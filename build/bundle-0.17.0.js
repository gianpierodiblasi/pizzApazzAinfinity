/**
 * The environment settings
 *
 * @author gianpiero.di.blasi
 */
class Z4Setting {

  static  language = Z4Setting.initLanguage();

  static  theme = Z4Setting.initTheme();

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
    this.root.id = this.getUniqueID();
    this.root.innerHTML = ui;
    let list = this.root.querySelectorAll("#" + this.root.id + " [data-token-lang-inner_text]");
    for (let index = 0; index < list.length; index++) {
      let element = list.item(index);
      element.innerHTML = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text"));
    }
  }

  /**
   * Returns an unique ID
   *
   * @return The unique ID
   */
   getUniqueID() {
    return "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
  }

  /**
   * Returns an unique name
   *
   * @return The unique name
   */
   getUniqueName() {
    return "name" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
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
   * Inserts this Z4AbstractComponentUI before another element
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
   insertBeforeElement(element) {
    element.parentElement.insertBefore(this.root, element);
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
    parent.id = new Date().getTime() + "-" + parseInt(1000 * Math.random());
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
    Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-primary", onOK, footer);
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
    let options = new Array();
    let onOptions = new Array();
    let isPrimary = new Array();
    Z4ModalMessageUI.push("YES", onYES, true, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("NO", onNO, false, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("OK", onOK, true, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("CANCEL", onCANCEL, false, options, onOptions, isPrimary);
    Z4ModalMessageUI.showOpenQuestion(title, message, options, onOptions, isPrimary);
  }

  static  push(token, onButton, primary, options, onOptions, isPrimary) {
    if (onButton) {
      options.push(Z4MessageFactory.get(token));
      onOptions.push(onButton);
      isPrimary.push(primary);
    }
  }

  /**
   * Shows a question message with open answers
   *
   * @param title The title
   * @param message The message
   * @param options The array of option messages
   * @param onOptions The array of callbacks to call
   * @param isPrimary The array of primary buttons
   */
  static  showOpenQuestion(title, message, options, onOptions, isPrimary) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    options.forEach((option, index, array) => {
      Z4ModalMessageUI.appendButton(option, "btn " + (isPrimary[index] ? "btn-primary" : "btn-secondary"), onOptions[index], footer);
    });
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
   * Creates a Z4Sign providing the following sequence +1, -1, +1, -1, ...
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
    this.step = 1;
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
   * Sets the value
   *
   * @param value The (positive) value
   * @return This Z4SignedRandomValue
   */
   setValue(value) {
    this.value = value;
    return this;
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
   * Sets the length
   *
   * @param length The length
   * @return This Z4SignedRandomValue
   */
   setLength(length) {
    this.length = length;
    return this;
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
        if (this.step >= this.length) {
          this.step = 1;
          this.prevRandom = this.nextRandom;
          this.controlRandom = this.controlRandom === 1 ? 0 : 1;
          this.nextRandom = Math.random();
          this.createBezierCurve();
        } else {
          this.step++;
        }
        return this.value * this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step >= this.length) {
          this.step = 1;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }
        return this.value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
      case 3:
        if (this.step >= this.length) {
          this.step = 1;
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
   * Sets if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise
   * @return This Z4FancifulValue
   */
   setUniformSign(uniformSign) {
    this.uniformSign = uniformSign;
    return this;
  }

  /**
   * Checks if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for both components,
   * false otherwise
   */
   isUniformSign() {
    return this.uniformSign;
  }

  /**
   * Returns the next "fanciful" value
   *
   * @return The next "fanciful" value
   */
   next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
    } else {
      return this.constant.next() + this.random.nextSigned();
    }
  }
}
/**
 * The rotation (angles parameters have to be provided in degrees, rotations are
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
    let nextAngle = Z4Math.deg2rad(this.startAngle + this.angle.next());
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

   valueLabel = this.querySelector(".signed-value-value-label");

   radioSpinner = this.querySelector(".signed-value-radio-spinner");

   radioRange = this.querySelector(".signed-value-radio-range");

   spinner = this.querySelector(".signed-value-range-input");

   applySpin = () => this.spin();

   applyMinusPlus = (sign, speed) => this.doMinusPlus(sign, speed, this.isApplyMinusPlus, () => this.applyMinusPlus(sign, Math.min(50, speed + 1)));

   isApplySpin = false;

   isApplyMinusPlus = false;

   timeoutID = 0;

   signVisible = true;

   min = 0;

   max = 1000000000;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  constructor() {
    super(Z4SignedValueUI.UI);
    let imgs = this.querySelectorAll(".signed-value-sign-dropdown-menu img[data-type='signed-value']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".signed-value-sign-dropdown-menu button[data-type='signed-value']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".signed-value-sign-button img[data-type='signed-value']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
          case "positive":
            this.onchange(this.value.setSign(Z4Sign.POSITIVE));
            break;
          case "negative":
            this.onchange(this.value.setSign(Z4Sign.NEGATIVE));
            break;
          case "random":
            this.onchange(this.value.setSign(Z4Sign.RANDOM));
            break;
          case "alternate":
            this.onchange(this.value.setSign(Z4Sign.alternate()));
            break;
        }
        return null;
      };
    }
    let name = this.getUniqueName();
    this.radioSpinner.id = this.getUniqueID();
    this.radioSpinner.setAttribute("name", name);
    this.radioSpinner.onchange = (event) => {
      this.spinner.setAttribute("min", "-50");
      this.spinner.setAttribute("max", "50");
      this.spinner.value = "0";
      return null;
    };
    this.querySelector(".signed-value-radio-spinner-label").setAttribute("for", this.radioSpinner.id);
    this.radioRange.id = this.getUniqueID();
    this.radioRange.setAttribute("name", name);
    this.radioRange.onchange = (event) => {
      this.configureRange();
      return null;
    };
    this.querySelector(".signed-value-radio-range-label").setAttribute("for", this.radioRange.id);
    let minus = this.querySelector(".signed-value-range-minus");
    let plus = this.querySelector(".signed-value-range-plus");
    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) => this.startSpin();
      this.spinner.ontouchend = (event) => this.stopSpin();
      minus.ontouchstart = (event) => this.minusPlus(-1);
      minus.ontouchend = (event) => this.minusPlus(0);
      plus.ontouchstart = (event) => this.minusPlus(1);
      plus.ontouchend = (event) => this.minusPlus(0);
    } else {
      this.spinner.onmousedown = (event) => this.startSpin();
      this.spinner.onmouseup = (event) => this.stopSpin();
      minus.onmousedown = (event) => this.minusPlus(-1);
      minus.onmouseup = (event) => this.minusPlus(0);
      minus.onmouseleave = (event) => this.minusPlus(0);
      plus.onmousedown = (event) => this.minusPlus(1);
      plus.onmouseup = (event) => this.minusPlus(0);
      plus.onmouseleave = (event) => this.minusPlus(0);
    }
    this.spinner.oninput = (event) => {
      if (this.radioRange.checked) {
        let v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.oninput(this.value.setValue(v));
      }
      return null;
    };
    this.spinner.onchange = (event) => {
      if (this.radioRange.checked) {
        let v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.onchange(this.value.setValue(v));
      }
      return null;
    };
    this.setValue(new Z4SignedValue());
  }

   startSpin() {
    if (this.radioSpinner.checked) {
      this.isApplySpin = true;
      this.applySpin();
    }
    return null;
  }

   stopSpin() {
    if (this.radioSpinner.checked) {
      this.isApplySpin = false;
      this.spinner.value = "0";
      this.onchange(this.value);
    }
    return null;
  }

   spin() {
    let abs = Math.max(1, Math.abs(this.spinner.valueAsNumber));
    if (this.spinner.valueAsNumber) {
      this.doMinusPlus(this.spinner.valueAsNumber > 0 ? 1 : -1, abs, this.isApplySpin, this.applySpin);
    } else {
      clearTimeout(this.timeoutID);
      if (this.isApplySpin) {
        this.timeoutID = setTimeout(this.applySpin, 500 / abs);
      }
    }
  }

   minusPlus(sign) {
    if (sign) {
      this.isApplyMinusPlus = true;
      this.applyMinusPlus(sign, 1.0);
    } else if (this.isApplyMinusPlus) {
      this.isApplyMinusPlus = false;
      clearTimeout(this.timeoutID);
      this.onchange(this.value);
    }
    return null;
  }

   doMinusPlus(sign, speed, isApply, apply) {
    let rangedMax = this.getRangedValue(this.max);
    let rangedValue = Math.max(0, this.getRangedValue(this.value.getValue()) + sign);
    rangedValue = Math.min(rangedValue, rangedMax);
    let reversedValue = this.getReversedValue(rangedValue);
    this.valueLabel.innerText = "" + reversedValue;
    if (this.radioRange.checked) {
      this.spinner.value = "" + rangedValue;
    }
    this.oninput(this.value.setValue(reversedValue));
    clearTimeout(this.timeoutID);
    if (isApply) {
      this.timeoutID = setTimeout(apply, 500 / speed);
    }
  }

  /**
   * Sets the range of this Z4SignedValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (1000000000 to show infinite)
   * @return This Z4SignedValueUI
   */
   setRange(min, max) {
    this.min = min;
    this.max = max;
    this.querySelector(".signed-value-range-span").innerHTML = "[" + min + "," + (max === 1000000000 ? "&infin;" : max) + "]";
    if (this.radioRange.checked) {
      this.configureRange();
    }
    return this;
  }

   configureRange() {
    this.spinner.setAttribute("min", "0");
    this.spinner.setAttribute("max", "" + this.getRangedValue(this.max));
    this.spinner.value = "" + this.getRangedValue(this.value.getValue());
  }

   getRangedValue(limit) {
    let count = 0;
    let counter = this.min;
    while (counter < limit) {
      count++;
      if (counter < 100) {
        counter++;
      } else if (counter < 1000) {
        counter += 10;
      } else if (counter < 10000) {
        counter += 100;
      } else if (counter < 100000) {
        counter += 1000;
      } else if (counter < 1000000) {
        counter += 10000;
      } else if (counter < 10000000) {
        counter += 100000;
      } else if (counter < 100000000) {
        counter += 1000000;
      } else if (counter < 1000000000) {
        counter += 10000000;
      }
    }
    return count;
  }

   getReversedValue(limit) {
    let count = 0;
    let counter = this.min;
    while (count < limit) {
      count++;
      if (counter < 100) {
        counter++;
      } else if (counter < 1000) {
        counter += 10;
      } else if (counter < 10000) {
        counter += 100;
      } else if (counter < 100000) {
        counter += 1000;
      } else if (counter < 1000000) {
        counter += 10000;
      } else if (counter < 10000000) {
        counter += 100000;
      } else if (counter < 100000000) {
        counter += 1000000;
      } else if (counter < 1000000000) {
        counter += 10000000;
      }
    }
    return counter;
  }

  /**
   * Sets the compact mode
   *
   * @return This Z4SignedValueUI
   */
   setCompact() {
    this.querySelector(".signed-value-compact-button").style.display = "inline-block";
    this.querySelector(".signed-value-compact-dropdown-menu li").appendChild(this.querySelector(".signed-value-range-minus"));
    this.querySelector(".signed-value-compact-dropdown-menu li").appendChild(this.querySelector(".signed-value-form-control"));
    this.querySelector(".signed-value-compact-dropdown-menu li").appendChild(this.querySelector(".signed-value-range-plus"));
    this.querySelector(".signed-value-sign-button img").setAttribute("width", "20");
    return this;
  }

  /**
   * Enables this Z4SignedValueUI
   *
   * @param b true to enable this Z4SignedValueUI, false otherwise
   * @return This Z4SignedValueUI
   */
   setEnabled(b) {
    if (b) {
      this.querySelector(".signed-value-radio-spinner").removeAttribute("disabled");
      this.querySelector(".signed-value-radio-range").removeAttribute("disabled");
      this.querySelector(".signed-value-sign-button").removeAttribute("disabled");
      this.querySelector(".signed-value-compact-button").removeAttribute("disabled");
      this.querySelector(".signed-value-range-minus").removeAttribute("disabled");
      this.querySelector(".signed-value-range-input").removeAttribute("disabled");
      this.querySelector(".signed-value-range-plus").removeAttribute("disabled");
    } else {
      this.querySelector(".signed-value-radio-spinner").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-radio-range").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-sign-button").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-compact-button").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-range-minus").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-range-input").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-range-plus").setAttribute("disabled", "disabled");
    }
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
      this.querySelector(".signed-value-input-group").classList.remove("sign-not-visible");
    } else {
      this.querySelector(".signed-value-input-group").classList.add("sign-not-visible");
    }
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
    let label = this.querySelector(".signed-value-label");
    label.setAttribute("data-token-lang-inner_text", token);
    label.innerHTML = Z4MessageFactory.get(token);
    label.style.fontWeight = bold ? "700" : "400";
    label.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.valueLabel.innerText = "" + this.value.getValue();
    if (this.value.getSign() === Z4Sign.POSITIVE) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='positive']").getAttribute("src"));
    } else if (this.value.getSign() === Z4Sign.NEGATIVE) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='negative']").getAttribute("src"));
    } else if (this.value.getSign() === Z4Sign.RANDOM) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='random']").getAttribute("src"));
    } else {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='alternate']").getAttribute("src"));
    }
    if (this.radioRange.checked) {
      this.configureRange();
    }
    return this;
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

   signedValueUI = new Z4SignedValueUI().appendToComponent(this);

   lengthUI = new Z4SignedValueUI().setSignVisible(false).setValueLabel("LENGTH", false, false).setRange(1, 1000000000).appendToElement(this.querySelector(".signed-random-value-length-ui"));

   lengthBadge = this.querySelector(".signed-random-value-length-badge");

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedRandomValueUI.html");

  /**
   * Creates a Z4SignedRandomValueUI
   */
  constructor() {
    super(Z4SignedRandomValueUI.UI);
    this.signedValueUI.oninput = (signedValue) => this.oninput(this.value.setValue(signedValue.getValue()).setSign(signedValue.getSign()));
    this.signedValueUI.onchange = (signedValue) => this.onchange(this.value.setValue(signedValue.getValue()).setSign(signedValue.getSign()));
    this.signedValueUI.querySelector(".signed-value-input-group").appendChild(this.querySelector(".signed-random-value-type-button"));
    this.signedValueUI.querySelector(".signed-value-input-group").appendChild(this.querySelector(".signed-random-value-type-dropdown-menu"));
    let imgs = this.querySelectorAll(".signed-random-value-type-dropdown-menu img[data-type='signed-random-value']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".signed-random-value-type-dropdown-menu button[data-type='signed-random-value']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".signed-random-value-type-button img[data-type='signed-random-value']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        let signedValue = this.signedValueUI.getValue();
        switch(button.getAttribute("data-value")) {
          case "classic":
            this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
            break;
          case "bezier":
            this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.lengthUI.getValue().getValue());
            break;
          case "polyline":
            this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.lengthUI.getValue().getValue());
            break;
          case "stepped":
            this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.lengthUI.getValue().getValue());
            break;
        }
        this.lengthUI.setEnabled(!this.value.isClassic());
        this.lengthBadge.style.display = this.value.isClassic() ? "none" : "inline-block";
        this.onchange(this.value.setSign(signedValue.getSign()));
        return null;
      };
    }
    this.lengthUI.oninput = (signedValue) => {
      this.lengthBadge.innerText = "" + signedValue.getValue();
      this.oninput(this.value.setLength(signedValue.getValue()));
    };
    this.lengthUI.onchange = (signedValue) => {
      this.lengthBadge.innerText = "" + signedValue.getValue();
      this.onchange(this.value.setLength(signedValue.getValue()));
    };
    this.setValue(Z4SignedRandomValue.classic(0));
  }

  /**
   * Sets the compact mode
   *
   * @return This Z4SignedRandomValueUI
   */
   setCompact() {
    this.signedValueUI.setCompact();
    this.querySelector(".signed-random-value-type-button img").setAttribute("width", "20");
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
    this.lengthUI.setRange(min, max);
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
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='classic']").getAttribute("src"));
    } else if (this.value.isBezier()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='bezier']").getAttribute("src"));
    } else if (this.value.isPolyline()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='polyline']").getAttribute("src"));
    } else if (this.value.isStepped()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='stepped']").getAttribute("src"));
    }
    this.lengthUI.setEnabled(!this.value.isClassic());
    this.lengthUI.setValue(new Z4SignedValue().setValue(this.value.getLength()));
    this.lengthBadge.style.display = this.value.isClassic() ? "none" : "inline-block";
    this.lengthBadge.innerText = "" + this.value.getLength();
    return this;
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

   uniformCheck = this.querySelector(".fanciful-value-uniform-check");

   constantUI = new Z4SignedValueUI().setCompact().setValueLabel("CONSTANT", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

   randomUI = new Z4SignedRandomValueUI().setCompact().setValueLabel("RANDOM", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    this.uniformCheck.id = this.getUniqueID();
    this.querySelector(".fanciful-value-uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) => {
      this.setSignsVisible(this.constantUI.isSignVisible());
      this.onchange(this.value.setUniformSign(this.uniformCheck.checked));
      return null;
    };
    let hr = document.createElement("li");
    hr.className = "dropdown-divider";
    let li = document.createElement("li");
    li.appendChild(hr);
    this.querySelector(".signed-value-sign-dropdown-menu").appendChild(li);
    li = document.createElement("li");
    li.className = "mx-1";
    li.appendChild(this.querySelector(".fanciful-value-uniform-form-switch"));
    this.querySelector(".signed-value-sign-dropdown-menu").appendChild(li);
    this.constantUI.oninput = (event) => this.onInput();
    this.randomUI.oninput = (event) => this.onInput();
    this.constantUI.onchange = (event) => this.onChange();
    this.randomUI.onchange = (event) => this.onChange();
    this.setValue(new Z4FancifulValue());
  }

   onInput() {
    this.oninput(this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()));
    return null;
  }

   onChange() {
    this.onchange(this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()));
    return null;
  }

  /**
   * Sets the visibility of the signs
   *
   * @param visible true to make the signs visible, false otherwise
   * @return This Z4FancifulValueUI
   */
   setSignsVisible(visible) {
    this.constantUI.setSignVisible(visible);
    this.constantUI.setValueLabel(visible ? "CONSTANT" : "CONSTANT_SHORT", false, true);
    this.randomUI.setSignVisible(!this.uniformCheck.checked && visible);
    this.randomUI.setValueLabel(!this.uniformCheck.checked && visible ? "RANDOM" : "RANDOM_SHORT", false, true);
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
    this.constantUI.setRange(min, max);
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
    this.randomUI.setRange(min, max);
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
    this.randomUI.setLengthRange(min, max);
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
    let valueLabel = this.querySelector(".fanciful-value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.uniformCheck.checked = this.value.isUniformSign();
    this.setSignsVisible(this.constantUI.isSignVisible());
    this.constantUI.setValue(this.value.getConstant());
    this.randomUI.setValue(this.value.getRandom());
    return this;
  }

   dispose() {
  }
}
/**
 * The component to edit a rotation
 *
 * @author gianpiero.di.blasi
 */
class Z4RotationUI extends Z4AbstractComponentWithValueUI {

   startAngle = new Z4SignedValueUI().setCompact().setRange(0, 360).setValueLabel("START_ANGLE", true, false).setSignVisible(false).insertBeforeElement(this.querySelector(".rotation-type-button"));

   delayedCheck = this.querySelector(".rotation-delayed-check");

   angle = new Z4FancifulValueUI().setValueLabel("ANGLE", true, false).setConstantRange(0, 180).setRandomRange(0, 180).insertBeforeElement(this.querySelector(".rotation-type-button"));

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  constructor() {
    super(Z4RotationUI.UI);
    let imgs = this.querySelectorAll(".rotation-type-dropdown-menu img[data-type='rotation']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".rotation-type-dropdown-menu button[data-type='rotation']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".rotation-type-button img[data-type='rotation']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
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
    this.delayedCheck.id = this.getUniqueID();
    this.querySelector(".rotation-delayed-label").setAttribute("for", this.delayedCheck.id);
    this.delayedCheck.onchange = (event) => {
      this.querySelector(".rotation-delayed-badge").style.display = this.delayedCheck.checked ? "inline-block" : "none";
      this.onchange(this.value.setDelayed(this.delayedCheck.checked));
      return null;
    };
    this.startAngle.querySelector(".signed-value-value-label").style.display = "block";
    let button = this.startAngle.querySelector(".signed-value-compact-button");
    let span = document.createElement("span");
    for (let i = 0; i < 10; i++) {
      span.innerHTML += "&nbsp";
    }
    button.appendChild(span);
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
    if (this.value.isFixed()) {
      this.querySelector(".rotation-type-button img").setAttribute("src", this.querySelector(".rotation-type-dropdown-menu img[data-icon='fixed']").getAttribute("src"));
    } else if (this.value.isCumulative()) {
      this.querySelector(".rotation-type-button img").setAttribute("src", this.querySelector(".rotation-type-dropdown-menu img[data-icon='cumulative']").getAttribute("src"));
    } else if (this.value.isRelativeToPath()) {
      this.querySelector(".rotation-type-button img").setAttribute("src", this.querySelector(".rotation-type-dropdown-menu img[data-icon='relativetopath']").getAttribute("src"));
    }
    this.delayedCheck.checked = this.value.isDelayed();
    this.querySelector(".rotation-delayed-badge").style.display = this.value.isDelayed() ? "inline-block" : "none";
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
 * The color
 *
 * @author gianpiero.di.blasi
 */
class Z4Color {

   a = 0;

   r = 0;

   g = 0;

   b = 0;

   argb = 0;

   hex = null;

  /**
   * Creates a Z4Color
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
   * Sets this Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4Color
   */
   set(color) {
    this.a = color >>> 24 & 0xff;
    this.r = color >>> 16 & 0xff;
    this.g = color >>> 8 & 0xff;
    this.b = color & 0xff;
    return this.init();
  }

  /**
   * In place converts this Z4Color to gray scaled, the transparency is not
   * changed
   *
   * @return This gray scaled Z4Color
   */
   gray() {
    let gray = parseInt(0.21 * this.r + 0.71 * this.g + 0.08 * this.b);
    this.r = gray;
    this.g = gray;
    this.b = gray;
    return this.init();
  }

  /**
   * In place converts this Z4Color to negative, the transparency is not changed
   *
   * @return This negativized Z4Color
   */
   negative() {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
    return this.init();
  }

  /**
   * In place lights up this Z4Color, the transparency is not changed
   *
   * @param lightingFactor The lighting factor (in the range [0,1])
   * @return This lighted Z4Color
   */
   lighted(lightingFactor) {
    this.r = parseInt((255 - this.r) * lightingFactor + this.r);
    this.g = parseInt((255 - this.g) * lightingFactor + this.g);
    this.b = parseInt((255 - this.b) * lightingFactor + this.b);
    return this.init();
  }

  /**
   * In place darkens this Z4Color, the transparency is not changed
   *
   * @param darkeningFactor The darkening factor (in the range [0,1])
   * @return This darkened Z4Color
   */
   darkened(darkeningFactor) {
    darkeningFactor = 1 - darkeningFactor;
    this.r = parseInt(darkeningFactor * this.r);
    this.g = parseInt(darkeningFactor * this.g);
    this.b = parseInt(darkeningFactor * this.b);
    return this.init();
  }

  /**
   * Returns the components of this Z4Color (a, r, g, b)
   *
   * @return The six components of this Z4Color
   */
   getComponents() {
    return new Array(this.a, this.r, this.g, this.b);
  }

  /**
   * Returns the ARGB integer representing this Z4Color
   *
   * @return The ARGB integer representing this Z4Color
   */
   getARGB() {
    return this.argb;
  }

  /**
   * Returns the RGB hex string representing this Z4Color
   *
   * @return The RGB hex string representing this Z4Color
   */
   getHEX() {
    return this.hex;
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
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
  static  getFillStyle(color) {
    return color;
  }
  /**
   * Creates a Z4Color from two Z4Color
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4Color
   */
  static  fromZ4Colors(before, after, div) {
    let cBefore = before.getComponents();
    let cAfter = after.getComponents();
    return new Z4Color(parseInt((cAfter[0] - cBefore[0]) * div + cBefore[0]), parseInt((cAfter[1] - cBefore[1]) * div + cBefore[1]), parseInt((cAfter[2] - cBefore[2]) * div + cBefore[2]), parseInt((cAfter[3] - cBefore[3]) * div + cBefore[3]));
  }
}
/**
 * The gradient color (a gradient between two colors)
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColor {

   start = new Z4Color(255, 255, 255, 255);

   stop = new Z4Color(255, 0, 0, 0);

   ripple = 0.0;

   mirrored = false;

  /**
   * Sets the start color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4GradientColor
   */
   setStartColor(color) {
    this.start.set(color);
    return this;
  }

  /**
   * Returns the start color
   *
   * @return The start color
   */
   getStartColor() {
    return this.start;
  }

  /**
   * Sets the stop color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4GradientColor
   */
   setStopColor(color) {
    this.stop.set(color);
    return this;
  }

  /**
   * Returns the stop color
   *
   * @return The stop color
   */
   getStopColor() {
    return this.stop;
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   * @return This Z4GradientColor
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
   * @return This Z4GradientColor
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
   * In place converts this Z4GradientColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4GradientColor
   */
   negative() {
    this.start.negative();
    this.stop.negative();
    return this;
  }

  /**
   * In place inverts this Z4GradientColor
   *
   * @return This inverted Z4GradientColor
   */
   inverted() {
    let argbStart = this.start.getARGB();
    this.start.set(this.stop.getARGB());
    this.stop.set(argbStart);
    return this;
  }

  /**
   * Returns a Z4Color in a position
   *
   * @param position The color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4Color
   */
   getZ4ColorAt(position, useRipple, useMirrored) {
    if (useMirrored && this.mirrored) {
      position = 2 * (position < 0.5 ? position : 1 - position);
    }
    if (useRipple && this.ripple !== 0) {
      position = Z4Math.ripple(position, 0, 1, this.ripple);
    }
    return Z4Color.fromZ4Colors(this.start, this.stop, position);
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
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
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
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
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
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
  }
  /**
   * Creates a Z4GradientColor from two Z4GradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4GradientColor
   */
  static  fromZ4GradientColors(before, after, div) {
    return new Z4GradientColor().setStartColor(Z4Color.fromZ4Colors(before.getStartColor(), after.getStartColor(), div).getARGB()).setStopColor(Z4Color.fromZ4Colors(before.getStopColor(), after.getStopColor(), div).getARGB()).setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }

  /**
   * Creates a Z4GradientColor from two Z4GradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between start and stop in the before and after
   * colors (in the range [0,1], 0=start, 1=stop)
   * @return The Z4GradientColor
   */
  static  fromStartStopZ4GradientColors(before, after, div) {
    return new Z4GradientColor().setStartColor(before.getZ4ColorAt(div, false, false).getARGB()).setStopColor(after.getZ4ColorAt(div, false, false).getARGB()).setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }
}
/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4ColorUI extends Z4AbstractComponentWithValueUI {

   color = this.querySelector(".color-input");

   opacityLabel = this.querySelector(".color-opacity-range-label");

   opacityRange = this.querySelector(".color-opacity-range");

   opacityBadge = this.querySelector(".color-opacity-badge");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.querySelector(".color-gray").onclick = (event) => {
      this.setValue(this.value.gray());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".color-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.color.oninput = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.color.onchange = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.onchange(this.value);
      return null;
    };
    this.opacityRange.oninput = (event) => {
      this.opacityLabel.innerText = this.opacityRange.value;
      this.opacityBadge.innerText = this.opacityRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.opacityRange.onchange = (event) => {
      this.opacityLabel.innerText = this.opacityRange.value;
      this.opacityBadge.innerText = this.opacityRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
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

  /**
   * Sets the visibility of the opacity badge
   *
   * @param visible true to make the opacity badge visible, false otherwise
   * @return This Z4ColorUI
   */
   setOpacityBadgeVisible(visible) {
    this.opacityBadge.style.display = visible ? "inline-block" : "none";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.color.value = this.value.getHEX().substring(0, 7);
    this.opacityRange.valueAsNumber = this.value.getComponents()[0];
    this.opacityLabel.innerText = this.opacityRange.value;
    this.opacityBadge.innerText = this.opacityRange.value;
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

   startColorUI = new Z4ColorUI().setColorLabel("START", false, true).setOpacityBadgeVisible(false).appendToElement(this.querySelector(".gradient-color-start-container"));

   canvas = this.querySelector(".gradient-color-canvas");

   stopColorUI = new Z4ColorUI().setColorLabel("STOP", false, true).setOpacityBadgeVisible(false).appendToElement(this.querySelector(".gradient-color-stop-container"));

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   mirroredCheck = this.querySelector(".gradient-color-mirrored-check");

   rippleLabel = this.querySelector(".gradient-color-ripple-label");

   rippleRange = this.querySelector(".gradient-color-ripple-range");

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   horizontal = true;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    this.querySelector(".gradient-color-inverted").onclick = (event) => {
      this.setValue(this.value.inverted());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".gradient-color-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.mirroredCheck.id = this.getUniqueID();
    this.querySelector(".gradient-color-mirrored-label").setAttribute("for", this.mirroredCheck.id);
    this.mirroredCheck.onchange = (event) => {
      this.onchange(this.value.setMirrored(this.mirroredCheck.checked));
      this.drawCanvas();
      return null;
    };
    this.rippleRange.oninput = (event) => {
      this.rippleLabel.innerText = this.rippleRange.value;
      this.oninput(this.value.setRipple(this.rippleRange.valueAsNumber));
      this.drawCanvas();
      return null;
    };
    this.rippleRange.onchange = (event) => {
      this.rippleLabel.innerText = this.rippleRange.value;
      this.onchange(this.value.setRipple(this.rippleRange.valueAsNumber));
      this.drawCanvas();
      return null;
    };
    this.startColorUI.oninput = (z4Color) => {
      this.oninput(this.value.setStartColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.startColorUI.onchange = (z4Color) => {
      this.onchange(this.value.setStartColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.stopColorUI.oninput = (z4Color) => {
      this.oninput(this.value.setStopColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.stopColorUI.onchange = (z4Color) => {
      this.onchange(this.value.setStopColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.setValue(new Z4GradientColor());
  }

   setVertical() {
    this.horizontal = false;
    let gradientColorContainer = this.querySelector(".gradient-color-container");
    gradientColorContainer.parentElement.style.height = "100%";
    gradientColorContainer.style.flexDirection = "column";
    gradientColorContainer.style.alignItems = "start";
    gradientColorContainer.style.height = "calc(100% - 24px)";
    this.startColorUI.querySelector(".input-group").classList.add("dropend");
    this.stopColorUI.querySelector(".input-group").classList.add("dropend");
    this.querySelector(".gradient-color-input-group-canvas").style.flexDirection = "column";
    this.querySelector(".gradient-color-input-group-canvas").classList.add("dropend");
    this.canvas.removeAttribute("height");
    this.canvas.style.removeProperty("height");
    this.canvas.width = 71.8;
    this.canvas.style.width = "71.8px";
    this.canvas.style.borderTopRightRadius = "0.25rem";
    this.canvas.style.borderBottomLeftRadius = "0";
    let button = this.querySelector(".gradient-color-canvas-button");
    button.style.width = "71.8px";
    button.style.marginLeft = "0.25px";
    button.style.borderTopRightRadius = "0";
    button.style.borderBottomLeftRadius = "0.25rem";
    return this;
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

   setValue(value) {
    this.value = value;
    this.mirroredCheck.checked = this.value.isMirrored();
    this.rippleRange.valueAsNumber = this.value.getRipple();
    this.rippleLabel.innerText = this.rippleRange.value;
    this.startColorUI.setValue(this.value.getStartColor());
    this.stopColorUI.setValue(this.value.getStopColor());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      if (this.horizontal) {
        for (let x = 0; x < this.canvas.clientWidth; x++) {
          offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / this.canvas.clientWidth, true, true).getHEX();
          offscreenCtx.fillRect(x, 0, 1, this.canvas.clientHeight);
        }
      } else {
        for (let y = 0; y < this.canvas.clientHeight; y++) {
          offscreenCtx.fillStyle = this.value.getZ4ColorAt(y / this.canvas.clientHeight, true, true).getHEX();
          offscreenCtx.fillRect(0, y, this.canvas.clientWidth, 1);
        }
      }
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
   * @param context The context to use to perform the drawing
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
    context.strokeStyle = this.getColor(document.body.classList.contains("z4-dark") ? "white" : "black");
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
   * The stop
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

   intensity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(15).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.P["x"] = x;
      this.P["y"] = y;
      this.hasNext = true;
      return true;
    } else {
      return false;
    }
  }

   next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let angle = this.rotation.next(0);
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.P["x"], this.P["y"], currentPush, angle);
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
      return this.z4Point.setIntensity(this.intensity.next());
    }
  }

   drawDemo(context, width, height) {
    let arrowPainter = new Z4ArrowPainter();
    let gradientColor = new Z4GradientColor();
    let fillStyle = document.body.classList.contains("z4-dark") ? "white" : "black";
    this.initDraw(width, height).forEach(point => {
      this.draw(Z4Action.START, point["x"], point["y"]);
      context.save();
      context.lineWidth = 1;
      context.fillStyle = Z4Color.getFillStyle(fillStyle);
      context.beginPath();
      context.arc(this.P["x"], this.P["y"], 2, 0, Z4Math.TWO_PI);
      context.fill();
      context.restore();
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
    for (let x = 50; x <= w; x += 100) {
      for (let y = 50; y <= h; y += 100) {
        let point = new Object();
        point["x"] = x;
        point["y"] = y;
        array.push(point);
      }
    }
    return array;
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
}
/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".stamper-canvas");

   ctx = this.canvas.getContext("2d");

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setConstantRange(0, 50).setRandomRange(0, 50).setRandomLengthRange(1, 100).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50).setRandomRange(0, 50).setRandomLengthRange(1, 100).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50).setRandomRange(0, 50).setRandomLengthRange(1, 100).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    let config = new Object();
    config["attributeFilter"] = new Array("class");
    this.mutationObserver.observe(document.body, config);
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
      this.value.setPush(push);
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
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      this.value.drawDemo(offscreenCtx, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
