import { Component, OnInit } from '@angular/core';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { AuthApi } from '@api/services';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'giz-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly icon = ICON;

    constructor(
        private readonly authApi: AuthApi,
        private readonly toastr: ToastrService,
    ) {
    }

    get title(): string {
        return $localize`:logout title:Logged out`;
    }

    get description(): string {
        return $localize`:logout description:You have successfully logged out`;
    }

    public ngOnInit() {
       this.authApi.logout()
           .pipe(take(1))
           .subscribe({
               error: (error: HttpErrorResponse) => {
                   this.toastr.error(
                       $localize`:logout error:Something went wrong logging out`,
                       `Error ${ error.status }: ${ error.message }`
                   );
               },
           });
    }
}
