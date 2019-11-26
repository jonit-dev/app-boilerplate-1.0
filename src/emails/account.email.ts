import { serverConfig } from '../constants/env';
import { EmailType, TransactionalEmailManager } from './TransactionalEmailManager';

export class AccountEmailManager extends TransactionalEmailManager {
  public newAccount(
    to: string,
    subject: string,
    template: string,
    customVars: object
  ): void {
    console.log("Sending new account email...");

    const htmlEmail = this.loadTemplate(EmailType.Html, template, customVars);
    const textEmail = this.loadTemplate(EmailType.Text, template, customVars);

    this.sendGrid.send({
      to,
      from: serverConfig.email.supportEmail,
      subject,
      html: htmlEmail,
      text: textEmail
    });
  }
}
