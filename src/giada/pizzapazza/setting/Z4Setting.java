package giada.pizzapazza.setting;

import static def.dom.Globals.document;
import def.dom.MediaQueryList;
import def.js.Date;
import static def.js.Globals.decodeURIComponent;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.window;

/**
 * The environment settings
 *
 * @author gianpiero.di.blasi
 */
public class Z4Setting {

  private final static String PATH = Z4Setting.initPath();
  private static String language = Z4Setting.initLanguage();
  private static boolean darkMode = Z4Setting.initDarkMode();
  private static String mode = Z4Setting.initMode();

  private static String initPath() {
    int start = window.location.href.indexOf('/', 10);
    int end = window.location.href.indexOf('/', start + 1);
    return window.location.href.substring(start, end);
  }

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

  private static boolean initDarkMode() {
    if ($exists(window.matchMedia)) {
      MediaQueryList matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

      matchMedia.addListener(event -> {
        Z4Setting.darkMode = event.matches;
      });

      return matchMedia.matches;
    } else {
      return false;
    }
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
    document.cookie = "z4language=" + language + ";expires=" + date.toUTCString() + ";path=" + Z4Setting.PATH;

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
   * Returns true if the OS is in dark mode
   *
   * @return true if the OS is in dark mode, false otherwise
   */
  public static boolean isDarkMode() {
    return Z4Setting.darkMode;
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
    document.cookie = "z4mode=" + mode + ";expires=" + date.toUTCString() + ";path=" + Z4Setting.PATH;
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
