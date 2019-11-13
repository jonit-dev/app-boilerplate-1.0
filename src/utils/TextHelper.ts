export class TextHelper {
  public static capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  private static escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  public static replaceAll(str, find, replace) {
    return str.replace(new RegExp(TextHelper.escapeRegExp(find), "g"), replace);
  }

  public static stringPrepare(str: string) {
    return str.toLowerCase().trim();
  }
}
