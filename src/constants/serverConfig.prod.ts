import { APP_NAME, SUPPORT_EMAIL } from './server.constants';

export const prodServerConfig = {
  app: {
    name: APP_NAME,
    port: 3000,
    url: "https://yourwebsite.com/",
    mongodbConnectionUrl: "mongodb://mongo:27017/app"
  },
  email: {
    supportEmail: SUPPORT_EMAIL,
    mailchimpAPIKey: "bad3b9754ab37c1329a284621d9bc307-us4",
    mailchimpDefaultList: "816cff1b6d", // https://mailchimp.com/pt/help/find-audience-id/
    sendGridAPIKey:
      "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",
    templatesFolder: "./src/emails/templates",
    globalTemplateVars: {
      "Product Name": APP_NAME,
      "Sender Name": "Joao",
      "Company Name, LLC": "App Boilerplate Inc",
      "Company Address": "1234, Street Rd. Suite 1234"
    }
  },

  maintenanceMode: false,
  language: "eng",
  jwtSecret: "pez9SHY+4By+ce4PFMevcg=="
};
