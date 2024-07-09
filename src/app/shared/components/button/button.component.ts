import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector:
        'button[giz-button], button[giz-stroke-button], button[giz-link-button],' +
        'a[giz-button], a[giz-stroke-button], a[giz-link-button]',
    templateUrl: './button.component.html',
    styleUrls: [ './button.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    @Input() buttonType: 'default' | 'stroke' | 'link' = 'default';
    @Input() theme: 'basic' | 'primary' = 'primary';
    @Input() icon?: ICON;
    @Input() iconPosition: 'left' | 'right' = 'left';

    @Input()
    @HostBinding('disabled')
    disabled = false;

    @Input()
    @HostBinding('tabindex')
    tabindex: number = this.disabled ? -1 : 0;

    @HostBinding('class') cssClass = 'button';

    constructor(
        private readonly elementRef: ElementRef,
    ) {
        this.determineButtonType();
    }

    @HostBinding('class.button--stroke') get modStroke(): boolean {
        return this.buttonType === 'stroke';
    }

    @HostBinding('class.button--link') get modLink(): boolean {
        return this.buttonType === 'link';
    }

    @HostBinding('class.button--primary') get modPrimary(): boolean {
        return this.theme === 'primary';
    }

    @HostBinding('class.button--basic') get modBasic(): boolean {
        return this.theme === 'basic';
    }

    @HostBinding('class.is-disabled') get modDisabled(): boolean {
        return !!this.disabled;
    }

    private determineButtonType(): void {
        const host = this.getHostElement();

        if (host.hasAttribute('giz-stroke-button')) {
            this.buttonType = 'stroke';
        } else if (host.hasAttribute('giz-link-button')) {
            this.buttonType = 'link';
        }
    }

    private getHostElement(): HTMLElement {
        return this.elementRef.nativeElement as HTMLElement;
    }
}
