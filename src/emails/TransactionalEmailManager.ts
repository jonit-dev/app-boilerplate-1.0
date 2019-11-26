import sgMail from '@sendgrid/mail';
import { readFileSync } from 'fs';

import { serverConfig } from '../constants/env';
import { TextHelper } from '../utils/TextHelper';

export enum EmailType {
  Html = "Html",
  Text = "Text"
}

export class TransactionalEmailManager {
  private _apiKey: string;
  public sendGrid: any;

  constructor() {
    this._apiKey = serverConfig.email.sendGridAPIKey;
    this.sendGrid = sgMail;
    this.sendGrid.setApiKey(this._apiKey);
  }

  public loadTemplate(type: EmailType, template: string, customVars: object) {
    let extension;

    if (type === EmailType.Html) {
      extension = ".html";
    } else if (type === EmailType.Text) {
      extension = ".txt";
    }

    const data = readFileSync(
      `${serverConfig.email.templatesFolder}/${template}/content${extension}`,
      "utf-8"
    ).toString();

    return this.replaceTemplateCustomVars(data, customVars);
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
