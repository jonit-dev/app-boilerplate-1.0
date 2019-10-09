import serverConfig from "../constants/serverConfig";
import TextHelper from "../utils/TextHelper";
import globalStrings from "../lang/global.lang";

// load proper language strings, accordingly to the server language settings

const getLanguageString = (model: any = null, key) => {
  if (!model) {
    //pass only the global strings
    return globalStrings[key][serverConfig.language];
  }

  //load language strings for a specific model
  let languageStrings = require(`../resources/${TextHelper.capitalizeFirstLetter(
    model
  )}/${model}.lang.ts`);

  //add our global generic strings
  languageStrings = {
    ...languageStrings,
    ...globalStrings
  };

  return languageStrings[key][serverConfig.language];
};

export default { getLanguageString };
