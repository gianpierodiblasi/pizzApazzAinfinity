package pizzapazza.util;

import static def.dom.Globals.navigator;

/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
@SuppressWarnings("StaticNonFinalUsedInInitialization")
public class Z4Translations {

  public static String SETTINGS = "";
  public static String LANGUAGE = "";
  public static String ENGLISH = "";
  public static String ITALIAN = "";
  public static String THEME = "";
  public static String AUTO = "";
  public static String LIGHT = "";
  public static String DARK = "";
  

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
  public static void setItalian() {
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
