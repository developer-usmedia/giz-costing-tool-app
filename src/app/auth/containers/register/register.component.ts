import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';

import { RegisterForm } from '@api/models';
import { AuthApi } from '@api/services';
import { AUTH_ROUTE, MODULE_ROUTE, UserDetails } from '@core/models';
import { AuthService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { Stepper } from '@shared/components/stepper/stepper.model';
import { STATUS } from '@shared/helpers';
import { SaveUserDetails } from '@store/app.actions';
import { AppStore } from '@store/app.store';

enum REGISTER_STEPS {
    REGISTER = 1,
    VERIFICATION_CODE = 2,
    DONE = 3,
}

@Component({
    selector: 'giz-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnDestroy {
    @Select(AppStore.userDetails) userDetails$!: Observable<UserDetails>;

    public currentStep$ = new BehaviorSubject<REGISTER_STEPS>(REGISTER_STEPS.REGISTER);
    public signupSubmitting = false;
    public verificationSubmitting = false;
    public emailTaken = false;
    public codeInvalid = false;
    public steps: Stepper[];
    public emailAddress = '';

    protected readonly icon = ICON;
    protected readonly registerSteps = REGISTER_STEPS;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly destroyed$ = new Subject<void>();
    private readonly authApi = inject(AuthApi);
    private readonly authService = inject(AuthService);
    private readonly store = inject(Store);
    private readonly toastr = inject(ToastrService);

    constructor() {
        this.steps = [
            {
                index: REGISTER_STEPS.REGISTER,
                description: $localize`:register signup hint:Create account`,
            },
            {
                index: REGISTER_STEPS.VERIFICATION_CODE,
                description: $localize`:register verification hint:Enter verification code received via email`,
            },
            {
                index: REGISTER_STEPS.DONE,
                description: $localize`:register finalize hint:Registration done`,
            },
        ];

        this.userDetails$.pipe(takeUntil(this.destroyed$)).subscribe((userDetails) => {
           this.emailAddress = userDetails.email;
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public signup(registerForm: RegisterForm): void {
        this.emailTaken = false;
        this.signupSubmitting = true;
        this.authApi
            .register(registerForm)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.store.dispatch(new SaveUserDetails({
                        email: registerForm.email,
                        password: registerForm.password,
                    }));
                    return this.currentStep$.next(REGISTER_STEPS.VERIFICATION_CODE);
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === STATUS.BAD_REQUEST) {
                        this.emailTaken = true;
                    }
                    this.signupSubmitting = false;
                },
            });
    }

    public verify(code: string): void {
        this.codeInvalid = false;
        this.verificationSubmitting = true;

        this.userDetails$
            .pipe(take(1))
            .subscribe((userDetails) => {
                this.authService
                    .login({
                        email: userDetails.email,
                        password: userDetails.password,
                        emailVerificationCode: code,
                    })
                    .then(() => this.currentStep$.next(REGISTER_STEPS.DONE))
                    .catch((error: HttpErrorResponse) => {
                        if (error.status === STATUS.BAD_REQUEST) {
                            this.codeInvalid = true;
                        }
                        this.verificationSubmitting = false;
                    });
            });

    }

    public sendNewCode(): void {
        this.userDetails$
            .pipe(take(1))
            .subscribe((userDetails) => {
                if (!userDetails.email) {
                    this.toastr.error($localize`:verificationCode send error:Something went wrong sending the code`);
                    return;
                }

                this.authApi
                    .verifyEmail({ email: userDetails.email })
                    .then(() => this.toastr.success($localize`:verificationCode send success:New code sent`,))
                    .catch((error: HttpErrorResponse) => {
                        if (error.status === STATUS.TOO_MANY_REQUESTS) {
                            this.toastr.error($localize`:verificationCode send error-limit:Too many requests, try again later`);
                        } else {
                            this.toastr.error($localize`:verificationCode send error:Something went wrong sending the code`);
                        }
                        console.error(error);
                    },
                    );
            });
    }

    public getTitle(step: REGISTER_STEPS): string {
        switch (step) {
            case REGISTER_STEPS.REGISTER:
                return $localize`:register signup title:Create account`;
            case REGISTER_STEPS.VERIFICATION_CODE:
                return $localize`:register verification title:Verification Code`;
            case REGISTER_STEPS.DONE:
                return $localize`:register finalize title:All done`;
        }
    }

    public getDescription(step: REGISTER_STEPS): string {
        switch (step) {
            case REGISTER_STEPS.REGISTER:
                return $localize`:register signup description:Please fill in the details below to create your account`;
            case REGISTER_STEPS.VERIFICATION_CODE:
              return $localize`:register verification description:We've sent an email to [${ this.emailAddress }](mailto:${ this.emailAddress }) with a verification code, please enter it below to continue.`;
            case REGISTER_STEPS.DONE:
                return $localize`:register finalize description:Your account has been created and you are ready to start using the tool`;
        }
    }
}
