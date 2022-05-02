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
    document.querySelectorAll("[data-token-lang-inner_text]").forEach(element => (element).innerText = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text")));
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
      element.innerText = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text"));
    }
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
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerText = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerText = message;
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
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerText = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerText = message;
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

  static  appendButton(text, className, onButton, footer) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-dismiss", "modal");
    button.className = className;
    button.innerText = text;
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
        return value * this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }
        return value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
      case 3:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = Math.random();
        } else {
          this.step++;
        }
        return value * this.prevRandom;
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

   toggle = this.querySelector(".sign-button");

   toggleImg = this.querySelector(".sign-button img");

   text = this.querySelector(".value");

   spinner = this.querySelector(".spinner");

   applySpin = () => this.spin();

   isApplySpin = false;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  constructor() {
    super(Z4SignedValueUI.UI);
    this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggle.setAttribute("data-value", str);
        this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + str + ".svg");
        switch(str) {
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
    this.text.oninput = (event) => {
      this.oninput(this.value.setValue(this.text.valueAsNumber));
      return null;
    };
    this.text.onchange = (event) => {
      this.onchange(this.value.setValue(this.text.valueAsNumber));
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
      this.oninput(this.value.setValue(this.text.valueAsNumber));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.value.setValue(this.text.valueAsNumber));
    }
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
    this.querySelector(".range-label").innerText = "[" + min + "," + (max === 999999999 ? "&infin;" : max) + "]";
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedValueUI
   */
   setSignVisible(visible) {
    if (visible) {
      this.querySelector(".sign-label").classList.remove("sign-label-not-visible");
      this.toggle.classList.remove("sign-toggle-not-visible");
    } else {
      this.querySelector(".sign-label").classList.add("sign-label-not-visible");
      this.toggle.classList.add("sign-toggle-not-visible");
    }
    return this;
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
    valueLabel.innerText = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    let str = null;
    if (value.getSign() === Z4Sign.POSITIVE) {
      str = "positive";
    } else if (value.getSign() === Z4Sign.NEGATIVE) {
      str = "negative";
    } else if (value.getSign() === Z4Sign.RANDOM) {
      str = "random";
    } else {
      str = "alternate";
    }
    this.toggle.setAttribute("data-value", str);
    this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + str + ".svg");
    this.text.value = "" + value.getValue();
    return this;
  }
}
/**
 * The component to edit a signed random value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI {

   toggleType = this.querySelector(".toggle-type");

   toggleTypeImg = this.querySelector(".toggle-type img");

   valueLength = this.querySelector(".type-length");

   spinnerLength = this.querySelector(".type-length-spinner");

   signedValueUI = new Z4SignedValueUI();

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
    this.signedValueUI.oninput = (signedValue) => this.oninput(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    this.signedValueUI.onchange = (signedValue) => this.onchange(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + this.toggleType.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".toggle-type-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".toggle-type-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleType.setAttribute("data-value", str);
        this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + str + ".svg");
        // JS equality for strings
        this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
        // JS equality for strings
        this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
        this.onchange(this.createSignedRandomValue(str));
        return null;
      };
    }
    this.valueLength.oninput = (event) => {
      this.oninput(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
      return null;
    };
    this.valueLength.onchange = (event) => {
      this.onchange(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
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
    this.signedValueUI.prependElement(this.querySelector(".type-label"));
    this.querySelector(".number-group").prepend(this.querySelector(".toggle-type-dropdown-menu"));
    this.querySelector(".number-group").prepend(this.toggleType);
    this.querySelector(".sign-label").style.width = "50px";
    this.querySelector(".range-label").classList.add("signed-random-value");
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
      this.oninput(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    }
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
    this.querySelector(".range-length-label").innerText = "[" + min + "," + (max === 999999999 ? "&infin;" : max) + "]";
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
    let str = null;
    if (this.value.isClassic()) {
      str = "classic";
    } else if (this.value.isBezier()) {
      str = "bezier";
    } else if (this.value.isPolyline()) {
      str = "polyline";
    } else if (this.value.isStepped()) {
      str = "stepped";
    }
    this.toggleType.setAttribute("data-value", str);
    this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + str + ".svg");
    this.signedValueUI.setValue(new Z4SignedValue().setValue(this.value.getValue()).setSign(this.value.getSign()));
    // JS equality for strings
    this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
    // JS equality for strings
    this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
    this.valueLength.value = "" + this.getValue().getLength();
    return this;
  }

   createSignedRandomValue(str) {
    let signedValue = this.signedValueUI.getValue();
    switch(str) {
      case "classic":
        this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
        break;
      case "bezier":
        this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
      case "polyline":
        this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
      case "stepped":
        this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
    }
    return this.value;
  }
}
/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   uniformCheck = this.querySelector(".uniform-check");

   toggleUniform = this.querySelector(".toggle-uniform");

   toggleUniformImg = this.querySelector(".toggle-uniform img");

   constantUI = new Z4SignedValueUI();

   randomUI = new Z4SignedRandomValueUI();

   proportionalUI = new Z4SignedValueUI();

   constantSignVisible = true;

   randomSignVisible = true;

   proportionalSignVisible = true;

   constantVisible = true;

   randomVisible = true;

   proportionalVisible = true;

   selector = new Array();

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) => {
      this.setUI();
      this.onchange(this.value.setUniformSign(this.uniformCheck.checked));
      return null;
    };
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleUniform.setAttribute("data-value", str);
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
        this.constantUI.setValue(this.constantUI.getValue().setSign(this.getUniformSign(str)));
        this.onchange(this.value.setConstant(this.constantUI.getValue()));
        return null;
      };
    }
    this.constantUI.appendToElement(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT", false, true);
    this.randomUI.appendToElement(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM", false, true);
    this.proportionalUI.appendToElement(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL", false, true);
    this.constantUI.oninput = (event) => this.onInput();
    this.randomUI.oninput = (event) => this.onInput();
    this.proportionalUI.oninput = (event) => this.onInput();
    this.constantUI.onchange = (event) => this.onChange();
    this.randomUI.onchange = (event) => this.onChange();
    this.proportionalUI.onchange = (event) => this.onChange();
    this.setValue(new Z4FancifulValue());
  }

   onInput() {
    this.setUniformSign(this.constantUI.getValue().getSign());
    this.oninput(this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()).setProportional(this.proportionalUI.getValue()));
    return null;
  }

   onChange() {
    this.setUniformSign(this.constantUI.getValue().getSign());
    this.onchange(this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()).setProportional(this.proportionalUI.getValue()));
    return null;
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
    this.constantVisible = constant;
    this.randomVisible = random;
    this.proportionalVisible = proportional;
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
    this.constantSignVisible = constant;
    this.randomSignVisible = random;
    this.proportionalSignVisible = proportional;
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
   * Sets the range of the proportional component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
   setProportionalRange(min, max) {
    this.proportionalUI.setRange(min, max);
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
    let valueLabel = this.querySelector(".fanciful-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the horizontal orientation
   *
   * @return This Z4FancifulValueUI
   */
   setHorizontal() {
    let element = this.querySelector(".fanciful-container");
    element.classList.remove("fanciful-container-vertical");
    element.classList.add("fanciful-container-horizontal");
    return this;
  }

  /**
   * Sets the vertical orientation
   *
   * @return This Z4FancifulValueUI
   */
   setVertical() {
    let element = this.querySelector(".fanciful-container");
    element.classList.add("fanciful-container-vertical");
    element.classList.remove("fanciful-container-horizontal");
    return this;
  }

   setValue(value) {
    this.value = value;
    this.uniformCheck.checked = this.value.isUniformSign();
    this.constantUI.setValue(this.value.getConstant());
    this.setUniformSign(this.value.getConstant().getSign());
    this.randomUI.setValue(this.value.getRandom());
    this.proportionalUI.setValue(this.value.getProportional());
    this.setUI();
    return this;
  }

   setUI() {
    this.selector.forEach(sel => {
      this.querySelector(".fanciful-label").classList.remove(sel);
      this.querySelector(".form-check").classList.remove(sel);
      this.querySelector(".fanciful-container").classList.remove(sel);
    });
    this.selector = new Array("cv-" + this.constantVisible, "rv-" + this.randomVisible, "pv-" + this.proportionalVisible, "csv-" + this.constantSignVisible, "rsv-" + this.randomSignVisible, "psv-" + this.proportionalSignVisible, "u-" + this.uniformCheck.checked);
    this.selector.forEach(sel => {
      this.querySelector(".fanciful-label").classList.add(sel);
      this.querySelector(".form-check").classList.add(sel);
      this.querySelector(".fanciful-container").classList.add(sel);
    });
  }

   setUniformSign(sign) {
    let str = null;
    if (sign === Z4Sign.POSITIVE) {
      str = "positive";
    } else if (sign === Z4Sign.NEGATIVE) {
      str = "negative";
    } else if (sign === Z4Sign.RANDOM) {
      str = "random";
    } else {
      str = "alternate";
    }
    this.toggleUniform.setAttribute("data-value", str);
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
  }

   getUniformSign(str) {
    switch(str) {
      case "positive":
        return Z4Sign.POSITIVE;
      case "negative":
        return Z4Sign.NEGATIVE;
      case "random":
        return Z4Sign.RANDOM;
      case "alternate":
        return Z4Sign.alternate();
      default:
        return null;
    }
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
    valueLabel.innerText = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the horizontal orientation
   *
   * @return This Z4RotationUI
   */
   setHorizontal() {
    this.angle.setHorizontal();
    return this;
  }

  /**
   * Sets the vertical orientation
   *
   * @return This Z4RotationUI
   */
   setVertical() {
    this.angle.setVertical();
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
    colorLabel.innerText = Z4MessageFactory.get(token);
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

   sliders = this.querySelector(".sliders");

   formRangeLabel = this.querySelector(".form-range-label");

   mirroredCheck = this.querySelector(".mirrored-check");

   formRange = this.querySelector(".form-range");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   key = new Date().getTime() + "_" + parseInt(1000 * Math.random());

   devicePixelRatioListener = null;

   mouseDown = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 50;

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio();
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
    this.querySelector(".gradient-guided-tour").onclick = (event) => {
      Z4GradientColorGuidedTourUI.show();
      return null;
    };
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4GradientColorUI.WIDTH + "px";
    this.canvas.style.height = Z4GradientColorUI.HEIGHT + "px";
    this.sliders.onmousemove = (event) => {
      this.sliders.style.cursor = "default";
      let x = event.clientX - this.sliders.getBoundingClientRect().left - 8;
      let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
      if (x < width) {
        let position = x / width;
        if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
          this.sliders.style.cursor = "pointer";
        }
      }
      return null;
    };
    if (Z4Loader.touch) {
      this.sliders.ontouchstart = (event) => {
        this.addColor(event.changedTouches[0].clientX);
        return null;
      };
    } else {
      this.sliders.onmousedown = (event) => {
        this.addColor(event.clientX);
        return null;
      };
    }
    this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);
    this.mirroredCheck.onchange = (event) => {
      this.value.setMirrored(this.mirroredCheck.checked);
      this.configureSliders(-1);
      this.drawCanvas();
      this.onchange(this.value);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.oninput(this.value);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.onchange(this.value);
      return null;
    };
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      this.drawCanvas();
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      this.drawCanvas();
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.value.removeColor(parseFloat(input.value));
        this.configureSliders(-1);
        this.drawCanvas();
        this.onchange(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setValue(new Z4GradientColor());
  }

   initDevicePixelRatio() {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        this.drawCanvas();
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

   addColor(x) {
    x -= this.sliders.getBoundingClientRect().left + 8;
    let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
        this.value.generateColor(position);
        this.configureSliders(this.value.getComponents().length - 1);
        this.drawCanvas();
        this.onchange(this.value);
      }
    }
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
    gradientColorLabel.innerText = Z4MessageFactory.get(token);
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
    this.configureSliders(-1);
    this.drawCanvas();
    return this;
  }

   configureSliders(selected) {
    let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
    this.sliders.innerHTML = "";
    this.value.getComponents().forEach((z4StopColor, index, array) => {
      let position = z4StopColor.getPosition();
      let left = width * position - (index * 16);
      let input = document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors_" + this.key);
      input.setAttribute("value", "" + position);
      input.setAttribute("style", (index !== 0 && index !== 1 ? "cursor:ew-resize;" : "") + "position:relative;left:" + left + "px");
      input.onchange = (event) => {
        this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        if (index === 0 || index === 1) {
          this.del.setAttribute("disabled", "");
        } else {
          this.del.removeAttribute("disabled");
        }
        return null;
      };
      if (Z4Loader.touch) {
        input.ontouchstart = (event) => this.manageEvent(event, true, false, index, input, event.changedTouches[0].clientX);
        input.ontouchmove = (event) => this.manageEvent(event, this.mouseDown, true, index, input, event.changedTouches[0].clientX);
        input.ontouchend = (event) => this.manageEvent(event, false, false, index, input, event.changedTouches[0].clientX);
        input.ontouchcancel = (event) => this.manageEvent(event, false, false, index, input, event.changedTouches[0].clientX);
      } else {
        input.onmousedown = (event) => this.manageEvent(event, true, false, index, input, event.clientX);
        input.onmousemove = (event) => this.manageEvent(event, this.mouseDown, true, index, input, event.clientX);
        input.onmouseup = (event) => this.manageEvent(event, false, false, index, input, event.clientX);
        input.onmouseleave = (event) => this.manageEvent(event, false, false, index, input, event.clientX);
      }
      if (selected !== -1 && index === selected) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        this.del.removeAttribute("disabled");
      } else if (selected === -1 && index === 0) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        this.del.setAttribute("disabled", "");
      }
      this.sliders.appendChild(input);
    });
  }

   manageEvent(event, mouseDown, check, index, input, x) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.onchange(this.value);
    }
    this.mouseDown = mouseDown;
    if (check && this.mouseDown && index !== 0 && index !== 1) {
      this.moveColor(input, index, x);
    }
    return null;
  }

   moveColor(input, idx, x) {
    x -= this.sliders.getBoundingClientRect().left + 8;
    let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.value.getComponents().every((color, index, array) => index === idx || Math.abs(position - color.getPosition()) > 0.05)) {
        let oldPosition = parseFloat(input.value);
        let left = width * position - (idx * 16);
        input.setAttribute("value", "" + position);
        input.style.left = left + "px";
        this.value.move(oldPosition, position);
        this.drawCanvas();
        this.oninput(this.value);
      }
    }
  }

   drawCanvas() {
    this.canvas.width = Math.floor(Z4GradientColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4GradientColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4GradientColorUI.WIDTH; x++) {
      offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / Z4GradientColorUI.WIDTH, true, true).getHEX();
      offscreenCtx.fillRect(x, 0, 1, Z4GradientColorUI.HEIGHT);
    }
    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
/**
 * The guided tour for the Z4GradientColorUI
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorGuidedTourUI extends Z4GradientColorUI {

   options = new Object();

   element1 = null;

   element2 = null;

   event = null;

   message = null;

  /**
   * Creates a Z4GradientColorGuidedTourUI
   */
  constructor() {
    super();
    this.querySelector(".dropdown-divider").remove();
    this.querySelector(".gradient-guided-tour").remove();
    this.options["once"] = true;
    this.doStep(0);
  }

  /**
   * Shows the guided tour
   */
  static  show() {
    Z4ModalMessageUI.showInfo(Z4MessageFactory.get("TITLE"), "", () => {
      document.querySelector(".modal-dialog").classList.remove("modal-lg");
      (document.querySelector(".modal-message")).innerHTML = "";
      (document.querySelector(".modal-dialog .modal-footer")).innerHTML = "";
    });
    let label = document.createElement("label");
    label.className = "z4-guided-tour";
    document.querySelector(".modal-dialog").classList.add("modal-lg");
    document.querySelector(".modal-dialog .modal-footer").insertBefore(label, document.querySelector(".modal-dialog .modal-footer button"));
    new Z4GradientColorGuidedTourUI().appendToElement(document.querySelector(".modal-message"));
  }

   doStep(step) {
    switch(step) {
      case 0:
        this.element1 = this.element2 = this.querySelector(".form-check-input[value='1']");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_SELECT_COLOR");
        break;
      case 1:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_COMPONENTS1");
        break;
      case 2:
        this.element1 = this.querySelector(".dropdown-toggle-split");
        this.element2 = this.querySelector(".dropdown-menu .form-range");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_OPACITY");
        break;
      case 3:
        this.element1 = this.element2 = this.querySelector(".sliders");
        this.event = Z4Loader.touch ? "touchstart" : "mousedown";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_ADD_COLOR");
        break;
      case 4:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_COMPONENTS2");
        break;
      case 5:
        this.element1 = this.element2 = this.querySelector(".form-check-input:nth-child(3)");
        this.event = Z4Loader.touch ? "touchend" : "mouseup";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_MOVE");
        break;
      case 6:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".gradient-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_INVERT");
        break;
      case 7:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".gradient-negative");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_NEGATIVIZE");
        break;
      case 8:
        this.element1 = this.element2 = this.querySelector(".mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_MIRROR");
        break;
      case 9:
        this.element1 = this.element2 = this.querySelector(".form-range[step='0.01']");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_ADD_RIPPLE");
        break;
      default:
        this.element1 = null;
        this.message = Z4MessageFactory.get("GUIDED_TOUR_COMPLETED");
    }
    let label = document.querySelector(".modal-dialog .modal-footer label");
    if (this.element1) {
      this.element1.classList.add("z4-guided-tour");
      this.element2.classList.add("z4-guided-tour");
      this.element2.addEventListener(this.event, (evt) => {
        this.element1.classList.remove("z4-guided-tour");
        this.element2.classList.remove("z4-guided-tour");
        this.doStep(step + 1);
      }, this.options);
    } else if (label) {
      label.className = "";
    }
    if (label) {
      label.innerText = this.message;
    } else {
      console.log(this.message);
    }
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

   sliders = this.querySelector(".sliders");

   temporalFormRangeLabel = this.querySelector(".temporal-form-range-label");

   spatialFormRangeLabel = this.querySelector(".spatial-form-range-label");

   temporalMirroredCheck = this.querySelector(".temporal-mirrored-check");

   spatialMirroredCheck = this.querySelector(".spatial-mirrored-check");

   temporalFormRange = this.querySelector(".form-range-temporal");

   spatialFormRange = this.querySelector(".form-range-spatial");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   key = new Date().getTime() + "_" + parseInt(1000 * Math.random());

   devicePixelRatioListener = null;

   mouseDown = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 200;

  /**
   * Creates a Z4TemporalColorUI
   */
  constructor() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio();
    this.querySelector(".temporal-inverted").onclick = (event) => this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) => this.inverted(false, true);
    this.querySelector(".temporal-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".temporal-guided-tour").onclick = (event) => {
      Z4TemporalColorGuidedTourUI.show();
      return null;
    };
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4TemporalColorUI.WIDTH + "px";
    this.canvas.style.height = Z4TemporalColorUI.HEIGHT + "px";
    this.canvas.onmousemove = (event) => {
      this.canvas.style.cursor = "default";
      let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
      let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
      let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
        if (okT && okS) {
          this.canvas.style.cursor = "pointer";
        }
      }
      return null;
    };
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => {
        this.addColor(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        return null;
      };
    } else {
      this.canvas.onmousedown = (event) => {
        this.addColor(event.clientX, event.clientY);
        return null;
      };
    }
    let mirror = (event) => {
      this.value.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.configureSliders(-1, -1);
      this.drawCanvas(1);
      this.onchange(this.value);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;
    this.temporalMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".temporal-mirrored-label").setAttribute("for", this.temporalMirroredCheck.id);
    this.spatialMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".spatial-mirrored-label").setAttribute("for", this.spatialMirroredCheck.id);
    this.temporalFormRange.oninput = (event) => this.setRipple(5);
    this.spatialFormRange.oninput = (event) => this.setRipple(5);
    this.temporalFormRange.onchange = (event) => this.setRipple(1);
    this.spatialFormRange.onchange = (event) => this.setRipple(1);
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(5);
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(1);
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.value.removeColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")));
        this.configureSliders(-1, -1);
        this.drawCanvas(1);
        this.onchange(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setValue(new Z4TemporalColor());
  }

   initDevicePixelRatio() {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        this.drawCanvas(1);
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

   addColor(x, y) {
    x -= this.canvas.getBoundingClientRect().left;
    y -= this.canvas.getBoundingClientRect().top;
    let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    if (x < width && gap < y && y < gap + height) {
      let positionT = x / width;
      let positionS = (height - y + gap) / height;
      let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
      let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
      if (okT && okS) {
        this.value.generateColor(positionT, positionS);
        this.configureSliders(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1);
        this.drawCanvas(1);
        this.onchange(this.value);
      }
    }
  }

   setRipple(step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.value.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(step);
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
    temporalColorLabel.innerText = Z4MessageFactory.get(token);
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
    this.configureSliders(-1, -1);
    this.drawCanvas(1);
    return this;
  }

   configureSliders(selectedT, selectedS) {
    let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    this.sliders.innerHTML = "";
    this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
      let positionT = z4StopGradientColor.getPosition();
      let left = -8 + width * positionT;
      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
        let positionS = z4StopColor.getPosition();
        let top = gap - 8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);
        let input = document.createElement("input");
        input.setAttribute("class", "form-check-input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "colors_" + this.key);
        input.setAttribute("value", positionT + "-" + positionS);
        input.setAttribute("T", "" + positionT);
        input.setAttribute("S", "" + positionS);
        input.setAttribute("style", "margin-top:0px;position:relative;left:" + left + "px;top:" + top + "px");
        if (indexT !== 0 && indexT !== 1 && indexS !== 0 && indexS !== 1) {
          input.style.cursor = "move";
        } else if (indexT !== 0 && indexT !== 1) {
          input.style.cursor = "ew-resize";
        } else if (indexS !== 0 && indexS !== 1) {
          input.style.cursor = "ns-resize";
        }
        input.onchange = (event) => {
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          if ((indexT !== 0 && indexT !== 1) || (indexS !== 0 && indexS !== 1)) {
            this.del.removeAttribute("disabled");
          } else {
            this.del.setAttribute("disabled", "");
          }
          return null;
        };
        if (Z4Loader.touch) {
          input.ontouchstart = (event) => this.manageEvent(event, true, false, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          input.ontouchmove = (event) => this.manageEvent(event, this.mouseDown, true, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          input.ontouchend = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          input.ontouchcancel = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        } else {
          input.onmousedown = (event) => this.manageEvent(event, true, false, indexT, indexS, input, event.clientX, event.clientY);
          input.onmousemove = (event) => this.manageEvent(event, this.mouseDown, true, indexT, indexS, input, event.clientX, event.clientY);
          input.onmouseup = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.clientX, event.clientY);
          input.onmouseleave = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.clientX, event.clientY);
        }
        if (selectedT !== -1 && selectedS !== -1 && indexT === selectedT && indexS === selectedS) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          this.del.removeAttribute("disabled");
        } else if (selectedT === -1 && selectedS === -1 && indexT === 0 && indexS === 0) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          this.del.setAttribute("disabled", "");
        }
        this.sliders.appendChild(input);
      });
    });
  }

   manageEvent(event, mouseDown, check, indexT, indexS, input, x, y) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.drawCanvas(1);
      this.onchange(this.value);
    }
    this.mouseDown = mouseDown;
    if (check && this.mouseDown && ((indexT !== 0 && indexT !== 1) || (indexS !== 0 && indexS !== 1))) {
      this.moveColor(input, indexT, indexS, x, y);
    }
    return null;
  }

   moveColor(input, idxT, idxS, x, y) {
    x -= this.canvas.getBoundingClientRect().left;
    y -= this.canvas.getBoundingClientRect().top;
    let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    let free = idxT !== 0 && idxT !== 1 && idxS !== 0 && idxS !== 1 && x < width && gap < y && y < gap + height;
    let temporal = idxT !== 0 && idxT !== 1 && x < width;
    let spatial = idxS !== 0 && idxS !== 1 && gap < y && y < gap + height;
    let positionT = x / width;
    let positionS = (height - y + gap) / height;
    let okT = this.value.getComponents().every((color, indexT, array) => indexT === idxT || Math.abs(positionT - color.getPosition()) > 0.05);
    let okS = this.value.getComponents()[0].getComponents().every((color, indexS, array) => indexS === idxS || Math.abs(positionS - color.getPosition()) > 0.1);
    let oldPositionT = parseFloat(input.getAttribute("T"));
    let oldPositionS = parseFloat(input.getAttribute("S"));
    let left = -8 + width * positionT;
    let top = gap - 8 + height * (1 - positionS) - ((idxS + this.value.getComponents()[0].getComponents().length * idxT) * 16);
    if (free) {
      if (okT && okS) {
        this.move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height);
        this.value.move(oldPositionT, positionT, oldPositionS, positionS);
        this.drawCanvas(5);
        this.oninput(this.value);
      }
    } else if (temporal) {
      if (okT) {
        this.move(input, oldPositionT, oldPositionS, positionT, oldPositionS, left, parseFloat(input.style.top.replace("px", "")), gap, height);
        this.value.move(oldPositionT, positionT, -1, -1);
        this.drawCanvas(5);
        this.oninput(this.value);
      }
    } else if (spatial) {
      if (okS) {
        this.move(input, oldPositionT, oldPositionS, oldPositionT, positionS, parseFloat(input.style.left.replace("px", "")), top, gap, height);
        this.value.move(oldPositionT, positionT, oldPositionS, positionS);
        this.drawCanvas(5);
        this.oninput(this.value);
      }
    }
  }

   move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height) {
    this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
      let brotherPositionT = z4StopGradientColor.getPosition();
      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
        let brotherPositionS = z4StopColor.getPosition();
        if (brotherPositionT === oldPositionT || brotherPositionS === oldPositionS) {
          let brother = this.querySelector(".sliders input[value='" + brotherPositionT + "-" + brotherPositionS + "']");
          if (brotherPositionT !== 0 && brotherPositionT !== 1 && brotherPositionT === oldPositionT) {
            brother.setAttribute("value", positionT + "-" + brotherPositionS);
            brother.setAttribute("T", "" + positionT);
            brother.style.left = left + "px";
          }
          if (brotherPositionS !== 0 && brotherPositionS !== 1 && brotherPositionS === oldPositionS) {
            let brotherTop = gap - 8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);
            brother.setAttribute("value", brotherPositionT + "-" + positionS);
            brother.setAttribute("S", "" + positionS);
            brother.style.top = brotherTop + "px";
          }
        }
      });
    });
    input.setAttribute("value", positionT + "-" + positionS);
    input.setAttribute("T", "" + positionT);
    input.setAttribute("S", "" + positionS);
    input.style.left = left + "px";
    input.style.top = top + "px";
  }

   drawCanvas(step) {
    this.canvas.width = Math.floor(Z4TemporalColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4TemporalColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4TemporalColorUI.WIDTH; x += step) {
      let z4GradientColor = this.value.getZ4GradientColorAt(x / Z4TemporalColorUI.WIDTH, true, true);
      for (let y = 0; y < Z4TemporalColorUI.HEIGHT; y += step) {
        offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / Z4TemporalColorUI.HEIGHT, true, true).getHEX();
        offscreenCtx.fillRect(x, Z4TemporalColorUI.HEIGHT - y - step, step, step);
      }
    }
    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
/**
 * The guided tour for the Z4TemporalColorUI
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColorGuidedTourUI extends Z4TemporalColorUI {

   options = new Object();

   element1 = null;

   element2 = null;

   event = null;

   message = null;

   i = document.createElement("i");

  /**
   * Creates a Z4TemporalColorGuidedTourUI
   */
  constructor() {
    super();
    this.querySelector(".dropdown-divider").remove();
    this.querySelector(".temporal-guided-tour").remove();
    let div = document.createElement("div");
    div.setAttribute("style", "float:right");
    this.querySelector(".canvas-container div div:nth-child(3)").appendChild(div);
    this.i.className = "bi bi-arrow-left-circle";
    this.i.setAttribute("style", "font-size:30px;border-radius:48px;position:relative;top:50px;padding:0px 5px;visibility:hidden");
    div.appendChild(this.i);
    this.options["once"] = true;
    this.doStep(0);
  }

  /**
   * Shows the guided tour
   */
  static  show() {
    Z4ModalMessageUI.showInfo(Z4MessageFactory.get("TITLE"), "", () => {
      document.querySelector(".modal-dialog").classList.remove("modal-lg");
      (document.querySelector(".modal-message")).innerHTML = "";
      (document.querySelector(".modal-dialog .modal-footer")).innerHTML = "";
    });
    let label = document.createElement("label");
    label.className = "z4-guided-tour";
    document.querySelector(".modal-dialog").classList.add("modal-lg");
    document.querySelector(".modal-dialog .modal-footer").insertBefore(label, document.querySelector(".modal-dialog .modal-footer button"));
    new Z4TemporalColorGuidedTourUI().appendToElement(document.querySelector(".modal-message"));
  }

   doStep(step) {
    switch(step) {
      case 0:
        this.element1 = this.element2 = this.querySelector(".form-check-input[value='1-1']");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_SELECT_COLOR");
        break;
      case 1:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_COMPONENTS1");
        break;
      case 2:
        this.element1 = this.querySelector(".dropdown-toggle-split");
        this.element2 = this.querySelector(".dropdown-menu .form-range");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_OPACITY");
        break;
      case 3:
        this.i.style.visibility = "visible";
        this.element1 = this.querySelector(".bi-arrow-left-circle");
        this.element2 = this.querySelector(".canvas");
        this.event = Z4Loader.touch ? "touchstart" : "mousedown";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_COLOR");
        break;
      case 4:
        this.i.style.visibility = "hidden";
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_COMPONENTS2");
        break;
      case 5:
        this.element1 = this.element2 = this.querySelector(".form-check-input:nth-child(9)");
        this.event = Z4Loader.touch ? "touchend" : "mouseup";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MOVE");
        break;
      case 6:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".spatial-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_INVERT_SPATIAL");
        break;
      case 7:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".temporal-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_INVERT_TEMPORAL");
        break;
      case 8:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".temporal-negative");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_NEGATIVIZE");
        break;
      case 9:
        this.element1 = this.element2 = this.querySelector(".temporal-mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MIRROR_TEMPORAL");
        break;
      case 10:
        this.element1 = this.element2 = this.querySelector(".spatial-mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MIRROR_SPATIAL");
        break;
      case 11:
        this.element1 = this.element2 = this.querySelector(".form-range-spatial");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_RIPPLE_SPATIAL");
        break;
      case 12:
        this.element1 = this.element2 = this.querySelector(".form-range-temporal");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_RIPPLE_TEMPORAL");
        break;
      default:
        this.element1 = null;
        this.message = Z4MessageFactory.get("GUIDED_TOUR_COMPLETED");
    }
    let label = document.querySelector(".modal-dialog .modal-footer label");
    if (this.element1) {
      this.element1.classList.add("z4-guided-tour");
      this.element2.classList.add("z4-guided-tour");
      this.element2.addEventListener(this.event, (evt) => {
        this.element1.classList.remove("z4-guided-tour");
        this.element2.classList.remove("z4-guided-tour");
        this.doStep(step + 1);
      }, this.options);
    } else if (label) {
      label.className = "";
    }
    if (label) {
      label.innerText = this.message;
    } else {
      console.log(this.message);
    }
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
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the push
   *
   * @return The push
   */
   getPush() {
    return this.push;
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
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), this.intensity.next(0), angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"], this.P["y"], this.intensity.next(0), angle));
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
      return this.z4Point;
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
        context.fillStyle = this.getColor("black");
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

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", false, false).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", false, false).appendToElement(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", false, false).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", false, false).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.setValue(new Z4Stamper());
  }

   setValue(value) {
    this.value = value;
    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    return this;
  }
}
