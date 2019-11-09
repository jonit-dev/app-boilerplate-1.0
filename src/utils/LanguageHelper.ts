import { serverConfig } from '../constants/serverConfig';
import { globalStrings } from '../lang/global.lang';
import { TextHelper } from '../utils/TextHelper';

// load proper language strings, accordingly to the server language settings

export class LanguageHelper {
  public static getLanguageString = (
    model: any = null,
    key: string,
    customVars: object = {}
  ) => {
    if (!model) {
      // pass only the global strings
      return globalStrings[key][serverConfig.language];
    }

    // load language strings for a specific model

    const {
      strings
    } = require(`../resources/${TextHelper.capitalizeFirstLetter(
      model
    )}/${model}.lang.ts`);

    // add our global generic strings
    const languageStrings = {
      ...strings,
      ...globalStrings
    };

    let string: string = languageStrings[key][serverConfig.language];
    const customVarsKeys = Object.keys(customVars);
    if (customVarsKeys) {
      for (const k of customVarsKeys) {
        string = string.replace(new RegExp(`{{${k}}}`, 'g'), customVars[k]);
      }
    }

    return string;
  };
}
