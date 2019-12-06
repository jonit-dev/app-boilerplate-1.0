import { APP_NAME, SUPPORT_EMAIL } from './server.constants';

export const devServerConfig = {
  app: {
    name: APP_NAME,
    port: 3000,
    url: "http://localhost:3000/",
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
    },
    oAuth: {
      gmail: {
        clientID:
          "868221073357-7oh0r0i2a2ggd0dt390d94q38vlp39vs.apps.googleusercontent.com",
        clientSecret: "-eTeflp7pP8PieK077dGP8rm"
      }
    }
  },

  maintenanceMode: false,
  language: "eng",
  jwtSecret: "pez9SHY+4By+ce4PFMevcg=="
};
