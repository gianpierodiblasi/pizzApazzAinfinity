/**
 * The environment settings
 *
 * @author gianpiero.di.blasi
 */
class Z4Setting {

  static  language = Z4Setting.initLanguage();

  static  theme = Z4Setting.initTheme();

  static  mode = Z4Setting.initMode();

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

  static  initTheme() {
    Z4Setting.theme = "auto";
    let decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (let index = 0; index < decodedCookies.length; index++) {
      let row = decodedCookies[index].trim();
      if (row.startsWith("z4theme")) {
        Z4Setting.theme = row.substring(8);
      }
    }
    Z4Setting.setTheme(Z4Setting.theme);
    return Z4Setting.theme;
  }

  static  initMode() {
    Z4Setting.mode = "standard";
    let decodedCookies = decodeURIComponent(document.cookie).split(";");
    for (let index = 0; index < decodedCookies.length; index++) {
      let row = decodedCookies[index].trim();
      if (row.startsWith("z4mode")) {
        Z4Setting.mode = row.substring(7);
      }
    }
    Z4Setting.setMode(Z4Setting.mode);
    return Z4Setting.mode;
  }

  /**
   * Sets the language
   *
   * @param language The language
   */
  static  setLanguage(language) {
    let date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4language=" + language + ";expires=" + date.toUTCString() + ";path=" + Z4Loader.path;
    Z4Setting.language = language;
  }

  /**
   * Returns the language
   *
   * @return The language
   */
  static  getLanguage() {
    return Z4Setting.language;
  }

  /**
   * Sets the theme
   *
   * @param theme The theme ("auto", "light", "dark")
   */
  static  setTheme(theme) {
    Z4Setting.theme = theme;
    let date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4theme=" + theme + ";expires=" + date.toUTCString() + ";path=" + Z4Loader.path;
    switch(Z4Setting.theme) {
      case "auto":
        if (!window.matchMedia) {
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

  static  addDarkModeListener() {
    if (Z4Setting.theme === "auto") {
      // JS equality for strings
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("z4-dark");
      } else {
        document.body.classList.remove("z4-dark");
      }
      let options = new Object();
      options["once"] = true;
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => Z4Setting.addDarkModeListener(), options);
    }
  }

  /**
   * Returns the theme
   *
   * @return The theme ("auto", "light", "dark")
   */
  static  getTheme() {
    return Z4Setting.theme;
  }

  /**
   * Sets the mode
   *
   * @param mode The mode ("lite", "standard", "pro")
   */
  static  setMode(mode) {
    Z4Setting.mode = mode;
    document.body.classList.remove("z4-lite");
    document.body.classList.remove("z4-standard");
    document.body.classList.remove("z4-pro");
    document.body.classList.add("z4-" + mode);
    let date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "z4mode=" + mode + ";expires=" + date.toUTCString() + ";path=" + Z4Loader.path;
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
