export enum EnvironmentTypes {
  Production = "Production",
  Staging = "Staging",
  Development = "Development"
}

export enum AvailableLanguages {
  eng = "eng",
  ptbr = "ptbr"
}

const ENV: string = EnvironmentTypes.Development; // set the current environment here

const defineServerUrl = () => {
  // Solution if fails to connect: https://stackoverflow.com/questions/33704130/react-native-android-fetch-failing-on-connection-to-local-api

  // You must use LAN on Expo developer tools settings, otherwise it won't map the docker container.

  switch (ENV) {
    case EnvironmentTypes.Development:
      return "http://localhost:3000";

    case EnvironmentTypes.Production:
      return "https://boilerplate.app:3000";

    case EnvironmentTypes.Staging:
      return "https://staging.boilerplate.app:3000";
  }
};

export const appEnv = {
  appName: "App Boilerplate",
  appNameFull: "App Boilerplate LLC",
  appPrivacyPolicyUrl: "https://appboilerplate.com/privacy",
  appUrl: "https://appboilerplate.com",
  appState: "British Columbia",
  appAddress: "18th Street",
  appCity: "North Vancouver",
  appCountry: "Canada",
  appEmail: "appboilerplate@app.com",
  language: AvailableLanguages.eng,
  serverUrl: defineServerUrl(), // current serverUrl
  oauth: {
    // * REMEMBER: you should also configure app.json with proper ids
    google: {
      // * Docs: https://docs.expo.io/versions/latest/sdk/google/
      iosClientId:
        "868221073357-62fb6bqh2i35ih18kv3rk0vs9u8bgk9c.apps.googleusercontent.com", // from GoogleService-Info.plist
      // from google developers console
      androidClientId:
        "868221073357-cpmr7sijto13j45ja8q6rqr13bq4bk92.apps.googleusercontent.com"
    },
    // * Docs: https://docs.expo.io/versions/latest/sdk/facebook/
    facebook: {
      appId: "442424923110439",
      appName: "AppBoilerplate"
    }
  },
  admob: {
    // * Docs: https://docs.expo.io/versions/latest/sdk/admob/
    // * REMEMBER: you should also configure app.json with proper ids
    enabled: false,
    adUnitID: "ca-app-pub-3940256099942544/1033173712"
  },
  onboarding: {
    // * Configure it at Onboarding.screen.tsx
    enabled: false
  }
};
