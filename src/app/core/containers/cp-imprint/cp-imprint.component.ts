import { Component } from '@angular/core';

@Component({
    selector: 'giz-cp-imprint',
    templateUrl: './cp-imprint.component.html',
    styleUrl: './cp-imprint.component.scss',
})
export class CpImprintComponent {
    public markdown: string = this.getMarkdown();

    // eslint-disable-next-line max-lines-per-function
    private getMarkdown() {
        return $localize`:imprint body:
# Imprint

Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH

## Coordination and editing

Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH
Sustainable Supply Chains Initiative (INA)
Programme for sustainable agricultural supply chains and standards

Tel.: +49 (0) 228 4460 4155
E-Mail: ina(at)giz.de

## Registered offices

Bonn und Eschborn

Friedrich-Ebert-Allee 32 + 36
53113 Bonn, Germany
Phone: +49 228 4460-0
Fax: +49 228 4460-1766

Dag-Hammarskjöld-Weg 1–5
65760 Eschborn, Germany
Phone: +49 6196 79-0
Fax: +49 6196 79-1115

E-Mail: info(at)giz.de
Homepage: www.giz.de

## Registered at

Local court (Amtsgericht) Bonn, Germany: HRB 18384
Local court (Amtsgericht) Frankfurt am Main, Germany: HRB 12394

Vat (no.) DE 113891176

## Chairperson of the Supervisory Board
Jochen Flasbarth, State Secretary in the Federal Ministry for Economic Cooperation and Development

## Management Board
Thorsten Schäfer-Gümbel (Chair)
Ingrid-Gabriela Hoven (Vice-Chair)
Anna Sophie Herken

## Legal notice on liability
GIZ makes every effort to ensure that the information provided on this website is correct and up-to-date. Nevertheless, errors and ambiguities cannot be completely ruled out. For this reason, GIZ does not assume any liability for the topicality, correctness, completeness or quality of the information provided. GIZ shall not be liable for any material or immaterial damage caused directly or indirectly by the use or non-use of the information provided or by the use of incorrect or incomplete information, unless it can be proven that GIZ acted with intent or gross negligence. Parts of the pages or the complete publication including all offers and information might be extended, changed or partly or completely deleted by GIZ without separate announcement.
References to "third-party content", which is provided by direct or indirect links to other providers, are adequately marked. GIZ has no influence whatsoever on "third-party content" and does not adopt this content as its own. GIZ has no positive knowledge of illegal or offensive content on the linked pages of other providers. Should the linked pages of external providers nevertheless contain illegal or offensive content, GIZ expressly distances itself from this content.

## Legal notes on copyright
The layout of the tool, the graphics used and the other contents are protected by copyright.

## Coordination and editing
Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH
Sustainable Supply Chains Initiative (INA)
Programme for sustainable agricultural supply chains and standards
Tel.: +49 (0) 228 4460 4155
E-Mail: ina(at)giz.de
`;
    }
}
