import Mailchimp from 'mailchimp-api-v3';

import { ENV, EnvType, serverConfig } from '../constants/env';

export interface ILists {
  default: string;
}

export class MarketingEmailManager {
  private _mailchimpApiKey: string;
  private lists: ILists;
  public mailchimp: any;
  constructor() {
    this._mailchimpApiKey = serverConfig.email.mailchimpAPIKey;
    this.mailchimp = new Mailchimp(serverConfig.email.mailchimpAPIKey);
    this.lists = {
      default: serverConfig.email.mailchimpDefaultList
    };
  }

  public async subscribe(
    email: string,
    callback?: () => any,
    listId: string = this.lists.default
  ) {
    switch (ENV) {
      case EnvType.Staging:
      case EnvType.Development:
        console.log(
          `Skipping adding new lead (${email}) to e-mail list (${listId}) under apiKey ${this._mailchimpApiKey}. Function only available in production`
        );
        break;
      case EnvType.Production:
        console.log(
          `adding new lead (${email}) to e-mail list (${listId}) under apiKey ${this._mailchimpApiKey}`
        );

        const payload = {
          members: [
            {
              email_address: email,
              email_type: "text",
              status: "subscribed"
            }
          ]
        };

        await this.mailchimp.post(`/lists/${listId}`, payload, () => {
          if (callback) {
            callback();
          }
        });
        break;
    }
  }
}
