import sgMail from '@sendgrid/mail';
import { readFileSync } from 'fs';

import { serverConfig } from '../constants/serverConfig';
import { TextHelper } from '../utils/TextHelper';

export class EmailManager {
  private apiKey: string;
  public sendGrid: any;

  constructor() {
    this.apiKey = serverConfig.email.sendGridAPIKey;
    this.sendGrid = sgMail;
    this.sendGrid.setApiKey(this.apiKey);
  }

  public loadTemplate(template: string, customVars: object) {
    const html = readFileSync(
      `${serverConfig.email.templatesFolder}/${template}/content.html`,
      'utf-8'
    ).toString();

    return this.replaceTemplateCustomVars(html, customVars);
  }

  private replaceTemplateCustomVars(html: string, customVars: object): string {
    const keys = Object.keys(customVars);
    const globalKeys = Object.keys(serverConfig.email.globalTemplateVars);

    if (keys) {
      for (const key of keys) {
        html = TextHelper.replaceAll(html, `{{${key}}}`, customVars[key]);
      }
    }

    if (globalKeys) {
      for (const globalKey of globalKeys) {
        html = TextHelper.replaceAll(
          html,
          `[${globalKey}]`,
          serverConfig.email.globalTemplateVars[globalKey]
        );
      }
    }

    return html;
  }
}
