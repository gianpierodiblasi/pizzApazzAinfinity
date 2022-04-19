package giada.pizzapazza.setting;

import static def.dom.Globals.document;
import def.js.Date;
import static def.js.Globals.decodeURIComponent;
import giada.pizzapazza.Z4Loader;
import simulation.dom.$MediaQueryList;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The environment settings
 *
 * @author gianpiero.di.blasi
 */
public class Z4Setting {

  private static String language = Z4Setting.initLanguage();
  private static String theme = Z4Setting.initTheme();
  private static String mode = Z4Setting.initMode();

  private static $MediaQueryList darkModeMediaQueryList;
  private static $Apply_0_Void darkModeListener;

  @SuppressWarnings("ForLoopReplaceableByForEach")
  private static String initLanguage() {
    String[] decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (int index = 0; index < decodedCookies.length; index++) {
      String row = decodedCookies[index].trim();
      if (row.startsWith("z4language")) {
        return row.substring(11);
      }
    }

    if ($exists(navigator.languages)) {
      return navigator.languages[0].substring(0, 2);
    } else if ($exists(navigator.language)) {
      return navigator.language.substring(0, 2);
    } else if ($exists(navigator.userLanguage)) {
      return navigator.userLanguage.substring(0, 2);
    } else {
      return "en";
    }
  }

  @SuppressWarnings("ForLoopReplaceableByForEach")
  private static String initTheme() {
    Z4Setting.theme = "auto";
    String[] decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (int index = 0; index < decodedCookies.length; index++) {
      String row = decodedCookies[index].trim();
      if (row.startsWith("z4theme")) {
        Z4Setting.theme = row.substring(8);
      }
    }

    Z4Setting.setTheme(Z4Setting.theme);
    return Z4Setting.theme;
  }

  @SuppressWarnings("ForLoopReplaceableByForEach")
  private static String initMode() {
    String[] decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (int index = 0; index < decodedCookies.length; index++) {
      String row = decodedCookies[index].trim();
      if (row.startsWith("z4mode")) {
        return row.substring(7);
      }
    }
    return "standard";
  }

  /**
   * Sets the language
   *
   * @param language The language
   */
  public static void setLanguage(String language) {
    Date date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4language=" + language + ";expires=" + date.toUTCString() + ";path=" + Z4Loader.path;

    Z4Setting.language = language;
  }

  /**
   * Returns the language
   *
   * @return The language
   */
  public static String getLanguage() {
    return Z4Setting.language;
  }

  /**
   * Sets the theme
   *
   * @param theme The theme ("auto", "light", "dark")
   */
  @SuppressWarnings("StringEquality")
  public static void setTheme(String theme) {
    Z4Setting.theme = theme;

    Date date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4theme=" + theme + ";expires=" + date.toUTCString() + ";path=" + Z4Loader.path;

    switch (Z4Setting.theme) {
      case "auto":
        if (!$exists(window.matchMedia)) {
          document.body.className = "";
        } else {
          Z4Setting.darkModeListener = () -> Z4Setting.addDarkModeListener();
          Z4Setting.addDarkModeListener();
        }
        break;
      case "light":
      case "dark":
        if ($exists(Z4Setting.darkModeMediaQueryList)) {
          Z4Setting.darkModeMediaQueryList.removeEventListener("change", Z4Setting.darkModeListener);
        }
        document.body.className = Z4Setting.theme == "dark" ? "z4-dark" : ""; // JS equality for strings
        break;
    }
  }

  private static void addDarkModeListener() {
    if (!$exists(Z4Setting.darkModeMediaQueryList)) {
      Z4Setting.darkModeMediaQueryList = window.$matchMedia("(prefers-color-scheme: dark)");
    }

    document.body.className = Z4Setting.darkModeMediaQueryList.matches ? "z4dark" : "";

    $Object options = new $Object();
    options.$set("once", true);
    Z4Setting.darkModeMediaQueryList.addEventListener("change", Z4Setting.darkModeListener, options);
  }

  /**
   * Returns the theme
   *
   * @return The theme ("auto", "light", "dark")
   */
  public static String getTheme() {
    return Z4Setting.theme;
  }

  /**
   * Sets the mode
   *
   * @param mode The mode ("lite", "standard", "pro")
   */
  public static void setMode(String mode) {
    Z4Setting.mode = mode;

    Date date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4mode=" + mode + ";expires=" + date.toUTCString() + ";path=" + Z4Loader.path;
  }

  /**
   * Returns the mode
   *
   * @return The mode ("lite", "standard", "pro")
   */
  public static String getMode() {
    return Z4Setting.mode;
  }

  /**
   * Returns true if the mode is "lite"
   *
   * @return true if the mode is "lite", false otherwise
   */
  @SuppressWarnings("StringEquality")
  public static boolean isLiteMode() {
    return Z4Setting.mode == "lite"; // JS equality for strings
  }

  /**
   * Returns true if the mode is "standard"
   *
   * @return true if the mode is "standard", false otherwise
   */
  @SuppressWarnings("StringEquality")
  public static boolean isStandardMode() {
    return Z4Setting.mode == "standard"; // JS equality for strings
  }

  /**
   * Returns true if the mode is "pro"
   *
   * @return true if the mode is "pro", false otherwise
   */
  @SuppressWarnings("StringEquality")
  public static boolean isProMode() {
    return Z4Setting.mode == "pro"; // JS equality for strings
  }

  private Z4Setting() {
  }
}
