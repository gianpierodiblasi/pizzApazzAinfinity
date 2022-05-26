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
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T prependElement(Element element) {
  // this.root.prepend(element);
  // return (T) this;
  // }
  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T prependComponent(Z4AbstractComponentUI element) {
  // this.root.prepend(element.root);
  // return (T) this;
  // }
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
    let imgs = this.querySelectorAll(".signed-value-sign-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".signed-value-sign-dropdown-menu button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".signed-value-sign-button img").setAttribute("src", button.querySelector("img").getAttribute("src"));
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
    } else {
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
    let imgs = this.querySelectorAll(".signed-random-value-type-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".signed-random-value-type-dropdown-menu button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".signed-random-value-type-button img").setAttribute("src", button.querySelector("img").getAttribute("src"));
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
    this.randomUI.setSignVisible(!this.uniformCheck.checked && visible);
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

   startAngle = new Z4SignedValueUI().setCompact().setRange(0, 360).setValueLabel("START_ANGLE", true, false).setSignVisible(false).appendToElement(this.querySelector(".rotation-container"));

   delayedCheck = this.querySelector(".rotation-delayed-check");

   angle = new Z4FancifulValueUI().setValueLabel("ANGLE", true, false).setConstantRange(0, 180).setRandomRange(0, 180).appendToElement(this.querySelector(".rotation-container"));

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  constructor() {
    super(Z4RotationUI.UI);
    let imgs = this.querySelectorAll(".rotation-type-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".rotation-type-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".rotation-type-button img").setAttribute("src", button.querySelector("img").getAttribute("src"));
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
    let element = this.startAngle.querySelector(".signed-value-compact-button span");
    element.innerHTML = element.innerText;
    for (let i = 0; i < 20; i++) {
      element.innerHTML += "&nbsp";
    }
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
