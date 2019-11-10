# NodeJS Server Boilerplate

by Joao Paulo Furtado

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

First you should configure your serverConfig.ts file inside src/constants folder. It should follow the following format:

```
const appName = 'App Boilerplate';
const supportEmail = 'email@gmail.com';

export const serverConfig = {
  app: {
    name: appName,
    devUrl: 'http://localhost:3000/',
    productionUrl: 'https://appboilerplate.io'
  },
  email: {
    supportEmail,
    sendGridAPIKey:
      'API_KEY',
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
  jwtSecret: 'yourJWTTOKEN'
};
```

- Please install typescript and tslint globally:

```
yarn global add tslint typescript
```

- Download VsCode TSLint extension

* then install our dependencies by running.

```
sudo yarn install
```

## Usage

In separate terminals, run:

Run:

```
npm run dev
```

and:

```
npm run mongo
```
