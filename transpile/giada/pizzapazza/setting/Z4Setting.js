/* global Date, Z4Setting, decodeURIComponent */

/**
 * The environment settings
 *
 * @author gianpiero.di.blasi
 */
class Z4Setting {

  static  PATH = Z4Setting.initPath();

  static  language = Z4Setting.initLanguage();

  static  darkMode = Z4Setting.initDarkMode();

  static  mode = Z4Setting.initMode();

  static  initPath() {
    let start = window.location.href.indexOf('/', 10);
    let end = window.location.href.indexOf('/', start + 1);
    return window.location.href.substring(start, end);
  }

  static  initLanguage() {
    let decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (let index = 0; index < decodedCookies.length; index++) {
      let row = decodedCookies[index].trim();
      if (row.startsWith("z4language")) {
        return row.substring(11);
      }
    }
    if (navigator.languages) {
      return navigator.languages[0].substring(0, 2);
    } else if (navigator.language) {
      return navigator.language.substring(0, 2);
    } else if (navigator.userLanguage) {
      return navigator.userLanguage.substring(0, 2);
    } else {
      return "en";
    }
  }

  static  initDarkMode() {
    if (window.matchMedia) {
      let matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      matchMedia.addListener(event => {
        Z4Setting.darkMode = event.matches;
      });
      return matchMedia.matches;
    } else {
      return false;
    }
  }

  static  initMode() {
    let decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (let index = 0; index < decodedCookies.length; index++) {
      let row = decodedCookies[index].trim();
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
  static  setLanguage(language) {
    let date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4language=" + language + ";expires=" + date.toUTCString() + ";path=" + Z4Setting.PATH;
    Z4Setting.language = language;
  }

  /**
   * Returns the language
   *
   * @return The language
   */
  static  getLanguage() {
    return language;
  }

  /**
   * Returns true if the OS is in dark mode
   *
   * @return true if the OS is in dark mode, false otherwise
   */
  static  isDarkMode() {
    return Z4Setting.darkMode;
  }

  /**
   * Sets the mode
   *
   * @param mode The mode ("lite", "standard", "pro")
   */
  static  setMode(mode) {
    Z4Setting.mode = mode;
    let date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4mode=" + mode + ";expires=" + date.toUTCString() + ";path=" + Z4Setting.PATH;
  }

  /**
   * Returns the mode
   *
   * @return The mode ("lite", "standard", "pro")
   */
  static  getMode() {
    return Z4Setting.mode;
  }

  /**
   * Returns true if the mode is "lite"
   *
   * @return true if the mode is "lite", false otherwise
   */
  static  isLiteMode() {
    // JS equality for strings
    return Z4Setting.mode === "lite";
  }

  /**
   * Returns true if the mode is "standard"
   *
   * @return true if the mode is "standard", false otherwise
   */
  static  isStandardMode() {
    // JS equality for strings
    return Z4Setting.mode === "standard";
  }

  /**
   * Returns true if the mode is "pro"
   *
   * @return true if the mode is "pro", false otherwise
   */
  static  isProMode() {
    // JS equality for strings
    return Z4Setting.mode === "pro";
  }

  constructor() {
  }
}
