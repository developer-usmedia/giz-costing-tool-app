import { Component } from '@angular/core';
import { MarkdownPipe } from '@shared/pipes';

@Component({
    selector: 'giz-cp-data-protection',
    templateUrl: './cp-data-protection.component.html',
    styleUrl: './cp-data-protection.component.scss',
    imports: [MarkdownPipe],
})
export class CpDataProtectionComponent {
    public markdown: string = this.getMarkdown();

    // eslint-disable-next-line max-lines-per-function
    private getMarkdown() {
        return $localize`:data-protection body:
# Data Protection

The Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH attaches great importance to responsible and transparent management of personal data. Below we provide users with information as to

- who they can contact at GIZ on the subject of data protection
- what data is processed when they visit the website
- what data is processed when users contact us
- how they can opt out of the storage of data
- what rights they have with respect to us

## Data controller and data protection officer

Please contact GIZ’s data protection officer if you have questions specifically about how your data are protected:
datenschutzbeauftragter(at)giz.de

## Address
Friedrich-Ebert-Allee 32 + 36, 53113 Bonn
Dag-Hammarskjöld-Weg 1–5, 65760 Eschborn
info(at)giz.de

Data processing is the responsibility of Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH.

## Information on the collection of personal data

### General
GIZ processes personal data exclusively in accordance with the EU General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (Bundesdatenschutzgesetz, BDSG).

Personal data are, for example, name, address, email addresses and user behaviour.

GIZ only processes personal data to the extent necessary. Which data is required and processed for which purpose and on what basis is largely determined by the type of service you use or the purpose for which the data is required.

## Collection of personal data when visiting our website
When visiting the website of Initiative for Sustainable Agricultural Supply Chains (INA) from GIZ, the browser used automatically transmits data that is saved in a log file. GIZ itself processes only the data that is technically required in order to display the website correctly and to ensure its stability and security.

Each time the website is accessed, the data stored includes, but is not limited to, the page that is viewed, the IP address of the accessing device, the page from which the user was redirected, as well as the date and time of access.

The data in the log file is deleted after 30 days.

### Further information on data storage and transfer
GIZ is obliged to store the data beyond the time of the visit in order to ensure protection against attacks against GIZ’s internet infrastructure and federal communications technology (legal basis: Article 6 (1) e GDPR in conjunction with Section 5 of the German Act on the Federal Office for Information Security (BSIG). In the event of attacks on communications technology, this data is analysed and used to initiate legal and criminal action.

Data that is logged when accessing the GIZ website is only transferred to third parties if there is a legal obligation to do so or if the transfer is necessary for legal or criminal prosecution in the event of attacks on federal communications technology. Data will not be passed on in any other cases. This data is not merged with other data sources at GIZ.

## Contact by email
It is possible to contact GIZ via the email addresses provided. In this case, at least the email address but also any other personal user data transmitted with the email (e.g. family and given name, address) as well as the information contained in the email are stored solely for the purpose of contacting the user and processing the request.

The legal basis for the processing of data in connection with email communication is Article 6 (1) e GDPR.

## Contact by letter
When contacting us by letter, the personal data transmitted (e.g. family and given name, address) and the information contained in the letter is stored for the purpose of establishing contact and processing the enquiry.

The legal basis for the processing of data in connection with communication by letter is Article 6 (1) e GDPR.

## Contact by phone
When contacting us by phone, personal data will be processed to the extent necessary in order to handle the enquiry.

The legal basis for the processing of data in connection with communication by phone is Article 6 (1) e GDPR.

## Disclosure to third parties
GIZ does not pass on personal data to third parties unless it is legally obliged or entitled to do so by law.

## Transfer of data to countries outside Germany
GIZ does not transfer personal data to third countries. When using social media, the privacy policies of the respective providers apply.

## Duration of data retention
User data will not be kept any longer than is necessary for the purpose for which it is processed or as required by law.

## IT security of user data
GIZ accords great importance to protecting personal data. For this reason, technical and organisational security measures ensure that data is protected against accidental and intentional manipulation and unintended erasure as well as unauthorised access. These measures are updated accordingly based on technical developments and adapted continuously in line with the risks.

## Reference to user rights
Visitors to the GIZ website have the right

- To obtain information about their data stored by us (Article 15 GDPR)
- To have their data stored by us rectified (Article 16 GDPR)
- To have their data stored by us erased (Article 17 GDPR)
- To obtain restriction of processing of their data stored by us (Article 18 GDPR)
- To object to the storage of their data if personal data are processed on the basis of the first sentence of Article 6 (1) 1 f and e GDPR (Article 21 GDPR)
- To receive their personal data in a commonly used and machine-readable format from the controller such that they can be potentially transmitted to another controller (right to data portability, Article 20 GDPR).
- To withdraw their consent to the extent that the data has been processed on the basis of consent (Article 6 (1) a GDPR). The lawfulness of the processing on the basis of the consent given remains unaffected until receipt of the withdrawal.

Users also have the right in accordance with Article 77 GDPR to lodge a complaint with the competent data protection supervisory authority. The competent authority is the Federal Commissioner for Data Protection and Freedom of Information (BfDI).

*Last updated: January 2022*
`;
    }
}
