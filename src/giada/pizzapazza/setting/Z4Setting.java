package giada.pizzapazza.setting;

import static def.dom.Globals.document;
import def.js.Date;
import static def.js.Globals.decodeURIComponent;
import giada.pizzapazza.Z4Loader;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The environment settings
 *
 * @author gianpiero.diblasi
 */
public class Z4Setting {

  private static String language = Z4Setting.initLanguage();
  private static String theme = Z4Setting.initTheme();
  
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
          document.body.classList.remove("z4-dark");
        } else {
          Z4Setting.addDarkModeListener();
        }
        break;
      case "light":
        document.body.classList.remove("z4-dark");
        break;
      case "dark":
        document.body.classList.add("z4-dark");
        break;
    }
  }

  @SuppressWarnings("StringEquality")
  private static void addDarkModeListener() {
    if (Z4Setting.theme == "auto") { // JS equality for strings
      if (window.$matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("z4-dark");
      } else {
        document.body.classList.remove("z4-dark");
      }

      $Object options = new $Object();
      options.$set("once", true);
      window.$matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () -> Z4Setting.addDarkModeListener(), options);
    }
  }

  /**
   * Returns the theme
   *
   * @return The theme ("auto", "light", "dark")
   */
  public static String getTheme() {
    return Z4Setting.theme;
  }

  private Z4Setting() {
  }
}
