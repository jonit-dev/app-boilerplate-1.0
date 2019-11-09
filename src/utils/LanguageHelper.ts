import { serverConfig } from '../constants/serverConfig';
import { globalStrings } from '../lang/global.lang';
import { TextHelper } from '../utils/TextHelper';

// load proper language strings, accordingly to the server language settings

export class LanguageHelper {
  public static getLanguageString = (model: any = null, key: string) => {
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

    return languageStrings[key][serverConfig.language];
  };
}
