package pizzapazza.util;

import static def.dom.Globals.navigator;
import javascript.util.KeyValue;

/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
@SuppressWarnings("StaticNonFinalUsedInInitialization")
public class Z4Translations {

  public static KeyValue<String, String> CURRENT_LANGUAGE;

  // Ribbon File
  public static String FILE = "";
  public static String NEW = "";
  public static String CREATE = "";
  public static String FROM_CLIPBOARD = "";
  public static String FROM_FILE = "";
  public static String OPEN = "";
  public static String OPEN_PROJECT = "";
  public static String SAVE = "";
  public static String SAVE_PROJECT = "";
  public static String EXPORT = "";

  // Ribbon Settings
  public static String SETTINGS = "";
  public static String LANGUAGE = "";
  public static String LANGUAGE_ENGLISH_NATIVE = "";
  public static String LANGUAGE_ITALIAN_NATIVE = "";
  public static String THEME = "";
  public static String THEME_AUTO = "";
  public static String THEME_LIGHT = "";
  public static String THEME_DARK = "";
  public static String REFRESH_PAGE_MESSAGE = "";

  // Other
  public static String FILENAME = "";
  public static String QUALITY = "";

  static {
    switch (navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  private Z4Translations() {
  }

  /**
   * Sets the English language
   */
  public static void setEnglish() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW = "New";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.EXPORT = "Export";

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

    // Other
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  public static void setItalian() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW = "Nuovo";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.EXPORT = "Esporta";

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

    // Other
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
