import { Pipe, PipeTransform } from '@angular/core';
import { marked, MarkedOptions } from 'marked';

@Pipe({
    name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
    transform(markdown: string, options?: MarkedOptions) {
        options = {
            breaks: true,
            ...options,
        };
        if (markdown == null) return '';
        return marked(markdown, options);
    }
}
