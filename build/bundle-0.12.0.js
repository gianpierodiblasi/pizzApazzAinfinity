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
/**
 * The html factory
 *
 * @author gianpiero.di.blasi
 */
class Z4HTMLFactory {

  static  HTML = Z4HTMLFactory.initHTML();

  /**
   * Returns a message
   *
   * @param key The html key
   * @return The html value
   */
  static  get(key) {
    return Z4HTMLFactory.HTML[key];
  }

  static  initHTML() {
    let array = new Array();
    let client = new XMLHttpRequest();
    if (Z4Loader.allFiles) {
      client.open("GET", Z4Loader.UP + "src/giada/html_list.properties?random=" + Math.random(), false);
      client.send();
      new String(client.responseText).split("\n").forEach(row => {
        if (row && !row.startsWith("#")) {
          client.open("GET", Z4Loader.UP + "src/" + row, false);
          client.send();
          array[row] = client.responseText;
        }
      });
    } else {
      client.open("GET", Z4Loader.UP + "build/bundle-" + Z4Loader.version + ".html", false);
      client.send();
      Z4HTMLFactory.readHTMLs(array, client.responseText);
    }
    return array;
  }

  static  readHTMLs(array, responseText) {
    new String(responseText).split("\n").forEach(row => {
      if (row) {
        let keyValue = row.split(":=");
        array[keyValue[0].trim()] = keyValue[1].trim();
      }
    });
  }

  constructor() {
  }
}
/**
 * The message factory
 *
 * @author gianpiero.di.blasi
 */
class Z4MessageFactory {

  static  MESSAGE = Z4MessageFactory.initMessages();

  /**
   * Returns a message
   *
   * @param key The message key
   * @return The message value
   */
  static  get(key) {
    return Z4MessageFactory.MESSAGE[key];
  }

  /**
   * Method to call when the language changes
   */
  static  changingLanguage() {
    Z4MessageFactory.MESSAGE = Z4MessageFactory.initMessages();
    document.querySelectorAll("[data-token-lang-inner_text]").forEach(element => (element).innerHTML = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text")));
  }

  static  initMessages() {
    let array = new Array();
    let path = Z4Loader.UP + (Z4Loader.allFiles ? "src/message/" : "build/message/");
    let file = Z4Loader.allFiles ? "message-" + Z4Setting.getLanguage() + ".properties?random=" + Math.random() : "message-" + Z4Setting.getLanguage() + "-" + Z4Loader.version + ".properties";
    let client = new XMLHttpRequest();
    client.open("GET", path + file, false);
    client.send();
    Z4MessageFactory.readMessages(array, client.responseText);
    if (Object.keys(array).length === 0) {
      Z4Setting.setLanguage("en");
      file = Z4Loader.allFiles ? "message-en.properties?random=" + Math.random() : "message-en-" + Z4Loader.version + ".properties";
      let clientEN = new XMLHttpRequest();
      clientEN.open("GET", path + file, false);
      clientEN.send();
      Z4MessageFactory.readMessages(array, clientEN.responseText);
    }
    return array;
  }

  static  readMessages(array, responseText) {
    new String(responseText).split("\n").forEach(row => {
      if (row && !row.startsWith("#")) {
        let keyValue = row.split("=");
        array[keyValue[0].trim()] = keyValue[1].trim();
      }
    });
  }

  constructor() {
  }
}
/**
 * The message factory
 *
 * @author gianpiero.di.blasi
 */
class Z4ImageFactory {

  static  IMAGES = Z4ImageFactory.initImages();

  /**
   * Returns an image
   *
   * @param key The image key
   * @return The image value
   */
  static  get(key) {
    return Z4ImageFactory.IMAGES[key];
  }

  static  initImages() {
    let array = new Array();
    let path = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
    let file = Z4Loader.allFiles ? "image_list.properties?random=" + Math.random() : "image_list-" + Z4Loader.version + ".properties";
    let client = new XMLHttpRequest();
    client.open("GET", path + file, false);
    client.send();
    Z4ImageFactory.readImages(path, array, new String(client.responseText).split("\n"));
    return array;
  }

  static  readImages(path, array, images) {
    images.forEach(row => {
      if (row && !row.startsWith("#")) {
        let keyValue = row.split("=");
        let image = new Image();
        image.onload = (event) => Z4ImageFactory.readImages(path, array, images.slice(1));
        image.src = path + keyValue[1].trim();
        array[keyValue[0].trim()] = image;
      }
    });
  }

  constructor() {
  }
}
/**
 * The abstract class of all UI components
 *
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentUI {

   root = null;

   devicePixelRatioListener = null;

  /**
   * Creates a Z4AbstractComponentUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    this.root = document.createElement("div");
    this.root.setAttribute("id", "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random()));
    this.root.innerHTML = ui;
    let list = this.root.querySelectorAll("#" + this.root.id + " [data-token-lang-inner_text]");
    for (let index = 0; index < list.length; index++) {
      let element = list.item(index);
      element.innerHTML = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text"));
    }
  }

  /**
   * Inizializes the monitoring of the device pixel ratio changes
   *
   * @param onDevicePixelRatioChange The method called on device pixel ratio
   * changes
   */
   initDevicePixelRatio(onDevicePixelRatioChange) {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        onDevicePixelRatioChange();
        this.addDevicePixelRatioListener();
      };
      this.addDevicePixelRatioListener();
    }
  }

   addDevicePixelRatioListener() {
    let options = new Object();
    options["once"] = true;
    window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").addEventListener("change", this.devicePixelRatioListener, options);
  }

  /**
   * Disposes the monitoring of the device pixel ratio changes
   */
   disposeDevicePixelRatio() {
    if (window.matchMedia) {
      window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").removeEventListener("change", this.devicePixelRatioListener);
    }
  }

  /**
   * Disposes the component
   */
   dispose() {
  }

  /**
   * Selects a child of this component
   *
   * @param selector The selector
   * @return The child of this component
   */
   querySelector(selector) {
    return this.root.querySelector(selector);
  }

  /**
   * Selects all children of this component
   *
   * @param selector The selector
   * @return All children of this component
   */
   querySelectorAll(selector) {
    return this.root.querySelectorAll(selector);
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param <T>
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
   appendToElement(parent) {
    parent.appendChild(this.root);
    return this;
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param <T>
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
   appendToComponent(parent) {
    parent.root.appendChild(this.root);
    return this;
  }

  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
   prependElement(element) {
    this.root.prepend(element);
    return this;
  }

  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
   prependComponent(element) {
    this.root.prepend(element.root);
    return this;
  }
}
/**
 * The abstract class of all UI components providing a value
 *
 * @param <S>
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentWithValueUI extends Z4AbstractComponentUI {

  /**
   * The provided value
   */
   value = null;

  /**
   * The onchange function
   */
   onchange = element => {
  };

  /**
   * The oninput function
   */
   oninput = element => {
  };

  /**
   * Creates a Z4AbstractComponentWithValueUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    super(ui);
  }

  /**
   * Sets the value
   *
   * @param <T>
   * @param value The value
   * @return This Z4AbstractComponentWithValueUI
   */
   setValue(value) {
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value;
  }
}
/**
 * The class of all UI messages
 *
 * @author gianpiero.di.blasi
 */
class Z4ModalMessageUI {

  static  html = Z4ModalMessageUI.loadHTML();

  static  modal = new bootstrap.Modal(Z4ModalMessageUI.html);

  static  loadHTML() {
    let parent = document.createElement("div");
    parent.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
    parent.setAttribute("data-bs-backdrop", "static");
    parent.setAttribute("data-bs-keyboard", "false");
    parent.setAttribute("tabindex", "-1");
    parent.setAttribute("style", "display:none");
    parent.className = "modal modal-dialog-centered fade";
    parent.innerHTML = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ModalMessageUI.html");
    document.body.appendChild(parent);
    return parent;
  }

  /**
   * Shows an information message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  static  showInfo(title, message, onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-info-circle-fill", "#0dcaf0");
  }

  /**
   * Shows a warning message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  static  showWarning(title, message, onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-exclamation-triangle-fill", "#ffc107");
  }

  /**
   * Shows an error message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  static  showError(title, message, onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-exclamation-octagon-fill", "#dc3545");
  }

  static  showOneButton(title, message, onOK, className, color) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = className;
    icon.style.color = color;
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-sm btn-primary", onOK, footer);
    Z4ModalMessageUI.modal.show();
  }

  /**
   * Shows a question message
   *
   * @param title The title
   * @param message The message
   * @param onYES The callback to call on YES, null to hide the YES button
   * @param onNO The callback to call on NO, null to hide the NO button
   * @param onOK The callback to call on OK, null to hide the OK button
   * @param onCANCEL The callback to call on CANCEL, null to hide the CANCEL
   * button
   */
  static  showQuestion(title, message, onYES, onNO, onOK, onCANCEL) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    if (onYES) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("YES"), "btn btn-sm btn-primary", onYES, footer);
    }
    if (onNO) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("NO"), "btn btn-sm btn-secondary", onNO, footer);
    }
    if (onOK) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-sm btn-primary", onOK, footer);
    }
    if (onCANCEL) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("CANCEL"), "btn btn-sm btn-secondary", onCANCEL, footer);
    }
    Z4ModalMessageUI.modal.show();
  }

  /**
   * Shows a question message with open answer
   *
   * @param title The title
   * @param message The message
   * @param optionStr1 The option1 message
   * @param onOption1 The callback to call on option1
   * @param optionStr2 The option2 message
   * @param onOption2 The callback to call on option2
   * @param optionStr3 The option3 message
   * @param onOption3 The callback to call on option3
   * @param optionStr4 The option4 message
   * @param onOption4 The callback to call on option4
   */
  static  showOpenQuestion(title, message, optionStr1, onOption1, optionStr2, onOption2, optionStr3, onOption3, optionStr4, onOption4) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    if (optionStr1) {
      Z4ModalMessageUI.appendButton(optionStr1, "btn btn-sm btn-secondary", onOption1, footer);
    }
    if (optionStr2) {
      Z4ModalMessageUI.appendButton(optionStr2, "btn btn-sm btn-secondary", onOption2, footer);
    }
    if (optionStr3) {
      Z4ModalMessageUI.appendButton(optionStr3, "btn btn-sm btn-secondary", onOption3, footer);
    }
    if (optionStr4) {
      Z4ModalMessageUI.appendButton(optionStr4, "btn btn-sm btn-secondary", onOption4, footer);
    }
    Z4ModalMessageUI.modal.show();
  }

  static  appendButton(text, className, onButton, footer) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-dismiss", "modal");
    button.className = className;
    button.innerHTML = text;
    button.onclick = (event) => {
      onButton();
      return null;
    };
    footer.appendChild(button);
  }

  constructor() {
  }
}
/**
 * The utility library for math
 *
 * @author gianpiero.di.blasi
 */
class Z4Math {

  /**
   * 2*PI value
   */
  static  TWO_PI = 2 * Math.PI;

  /**
   * PI/2 value
   */
  static  HALF_PI = Math.PI / 2;

  /**
   * The gold section
   */
  static  GOLD_SECTION = (1 + Math.sqrt(5)) / 2;

  /**
   * The gold section square
   */
  static  SQUARE_GOLD_SECTION = Z4Math.GOLD_SECTION * Z4Math.GOLD_SECTION;

  /**
   * RAD to DEG conversion
   */
  static  RAD2DEG = 180 / Math.PI;

  /**
   * DEG to RAD conversion
   */
  static  DEG2RAD = Math.PI / 180;

  /**
   * Converts an angle from radiants to degrees
   *
   * @param radians The angle in radians
   * @return The angle in degree
   */
  static  rad2deg(radians) {
    return radians * Z4Math.RAD2DEG;
  }

  /**
   * Converts an angle from degrees to radians
   *
   * @param degrees The angle in degrees
   * @return The angle in radians
   */
  static  deg2rad(degrees) {
    return degrees * Z4Math.DEG2RAD;
  }

  /**
   * Returns the distance between two points
   *
   * @param x1 The x-axis coordinate of the first point
   * @param y1 The y-axis coordinate of the first point
   * @param x2 The x-axis coordinate of the second point
   * @param y2 The y-axis coordinate of the second point
   * @return The distance between two points
   */
  static  distance(x1, y1, x2, y2) {
    let x = x1 - x2;
    let y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Returns the theta component of a point or a vector, in polar coordinates.
   * The value is normalized in the range [0,2*PI]
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The theta component of a point or a vector, in polar coordinates
   */
  static  atan(x0, y0, x, y) {
    let a = Math.atan2(y - y0, x - x0);
    return a < 0 ? a + Z4Math.TWO_PI : a;
  }

  /**
   * Generates a ripple around a value
   *
   * @param value The value
   * @param min The minimum allowed value
   * @param max The maximum allowed value
   * @param ripple The ripple (in the range [0,1])
   * @return The rippled value
   */
  static  ripple(value, min, max, ripple) {
    let rnd = (max - min) * ripple * Math.random();
    value += Math.random() > 0.5 ? rnd : -rnd;
    return value < min ? min : value > max ? max : value;
  }

  constructor() {
  }
}
/**
 * The signs of a value
 *
 * @author gianpiero.di.blasi
 */
class Z4Sign {

  /**
   * Positive sign
   */
  static  POSITIVE = new Z4Sign(1);

  /**
   * Negative sign
   */
  static  NEGATIVE = new Z4Sign(-1);

  /**
   * Random sign
   */
  static  RANDOM = new Z4Sign(0);

   sign = 0;

  constructor(sign) {
    this.sign = sign;
  }

  /**
   * Returns the next sign
   *
   * @return The next sign
   */
   next() {
    switch(this.sign) {
      case 1:
      case -1:
        return this.sign;
      case 0:
      default:
        return Math.random() > 0.5 ? 1 : -1;
      case 2:
      case -2:
        this.sign *= -1;
        return this.sign / 2;
    }
  }

  /**
   * Creates a Z4Sign providing the following sequence 1, -1, 1, -1, ...
   *
   * @return The Z4Sign
   */
  static  alternate() {
    return new Z4Sign(-2);
  }
}
/**
 * A value with sign
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValue {

   sign = Z4Sign.RANDOM;

   value = 0.0;

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Sets the sign
   *
   * @param sign The sign
   * @return This Z4SignedValue
   */
   setSign(sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
   getValue() {
    return this.value;
  }

  /**
   * Sets the value
   *
   * @param value The (positive) value
   * @return This Z4SignedValue
   */
   setValue(value) {
    this.value = value;
    return this;
  }

  /**
   * Returns the next signed value
   *
   * @return The next signed value
   */
   next() {
    return this.sign.next() * this.value;
  }
}
/**
 * A random value with sign
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValue {

   sign = Z4Sign.RANDOM;

   value = 0.0;

   type = 0;

   length = 0.0;

   step = 0;

   prevRandom = 0.0;

   controlRandom = 0.0;

   nextRandom = 0.0;

   bezierCurve = null;

  constructor(value, type, length) {
    this.value = value;
    this.type = type;
    this.length = length;
    this.step = 0;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();
    if (this.type === 1) {
      this.createBezierCurve();
    }
  }

   createBezierCurve() {
    this.bezierCurve = new Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
  }

  /**
   * Checks if this Z4SignedRandomValue generates "classic "random values
   *
   * @return true if this Z4SignedRandomValue generates "classic "random values,
   * false otherwise
   */
   isClassic() {
    return this.type === 0;
  }

  /**
   * Checks if this Z4SignedRandomValue generates random values on a bezier
   * curve
   *
   * @return true if this Z4SignedRandomValue generates random values on a
   * bezier curve, false otherwise
   */
   isBezier() {
    return this.type === 1;
  }

  /**
   * Checks if this Z4SignedRandomValue generates random values on a polyline
   *
   * @return true if this Z4SignedRandomValue generates random values on a
   * polyline, false otherwise
   */
   isPolyline() {
    return this.type === 2;
  }

  /**
   * Returns if this Z4SignedRandomValue generates random values on a stepped
   * line
   *
   * @return true if this Z4SignedRandomValue generates random values on a
   * stepped line, false otherwise
   */
   isStepped() {
    return this.type === 3;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Sets the sign
   *
   * @param sign The sign
   * @return This Z4SignedRandomValue
   */
   setSign(sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The (positive) value
   */
   getValue() {
    return this.value;
  }

  /**
   * Returns the length
   *
   * @return The length
   */
   getLength() {
    return this.length;
  }

  /**
   * Returns the next unsigned random value
   *
   * @return The next unsigned random value (in the range [0,value[)
   */
   nextUnsigned() {
    switch(this.type) {
      case 0:
      default:
        return this.value * Math.random();
      case 1:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.controlRandom = this.controlRandom === 1 ? 0 : 1;
          this.nextRandom = Math.random();
          this.createBezierCurve();
        } else {
          this.step++;
        }
        return this.value * this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }
        return this.value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
      case 3:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = Math.random();
        } else {
          this.step++;
        }
        return this.value * this.prevRandom;
    }
  }

  /**
   * Returns the next signed random value
   *
   * @return The next signed random value (in the range ]-value,value[)
   */
   nextSigned() {
    return this.sign.next() * this.nextUnsigned();
  }

  /**
   * Returns a Z4SignedRandomValue generating "classic "random values
   *
   * @param value The (positive) value
   * @return The Z4SignedRandomValue
   */
  static  classic(value) {
    return new Z4SignedRandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a bezier curve
   *
   * @param value The (positive) value
   * @param length The curve length
   * @return The Z4SignedRandomValue
   */
  static  bezier(value, length) {
    return new Z4SignedRandomValue(value, 1, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a polyline
   *
   * @param value The (positive) value
   * @param length The polyline length
   * @return The Z4SignedRandomValue
   */
  static  polyline(value, length) {
    return new Z4SignedRandomValue(value, 2, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a stepped line
   *
   * @param value The (positive) value
   * @param length The step length
   * @return The Z4SignedRandomValue
   */
  static  stepped(value, length) {
    return new Z4SignedRandomValue(value, 3, length);
  }
}
/**
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValue {

   constant = new Z4SignedValue();

   random = Z4SignedRandomValue.classic(0);

   proportional = new Z4SignedValue();

   uniformSign = false;

  /**
   * Sets the constant component
   *
   * @param constant The constant component
   * @return This Z4FancifulValue
   */
   setConstant(constant) {
    this.constant = constant;
    return this;
  }

  /**
   * Returns the the constant component
   *
   * @return The the constant component
   */
   getConstant() {
    return this.constant;
  }

  /**
   * Sets the random component
   *
   * @param random The random component
   * @return This Z4FancifulValue
   */
   setRandom(random) {
    this.random = random;
    return this;
  }

  /**
   * Returns the random component
   *
   * @return The random component
   */
   getRandom() {
    return this.random;
  }

  /**
   * Sets the proportional component
   *
   * @param proportional The proportional component
   * @return This Z4FancifulValue
   */
   setProportional(proportional) {
    this.proportional = proportional;
    return this;
  }

  /**
   * Returns the proportional component
   *
   * @return The proportional component
   */
   getProportional() {
    return this.proportional;
  }

  /**
   * Sets if the computed sign has to be equals for all components; if true then
   * the constant sign is used
   *
   * @param uniformSign true if the computed sign has to be equals for all
   * components, false otherwise
   * @return This Z4FancifulValue
   */
   setUniformSign(uniformSign) {
    this.uniformSign = uniformSign;
    return this;
  }

  /**
   * Checks if the computed sign has to be equals for all components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for all components,
   * false otherwise
   */
   isUniformSign() {
    return this.uniformSign;
  }

  /**
   * Returns the next "fanciful" value
   *
   * @param sensibility The sensibility value to apply to the proportional
   * component
   * @return The next "fanciful" value
   */
   next(sensibility) {
    if (Z4Setting.isLiteMode()) {
      return this.constant.next();
    } else if (Z4Setting.isStandardMode()) {
      if (this.uniformSign) {
        return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
      } else {
        return this.constant.next() + this.random.nextSigned();
      }
    } else if (Z4Setting.isProMode()) {
      if (this.uniformSign) {
        return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned() + sensibility * this.proportional.getValue());
      } else {
        return this.constant.next() + this.random.nextSigned() + sensibility * this.proportional.next();
      }
    } else {
      return 0;
    }
  }
}
/**
 * The rotation (angles parameters are computed in degrees, rotations are
 * computed in radians)
 *
 * @author gianpiero.di.blasi
 */
class Z4Rotation {

   type = 0;

   startAngle = 0.0;

   angle = new Z4FancifulValue();

   delayed = false;

   rotationNext = 0.0;

  constructor(type) {
    this.type = type;
  }

  /**
   * Returns if the next rotation is computed on a fixed value
   *
   * @return true if the next rotation is computed on a fixed value, false
   * otherwise
   */
   isFixed() {
    return this.type === 0;
  }

  /**
   * Returns if next rotation is computed by cumulating previous rotation
   *
   * @return true if next rotation is computed by cumulating previous rotation,
   * false otherwise
   */
   isCumulative() {
    return this.type === 1;
  }

  /**
   * Checks if next rotation is computed relative to a path
   *
   * @return true if next rotation is computed relative to a path, false
   * otherwise
   */
   isRelativeToPath() {
    return this.type === 2;
  }

  /**
   * Returns the initial angle of rotation (in degrees)
   *
   * @return The initial angle of rotation (in degrees)
   */
   getStartAngle() {
    return this.startAngle;
  }

  /**
   * Sets the initial angle of rotation (in degrees)
   *
   * @param startAngle The initial angle of rotation (in degrees)
   * @return This Z4Rotation
   */
   setStartAngle(startAngle) {
    this.startAngle = startAngle;
    return this;
  }

  /**
   * Returns the angle (in degrees)
   *
   * @return The angle (in degrees)
   */
   getAngle() {
    return this.angle;
  }

  /**
   * Sets the angle (in degrees)
   *
   * @param angle The angle (in degrees)
   * @return This Z4Rotation
   */
   setAngle(angle) {
    this.angle = angle;
    return this;
  }

  /**
   * Returns if the rotation has to be delayed (rotated by a PI angle)
   *
   * @return true if the returned rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   */
   isDelayed() {
    return this.delayed;
  }

  /**
   * Sets if the rotation has to be delayed (rotated by a PI angle)
   *
   * @param delayed true if the rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   * @return This Z4Rotation
   */
   setDelayed(delayed) {
    this.delayed = delayed;
    return this;
  }

  /**
   * Returns the next rotation
   *
   * @param tangentAngle The tangent angle (in radians)
   * @return The next rotation (in radians)
   */
   next(tangentAngle) {
    let nextAngle = Z4Math.deg2rad(this.startAngle + this.angle.next(0));
    switch(this.type) {
      case 0:
        return nextAngle + (this.delayed ? Math.PI : 0);
      case 1:
        this.rotationNext += nextAngle;
        return this.rotationNext + (this.delayed ? Math.PI : 0);
      case 2:
        return nextAngle + tangentAngle + (this.delayed ? Math.PI : 0);
      default:
        return 0;
    }
  }

  /**
   * Computes the next side
   *
   * @param z4Point The current point
   * @param vector The tangent vector
   */
   nextSide(z4Point, vector) {
    switch(this.type) {
      case 0:
      case 1:
        z4Point.setSide(Z4Sign.POSITIVE);
        break;
      case 2:
        z4Point.setSide(vector ? vector.direction(z4Point.getZ4Vector()) : Z4Sign.RANDOM);
        break;
    }
  }

  /**
   * Returns a Z4Rotation with next rotation computed on a fixed value
   *
   * @return The Z4Rotation
   */
  static  fixed() {
    return new Z4Rotation(0);
  }

  /**
   * Returns a Z4Rotation with next rotation computed by cumulating previous
   * rotation
   *
   * @return The Z4Rotation
   */
  static  cumulative() {
    return new Z4Rotation(1);
  }

  /**
   * Returns a Z4Rotation with next rotation computed relative to a path
   *
   * @return The Z4Rotation
   */
  static  relativeToPath() {
    return new Z4Rotation(2);
  }
}
/**
 * The geometric shapes
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2D {

  /**
   * A circular geometric shape
   */
  static  CIRCLE = new Z4Shape2D(0);

  /**
   * A triangular geometric shape
   */
  static  TRIANGLE = new Z4Shape2D(3);

  /**
   * A squared geometric shape
   */
  static  SQUARE = new Z4Shape2D(-4);

  /**
   * A diamond geometric shape
   */
  static  DIAMOND = new Z4Shape2D(4);

  /**
   * A five sided geometric shape
   */
  static  PENTAGON = new Z4Shape2D(5);

  /**
   * A six sided geometric shape
   */
  static  HEXAGON = new Z4Shape2D(6);

  /**
   * A seven sided geometric shape
   */
  static  SEPTAGON = new Z4Shape2D(7);

  /**
   * A eight sided geometric shape
   */
  static  HEPTAGON = new Z4Shape2D(8);

  /**
   * A star geometric shape
   */
  static  STAR = new Z4Shape2D(-5);

   path = new Path2D();

  constructor(sides) {
    let size = 1;
    let halfSize = 0.5;
    let val = 0.0;
    let angle = 0.0;
    switch(sides) {
      case 0:
        this.path.arc(0, 0, halfSize, 0, Z4Math.TWO_PI);
        break;
      case -4:
        this.path.rect(-halfSize, -halfSize, size, size);
        break;
      case -5:
        val = -Z4Math.HALF_PI;
        angle = Z4Math.TWO_PI / 5;
        let halfSizeGold = halfSize / Z4Math.SQUARE_GOLD_SECTION;
        this.path.moveTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        val = angle * 3 + Z4Math.HALF_PI;
        this.path.lineTo(Math.cos(val) * halfSizeGold, Math.sin(val) * halfSizeGold);
        for (let i = 1; i < 5; i++) {
          val = angle * i - Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
          val = angle * (i + 3) + Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSizeGold, Math.sin(val) * halfSizeGold);
        }
        break;
      default:
        val = -Z4Math.HALF_PI;
        angle = Z4Math.TWO_PI / sides;
        this.path.moveTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        for (let i = 1; i < sides; i++) {
          val = angle * i - Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        }
        break;
    }
    this.path.closePath();
  }

  /**
   * Returns the path
   *
   * @return The path
   */
   getPath() {
    return path;
  }
}
/**
 * The vector
 *
 * @author gianpiero.di.blasi
 */
class Z4Vector {

   x0 = 0.0;

   y0 = 0.0;

   x = 0.0;

   y = 0.0;

   module = 0.0;

   phase = 0.0;

  constructor(x0, y0, x, y, module, phase) {
    this.x0 = x0;
    this.y0 = y0;
    this.x = x;
    this.y = y;
    this.module = module;
    this.phase = phase;
  }

  /**
   * Creates a Z4Vector from points
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The Z4Vector
   */
  static  fromPoints(x0, y0, x, y) {
    return new Z4Vector(x0, y0, x, y, Z4Math.distance(x0, y0, x, y), Z4Math.atan(x0, y0, x, y));
  }

  /**
   * Creates a Z4Vector from a vector
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param module The module
   * @param phase The phase (in radians)
   * @return The Z4Vector
   */
  static  fromVector(x0, y0, module, phase) {
    return new Z4Vector(x0, y0, x0 + module * Math.cos(phase), y0 + module * Math.sin(phase), module, phase);
  }

   clone() {
    return new Z4Vector(this.x0, this.y0, this.x, this.y, this.module, this.phase);
  }

  /**
   * Return the x-axis coordinate of the start point
   *
   * @return The x-axis coordinate of the start point
   */
   getX0() {
    return this.x0;
  }

  /**
   * Return the y-axis coordinate of the start point
   *
   * @return The y-axis coordinate of the start point
   */
   getY0() {
    return this.y0;
  }

  /**
   * Return the x-axis coordinate of the end point
   *
   * @return The x-axis coordinate of the end point
   */
   getX() {
    return this.x;
  }

  /**
   * Return the y-axis coordinate of the end point
   *
   * @return The y-axis coordinate of the end point
   */
   getY() {
    return this.y;
  }

  /**
   * Returns the module
   *
   * @return The module
   */
   getModule() {
    return this.module;
  }

  /**
   * Return the phase (in radians)
   *
   * @return The phase (in radians)
   */
   getPhase() {
    return this.phase;
  }

  /**
   * Returns the direction in which this vector rotates on another Z4Vector
   *
   * @param vector The other vector
   * @return The direction in which this vector rotates on another Z4Vector
   */
   direction(vector) {
    let x1 = this.x - this.x0;
    let y1 = this.y - this.y0;
    let x2 = vector.x - vector.x0;
    let y2 = vector.y - vector.y0;
    return Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2) >= 0 ? Z4Sign.POSITIVE : Z4Sign.NEGATIVE;
  }
}
/**
 * The point where to perform a drawing
 *
 * @author gianpiero.di.blasi
 */
class Z4Point {

   z4Vector = Z4Vector.fromPoints(0, 0, 1, 1);

   intensity = 1;

   lighting = Z4Lighting.NONE;

   colorPosition = -1;

   drawBounds = false;

   side = Z4Sign.RANDOM;

   useVectorModuleAsSize = false;

   clone() {
    let clone = new Z4Point();
    clone.z4Vector = this.z4Vector.clone();
    clone.intensity = this.intensity;
    clone.lighting = this.lighting;
    clone.colorPosition = this.colorPosition;
    clone.drawBounds = this.drawBounds;
    clone.side = this.side;
    clone.useVectorModuleAsSize = this.useVectorModuleAsSize;
    return clone;
  }

  /**
   * Returns the Z4Vector
   *
   * @return The Z4Vector
   */
   getZ4Vector() {
    return this.z4Vector;
  }

  /**
   * Sets the Z4Vector
   *
   * @param z4Vector The Z4Vector
   * @return This Z4Point
   */
   setZ4Vector(z4Vector) {
    this.z4Vector = z4Vector;
    return this;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
   getIntensity() {
    return this.intensity;
  }

  /**
   * Sets the intensity
   *
   * @param intensity The intensity
   * @return This Z4Point
   */
   setIntensity(intensity) {
    this.intensity = intensity;
    return this;
  }

  /**
   * Returns the lighting
   *
   * @return The lighting
   */
   getLighting() {
    return this.lighting;
  }

  /**
   * Sets the lighting
   *
   * @param lighting The lighting
   * @return This Z4Point
   */
   setLighting(lighting) {
    this.lighting = lighting;
    return this;
  }

  /**
   * Returns the color position
   *
   * @return The color position (in the range [0,1]), -1 if this point has no
   * color position
   */
   getColorPosition() {
    return this.colorPosition;
  }

  /**
   * Sets the color position
   *
   * @param colorPosition The color position (in the range [0,1]), -1 if this
   * point has no color position
   * @return This Z4Point
   */
   setColorPosition(colorPosition) {
    this.colorPosition = colorPosition;
    return this;
  }

  /**
   * Checks if this point has to be used to draw bounds or real objects
   *
   * @return true if this point has to be used to draw bounds, false otherwise
   */
   isDrawBounds() {
    return this.drawBounds;
  }

  /**
   * Sets the side
   *
   * @param side the side
   * @return This Z4Point
   */
   setSide(side) {
    this.side = side;
    return this;
  }

  /**
   * Checks if the vector module of this point has to be used has size
   *
   * @return true if the vector module of this point has to be used has size,
   * false otherwise
   */
   isUseVectorModuleAsSize() {
    return this.useVectorModuleAsSize;
  }
}
/**
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValueUI extends Z4AbstractComponentWithValueUI {

   valueSpan = this.querySelector(".value-span");

   text = this.querySelector(".value");

   spinner = this.querySelector(".spinner");

   applySpin = () => this.spin();

   isApplySpin = false;

   signVisible = true;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  constructor() {
    super(Z4SignedValueUI.UI);
    let imgs = this.querySelectorAll(".btn-group-sign img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".btn-group-sign button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        switch(str) {
          case "positive":
            this.value.setSign(Z4Sign.POSITIVE);
            break;
          case "negative":
            this.value.setSign(Z4Sign.NEGATIVE);
            break;
          case "random":
            this.value.setSign(Z4Sign.RANDOM);
            break;
          case "alternate":
            this.value.setSign(Z4Sign.alternate());
            break;
        }
        this.setSpan();
        this.onchange(this.value);
        return null;
      };
    }
    this.text.oninput = (event) => {
      this.value.setValue(this.text.valueAsNumber);
      this.setSpan();
      this.oninput(this.value);
      return null;
    };
    this.text.onchange = (event) => {
      this.value.setValue(this.text.valueAsNumber);
      this.setSpan();
      this.onchange(this.value);
      return null;
    };
    this.text.onfocus = (event) => {
      this.text.select();
      return null;
    };
    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) => this.startSpin();
      this.spinner.ontouchend = (event) => this.stopSpin();
    } else {
      this.spinner.onmousedown = (event) => this.startSpin();
      this.spinner.onmouseup = (event) => this.stopSpin();
    }
    this.setValue(new Z4SignedValue());
  }

   startSpin() {
    this.isApplySpin = true;
    this.applySpin();
    return null;
  }

   stopSpin() {
    this.isApplySpin = false;
    this.spinner.value = "0";
    return null;
  }

   spin() {
    let min = parseFloat(this.text.getAttribute("min"));
    let max = parseFloat(this.text.getAttribute("max"));
    let v = this.spinner.valueAsNumber;
    let abs = 1;
    if (v) {
      abs = Math.abs(v);
      v = Math.max(min, this.text.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);
      this.text.value = "" + v;
      this.value.setValue(this.text.valueAsNumber);
      this.setSpan();
      this.oninput(this.value);
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.value.setValue(this.text.valueAsNumber);
      this.setSpan();
      this.onchange(this.value);
    }
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4SignedValueUI
   */
   compact() {
    this.valueSpan.classList.remove("signed-value-not-compact");
    this.querySelector(".dropdown-toggle-split").style.display = "inline-block";
    this.querySelector(".form-expanded").classList.add("mx-1");
    this.querySelector(".dropdown-menu").appendChild(this.querySelector(".form-expanded"));
    return this;
  }

  /**
   * Sets the range of this Z4SignedValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedValueUI
   */
   setRange(min, max) {
    this.text.setAttribute("min", "" + min);
    this.text.setAttribute("max", "" + max);
    this.querySelector(".range-label").innerHTML = "[" + min + "," + (max === 999999999 ? "&infin;" : max) + "]";
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedValueUI
   */
   setSignVisible(visible) {
    this.signVisible = visible;
    if (visible) {
      this.querySelector(".sign-label").classList.remove("sign-not-visible");
      this.querySelector(".btn-group-sign").classList.remove("sign-not-visible");
    } else {
      this.querySelector(".sign-label").classList.add("sign-not-visible");
      this.querySelector(".btn-group-sign").classList.add("sign-not-visible");
    }
    this.setSpan();
    return this;
  }

  /**
   * Checks if the sign is visible
   *
   * @return true if the sign is visible, false otherwise
   */
   isSignVisible() {
    return this.signVisible;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4SignedValueUI
   */
   setValueLabel(token, bold, italic) {
    let valueLabel = this.querySelector(".value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.text.value = "" + value.getValue();
    this.setSpan();
    return this;
  }

   setSpan() {
    if (!this.signVisible) {
      this.valueSpan.innerHTML = "" + this.value.getValue();
    } else if (this.value.getSign() === Z4Sign.POSITIVE) {
      this.valueSpan.innerHTML = "&plus;" + this.value.getValue();
    } else if (this.value.getSign() === Z4Sign.NEGATIVE) {
      this.valueSpan.innerHTML = "&minus;" + this.value.getValue();
    } else if (this.value.getSign() === Z4Sign.RANDOM) {
      this.valueSpan.innerHTML = "&plusmn;" + this.value.getValue();
    } else {
      this.valueSpan.innerHTML = "&plusmn;<sup>&UpArrowDownArrow;</sup>" + this.value.getValue();
    }
  }

   dispose() {
  }
}
/**
 * The component to edit a signed random value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI {

   valueLength = this.querySelector(".type-length");

   spinnerLength = this.querySelector(".type-length-spinner");

   signedValueUI = new Z4SignedValueUI();

   valueSpan = this.signedValueUI.querySelector(".value-span");

   applySpin = () => this.spin();

   isApplySpin = false;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedRandomValueUI.html");

  /**
   * Creates a Z4SignedRandomValueUI
   */
  constructor() {
    super(Z4SignedRandomValueUI.UI);
    this.signedValueUI.appendToComponent(this);
    this.signedValueUI.oninput = (signedValue) => this.oninput(this.createSignedRandomValue(this.getType()));
    this.signedValueUI.onchange = (signedValue) => this.onchange(this.createSignedRandomValue(this.getType()));
    this.signedValueUI.querySelector(".form-expanded").insertBefore(this.querySelector(".btn-group-type-container"), this.signedValueUI.querySelector(".form-expanded .value-label-fixed"));
    this.signedValueUI.querySelector(".form-expanded").insertBefore(this.querySelector(".container-length"), this.signedValueUI.querySelector(".form-expanded .value-label-fixed"));
    let imgs = this.querySelectorAll(".btn-group-type img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".btn-group-type button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.onchange(this.createSignedRandomValue(button.getAttribute("data-value")));
        return null;
      };
    }
    this.valueLength.oninput = (event) => {
      this.oninput(this.createSignedRandomValue(this.getType()));
      return null;
    };
    this.valueLength.onchange = (event) => {
      this.onchange(this.createSignedRandomValue(this.getType()));
      return null;
    };
    this.valueLength.onfocus = (event) => {
      this.valueLength.select();
      return null;
    };
    if (Z4Loader.touch) {
      this.spinnerLength.ontouchstart = (event) => this.startSpin();
      this.spinnerLength.ontouchend = (event) => this.stopSpin();
    } else {
      this.spinnerLength.onmousedown = (event) => this.startSpin();
      this.spinnerLength.onmouseup = (event) => this.stopSpin();
    }
    this.setValue(Z4SignedRandomValue.classic(0));
  }

   startSpin() {
    this.isApplySpin = true;
    this.applySpin();
    return null;
  }

   stopSpin() {
    this.isApplySpin = false;
    this.spinnerLength.value = "0";
    return null;
  }

   spin() {
    let min = parseFloat(this.valueLength.getAttribute("min"));
    let max = parseFloat(this.valueLength.getAttribute("max"));
    let v = this.spinnerLength.valueAsNumber;
    let abs = 1;
    if (v) {
      abs = Math.abs(v);
      v = Math.max(min, this.valueLength.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);
      this.valueLength.value = "" + v;
      this.oninput(this.createSignedRandomValue(this.getType()));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.createSignedRandomValue(this.getType()));
    }
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4SignedRandomValueUI
   */
   compact() {
    this.signedValueUI.compact();
    return this;
  }

  /**
   * Sets the range of this Z4SignedRandomValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
   setRange(min, max) {
    this.signedValueUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedRandomValueUI
   */
   setSignVisible(visible) {
    this.signedValueUI.setSignVisible(visible);
    return this;
  }

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
   setLengthRange(min, max) {
    this.valueLength.setAttribute("min", "" + min);
    this.valueLength.setAttribute("max", "" + max);
    this.querySelector(".range-length-label").innerHTML = "[" + min + "," + (max === 999999999 ? "&infin;" : max) + "]";
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4SignedRandomValueUI
   */
   setValueLabel(token, bold, italic) {
    this.signedValueUI.setValueLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
    this.value = value;
    this.signedValueUI.setValue(new Z4SignedValue().setValue(this.value.getValue()).setSign(this.value.getSign()));
    if (this.value.isClassic()) {
      this.valueLength.setAttribute("disabled", "disabled");
      this.spinnerLength.setAttribute("disabled", "disabled");
    } else if (this.value.isBezier()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    } else if (this.value.isPolyline()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    } else if (this.value.isStepped()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    }
    this.valueLength.value = "" + this.getValue().getLength();
    this.setSpan();
    return this;
  }

   createSignedRandomValue(str) {
    let signedValue = this.signedValueUI.getValue();
    switch(str) {
      case "classic":
        this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
        this.valueLength.setAttribute("disabled", "disabled");
        this.spinnerLength.setAttribute("disabled", "disabled");
        break;
      case "bezier":
        this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
      case "polyline":
        this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
      case "stepped":
        this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
    }
    this.setSpan();
    return this.value;
  }

   getType() {
    if (this.value.isClassic()) {
      return "classic";
    } else if (this.value.isBezier()) {
      return "bezier";
    } else if (this.value.isPolyline()) {
      return "polyline";
    } else if (this.value.isStepped()) {
      return "stepped";
    } else {
      return null;
    }
  }

   setSpan() {
    let sign = "";
    if (!this.signedValueUI.isSignVisible()) {
    } else if (this.value.getSign() === Z4Sign.POSITIVE) {
      sign = "&plus;";
    } else if (this.value.getSign() === Z4Sign.NEGATIVE) {
      sign = "&minus;";
    } else if (this.value.getSign() === Z4Sign.RANDOM) {
      sign = "&plusmn;";
    } else {
      sign = "&plusmn;<sup>&UpArrowDownArrow;</sup>";
    }
    let rnd = "";
    if (this.value.isClassic()) {
      rnd = "rnd";
    } else if (this.value.isBezier()) {
      rnd = "rnd&#8767;<sup>" + this.value.getLength() + "</sup>";
    } else if (this.value.isPolyline()) {
      rnd = "rnd&#8896;<sup>" + this.value.getLength() + "</sup>";
    } else if (this.value.isStepped()) {
      rnd = "rnd&#8851;<sup>" + this.value.getLength() + "</sup>";
    }
    this.valueSpan.innerHTML = sign + rnd + "(" + this.value.getValue() + ")";
  }

   dispose() {
  }
}
/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   valueSpan = this.querySelector(".fanciful-value-span");

  // private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
  // private final HTMLElement toggleUniform = this.querySelector(".toggle-uniform");
  // private final HTMLElement toggleUniformImg = this.querySelector(".toggle-uniform img");
  // 
   constantUI = new Z4SignedValueUI();

   randomUI = new Z4SignedRandomValueUI();

   proportionalUI = new Z4SignedValueUI();

  // 
   mutationObserver = new MutationObserver(() => this.setSpan());

  // private boolean constantSignVisible = true;
  // private boolean randomSignVisible = true;
  // private boolean proportionalSignVisible = true;
  // private boolean constantVisible = true;
  // private boolean randomVisible = true;
  // private boolean proportionalVisible = true;
   selector = new Array();

  // 
  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    // this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    // this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    // this.uniformCheck.onchange = (event) -> {
    // this.setUI();
    // this.onchange.$apply(this.value.setUniformSign(this.uniformCheck.checked));
    // return null;
    // };
    // 
    // this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + ".svg");
    // 
    // NodeList imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    // for (int i = 0; i < imgs.length; i++) {
    // HTMLElement img = (HTMLElement) imgs.item(i);
    // img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    // }
    // 
    // NodeList buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    // for (int i = 0; i < buttons.length; i++) {
    // HTMLElement button = (HTMLElement) buttons.item(i);
    // button.onclick = (event) -> {
    // String str = button.getAttribute("data-value");
    // this.toggleUniform.setAttribute("data-value", str);
    // this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
    // 
    // this.constantUI.setValue(this.constantUI.getValue().setSign(this.getUniformSign(str)));
    // this.onchange.$apply(this.value.setConstant(this.constantUI.getValue()));
    // return null;
    // };
    // }
    // 
    this.constantUI.appendToElement(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT", false, true);
    this.randomUI.appendToElement(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM", false, true);
    this.proportionalUI.appendToElement(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL", false, true);
    // 
    // this.constantUI.oninput = (event) -> this.onInput();
    // this.randomUI.oninput = (event) -> this.onInput();
    // this.proportionalUI.oninput = (event) -> this.onInput();
    // this.constantUI.onchange = (event) -> this.onChange();
    // this.randomUI.onchange = (event) -> this.onChange();
    // this.proportionalUI.onchange = (event) -> this.onChange();
    // 
    let array = new Array("class");
    let observerConfig = new Object();
    observerConfig["attributes"] = true;
    observerConfig["attributeFilter"] = array;
    this.mutationObserver.observe(document.querySelector("body"), observerConfig);
    this.setValue(new Z4FancifulValue());
  }

   onInput() {
    // this.setUniformSign(this.constantUI.getValue().getSign());
    // 
    // this.oninput.$apply(this.value.
    // setConstant(this.constantUI.getValue()).
    // setRandom(this.randomUI.getValue()).
    // setProportional(this.proportionalUI.getValue())
    // );
    return null;
  }

   onChange() {
    // this.setUniformSign(this.constantUI.getValue().getSign());
    // 
    // this.onchange.$apply(this.value.
    // setConstant(this.constantUI.getValue()).
    // setRandom(this.randomUI.getValue()).
    // setProportional(this.proportionalUI.getValue())
    // );
    return null;
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4FancifulValueUI
   */
   compact() {
    this.valueSpan.classList.remove("fanciful-value-not-compact");
    this.querySelector(".form-compact .dropdown-toggle-split").style.display = "inline-block";
    this.querySelector(".form-expanded").classList.add("mx-1");
    this.querySelector(".form-compact .dropdown-menu").appendChild(this.querySelector(".form-expanded"));
    return this;
  }

  /**
   * Sets the visibility of the components
   *
   * @param constant true to make the constant component visible, false
   * otherwise
   * @param random true to make the random component visible, false otherwise
   * @param proportional true to make the proportional component visible, false
   * @return This Z4FancifulValueUI
   */
   setComponentsVisible(constant, random, proportional) {
    // this.constantVisible = constant;
    // this.randomVisible = random;
    // this.proportionalVisible = proportional;
    // 
    this.setUI();
    return this;
  }

  /**
   * Sets the visibility of the signs
   *
   * @param constant true to make the constant sign visible, false otherwise
   * @param random true to make the random sign visible, false otherwise
   * @param proportional true to make the proportional sign visible, false
   * otherwise
   * @return
   */
   setSignsVisible(constant, random, proportional) {
    // this.constantSignVisible = constant;
    // this.randomSignVisible = random;
    // this.proportionalSignVisible = proportional;
    // 
    this.setUI();
    return this;
  }

  /**
   * Sets the range of the constant component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
   setConstantRange(min, max) {
    // this.constantUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the range of the random component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
   setRandomRange(min, max) {
    // this.randomUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
   setRandomLengthRange(min, max) {
    // this.randomUI.setLengthRange(min, max);
    return this;
  }

  /**
   * Sets the range of the proportional component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
   setProportionalRange(min, max) {
    // this.proportionalUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4FancifulValueUI
   */
   setValueLabel(token, bold, italic) {
    // $HTMLElement valueLabel = this.querySelector(".fanciful-label");
    // valueLabel.setAttribute("data-token-lang-inner_text", token);
    // valueLabel.innerHTML = Z4MessageFactory.get(token);
    // valueLabel.style.fontWeight = bold ? "700" : "400";
    // valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    // 
    // this.uniformCheck.checked = this.value.isUniformSign();
    // 
    // this.constantUI.setValue(this.value.getConstant());
    // this.setUniformSign(this.value.getConstant().getSign());
    // this.randomUI.setValue(this.value.getRandom());
    // this.proportionalUI.setValue(this.value.getProportional());
    // 
    this.setUI();
    this.setSpan();
    return this;
  }

  // 
   setUI() {
    // this.selector.forEach(sel -> {
    // this.querySelector(".fanciful-label").classList.remove(sel);
    // this.querySelector(".form-check").classList.remove(sel);
    // this.querySelector(".fanciful-container").classList.remove(sel);
    // });
    // 
    // this.selector = new Array<>(
    // "cv-" + this.constantVisible,
    // "rv-" + this.randomVisible,
    // "pv-" + this.proportionalVisible,
    // "csv-" + this.constantSignVisible,
    // "rsv-" + this.randomSignVisible,
    // "psv-" + this.proportionalSignVisible,
    // "u-" + this.uniformCheck.checked
    // );
    // 
    // this.selector.forEach(sel -> {
    // this.querySelector(".fanciful-label").classList.add(sel);
    // this.querySelector(".form-check").classList.add(sel);
    // this.querySelector(".fanciful-container").classList.add(sel);
    // });
  }

  // 
   setUniformSign(sign) {
    // String str;
    // 
    // if (sign == Z4Sign.POSITIVE) {
    // str = "positive";
    // } else if (sign == Z4Sign.NEGATIVE) {
    // str = "negative";
    // } else if (sign == Z4Sign.RANDOM) {
    // str = "random";
    // } else {
    // str = "alternate";
    // }
    // 
    // this.toggleUniform.setAttribute("data-value", str);
    // this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
  }

  // 
  // private Z4Sign getUniformSign(String str) {
  // switch (str) {
  // case "positive":
  // return Z4Sign.POSITIVE;
  // case "negative":
  // return Z4Sign.NEGATIVE;
  // case "random":
  // return Z4Sign.RANDOM;
  // case "alternate":
  // return Z4Sign.alternate();
  // default:
  // return null;
  // }
  // }
  // 
   setSpan() {
    // if (!this.signVisible) {
    // this.valueSpan.innerHTML = "" + this.value.getValue();
    // } else if (this.value.getSign() == Z4Sign.POSITIVE) {
    // this.valueSpan.innerHTML = "&plus;" + this.value.getValue();
    // } else if (this.value.getSign() == Z4Sign.NEGATIVE) {
    // this.valueSpan.innerHTML = "&minus;" + this.value.getValue();
    // } else if (this.value.getSign() == Z4Sign.RANDOM) {
    // this.valueSpan.innerHTML = "&plusmn;" + this.value.getValue();
    // } else {
    // this.valueSpan.innerHTML = "&plusmn;<sup>&UpArrowDownArrow;</sup>" + this.value.getValue();
    // }
    if (Z4Setting.isLiteMode()) {
      this.valueSpan.innerHTML = "10 lite";
    } else if (Z4Setting.isStandardMode()) {
      this.valueSpan.innerHTML = "10 standard";
    } else if (Z4Setting.isProMode()) {
      this.valueSpan.innerHTML = "10 pro";
    }
  }

   dispose() {
    this.mutationObserver.unobserve(document.querySelector("body"));
  }
}
/**
 * The component to edit a rotation
 *
 * @author gianpiero.di.blasi
 */
class Z4RotationUI extends Z4AbstractComponentWithValueUI {

   toggleType = this.querySelector(".toggle-type-rotation");

   toggleTypeImg = this.querySelector(".toggle-type-rotation img");

   startAngle = new Z4SignedValueUI().setRange(0, 360).setValueLabel("START_ANGLE", true, false).setSignVisible(false).appendToElement(this.querySelector(".start-angle-container"));

   delayedCheck = this.querySelector(".delayed-check");

   angle = new Z4FancifulValueUI().setValueLabel("ANGLE", true, false).setComponentsVisible(true, true, false).setConstantRange(0, 180).setRandomRange(0, 180).appendToComponent(this);

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  constructor() {
    super(Z4RotationUI.UI);
    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + this.toggleType.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".toggle-type-rotation-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".toggle-type-rotation-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleType.setAttribute("data-value", str);
        this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + str + ".svg");
        switch(str) {
          case "fixed":
            this.value = Z4Rotation.fixed();
            break;
          case "cumulative":
            this.value = Z4Rotation.cumulative();
            break;
          case "relativetopath":
            this.value = Z4Rotation.relativeToPath();
            break;
        }
        this.onchange(this.value.setAngle(this.angle.getValue()).setStartAngle(this.startAngle.getValue().getValue()).setDelayed(this.delayedCheck.checked));
        return null;
      };
    }
    this.delayedCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".delayed-label").setAttribute("for", this.delayedCheck.id);
    this.delayedCheck.onchange = (event) => {
      this.onchange(this.value.setDelayed(this.delayedCheck.checked));
      return null;
    };
    this.startAngle.oninput = (start) => this.oninput(this.value.setStartAngle(start.getValue()));
    this.startAngle.onchange = (start) => this.onchange(this.value.setStartAngle(start.getValue()));
    this.angle.oninput = (a) => this.oninput(this.value.setAngle(a));
    this.angle.onchange = (a) => this.onchange(this.value.setAngle(a));
    this.setValue(Z4Rotation.fixed());
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4RotationUI
   */
   setRandomLengthRange(min, max) {
    this.angle.setRandomLengthRange(min, max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4RotationUI
   */
   setValueLabel(token, bold, italic) {
    let valueLabel = this.querySelector(".rotation-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    let str = null;
    if (this.value.isFixed()) {
      str = "fixed";
    } else if (this.value.isCumulative()) {
      str = "cumulative";
    } else if (this.value.isRelativeToPath()) {
      str = "relativetopath";
    }
    this.toggleType.setAttribute("data-value", str);
    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + str + ".svg");
    this.delayedCheck.checked = this.value.isDelayed();
    this.startAngle.setValue(new Z4SignedValue().setValue(this.value.getStartAngle()));
    this.angle.setValue(this.value.getAngle());
    return this;
  }

   dispose() {
  }
}
/**
 * The lighting of a color
 *
 * @author gianpiero.di.blasi
 */
class Z4Lighting {

  /**
   * No lighting
   */
  static  NONE = new Z4Lighting();

  /**
   * lighting
   */
  static  LIGTHED = new Z4Lighting();

  /**
   * darkening
   */
  static  DARKENED = new Z4Lighting();

  constructor() {
  }
}
/**
 * The progression of a color
 *
 * @author gianpiero.di.blasi
 */
class Z4Progression {

  /**
   * The spatial progression
   */
  static  SPATIAL = new Z4Progression();

  /**
   * The temporal progression
   */
  static  TEMPORAL = new Z4Progression();

  /**
   * The progression relative to a path
   */
  static  RELATIVE_TO_PATH = new Z4Progression();

  /**
   * The random progression
   */
  static  RANDOM = new Z4Progression();

  constructor() {
  }
}
/**
 * The abstract color
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractColor {

   a = 0;

   r = 0;

   g = 0;

   b = 0;

   argb = 0;

   hex = null;

  /**
   * Creates a Z4AbstractColor
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  constructor(a, r, g, b) {
    this.a = a;
    this.r = r;
    this.g = g;
    this.b = b;
    this.init();
  }

   init() {
    this.argb = this.a << 24 | this.r << 16 | this.g << 8 | this.b;
    this.hex = "#" + new Number(this.r).toString(16).padStart(2, "0") + new Number(this.g).toString(16).padStart(2, "0") + new Number(this.b).toString(16).padStart(2, "0") + new Number(this.a).toString(16).padStart(2, "0");
    return this;
  }

  /**
   * Returns the components of this Z4AbstractColor (a, r, g, b)
   *
   * @return The six components of this Z4AbstractColor
   */
   getComponents() {
    return new Array(this.a, this.r, this.g, this.b);
  }

  /**
   * Returns the ARGB integer representing this Z4AbstractColor
   *
   * @return The ARGB integer representing this Z4AbstractColor
   */
   getARGB() {
    return this.argb;
  }

  /**
   * Returns the RGB hex string representing this Z4AbstractColor
   *
   * @return The RGB hex string representing this Z4AbstractColor
   */
   getHEX() {
    return this.hex;
  }
  /**
   * Sets this Z4AbstractColor from an ARGB integer color
   *
   * @param color The color
   * @return This Z4AbstractColor
   */
   set(color) {
    this.a = color >>> 24 & 0xff;
    this.r = color >>> 16 & 0xff;
    this.g = color >>> 8 & 0xff;
    this.b = color & 0xff;
    return this.init();
  }

  /**
   * In place converts this Z4AbstractColor to gray scaled, the transparency is
   * not changed
   *
   * @return This gray scaled Z4AbstractColor
   */
   gray() {
    let gray = parseInt(0.21 * this.r + 0.71 * this.g + 0.08 * this.b);
    this.r = gray;
    this.g = gray;
    this.b = gray;
    return this.init();
  }

  /**
   * In place converts this Z4AbstractColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4AbstractColor
   */
   negative() {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
    return this.init();
  }

  /**
   * In place lights up this Z4AbstractColor, the transparency is not changed
   *
   * @param lightingFactor The lighting factor (in the range [0,1])
   * @return This lighted Z4AbstractColor
   */
   lighted(lightingFactor) {
    this.r = parseInt((255 - this.r) * lightingFactor + this.r);
    this.g = parseInt((255 - this.g) * lightingFactor + this.g);
    this.b = parseInt((255 - this.b) * lightingFactor + this.b);
    return this.init();
  }

  /**
   * In place darkens this Z4AbstractColor, the transparency is not changed
   *
   * @param darkeningFactor The darkening factor (in the range [0,1])
   * @return This darkened Z4AbstractColor
   */
   darkened(darkeningFactor) {
    darkeningFactor = 1 - darkeningFactor;
    this.r = parseInt(darkeningFactor * this.r);
    this.g = parseInt(darkeningFactor * this.g);
    this.b = parseInt(darkeningFactor * this.b);
    return this.init();
  }

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
  static  getFillStyle(color) {
    return color;
  }
}
/**
 * The color
 *
 * @author gianpiero.di.blasi
 */
class Z4Color extends Z4AbstractColor {

  /**
   * Creates a Z4Color
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  constructor(a, r, g, b) {
    super(a, r, g, b);
  }

  /**
   * Creates a Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return The Z4Color
   */
  static  fromARGB(color) {
    return new Z4Color(color >>> 24 & 0xff, color >>> 16 & 0xff, color >>> 8 & 0xff, color & 0xff);
  }

  /**
   * Creates a Z4Color from an RGB hex string
   *
   * @param color The color
   * @param a The transparency component
   * @return The Z4Color
   */
  static  fromHEX(color, a) {
    let result = new RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4Color(a, parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
  }

  /**
   * Creates a Z4Color from a Z4AbstractColor
   *
   * @param color The color Z4AbstractColor
   * @return The Z4Color
   */
  static  fromZ4AbstractColor(color) {
    return Z4Color.fromARGB(color.getARGB());
  }

  /**
   * Creates a Z4Color from two Z4AbstractColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4Color
   */
  static  fromZ4AbstractColors(before, after, div) {
    let cBefore = before.getComponents();
    let cAfter = after.getComponents();
    return new Z4Color(parseInt((cAfter[0] - cBefore[0]) * div + cBefore[0]), parseInt((cAfter[1] - cBefore[1]) * div + cBefore[1]), parseInt((cAfter[2] - cBefore[2]) * div + cBefore[2]), parseInt((cAfter[3] - cBefore[3]) * div + cBefore[3]));
  }
}
/**
 * The stop color in a sequence
 *
 * @author gianpiero.di.blasi
 */
class Z4StopColor extends Z4AbstractColor {

   position = 0.0;

  /**
   * Creates a Z4StopColor
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   * @param position The position in a sequence (in the range [0,1])
   */
  constructor(a, r, g, b, position) {
    super(a, r, g, b);
    this.position = position;
  }

  /**
   * Returns the position
   *
   * @return The position in a sequence (in the range [0,1])
   */
   getPosition() {
    return this.position;
  }

  /**
   * Sets the position
   *
   * @param position The position in a sequence (in the range [0,1])
   * @return This Z4StopColor
   */
   setPosition(position) {
    this.position = position;
    return this;
  }

  /**
   * Creates a Z4StopColor from an ARGB integer color
   *
   * @param color The color
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  static  fromARGB(color, position) {
    return new Z4StopColor(color >>> 24 & 0xff, color >>> 16 & 0xff, color >>> 8 & 0xff, color & 0xff, position);
  }

  /**
   * Creates a Z4StopColor from an RGB hex string
   *
   * @param color The color
   * @param a The transparency component
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  static  fromHEX(color, a, position) {
    let result = new RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4StopColor(a, parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), position);
  }

  /**
   * Creates a Z4StopColor from a Z4AbstractColor
   *
   * @param color The Z4AbstractColor
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  static  fromZ4AbstractColor(color, position) {
    return Z4StopColor.fromARGB(color.getARGB(), position);
  }
}
/**
 * The abstract gradient color (a sequence of Z4StopColor)
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractGradientColor {

   z4StopColors = new Array();

   ripple = 0.0;

   mirrored = false;

  /**
   * Creates a Z4AbstractGradientColor
   */
  constructor() {
    this.z4StopColors.push(new Z4StopColor(255, 255, 255, 255, 0));
    this.z4StopColors.push(new Z4StopColor(255, 0, 0, 0, 1));
  }

  /**
   * Returns the components of this Z4AbstractGradientColor
   *
   * @return The components of this Z4AbstractGradientColor
   */
   getComponents() {
    return this.z4StopColors;
  }

  /**
   * Adds or updates a color
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param color An ARGB integer color
   * @return This Z4AbstractGradientColor
   */
   addOrUpdateColor(position, color) {
    let found = this.z4StopColors.find((z4StopColor, index, array) => z4StopColor.getPosition() === position);
    if (found) {
      found.set(color);
    } else {
      this.z4StopColors.push(Z4StopColor.fromARGB(color, position));
    }
    return this;
  }

  /**
   * Generates a color in a position computed as the linear interpolation of the
   * colors before and after the position
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @return This Z4AbstractGradientColor
   */
   generateColor(position) {
    return this.addOrUpdateColor(position, this.getZ4ColorAt(position, false, false).getARGB());
  }

  /**
   * Removes a color
   *
   * @param position The position in the sequence (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
   removeColor(position) {
    this.z4StopColors = this.z4StopColors.filter((z4StopColor, index, array) => z4StopColor.getPosition() !== position);
    return this;
  }

  /**
   * Moves the position of a color
   *
   * @param from The old color position (in the range [0,1])
   * @param to The new color position (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
   move(from, to) {
    let found = this.z4StopColors.find((z4StopColor, index, array) => z4StopColor.getPosition() === from);
    if (found && from !== 0 && from !== 1 && to !== 0 && to !== 1) {
      found.setPosition(to);
    }
    return this;
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
   setRipple(ripple) {
    this.ripple = ripple;
    return this;
  }

  /**
   * Returns the ripple
   *
   * @return The ripple (in the range [0,1])
   */
   getRipple() {
    return this.ripple;
  }

  /**
   * Sets the mirrored
   *
   * @param mirrored true if the color is mirrored, false otherwise
   * @return This Z4AbstractGradientColor
   */
   setMirrored(mirrored) {
    this.mirrored = mirrored;
    return this;
  }

  /**
   * Returns if the color is mirrored
   *
   * @return true if the color is mirrored, false otherwise
   */
   isMirrored() {
    return this.mirrored;
  }

  /**
   * In place converts this Z4AbstractGradientColor to negative, the
   * transparency is not changed
   *
   * @return This negativized Z4AbstractGradientColor
   */
   negative() {
    this.z4StopColors.forEach(z4StopColor => z4StopColor.negative());
    return this;
  }

  /**
   * In place inverts this Z4AbstractGradientColor
   *
   * @return This inverted Z4AbstractGradientColor
   */
   inverted() {
    this.z4StopColors.forEach(z4StopColor => z4StopColor.setPosition(1 - z4StopColor.getPosition()));
    return this;
  }

  /**
   * Returns a Z4AbstractColor in a position
   *
   * @param position The color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4AbstractColor
   */
   getZ4ColorAt(position, useRipple, useMirrored) {
    if (Z4Setting.isLiteMode()) {
      return this.z4StopColors.find((z4StopColor, index, array) => z4StopColor.getPosition() === 1);
    } else if (Z4Setting.isStandardMode() || Z4Setting.isProMode()) {
      if (useMirrored && this.mirrored) {
        position = 2 * (position < 0.5 ? position : 1 - position);
      }
      if (useRipple && this.ripple !== 0) {
        position = Z4Math.ripple(position, 0, 1, this.ripple);
      }
      let pos = position;
      let before = this.z4StopColors.filter((z4StopColor, index, array) => pos === 1 ? z4StopColor.getPosition() < pos : z4StopColor.getPosition() <= pos).reduce((found, current, index, array) => !found ? current : found.getPosition() > current.getPosition() ? found : current);
      let after = this.z4StopColors.filter((z4StopColor, index, array) => pos === 0 ? z4StopColor.getPosition() > pos : z4StopColor.getPosition() >= pos).reduce((found, current, index, array) => !found ? current : found.getPosition() < current.getPosition() ? found : current);
      if (before === after) {
        return before;
      } else {
        let div = (position - before.getPosition()) / (after.getPosition() - before.getPosition());
        return Z4Color.fromZ4AbstractColors(before, after, div);
      }
    } else {
      return null;
    }
  }

  /**
   * Returns a linear gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @return The linear gradient
   */
   getLinearGradient(context, x1, y1, x2, y2) {
    let gradient = context.createLinearGradient(x1, y1, x2, y2);
    this.z4StopColors.forEach((z4StopColor, index, array) => gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
    return gradient;
  }
  /**
   * Returns a radial gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start circle
   * @param y1 The y-axis coordinate of the start circle
   * @param r1 The radius of the start circle
   * @param x2 The x-axis coordinate of the end circle
   * @param y2 The y-axis coordinate of the end circle
   * @param r2 The radius of the end circle
   * @return The radial gradient
   */
   getRadialGradient(context, x1, y1, r1, x2, y2, r2) {
    let gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.z4StopColors.forEach((z4StopColor, index, array) => gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
    return gradient;
  }
  /**
   * Returns a conic gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x The x-axis coordinate of the centre of the gradient
   * @param y The y-axis coordinate of the centre of the gradient
   * @param angle The angle at which to begin the gradient, in radians
   * @return The conic gradient
   */
   getConicGradient(context, x, y, angle) {
    let gradient = context.createConicGradient(angle, x, y);
    this.z4StopColors.forEach((z4StopColor, index, array) => gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
    return gradient;
  }
}
/**
 * The gradient color (a sequence of Z4StopColor)
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColor extends Z4AbstractGradientColor {

  /**
   * Creates a Z4GradientColor
   */
  constructor() {
    super();
  }

  /**
   * Creates a Z4GradientColor from a Z4AbstractGradientColor
   *
   * @param color The Z4AbstractGradientColor
   * @return The Z4GradientColor
   */
  static  fromZ4AbstractGradientColor(color) {
    let z4GradientColor = new Z4GradientColor();
    color.getComponents().forEach(z4StopColor => z4GradientColor.addOrUpdateColor(z4StopColor.getPosition(), z4StopColor.getARGB()));
    return z4GradientColor;
  }

  /**
   * Creates a Z4GradientColor from two Z4AbstractGradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4GradientColor
   */
  static  fromZ4AbstractGradientColors(before, after, div) {
    let z4GradientColor = new Z4GradientColor();
    before.getComponents().forEach(z4StopColorBefore => {
      let z4StopColorAfter = after.getZ4ColorAt(z4StopColorBefore.getPosition(), false, false);
      let color = Z4Color.fromZ4AbstractColors(z4StopColorBefore, z4StopColorAfter, div);
      z4GradientColor.addOrUpdateColor(z4StopColorBefore.getPosition(), color.getARGB());
    });
    return z4GradientColor.setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }
}
/**
 * The stop gradient color in a sequence
 *
 * @author gianpiero.di.blasi
 */
class Z4StopGradientColor extends Z4AbstractGradientColor {

   position = 0.0;

  /**
   * Creates a Z4StopGradientColor
   *
   * @param position The position in a sequence (in the range [0,1])
   */
  constructor(position) {
    super();
    this.position = position;
  }

  /**
   * Returns the position
   *
   * @return The position in a sequence (in the range [0,1])
   */
   getPosition() {
    return this.position;
  }

  /**
   * Sets the position
   *
   * @param position The position in a sequence (in the range [0,1])
   * @return This Z4StopGradientColor
   */
   setPosition(position) {
    this.position = position;
    return this;
  }

  /**
   * Creates a Z4StopGradientColor from a Z4AbstractGradientColor
   *
   * @param color The Z4AbstractGradientColor
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopGradientColor
   */
  static  fromZ4AbstractGradientColor(color, position) {
    let z4StopGradientColor = new Z4StopGradientColor(position);
    color.getComponents().forEach(z4StopColor => z4StopGradientColor.addOrUpdateColor(z4StopColor.getPosition(), z4StopColor.getARGB()));
    return z4StopGradientColor.setRipple(color.getRipple()).setMirrored(color.isMirrored());
  }
}
/**
 * The temporal color (a sequence of Z4StopGradientColor)
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColor {

   z4StopGradientColors = new Array();

   ripple = 0.0;

   mirrored = false;

  /**
   * Creates a Z4AbstractGradientColor
   */
  constructor() {
    this.z4StopGradientColors.push(new Z4StopGradientColor(0));
    this.z4StopGradientColors.push(new Z4StopGradientColor(1));
  }

  /**
   * Returns the components of this Z4TemporalColor
   *
   * @return The components of this Z4TemporalColor
   */
   getComponents() {
    return this.z4StopGradientColors;
  }

  /**
   * Adds or updates a color
   *
   * @param temporal The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param spatial The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param color An ARGB integer color
   * @return This Z4TemporalColor
   */
   addOrUpdateColor(temporal, spatial, color) {
    let found = this.z4StopGradientColors.find((z4StopGradientColor, index, array) => z4StopGradientColor.getPosition() === temporal);
    if (!found) {
      let z4StopGradientColor = this.getZ4GradientColorAt(temporal, false, false);
      this.z4StopGradientColors.push(Z4StopGradientColor.fromZ4AbstractGradientColor(z4StopGradientColor, temporal));
    }
    this.z4StopGradientColors.forEach(z4StopGradientColor => {
      if (z4StopGradientColor.getPosition() !== temporal) {
        let found2 = z4StopGradientColor.getComponents().find((z4StopColor, index, array) => z4StopColor.getPosition() === spatial);
        if (!found2) {
          z4StopGradientColor.generateColor(spatial);
        }
      } else {
        z4StopGradientColor.addOrUpdateColor(spatial, color);
      }
    });
    return this;
  }

  /**
   * Generates a color in a position computed as the linear interpolation of the
   * colors before and after the position
   *
   * @param temporal The temporal position in the sequence (in the range [0,1]),
   * if there is no color in this position then it is added otherwise it is
   * updated, -1 to not generate anything
   * @param spatial The spatial position in the sequence (in the range [0,1]),
   * if there is no color in this position then it is added otherwise it is
   * updated, -1 to not generate anything
   * @return This Z4TemporalColor
   */
   generateColor(temporal, spatial) {
    if (temporal !== -1) {
      return this.addOrUpdateColor(temporal, spatial, this.getZ4ColorAt(temporal, spatial, false, false).getARGB());
    }
    if (spatial !== -1) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.generateColor(spatial));
    }
    return this;
  }

  /**
   * Removes a color
   *
   * @param temporal The temporal position in the sequence (in the range [0,1]),
   * -1 to not remove anything
   * @param spatial The spatial position in the sequence (in the range [0,1]),
   * -1 to not remove anything
   * @return This Z4TemporalColor
   */
   removeColor(temporal, spatial) {
    if (temporal !== 0 && temporal !== 1) {
      this.z4StopGradientColors = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) => z4StopGradientColor.getPosition() !== temporal);
    }
    if (spatial !== 0 && spatial !== 1) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.removeColor(spatial));
    }
    return this;
  }

  /**
   * Moves the position of a color
   *
   * @param fromT The old temporal color position (in the range [0,1]), -1 to
   * not move anything
   * @param toT The new temporal color position (in the range [0,1])
   * @param fromS The old spatial color position (in the range [0,1]), -1 to not
   * remove anything
   * @param toS The new spatial color position (in the range [0,1])
   * @return This Z4TemporalColor
   */
   move(fromT, toT, fromS, toS) {
    let found = this.z4StopGradientColors.find((z4StopGradientColor, index, array) => z4StopGradientColor.getPosition() === fromT);
    if (found && fromT !== 0 && fromT !== 1 && toT !== 0 && toT !== 1) {
      found.setPosition(toT);
    }
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.move(fromS, toS));
    return this;
  }

  /**
   * Sets the ripple
   *
   * @param temporal The temporal ripple (in the range [0,1])
   * @param spatial The spatial ripple (in the range [0,1])
   * @return This Z4TemporalColor
   */
   setRipple(temporal, spatial) {
    this.ripple = temporal;
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.setRipple(spatial));
    return this;
  }

  /**
   * Returns the temporal ripple
   *
   * @return The temporal ripple (in the range [0,1])
   */
   getTemporalRipple() {
    return this.ripple;
  }

  /**
   * Returns the spatial ripple
   *
   * @return The spatial ripple (in the range [0,1])
   */
   getSpatialRipple() {
    return this.z4StopGradientColors[0].getRipple();
  }

  /**
   * Sets the mirrored
   *
   * @param temporal true if the color is temporaly mirrored, false otherwise
   * @param spatial true if the color is spatialy mirrored, false otherwise
   * @return This Z4TemporalColor
   */
   setMirrored(temporal, spatial) {
    this.mirrored = temporal;
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.setMirrored(spatial));
    return this;
  }

  /**
   * Returns if the color is temporaly mirrored
   *
   * @return true if the color is temporaly mirrored, false otherwise
   */
   isTemporalyMirrored() {
    return this.mirrored;
  }

  /**
   * Returns if the color is spatialy mirrored
   *
   * @return true if the color is spatialy mirrored, false otherwise
   */
   isSpatialyMirrored() {
    return this.z4StopGradientColors[0].isMirrored();
  }

  /**
   * In place converts this Z4TemporalColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4TemporalColor
   */
   negative() {
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.negative());
    return this;
  }

  /**
   * In place inverts this Z4TemporalColor
   *
   * @param temporal true for temporal inversion, false otherwise
   * @param spatial true for spatial inversion, false otherwise
   * @return This inverted Z4TemporalColor
   */
   inverted(temporal, spatial) {
    if (temporal) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.setPosition(1 - z4StopGradientColor.getPosition()));
    }
    if (spatial) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.inverted());
    }
    return this;
  }

  /**
   * Returns a Z4AbstractGradientColor in a position
   *
   * @param position The temporal color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4AbstractGradientColor
   */
   getZ4GradientColorAt(position, useRipple, useMirrored) {
    if (Z4Setting.isLiteMode() || Z4Setting.isStandardMode()) {
      return this.z4StopGradientColors.find((z4StopGradienColor, index, array) => z4StopGradienColor.getPosition() === 0);
    } else if (Z4Setting.isProMode()) {
      if (useMirrored && this.mirrored) {
        position = 2 * (position < 0.5 ? position : 1 - position);
      }
      if (useRipple && this.ripple !== 0) {
        position = Z4Math.ripple(position, 0, 1, this.ripple);
      }
      let pos = position;
      let before = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) => pos === 1 ? z4StopGradientColor.getPosition() < pos : z4StopGradientColor.getPosition() <= pos).reduce((found, current, index, array) => !found ? current : found.getPosition() > current.getPosition() ? found : current);
      let after = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) => pos === 0 ? z4StopGradientColor.getPosition() > pos : z4StopGradientColor.getPosition() >= pos).reduce((found, current, index, array) => !found ? current : found.getPosition() < current.getPosition() ? found : current);
      if (before === after) {
        return before;
      } else {
        let div = (pos - before.getPosition()) / (after.getPosition() - before.getPosition());
        return Z4GradientColor.fromZ4AbstractGradientColors(before, after, div);
      }
    } else {
      return null;
    }
  }

  /**
   * Returns a Z4AbstractColor in a position
   *
   * @param temporal The temporal color position (in the range [0,1])
   * @param spatial The spatial color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4AbstractColor
   */
   getZ4ColorAt(temporal, spatial, useRipple, useMirrored) {
    if (Z4Setting.isLiteMode()) {
      return this.getZ4GradientColorAt(0, false, false).getZ4ColorAt(1, false, false);
    } else if (Z4Setting.isStandardMode()) {
      return this.getZ4GradientColorAt(0, false, false).getZ4ColorAt(spatial, useRipple, useMirrored);
    } else if (Z4Setting.isProMode()) {
      return this.getZ4GradientColorAt(temporal, useRipple, useMirrored).getZ4ColorAt(spatial, useRipple, useMirrored);
    } else {
      return null;
    }
  }
}
/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4ColorUI extends Z4AbstractComponentWithValueUI {

   color = this.querySelector(".form-control-color");

   formRangeLabel = this.querySelector(".form-range-label");

   formRange = this.querySelector(".form-range");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.querySelector(".gray").onclick = (event) => {
      this.setValue(this.value.gray());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.color.oninput = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.color.onchange = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.onchange(this.value);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.onchange(this.value);
      return null;
    };
    this.setValue(new Z4Color(255, 0, 0, 0));
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4ColorUI
   */
   setColorLabel(token, bold, italic) {
    let colorLabel = this.querySelector(".color-label");
    colorLabel.setAttribute("data-token-lang-inner_text", token);
    colorLabel.innerHTML = Z4MessageFactory.get(token);
    colorLabel.style.fontWeight = bold ? "700" : "400";
    colorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.color.value = this.value.getHEX().substring(0, 7);
    this.formRange.valueAsNumber = this.value.getComponents()[0];
    this.formRangeLabel.innerText = this.formRange.value;
    return this;
  }

   dispose() {
  }
}
/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   formRangeLabel = this.querySelector(".form-range-label");

   mirroredCheck = this.querySelector(".mirrored-check");

   formRange = this.querySelector(".form-range");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   resizeObserver = new ResizeObserver(() => this.drawCanvas(this.selectedIndex));

   selectedIndex = 0;

   selectedPosition = 0.0;

   mouseDown = false;

   dataChanged = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas(this.selectedIndex));
    this.querySelector(".gradient-inverted").onclick = (event) => {
      this.setValue(this.value.inverted());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".gradient-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => this.onMouseDown(event, event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchmove = (event) => this.onMouseMove(event, event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchend = (event) => this.onMouseUp(event);
      this.canvas.ontouchcancel = (event) => this.onMouseUp(event);
    } else {
      this.canvas.onmousedown = (event) => this.onMouseDown(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmousemove = (event) => this.onMouseMove(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmouseup = (event) => this.onMouseUp(event);
      this.canvas.onmouseleave = (event) => this.onMouseUp(event);
    }
    this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);
    this.mirroredCheck.onchange = (event) => {
      this.value.setMirrored(this.mirroredCheck.checked);
      this.drawCanvas(this.selectedIndex);
      this.onchange(this.value);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas(this.selectedIndex);
      this.oninput(this.value);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas(this.selectedIndex);
      this.onchange(this.value);
      return null;
    };
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPosition, z4Color.getARGB());
      this.drawCanvas(this.selectedIndex);
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPosition, z4Color.getARGB());
      this.drawCanvas(this.selectedIndex);
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        this.value.removeColor(this.selectedPosition);
        this.drawCanvas(0);
        this.onchange(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4GradientColor());
  }

   onMouseMove(event, x, y) {
    event.stopPropagation();
    let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
    if (this.mouseDown) {
      if (x < width) {
        let position = x / width;
        if (this.value.getComponents().every((color, index, array) => index === this.selectedIndex || Math.abs(position - color.getPosition()) > 0.05)) {
          this.dataChanged = true;
          this.value.move(this.selectedPosition, position);
          this.drawCanvas(this.selectedIndex);
          this.oninput(this.value);
        }
      }
    } else {
      this.canvas.style.cursor = "default";
      if (x < width) {
        let position = x / width;
        if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
          this.canvas.style.cursor = "pointer";
        } else {
          this.value.getComponents().forEach((color, index, array) => {
            if (index !== 0 && index !== 1 && Z4Math.distance(x, y, color.getPosition() * width, this.canvas.clientHeight / 2) < 8) {
              this.canvas.style.cursor = "ew-resize";
            }
          });
        }
      }
    }
    return null;
  }

   onMouseDown(event, x, y) {
    event.stopPropagation();
    let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
        this.value.generateColor(position);
        this.canvas.style.cursor = "ew-resize";
        this.drawCanvas(this.value.getComponents().length - 1);
        this.onchange(this.value);
      } else {
        this.value.getComponents().forEach((color, index, array) => {
          if (Z4Math.distance(x, y, color.getPosition() * width, this.canvas.clientHeight / 2) < 8) {
            this.mouseDown = true;
            this.drawCanvas(index);
          }
        });
      }
    }
    return null;
  }

   onMouseUp(event) {
    event.stopPropagation();
    if (this.dataChanged) {
      this.onchange(this.value);
    }
    this.mouseDown = false;
    this.dataChanged = false;
    return null;
  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4GradientColorUI
   */
   setGradientColorLabel(token, bold, italic) {
    let gradientColorLabel = this.querySelector(".gradient-color-label");
    gradientColorLabel.setAttribute("data-token-lang-inner_text", token);
    gradientColorLabel.innerHTML = Z4MessageFactory.get(token);
    gradientColorLabel.style.fontWeight = bold ? "700" : "400";
    gradientColorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4GradientColorUI
   */
   setColorLabel(token, bold, italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
    this.value = value;
    this.mirroredCheck.checked = this.value.isMirrored();
    this.formRange.valueAsNumber = this.value.getRipple();
    this.formRangeLabel.innerText = this.formRange.value;
    this.drawCanvas(0);
    return this;
  }

   drawCanvas(selected) {
    this.selectedIndex = selected;
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      for (let x = 0; x < this.canvas.clientWidth; x++) {
        offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / this.canvas.clientWidth, true, true).getHEX();
        offscreenCtx.fillRect(x, 0, 1, this.canvas.clientHeight);
      }
      let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
      this.value.getComponents().forEach((z4StopColor, index, array) => {
        let position = z4StopColor.getPosition();
        offscreenCtx.save();
        offscreenCtx.translate(position * width, this.canvas.clientHeight / 2);
        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
        offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("white");
        offscreenCtx.strokeStyle = Z4AbstractColor.getFillStyle("lightgray");
        offscreenCtx.fill();
        offscreenCtx.stroke();
        if (this.selectedIndex === index) {
          this.selectedPosition = position;
          offscreenCtx.beginPath();
          offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI, false);
          offscreenCtx.arc(0, 0, 4, 0, Z4Math.TWO_PI, true);
          offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("#0d6efd");
          offscreenCtx.fill();
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        }
        offscreenCtx.restore();
      });
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.fillStyle = this.chessboard;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
      if (this.selectedIndex === 0 || this.selectedIndex === 1) {
        this.del.setAttribute("disabled", "");
      } else {
        this.del.removeAttribute("disabled");
      }
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
/**
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   temporalFormRangeLabel = this.querySelector(".temporal-form-range-label");

   spatialFormRangeLabel = this.querySelector(".spatial-form-range-label");

   temporalMirroredCheck = this.querySelector(".temporal-mirrored-check");

   spatialMirroredCheck = this.querySelector(".spatial-mirrored-check");

   temporalFormRange = this.querySelector(".form-range-temporal");

   spatialFormRange = this.querySelector(".form-range-spatial");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   resizeObserver = new ResizeObserver(() => this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1));

   selectedIndexT = 0;

   selectedIndexS = 0;

   selectedPositionT = 0.0;

   selectedPositionS = 0.0;

   mouseDown = false;

   dataChanged = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

  /**
   * Creates a Z4TemporalColorUI
   */
  constructor() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1));
    this.querySelector(".temporal-inverted").onclick = (event) => this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) => this.inverted(false, true);
    this.querySelector(".temporal-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => this.onMouseDown(event, event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchmove = (event) => this.onMouseMove(event, event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchend = (event) => this.onMouseUp(event);
      this.canvas.ontouchcancel = (event) => this.onMouseUp(event);
    } else {
      this.canvas.onmousedown = (event) => this.onMouseDown(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmousemove = (event) => this.onMouseMove(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmouseup = (event) => this.onMouseUp(event);
      this.canvas.onmouseleave = (event) => this.onMouseUp(event);
    }
    let mirror = (event) => {
      this.value.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange(this.value);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;
    this.temporalMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".temporal-mirrored-label").setAttribute("for", this.temporalMirroredCheck.id);
    this.spatialMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".spatial-mirrored-label").setAttribute("for", this.spatialMirroredCheck.id);
    this.temporalFormRange.oninput = (event) => this.setRipple(this.getStep());
    this.spatialFormRange.oninput = (event) => this.setRipple(this.getStep());
    this.temporalFormRange.onchange = (event) => this.setRipple(1);
    this.spatialFormRange.onchange = (event) => this.setRipple(1);
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPositionT, this.selectedPositionS, z4Color.getARGB());
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPositionT, this.selectedPositionS, z4Color.getARGB());
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showOpenQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE2"), Z4MessageFactory.get("DELETE_COLOR_BOTH"), () => {
        this.value.removeColor(this.selectedPositionT, this.selectedPositionS);
        this.drawCanvas(0, 0, 1);
        this.onchange(this.value);
      }, Z4MessageFactory.get("DELETE_COLOR_TEMPORAL"), () => {
        this.value.removeColor(this.selectedPositionT, -1);
        this.drawCanvas(0, 0, 1);
        this.onchange(this.value);
      }, Z4MessageFactory.get("DELETE_COLOR_SPATIAL"), () => {
        this.value.removeColor(-1, this.selectedPositionS);
        this.drawCanvas(0, 0, 1);
        this.onchange(this.value);
      }, Z4MessageFactory.get("CANCEL"), () => {
      });
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4TemporalColor());
  }

   onMouseMove(event, x, y) {
    event.stopPropagation();
    let width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
    if (this.mouseDown) {
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let free = this.selectedIndexT !== 0 && this.selectedIndexT !== 1 && this.selectedIndexS !== 0 && this.selectedIndexS !== 1 && x < width && gap < y && y < gap + height;
        let temporal = this.selectedIndexT !== 0 && this.selectedIndexT !== 1 && x < width;
        let spatial = this.selectedIndexS !== 0 && this.selectedIndexS !== 1 && gap < y && y < gap + height;
        let okT = this.value.getComponents().every((color, indexT, array) => indexT === this.selectedIndexT || Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.value.getComponents()[0].getComponents().every((color, indexS, array) => indexS === this.selectedIndexS || Math.abs(positionS - color.getPosition()) > 0.1);
        if (free) {
          if (okT && okS) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, this.selectedPositionS, positionS);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput(this.value);
          }
        } else if (temporal) {
          if (okT) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, -1, -1);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput(this.value);
          }
        } else if (spatial) {
          if (okS) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, this.selectedPositionS, positionS);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput(this.value);
          }
        }
      }
    } else {
      this.canvas.style.cursor = "default";
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
        if (okT || okS) {
          this.canvas.style.cursor = "pointer";
        } else {
          this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
            z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
              if (Z4Math.distance(x, y, z4StopGradientColor.getPosition() * width, (1 - z4StopColor.getPosition()) * height + gap) >= 8) {
              } else if (indexT !== 0 && indexT !== 1 && indexS !== 0 && indexS !== 1) {
                this.canvas.style.cursor = "move";
              } else if (indexT !== 0 && indexT !== 1) {
                this.canvas.style.cursor = "ew-resize";
              } else if (indexS !== 0 && indexS !== 1) {
                this.canvas.style.cursor = "ns-resize";
              }
            });
          });
        }
      }
    }
    return null;
  }

   onMouseDown(event, x, y) {
    event.stopPropagation();
    let width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
    if (x < width && gap < y && y < gap + height) {
      let positionT = x / width;
      let positionS = (height - y + gap) / height;
      let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
      let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
      if (okT && okS) {
        this.value.generateColor(positionT, positionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1, 1);
        this.onchange(this.value);
      } else if (okT) {
        this.value.generateColor(positionT, this.selectedPositionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1, 1);
        this.onchange(this.value);
      } else if (okS) {
        this.value.generateColor(this.selectedPositionT, positionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1, 1);
        this.onchange(this.value);
      } else {
        this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
          z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
            if (Z4Math.distance(x, y, z4StopGradientColor.getPosition() * width, (1 - z4StopColor.getPosition()) * height + gap) < 8) {
              this.mouseDown = true;
              this.drawCanvas(indexT, indexS, 1);
            }
          });
        });
      }
    }
    return null;
  }

   onMouseUp(event) {
    event.stopPropagation();
    if (this.dataChanged) {
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange(this.value);
    }
    this.mouseDown = false;
    this.dataChanged = false;
    return null;
  }

   setRipple(step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.value.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(this.selectedIndexT, this.selectedIndexS, step);
    if (step === 1) {
      this.onchange(this.value);
    } else {
      this.oninput(this.value);
    }
    return null;
  }

   inverted(temporal, spatial) {
    this.setValue(this.value.inverted(temporal, spatial));
    this.onchange(this.value);
    return null;
  }

  /**
   * Sets the token of the temporal color label
   *
   * @param token The token of the temporal color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4TemporalColorUI
   */
   setTemporalColorLabel(token, bold, italic) {
    let temporalColorLabel = this.querySelector(".temporal-color-label");
    temporalColorLabel.setAttribute("data-token-lang-inner_text", token);
    temporalColorLabel.innerHTML = Z4MessageFactory.get(token);
    temporalColorLabel.style.fontWeight = bold ? "700" : "400";
    temporalColorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4TemporalColorUI
   */
   setColorLabel(token, bold, italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
    this.value = value;
    this.temporalMirroredCheck.checked = this.value.isTemporalyMirrored();
    this.spatialMirroredCheck.checked = this.value.isSpatialyMirrored();
    this.temporalFormRange.valueAsNumber = this.value.getTemporalRipple();
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRange.valueAsNumber = this.value.getSpatialRipple();
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.drawCanvas(0, 0, 1);
    return this;
  }

   getStep() {
    return Math.max(2, parseInt(this.canvas.width / 100));
  }

   drawCanvas(selectedIndexT, selectedIndexS, step) {
    this.selectedIndexT = selectedIndexT;
    this.selectedIndexS = selectedIndexS;
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      for (let x = 0; x < this.canvas.clientWidth; x += step) {
        let z4GradientColor = this.value.getZ4GradientColorAt(x / this.canvas.clientWidth, true, true);
        for (let y = 0; y < this.canvas.clientHeight; y += step) {
          offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / this.canvas.clientHeight, true, true).getHEX();
          offscreenCtx.fillRect(x, this.canvas.clientHeight - y - step, step, step);
        }
      }
      let width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
      let height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
      let gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
      this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
        let positionT = z4StopGradientColor.getPosition();
        z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
          let positionS = z4StopColor.getPosition();
          offscreenCtx.save();
          offscreenCtx.translate(positionT * width, (1 - positionS) * height + gap);
          offscreenCtx.beginPath();
          offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
          offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("white");
          offscreenCtx.strokeStyle = Z4AbstractColor.getFillStyle("lightgray");
          offscreenCtx.fill();
          offscreenCtx.stroke();
          if (this.selectedIndexT === indexT && this.selectedIndexS === indexS) {
            this.selectedPositionT = positionT;
            this.selectedPositionS = positionS;
            offscreenCtx.beginPath();
            offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI, false);
            offscreenCtx.arc(0, 0, 4, 0, Z4Math.TWO_PI, true);
            offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("#0d6efd");
            offscreenCtx.fill();
            this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          }
          offscreenCtx.restore();
        });
      });
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.fillStyle = this.chessboard;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
/**
 * The common parent of all painters
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4Painter {

  /**
   * Performs a drawing
   *
   * @param context The context to perform the drawing
   * @param point The point where to perform the drawing
   * @param gradientColor The color to use to perform the drawing
   * @return This Z4Painter
   */
   draw(context, point, gradientColor) {
  }

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
   getColor(color) {
    return color;
  }
}
/**
 * The painter of arrows, used only for testing purpose
 *
 * @author gianpiero.di.blasi
 */
class Z4ArrowPainter extends Z4Painter {

   bool = false;

   draw(context, point, gradientColor) {
    this.bool = !this.bool;
    let x = point.getIntensity() * point.getZ4Vector().getModule();
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = this.getColor("black");
    context.beginPath();
    context.arc(0, 0, 2, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = this.getColor(this.bool ? "blue" : "red");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -2.5);
    context.lineTo(x - 5, +2.5);
    context.lineTo(x, 0);
    context.stroke();
    context.restore();
    return this;
  }
}
/**
 * The classic painter
 *
 * @author gianpiero.di.blasi
 */
class Z4ClassicPainter extends Z4Painter {

   draw(context, point, gradientColor) {
    return this;
  }
}
/**
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2DPainter extends Z4Painter {

   shape = Z4Shape2D.SQUARE;

   size = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE));

   shadowShiftX = new Z4FancifulValue();

   shadowShiftY = new Z4FancifulValue();

   shadowColor = new Z4Color(255, 0, 0, 0);

   borderSize = new Z4FancifulValue();

   borderColor = new Z4Color(255, 0, 0, 0);

  /**
   * Sets the shape
   *
   * @param shape The shape
   * @return This Z4Shape2DPainter
   */
   setShape2D(shape) {
    this.shape = shape;
    return this;
  }

  /**
   * Sets the size
   *
   * @param {number} fixedComponent The fixed component of the size
   * @param {number} randomComponent The random component of the size
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @return {} This Z4Shape2DPainter
   */
  // setSize(fixedComponent, randomComponent, z4RandomComponentSign) {
  // this.size = new Z4FancifulValue(fixedComponent, randomComponent, z4RandomComponentSign, Z4Sign.POSITIVE);
  // return this;
  // }
  /**
   * Sets the random component of the size
   *
   * @param {number} randomComponent The random component of the value
   * @param {Z4RandomBehaviour} randomComponentBehaviour The behaviour of the
   * random component
   * @param {number} randomComponentStep The step of the random component
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @return {} This Z4Shape2DPainter
   */
  // setRandomComponentSize(randomComponent, randomComponentBehaviour, randomComponentStep, z4RandomComponentSign) {
  // this.size.setRandom(randomComponent, randomComponentBehaviour, randomComponentStep, z4RandomComponentSign);
  // return this;
  // }
  /**
   * Sets the shadow
   *
   * @param {number} fixedComponentX The fixed component of the X shadow shift
   * @param {number} randomComponentX The random component of the X shadow shift
   * @param {number} fixedComponentY The fixed component of the Y shadow shift
   * @param {number} randomComponentY The random component of the Y shadow shift
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @param {Z4Color} shadowColor The shadow color
   * @return {} This Z4Shape2DPainter
   */
  // setShadow(fixedComponentX, randomComponentX, fixedComponentY, randomComponentY, z4RandomComponentSign, shadowColor) {
  // this.shadowShiftX = new Z4FancifulValue(fixedComponentX, randomComponentX, z4RandomComponentSign, Z4Sign.POSITIVE);
  // this.shadowShiftY = new Z4FancifulValue(fixedComponentY, randomComponentY, z4RandomComponentSign, Z4Sign.POSITIVE);
  // this.shadowColor = shadowColor;
  // return this;
  // }
  /**
   * Sets the border
   *
   * @param {number} fixedComponent The fixed component of the border size
   * @param {number} randomComponent The random component of the border size
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @param {Z4Color} borderColor The border color
   * @return {} This Z4Shape2DPainter
   */
  // setBorder(fixedComponent, randomComponent, z4RandomComponentSign, borderColor) {
  // this.borderSize = new Z4FancifulValue(fixedComponent, randomComponent, z4RandomComponentSign, Z4Sign.POSITIVE);
  // this.borderColor = borderColor;
  // return this;
  // }
   draw(context, point, gradientColor) {
    if (point.isDrawBounds()) {
      this.drawBounds(context, point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstant().getValue()));
    } else {
      let currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.next(0));
      if (currentSize <= 0) {
        return this;
      }
      let currentShadowShiftX = point.getIntensity() * this.shadowShiftX.next(0);
      let currentShadowShiftY = point.getIntensity() * this.shadowShiftY.next(0);
      let currentBorderSize = point.getIntensity() * this.borderSize.next(0);
      if (currentShadowShiftX || currentShadowShiftY) {
        context.save();
        context.translate(currentShadowShiftX, currentShadowShiftY);
        this.drawPath(context, currentSize + (currentBorderSize > 0 ? currentBorderSize : 0), this.shadowColor);
        context.restore();
      }
      if (currentBorderSize) {
        context.save();
        this.drawPath(context, currentSize + currentBorderSize, this.borderColor);
        context.restore();
      }
      let position = point.getColorPosition();
      let lighting = point.getLighting();
      if (position === -1) {
        for (let scale = currentSize; scale > 0; scale--) {
          this.drawPath(context, scale, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
        }
      } else if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentSize, gradientColor.getZ4ColorAt(position, true, true));
      } else {
        let newColor = gradientColor.getZ4ColorAt(position, true, true);
        for (let scale = currentSize; scale > 0; scale--) {
          if (lighting === Z4Lighting.LIGTHED) {
            this.drawPath(context, scale, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
          } else if (lighting === Z4Lighting.DARKENED) {
            this.drawPath(context, scale, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
          }
        }
      }
    }
    return this;
  }

   drawPath(context, scale, color) {
    context.save();
    context.scale(scale, scale);
    context.fillStyle = color.getHEX();
    context.fill(this.shape.getPath());
    context.restore();
  }

   drawBounds(context, scale) {
    context.save();
    context.scale(scale, scale);
    context.lineWidth = 1 / scale;
    context.strokeStyle = this.getColor("gray");
    context.stroke(this.shape.getPath());
    context.strokeStyle = this.getColor("black");
    context.translate(1 / scale, 1 / scale);
    context.stroke(this.shape.getPath());
    context.restore();
  }
}
/**
 * The painter of natural figures
 *
 * @author gianpiero.di.blasi
 */
class Z4NaturalFigurePainter extends Z4Painter {

   draw(context, point, gradientColor) {
    return this;
  }
}
/**
 * The painter of centered figures
 *
 * @author gianpiero.di.blasi
 */
class Z4CenteredFigurePainter extends Z4Painter {

   draw(context, point, gradientColor) {
    return this;
  }
}
/**
 * The drawing action of a Z4PointIterator
 *
 * @author gianpiero.di.blasi
 */
class Z4Action {

  /**
   * The start
   */
  static  START = new Z4Action();

  /**
   * The continue
   */
  static  CONTINUE = new Z4Action();

  /**
   * The spirograph
   */
  static  STOP = new Z4Action();

  constructor() {
  }
}
/**
 * The common parent of all point iterators
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4PointIterator {

  /**
   * The color progression
   */
   progression = Z4Progression.SPATIAL;

  /**
   * The step for temporal progression (in the range [0,1])
   */
   temporalStepProgression = 0.1;

  /**
   * The color lighting
   */
   lighting = Z4Lighting.NONE;

  /**
   * The rotation
   */
   rotation = Z4Rotation.fixed();

  /**
   * The current Z4Point
   */
   z4Point = new Z4Point();

  /**
   * The current "utility" point
   */
   P = new Object();

  /**
   * true if this Z4PointIterator has another point, false otherwise
   */
   hasNext = false;

  /**
   * Creates a Z4PointIterator
   */
  constructor() {
    this.P["x"] = 0;
    this.P["y"] = 0;
  }

  /**
   * Sets the color progression
   *
   * @param progression The color progression
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   * @return This Z4PointIterator
   */
   seProgression(progression, temporalStepProgression, lighting) {
    this.progression = progression;
    this.temporalStepProgression = temporalStepProgression;
    this.lighting = lighting;
    return this;
  }

  /**
   * Sets the rotation
   *
   * @param rotation The rotation
   * @return This Z4PointIterator
   */
   setRotation(rotation) {
    this.rotation = rotation;
    return this;
  }

  /**
   * Returns the rotation
   *
   * @return The rotation
   */
   getRotation() {
    return this.rotation;
  }

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   draw(action, x, y) {
  }

  /**
   * Returns the next point of the iterator
   *
   * @return The next point of the iterator, null if the iterator has no more
   * points
   */
   next() {
  }

  /**
   * Draws a demo of this Z4PointIterator
   *
   * @param context The context where to draw the demo
   * @param width The width
   * @param height The height
   */
   drawDemo(context, width, height) {
  }
}
/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
class Z4Stamper extends Z4PointIterator {

   intensity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(15).setSign(Z4Sign.POSITIVE));

   multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE));

   push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE));

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

   currentPush = 0.0;

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next(0));
      this.currentPush = this.push.next(0);
      this.P["x"] = x;
      this.P["y"] = y;
      this.hasNext = true;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
   getIntensity() {
    return this.intensity;
  }

  /**
   * Sets the intensity
   *
   * @param intensity The intensity
   * @return This Z4Stamper
   */
   setIntensity(intensity) {
    this.intensity = intensity;
    return this;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Sets the multiplicity
   *
   * @param multiplicity The multiplicity
   * @return This Z4Stamper
   */
   setMultiplicity(multiplicity) {
    this.multiplicity = multiplicity;
    return this;
  }

  /**
   * Returns the push
   *
   * @return The push
   */
   getPush() {
    return this.push;
  }

  /**
   * Sets the push
   *
   * @param push The push
   * @return This Z4Stamper
   */
   setPush(push) {
    this.push = push;
    return this;
  }

   next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let angle = this.rotation.next(0);
      if (this.currentPush) {
        let pushed = Z4Vector.fromVector(this.P["x"], this.P["y"], this.currentPush, angle);
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), 1, angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"], this.P["y"], 1, angle));
      }
      this.rotation.nextSide(this.z4Point, null);
      if (this.progression === Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);
        let colorPosition = this.z4Point.getColorPosition();
        colorPosition = colorPosition === -1 ? 0 : colorPosition + this.temporalStepProgression;
        if (colorPosition > 1) {
          colorPosition -= 1;
        }
        this.z4Point.setColorPosition(colorPosition);
      } else if (this.progression === Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression === Z4Progression.RELATIVE_TO_PATH || this.progression === Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setColorPosition(Math.random());
      }
      return this.z4Point.setIntensity(this.intensity.next(0));
    }
  }

   drawDemo(context, width, height) {
    let arrowPainter = new Z4ArrowPainter();
    let gradientColor = new Z4GradientColor();
    this.initDraw(width, height).forEach(point => {
      this.draw(Z4Action.START, point["x"], point["y"]);
      if (this.currentPush && !this.currentMultiplicityCounter) {
        context.save();
        context.lineWidth = 1;
        context.fillStyle = Z4AbstractColor.getFillStyle("black");
        context.beginPath();
        context.arc(this.P["x"], this.P["y"], 2, 0, Z4Math.TWO_PI);
        context.fill();
        context.restore();
      }
      let next = null;
      while ((next = this.next()) !== null) {
        let vector = next.getZ4Vector();
        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        arrowPainter.draw(context, next, gradientColor);
        context.restore();
      }
    });
  }

   initDraw(w, h) {
    let array = new Array();
    for (let x = 50; x <= w - 50; x += 100) {
      for (let y = 50; y <= h - 50; y += 100) {
        let point = new Object();
        point["x"] = x;
        point["y"] = y;
        array.push(point);
      }
    }
    return array;
  }
}
/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 300;

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4StamperUI.WIDTH + "px";
    this.canvas.style.height = Z4StamperUI.HEIGHT + "px";
    this.intensity.oninput = (v) => this.set(v, null, null, null, false);
    this.intensity.onchange = (v) => this.set(v, null, null, null, true);
    this.rotation.oninput = (v) => this.set(null, v, null, null, false);
    this.rotation.onchange = (v) => this.set(null, v, null, null, true);
    this.multiplicity.oninput = (v) => this.set(null, null, v, null, false);
    this.multiplicity.onchange = (v) => this.set(null, null, v, null, true);
    this.push.oninput = (v) => this.set(null, null, null, v, false);
    this.push.onchange = (v) => this.set(null, null, null, v, true);
    this.setValue(new Z4Stamper());
  }

   set(intensity, rotation, multiplicity, push, onchange) {
    if (intensity) {
      this.value.setIntensity(intensity);
    }
    if (rotation) {
      this.value.setRotation(rotation);
    }
    if (multiplicity) {
      this.value.setMultiplicity(multiplicity);
    }
    if (push) {
      this.value.setMultiplicity(push);
    }
    this.drawCanvas();
    if (onchange) {
      this.onchange(this.value);
    } else {
      this.oninput(this.value);
    }
  }

   setValue(value) {
    this.value = value;
    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    this.canvas.width = Math.floor(Z4StamperUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4StamperUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4StamperUI.WIDTH, Z4StamperUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    this.value.drawDemo(offscreenCtx, Z4StamperUI.WIDTH, Z4StamperUI.HEIGHT);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }

   dispose() {
    this.disposeDevicePixelRatio();
  }
}
