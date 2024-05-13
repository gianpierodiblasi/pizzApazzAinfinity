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
  public static String NEW_PROJECT = "";
  public static String CREATE = "";
  public static String FROM_CLIPBOARD = "";
  public static String FROM_FILE = "";
  public static String OPEN = "";
  public static String OPEN_PROJECT = "";
  public static String SAVE = "";
  public static String SAVE_PROJECT = "";
  public static String EXPORT = "";
  public static String PROJECT_NOT_SAVED_MESSAGE = "";

  // Ribbon Layer
  public static String LAYER = "";
  public static String NEW_LAYER = "";
  public static String BACKGROUND_LAYER = "";

  // Ribbon Settings
  public static String SETTINGS = "";
  public static String LANGUAGE = "";
  public static String LANGUAGE_ENGLISH_NATIVE = "";
  public static String LANGUAGE_ITALIAN_NATIVE = "";
  public static String THEME = "";
  public static String THEME_AUTO = "";
  public static String THEME_LIGHT = "";
  public static String THEME_DARK = "";
  public static String THEME_COLOR = "";
  public static String REFRESH_PAGE_MESSAGE = "";

  // Other
  public static String PROJECT_NAME = "";
  public static String FILENAME = "";
  public static String QUALITY = "";
  public static String RESET = "";
  public static String WIDTH = "";
  public static String HEIGHT = "";
  public static String RESOLUTION = "";
  public static String FILLING_COLOR = "";
  public static String EDIT = "";
  public static String FIT = "";

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
    Z4Translations.NEW_PROJECT = "New Project";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.EXPORT = "Export";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Project not saved, do you want to save your changes?";

    // Ribbon Layer
    Z4Translations.LAYER = "Layer";
    Z4Translations.NEW_LAYER = "New Layer";
    Z4Translations.BACKGROUND_LAYER = "Background Layer";

    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.THEME_COLOR = "Color";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";

    // Other
    Z4Translations.PROJECT_NAME = "Project Name";
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";
    Z4Translations.RESET = "Reset";
    Z4Translations.WIDTH = "Width";
    Z4Translations.HEIGHT = "Height";
    Z4Translations.RESOLUTION = "Resolution";
    Z4Translations.FILLING_COLOR = "Filling Color";
    Z4Translations.EDIT = "Edit";
    Z4Translations.FIT = "Fit";

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  public static void setItalian() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW_PROJECT = "Nuovo Progetto";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.EXPORT = "Esporta";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Progetto non salvato, vuoi salvare le modifiche?";

    // Ribbon Layer
    Z4Translations.LAYER = "Livello";
    Z4Translations.NEW_LAYER = "Nuovo Livello";
    Z4Translations.BACKGROUND_LAYER = "Livello di Sfondo";

    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.THEME_COLOR = "Colore";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";

    // Other
    Z4Translations.PROJECT_NAME = "Nome Progetto";
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";
    Z4Translations.RESET = "Ripristina";
    Z4Translations.WIDTH = "Larghezza";
    Z4Translations.HEIGHT = "Altezza";
    Z4Translations.RESOLUTION = "Risoluzione";
    Z4Translations.FILLING_COLOR = "Colore di Riempimento";
    Z4Translations.EDIT = "Modifica";
    Z4Translations.FIT = "Adatta";

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
