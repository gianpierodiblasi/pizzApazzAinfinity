/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
class Z4Translations {

  static  CURRENT_LANGUAGE = null;

  // Ribbon File
  static  FILE = "";

  static  NEW = "";

  static  CREATE = "";

  static  CREATE_FROM_CLIPBOARD = "";

  static  OPEN = "";

  static  OPEN_FROM_DEVICE = "";

  static  OPEN_FROM_BROWSER = "";

  static  SAVE = "";

  static  SAVE_AS = "";

  // Ribbon Settings
  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

  static  REFRESH_PAGE_MESSAGE = "";

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
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW = "New";
    Z4Translations.CREATE = "Create";
    Z4Translations.CREATE_FROM_CLIPBOARD = "Create from Clipboard";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_FROM_DEVICE = "Open from Device";
    Z4Translations.OPEN_FROM_BROWSER = "Open from Browser";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_AS = "Save As...";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW = "Nuovo";
    Z4Translations.CREATE = "Crea";
    Z4Translations.CREATE_FROM_CLIPBOARD = "Crea dagli Appunti";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_FROM_DEVICE = "Apri dal Dispositivo";
    Z4Translations.OPEN_FROM_BROWSER = "Apri dal Browser";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_AS = "Salva Come...";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
