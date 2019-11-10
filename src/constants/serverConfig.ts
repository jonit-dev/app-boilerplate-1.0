const appName = 'App Boilerplate';
const supportEmail = 'jfurtado141@gmail.com';

export const serverConfig = {
  app: {
    name: appName
  },
  email: {
    supportEmail,
    sendGridAPIKey:
      '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',
    templatesFolder: './src/emails/templates',
    globalTemplateVars: {
      'Product Name': appName,
      'Sender Name': 'Joao',
      'Company Name, LLC': 'App Boilerplate Inc',
      'Company Address': '1234, Street Rd. Suite 1234'
    }
  },
  env: 'dev',
  maintenanceMode: false,
  language: 'eng',
  jwtSecret: 'pez9SHY+4By+ce4PFMevcg=='
};
