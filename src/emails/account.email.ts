import { serverConfig } from '../constants/serverConfig';
import { EmailManager } from './emailManager';

export class AccountEmailManager extends EmailManager {
  public newAccount(
    to: string,
    subject: string,
    template: string,
    customVars: object
  ): void {
    console.log('Sending new account email...');

    const htmlEmail = this.loadTemplate(template, customVars);

    this.sendGrid.send({
      to,
      from: serverConfig.email.supportEmail,
      subject,
      html: htmlEmail
    });
  }
}
