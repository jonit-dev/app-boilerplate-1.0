import { appName, supportEmail } from './env';

export const prodServerConfig = {
  app: {
    name: appName,
    port: 3000,
    url: "https://yourwebsite.com:3000/",
    mongodbConnectionUrl: "mongodb://mongo:27017/app"
  },
  email: {
    supportEmail,
    sendGridAPIKey: "SENDGRIDKEYHERE",
    mailchimpAPIKey: "MAILCHIMPAPIKEYHERE",
    mailchimpDefaultList: "816cff1b6d", // https://mailchimp.com/pt/help/find-audience-id/
    templatesFolder: "./src/emails/templates",
    globalTemplateVars: {
      "Product Name": appName,
      "Sender Name": "Joao",
      "Company Name, LLC": "App Boilerplate Inc",
      "Company Address": "1234, Street Rd. Suite 1234"
    }
  },
  env: "dev",
  maintenanceMode: false,
  language: "eng",
  jwtSecret: "pez9SHY+4By+ce4PFMevcg=="
};
