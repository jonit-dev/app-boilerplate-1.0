import { ENV, EnvType, serverConfig } from '../constants/env';
import { EmailType, TransactionalEmailManager } from './TransactionalEmailManager';

export class AccountEmailManager extends TransactionalEmailManager {
  public newAccount(
    to: string,
    subject: string,
    template: string,
    customVars: object
  ): void {
    switch (ENV) {
      case EnvType.Development:
      case EnvType.Staging:
        console.log(
          "Skipping sending new account email... Option only available in production."
        );
        break;

      case EnvType.Production:
        console.log("Sending new account email...");
        const htmlEmail = this.loadTemplate(
          EmailType.Html,
          template,
          customVars
        );
        const textEmail = this.loadTemplate(
          EmailType.Text,
          template,
          customVars
        );

        this.sendGrid.send({
          to,
          from: serverConfig.email.supportEmail,
          subject,
          html: htmlEmail,
          text: textEmail
        });
        break;
    }
  }
}
