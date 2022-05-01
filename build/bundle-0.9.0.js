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
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentUI {

   html = null;

  /**
   * Creates a Z4AbstractComponentUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    this.html = document.createElement("div");
    this.html.setAttribute("id", "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random()));
    this.html.innerHTML = ui;
    let list = this.html.querySelectorAll("#" + this.html.id + " [data-token-lang-inner_text]");
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
    return this.html.querySelector(selector);
  }

  /**
   * Selects all children of this component
   *
   * @param selector The selector
   * @return All children of this component
   */
   querySelectorAll(selector) {
    return this.html.querySelectorAll(selector);
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
   appendTo(parent) {
    parent.appendChild(this.html);
    return this;
  }
}
/**
 * The abstract class of all UI components providing a value
 *
 * @param <S>
 * @param <T>
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
   * Sets the value
   *
   * @param value The value
   * @return This Z4AbstractComponentWithValueUI
   */
   setValue(value) {
    this.value = value;
    return this;
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
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerText = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerText = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    if (onYES) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("YES"), "btn btn-primary", onYES, footer);
    }
    if (onNO) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("NO"), "btn btn-secondary", onNO, footer);
    }
    if (onOK) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-primary", onOK, footer);
    }
    if (onCANCEL) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("CANCEL"), "btn btn-secondary", onCANCEL, footer);
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
 * The random value
 *
 * @author gianpiero.di.blasi
 */
class Z4RandomValue {

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
   * Checks if this Z4RandomValue generates "classic "random values
   *
   * @return true if this Z4RandomValue generates "classic "random values, false
   * otherwise
   */
   isClassic() {
    return this.type === 0;
  }

  /**
   * Checks if this Z4RandomValue generates random values on a bezier curve
   *
   * @return true if this Z4RandomValue generates random values on a bezier
   * curve, false otherwise
   */
   isBezier() {
    return this.type === 1;
  }

  /**
   * Checks if this Z4RandomValue generates random values on a polyline
   *
   * @return true if this Z4RandomValue generates random values on a polyline,
   * false otherwise
   */
   isPolyline() {
    return this.type === 2;
  }

  /**
   * Returns if this Z4RandomValue generates random values on a stepped line
   *
   * @return true if this Z4RandomValue generates random values on a stepped
   * line, false otherwise
   */
   isStepped() {
    return this.type === 3;
  }

  /**
   * Returns the value
   *
   * @return The value
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
   * Returns the next random value
   *
   * @return The next random value (in the range [0,value[)
   */
   next() {
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
   * Returns a Z4RandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4RandomValue
   */
  static  classic(value) {
    return new Z4RandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4RandomValue
   */
  static  bezier(value, length) {
    return new Z4RandomValue(value, 1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  static  polyline(value, length) {
    return new Z4RandomValue(value, 2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4RandomValue
   */
  static  stepped(value, length) {
    return new Z4RandomValue(value, 3, length);
  }
}
/**
 * The common parent of all fanciful values
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractFancifulValue {

   constantSign = Z4Sign.RANDOM;

   constantValue = 0;

   randomSign = Z4Sign.RANDOM;

   randomValue = Z4RandomValue.classic(0);

   proportionalSign = Z4Sign.RANDOM;

   proportionalValue = 0;

   uniformSign = false;

  /**
   * Sets the constant component
   *
   * @param constantSign The sign of the constant component
   * @param constantValue The value of the constant component
   * @return This Z4FancifulValue
   */
   setConstant(constantSign, constantValue) {
    this.constantSign = constantSign;
    this.constantValue = constantValue;
    return this;
  }

  /**
   * Returns the sign of the constant component
   *
   * @return The sign of the constant component
   */
   getConstantSign() {
    return this.constantSign;
  }

  /**
   * Returns the value of the constant component
   *
   * @return The value of the constant component
   */
   getConstantValue() {
    return this.constantValue;
  }

  /**
   * Sets the random component
   *
   * @param randomSign The sign of the random component
   * @param randomValue The value of the random component
   * @return This Z4FancifulValue
   */
   setRandom(randomSign, randomValue) {
    this.randomSign = randomSign;
    this.randomValue = randomValue;
    return this;
  }

  /**
   * Returns the sign of the random component
   *
   * @return The sign of the random component
   */
   getRandomSign() {
    return this.randomSign;
  }

  /**
   * Returns the value of the random component
   *
   * @return The value of the random component
   */
   getRandomValue() {
    return this.randomValue;
  }

  /**
   * Sets the proportional component
   *
   * @param proportionalSign The sign of the proportional component
   * @param proportionalValue The value of the proportional component
   * @return This Z4FancifulValue
   */
   setProportional(proportionalSign, proportionalValue) {
    this.proportionalSign = proportionalSign;
    this.proportionalValue = proportionalValue;
    return this;
  }

  /**
   * Returns the sign of the proportional component
   *
   * @return The sign of the proportional component
   */
   getProportionalSign() {
    return this.proportionalSign;
  }

  /**
   * Returns the value of the proportional component
   *
   * @return The value of the proportional component
   */
   getProportionalValue() {
    return this.proportionalValue;
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
      return this.constantSign.next() * this.constantValue;
    } else if (Z4Setting.isStandardMode()) {
      if (this.uniformSign) {
        return this.constantSign.next() * (this.constantValue + this.randomValue.next());
      } else {
        return this.constantSign.next() * this.constantValue + this.randomSign.next() * this.randomValue.next();
      }
    } else if (Z4Setting.isProMode()) {
      if (this.uniformSign) {
        return this.constantSign.next() * (this.constantValue + this.randomValue.next() + sensibility * this.proportionalValue);
      } else {
        return this.constantSign.next() * this.constantValue + this.randomSign.next() * this.randomValue.next() + this.proportionalSign.next() * sensibility * this.proportionalValue;
      }
    } else {
      return 0;
    }
  }
}
/**
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValue extends Z4AbstractFancifulValue {
}
/**
 * The rotation (angles parameters are computed in degrees, rotations are
 * computed in radians)
 *
 * @author gianpiero.di.blasi
 */
class Z4Rotation extends Z4AbstractFancifulValue {

   type = 0;

   startAngle = 0.0;

   delayed = false;

   rotationNext = 0.0;

  constructor(type) {
    super();
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
   * Returns this Z4Rotation as a Z4FancifulValue
   * @return This Z4Rotation as a Z4FancifulValue
   */
   asFancifulValue() {
    return new Z4FancifulValue().setConstant(this.getConstantSign(), this.getConstantValue()).setRandom(this.getRandomSign(), this.getRandomValue()).setProportional(this.getProportionalSign(), this.getProportionalValue()).setUniformSign(this.isUniformSign());
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
    let angle = Z4Math.deg2rad(this.startAngle + super.next(0));
    switch(this.type) {
      case 0:
        return angle + (this.delayed ? Math.PI : 0);
      case 1:
        this.rotationNext += angle;
        return this.rotationNext + (this.delayed ? Math.PI : 0);
      case 2:
        return angle + tangentAngle + (this.delayed ? Math.PI : 0);
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
    new Z4TemporalColorGuidedTourUI().appendTo(document.querySelector(".modal-message"));
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
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2DPainter extends Z4Painter {

   shape = Z4Shape2D.SQUARE;

   size = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 50);

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
      this.drawBounds(context, point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstantValue()));
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

   intensity = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 15);

   multiplicity = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 1);

   push = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 0);

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
