/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
class Z4Translations {

  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  ENGLISH = "";

  static  ITALIAN = "";

  static  THEME = "";

  static  AUTO = "";

  static  LIGHT = "";

  static  DARK = "";

  static {
    switch(navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  constructor() {
  }

  /**
   * Sets the English language
   */
  static  setEnglish() {
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.ENGLISH = "English";
    Z4Translations.ITALIAN = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.AUTO = "Auto";
    Z4Translations.LIGHT = "Light";
    Z4Translations.DARK = "Dark";
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.ENGLISH = "English";
    Z4Translations.ITALIAN = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.AUTO = "Auto";
    Z4Translations.LIGHT = "Chiaro";
    Z4Translations.DARK = "Scuro";
  }
}
