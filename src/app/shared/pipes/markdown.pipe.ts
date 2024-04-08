import { Pipe, PipeTransform } from '@angular/core';
import { marked, MarkedOptions } from 'marked';

@Pipe({
    name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
    transform(markdown: string, options?: MarkedOptions) {
        if (markdown == null) return '';
        return marked(markdown, options);
    }
}
