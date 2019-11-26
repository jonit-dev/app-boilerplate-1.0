import Mailchimp from 'mailchimp-api-v3';

import { serverConfig } from '../constants/env';

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
    callback: () => any,
    listId: string = this.lists.default
  ) {
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

    await this.mailchimp.post(`/lists/${listId}`, payload, () => callback());
  }
}
