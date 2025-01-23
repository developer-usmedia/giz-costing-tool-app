import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { PasswordService } from '@shared/services';
import { NgClass } from '@angular/common';

export enum RANK {
    TOO_SHORT = 0,
    WEAK = 1,
    MEDIUM = 2,
    STRONG = 3,
    VERY_STRONG = 4,
}

@Component({
    selector: 'giz-password-strength',
    templateUrl: './password-strength.component.html',
    styleUrl: './password-strength.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [NgClass],
})
export class PasswordStrengthComponent implements OnChanges {
    @Input({ required: true }) password!: string;
    @Input() minimalRank = RANK.VERY_STRONG;
    @Output() passwordStrength = new EventEmitter<boolean>();

    public passwordScore: RANK = RANK.TOO_SHORT;

    protected readonly rank = RANK;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['password']) {
            this.checkPassword();
        }
    }

    public checkPassword() {
        this.rankPassword();
        this.passwordStrength.emit(this.passwordScore === this.minimalRank);
    }

    private rankPassword() {
        let score = 0;
        const maxScore = 4;

        // If no password or too short
        if (!this.password || !PasswordService.checkLength(this.password)) {
            this.passwordScore = RANK.TOO_SHORT;
            return;
        }

        // Increment the score for each of these conditions
        if (PasswordService.checkLength(this.password)) {
            score++;
        }
        if (PasswordService.checkUpperAndLowerCase(this.password)) {
            score++;
        }
        if (PasswordService.checkForNumbers(this.password)) {
            score++;
        }
        if (PasswordService.checkForSpecialCharacters(this.password)) {
            score++;
        }

        // Set score
        if (score < 2) {
            this.passwordScore = RANK.WEAK;
        } else if (score < 3) {
            this.passwordScore = RANK.MEDIUM;
        } else if (score < maxScore) {
            this.passwordScore = RANK.STRONG;
        } else {
            this.passwordScore = RANK.VERY_STRONG;
        }
    }
}
