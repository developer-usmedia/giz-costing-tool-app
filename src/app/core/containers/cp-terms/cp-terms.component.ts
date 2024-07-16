import { Component } from '@angular/core';

@Component({
    selector: 'giz-cp-terms',
    templateUrl: './cp-terms.component.html',
    styleUrl: './cp-terms.component.scss',
})
export class CpTermsComponent {
    public markdown: string = this.getMarkdown();

    // eslint-disable-next-line max-lines-per-function
    private getMarkdown() {
        return $localize`:terms body:
# Terms and conditions

*August 21, 2023*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit ut aliquam purus. Dictum varius duis at consectetur lorem donec massa sapien. Id aliquet lectus proin nibh. Ornare aenean euismod elementum nisi quis. Diam quis enim lobortis scelerisque fermentum.
`;
    }
}
