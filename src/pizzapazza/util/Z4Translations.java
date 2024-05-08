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
  public static String CREATE_FROM_CLIPBOARD = "";
  public static String OPEN = "";
  public static String OPEN_FROM_DEVICE = "";
  public static String OPEN_FROM_BROWSER = "";
  public static String SAVE = "";
  public static String SAVE_AS = "";

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

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
