const serverConfig = require("../constants/serverConfig.json");
const TextHelper = require("../utils/TextHelper");
const globalStrings = require("../lang/global.lang.json");

// load proper language strings, accordingly to the server language settings

const getLanguageString = (model = null, key) => {
  if (!model) {
    //pass only the global strings
    return globalStrings[key][serverConfig.language];
  }

  //load language strings for a specific model
  let languageStrings = require(`../resources/${TextHelper.capitalizeFirstLetter(
    model
  )}/${model}.lang.json`);

  //add our global generic strings
  languageStrings = {
    ...languageStrings,
    ...globalStrings
  };

  return languageStrings[key][serverConfig.language];
};

module.exports = {
  getLanguageString
};
