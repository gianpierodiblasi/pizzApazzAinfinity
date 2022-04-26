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
          document.body.className = "";
        } else {
          Z4Setting.addDarkModeListener();
        }
        break;
      case "light":
      case "dark":
        // JS equality for strings
        document.body.className = Z4Setting.theme === "dark" ? "z4-dark" : "";
        break;
    }
  }

  static  addDarkModeListener() {
    if (Z4Setting.theme === "auto") {
      // JS equality for strings
      document.body.className = window.matchMedia("(prefers-color-scheme: dark)").matches ? "z4dark" : "";
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
    let file = "message-" + Z4Setting.getLanguage() + ".properties";
    let client = new XMLHttpRequest();
    client.open("GET", path + file, false);
    client.send();
    Z4MessageFactory.readMessages(array, client.responseText);
    if (Object.keys(array).length === 0) {
      Z4Setting.setLanguage("en");
      file = "message-en.properties";
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
    let client = new XMLHttpRequest();
    client.open("GET", Z4Loader.UP + "image_list.properties", false);
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
class Z4ComponentUI {

   html = null;

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
   * Loads an HTML file
   *
   * @param html The HTML file
   * @return The HTML file
   */
  static  loadHTML(html) {
    let path = Z4Loader.UP + (Z4Loader.allFiles ? "src/" : "build/html/");
    let client = new XMLHttpRequest();
    client.open("GET", path + html, false);
    client.send();
    return client.responseText;
  }

  /**
   * Creates a Z4ComponentUI
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
   * Appends this Z4ComponentUI to its parent
   *
   * @param parent The parent
   * @return This Z4ComponentUI
   */
   appendTo(parent) {
    parent.appendChild(this.html);
    return this;
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
    let path = Z4Loader.UP + (Z4Loader.allFiles ? "src/" : "build/html/");
    let client = new XMLHttpRequest();
    client.open("GET", path + "giada/pizzapazza/ui/Z4ModalMessageUI.html", false);
    client.send();
    let parent = document.createElement("div");
    parent.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
    parent.setAttribute("data-bs-backdrop", "static");
    parent.setAttribute("data-bs-keyboard", "false");
    parent.setAttribute("tabindex", "-1");
    parent.setAttribute("style", "display:none");
    parent.className = "modal modal-dialog-centered fade";
    parent.innerHTML = client.responseText;
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

   value = 0;

   type = 0;

   length = 0;

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
    return new Z4RandomValue(value, 0, 0);
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
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValue {

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
   * Returns the constant value
   *
   * @return The constant value
   */
   getConstantValue() {
    return constantValue;
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
    let components = new Array();
    components.push(this.a, this.r, this.g, this.b);
    return components;
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
class Z4ColorUI extends Z4ComponentUI {

   colorLabel = this.querySelector(".color-label");

   color = this.querySelector(".form-control-color");

   formRangeLabel = this.querySelector(".form-range-label");

   formRange = this.querySelector(".form-range");

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.querySelector(".gray").onclick = (event) => {
      this.setZ4Color(this.getZ4Color().gray());
      this.onchange(this.getZ4Color());
      return null;
    };
    this.querySelector(".negative").onclick = (event) => {
      this.setZ4Color(this.getZ4Color().negative());
      this.onchange(this.getZ4Color());
      return null;
    };
    this.color.oninput = (event) => {
      this.oninput(this.getZ4Color());
      return null;
    };
    this.color.onchange = (event) => {
      this.onchange(this.getZ4Color());
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.oninput(this.getZ4Color());
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.onchange(this.getZ4Color());
      return null;
    };
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4ColorUI
   */
   setColorLabel(token) {
    this.colorLabel.setAttribute("data-token-lang", token);
    this.colorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the Z4Color
   *
   * @param color The Z4Color
   * @return This Z4ColorUI
   */
   setZ4Color(color) {
    this.color.value = color.getHEX().substring(0, 7);
    this.formRange.valueAsNumber = color.getComponents()[0];
    this.formRangeLabel.innerText = this.formRange.value;
    return this;
  }

  /**
   * Returns the Z4Color
   *
   * @return The Z4Color
   */
   getZ4Color() {
    return Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
  }
}
/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4ComponentUI {

   gradientColorLabel = this.querySelector(".gradient-color-label");

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

   gradientColor = new Z4GradientColor();

   devicePixelRatioListener = null;

   mouseDown = false;

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 50;

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio();
    this.querySelector(".gradient-inverted").onclick = (event) => {
      this.setZ4GradientColor(this.gradientColor.inverted());
      this.onchange(this.gradientColor);
      return null;
    };
    this.querySelector(".gradient-negative").onclick = (event) => {
      this.setZ4GradientColor(this.gradientColor.negative());
      this.onchange(this.gradientColor);
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
      let width = Z4GradientColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
      if (x < width) {
        let position = x / width;
        if (this.gradientColor.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
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
    this.mirroredCheck.onchange = (event) => {
      this.gradientColor.setMirrored(this.mirroredCheck.checked);
      this.configureSliders(-1);
      this.drawCanvas();
      this.onchange(this.gradientColor);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.gradientColor.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.oninput(this.gradientColor);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.gradientColor.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.onchange(this.gradientColor);
      return null;
    };
    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.gradientColor.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      this.drawCanvas();
      this.oninput(this.gradientColor);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.gradientColor.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      this.drawCanvas();
      this.onchange(this.gradientColor);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.gradientColor.removeColor(parseFloat(input.value));
        this.configureSliders(-1);
        this.drawCanvas();
        this.onchange(this.gradientColor);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setZ4GradientColor(this.gradientColor);
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
    let width = Z4GradientColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.gradientColor.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
        this.gradientColor.generateColor(position);
        this.configureSliders(this.gradientColor.getComponents().length - 1);
        this.drawCanvas();
        this.onchange(this.gradientColor);
      }
    }
  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @return This Z4GradientColorUI
   */
   setGradientColorLabel(token) {
    this.gradientColorLabel.setAttribute("data-token-lang", token);
    this.gradientColorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4GradientColorUI
   */
   setColorLabel(token) {
    this.z4ColorUI.setColorLabel(token);
    return this;
  }

  /**
   * Returns the Z4GradientColor
   *
   * @return The Z4GradientColor
   */
   getZ4GradientColor() {
    return this.gradientColor;
  }

  /**
   * Sets the Z4GradientColor
   *
   * @param color The Z4GradientColor
   * @return This Z4GradientColorUI
   */
   setZ4GradientColor(color) {
    this.gradientColor = color;
    this.mirroredCheck.checked = this.gradientColor.isMirrored();
    this.formRange.valueAsNumber = this.gradientColor.getRipple();
    this.formRangeLabel.innerText = this.formRange.value;
    this.configureSliders(-1);
    this.drawCanvas();
    return this;
  }

   configureSliders(selected) {
    let width = Z4GradientColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
    this.sliders.innerHTML = "";
    this.gradientColor.getComponents().forEach((z4StopColor, index, array) => {
      let position = z4StopColor.getPosition();
      let left = width * position - (index * 16);
      let input = document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors_" + this.key);
      input.setAttribute("value", "" + position);
      input.setAttribute("style", (index !== 0 && index !== 1 ? "cursor:ew-resize;" : "") + "position:relative;left:" + left + "px");
      input.onchange = (event) => {
        this.z4ColorUI.setZ4Color(z4StopColor);
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
        this.z4ColorUI.setZ4Color(z4StopColor);
        this.del.removeAttribute("disabled");
      } else if (selected === -1 && index === 0) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setZ4Color(z4StopColor);
        this.del.setAttribute("disabled", "");
      }
      this.sliders.appendChild(input);
    });
  }

   manageEvent(event, mouseDown, check, index, input, x) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.onchange(this.gradientColor);
    }
    this.mouseDown = mouseDown;
    if (check && this.mouseDown && index !== 0 && index !== 1) {
      this.moveColor(input, index, x);
    }
    return null;
  }

   moveColor(input, idx, x) {
    x -= this.sliders.getBoundingClientRect().left + 8;
    let width = Z4GradientColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.gradientColor.getComponents().every((color, index, array) => index === idx || Math.abs(position - color.getPosition()) > 0.05)) {
        let oldPosition = parseFloat(input.value);
        let left = width * position - (idx * 16);
        input.setAttribute("value", "" + position);
        input.style.left = left + "px";
        this.gradientColor.move(oldPosition, position);
        this.drawCanvas();
        this.oninput(this.gradientColor);
      }
    }
  }

   drawCanvas() {
    this.canvas.width = Math.floor(Z4GradientColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4GradientColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4GradientColorUI.WIDTH; x++) {
      offscreenCtx.fillStyle = this.gradientColor.getZ4ColorAt(x / Z4GradientColorUI.WIDTH, true, true).getHEX();
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
    new Z4GradientColorGuidedTourUI().appendTo(document.querySelector(".modal-message"));
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
class Z4TemporalColorUI extends Z4ComponentUI {

   temporalColorLabel = this.querySelector(".temporal-color-label");

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

   temporalColor = new Z4TemporalColor();

   devicePixelRatioListener = null;

   mouseDown = false;

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

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
      this.setZ4TemporalColor(this.temporalColor.negative());
      this.onchange(this.temporalColor);
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
      let width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
      let height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
      let gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let okT = this.temporalColor.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.temporalColor.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
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
      this.temporalColor.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.configureSliders(-1, -1);
      this.drawCanvas(1);
      this.onchange(this.temporalColor);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;
    this.temporalFormRange.oninput = (event) => this.setRipple(5);
    this.spatialFormRange.oninput = (event) => this.setRipple(5);
    this.temporalFormRange.onchange = (event) => this.setRipple(1);
    this.spatialFormRange.onchange = (event) => this.setRipple(1);
    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.temporalColor.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(5);
      this.oninput(this.temporalColor);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.temporalColor.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(1);
      this.onchange(this.temporalColor);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.temporalColor.removeColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")));
        this.configureSliders(-1, -1);
        this.drawCanvas(1);
        this.onchange(this.temporalColor);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setZ4TemporalColor(this.temporalColor);
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
    let width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    let gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    if (x < width && gap < y && y < gap + height) {
      let positionT = x / width;
      let positionS = (height - y + gap) / height;
      let okT = this.temporalColor.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
      let okS = this.temporalColor.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
      if (okT && okS) {
        this.temporalColor.generateColor(positionT, positionS);
        this.configureSliders(this.temporalColor.getComponents().length - 1, this.temporalColor.getComponents()[0].getComponents().length - 1);
        this.drawCanvas(1);
        this.onchange(this.temporalColor);
      }
    }
  }

   setRipple(step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.temporalColor.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(step);
    if (step === 1) {
      this.onchange(this.temporalColor);
    } else {
      this.oninput(this.temporalColor);
    }
    return null;
  }

   inverted(temporal, spatial) {
    this.setZ4TemporalColor(this.temporalColor.inverted(temporal, spatial));
    this.onchange(this.temporalColor);
    return null;
  }

  /**
   * Sets the token of the temporal color label
   *
   * @param token The token of the temporal color label
   * @return This Z4TemporalColorUI
   */
   setTemporalColorLabel(token) {
    this.temporalColorLabel.setAttribute("data-token-lang", token);
    this.temporalColorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4TemporalColorUI
   */
   setColorLabel(token) {
    this.z4ColorUI.setColorLabel(token);
    return this;
  }

  /**
   * Returns the Z4TemporalColor
   *
   * @return The Z4TemporalColor
   */
   getZ4TemporalColor() {
    return this.temporalColor;
  }

  /**
   * Sets the Z4TemporalColor
   *
   * @param color The Z4TemporalColor
   * @return This Z4TemporalColorUI
   */
   setZ4TemporalColor(color) {
    this.temporalColor = color;
    this.temporalMirroredCheck.checked = this.temporalColor.isTemporalyMirrored();
    this.spatialMirroredCheck.checked = this.temporalColor.isSpatialyMirrored();
    this.temporalFormRange.valueAsNumber = this.temporalColor.getTemporalRipple();
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRange.valueAsNumber = this.temporalColor.getSpatialRipple();
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.configureSliders(-1, -1);
    this.drawCanvas(1);
    return this;
  }

   configureSliders(selectedT, selectedS) {
    let width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    let gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    this.sliders.innerHTML = "";
    this.temporalColor.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
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
          this.z4ColorUI.setZ4Color(z4StopColor);
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
          this.z4ColorUI.setZ4Color(z4StopColor);
          this.del.removeAttribute("disabled");
        } else if (selectedT === -1 && selectedS === -1 && indexT === 0 && indexS === 0) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setZ4Color(z4StopColor);
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
      this.onchange(this.temporalColor);
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
    let width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    let gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    let free = idxT !== 0 && idxT !== 1 && idxS !== 0 && idxS !== 1 && x < width && gap < y && y < gap + height;
    let temporal = idxT !== 0 && idxT !== 1 && x < width;
    let spatial = idxS !== 0 && idxS !== 1 && gap < y && y < gap + height;
    let positionT = x / width;
    let positionS = (height - y + gap) / height;
    let okT = this.temporalColor.getComponents().every((color, indexT, array) => indexT === idxT || Math.abs(positionT - color.getPosition()) > 0.05);
    let okS = this.temporalColor.getComponents()[0].getComponents().every((color, indexS, array) => indexS === idxS || Math.abs(positionS - color.getPosition()) > 0.1);
    let oldPositionT = parseFloat(input.getAttribute("T"));
    let oldPositionS = parseFloat(input.getAttribute("S"));
    let left = -8 + width * positionT;
    let top = gap - 8 + height * (1 - positionS) - ((idxS + this.temporalColor.getComponents()[0].getComponents().length * idxT) * 16);
    if (free) {
      if (okT && okS) {
        this.move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height);
        this.temporalColor.move(oldPositionT, positionT, oldPositionS, positionS);
        this.drawCanvas(5);
        this.oninput(this.temporalColor);
      }
    } else if (temporal) {
      if (okT) {
        this.move(input, oldPositionT, oldPositionS, positionT, oldPositionS, left, parseFloat(input.style.top.replace("px", "")), gap, height);
        this.temporalColor.move(oldPositionT, positionT, -1, -1);
        this.drawCanvas(5);
        this.oninput(this.temporalColor);
      }
    } else if (spatial) {
      if (okS) {
        this.move(input, oldPositionT, oldPositionS, oldPositionT, positionS, parseFloat(input.style.left.replace("px", "")), top, gap, height);
        this.temporalColor.move(oldPositionT, positionT, oldPositionS, positionS);
        this.drawCanvas(5);
        this.oninput(this.temporalColor);
      }
    }
  }

   move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height) {
    this.temporalColor.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
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
      let z4GradientColor = this.temporalColor.getZ4GradientColorAt(x / Z4TemporalColorUI.WIDTH, true, true);
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

   draw(context, point, gradientColor) {
    let x = point.getIntensity() * point.getZ4Vector().getModule();
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = this.getColor("gray");
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -3);
    context.lineTo(x - 5, +3);
    context.lineTo(x, 0);
    context.stroke();
    context.strokeStyle = this.getColor("black");
    context.translate(1, 1);
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
 * The rotation of a Z4PointIterator
 *
 * @author gianpiero.di.blasi
 */
class Z4Rotation {

  /**
   * Next rotation is computed on a fixed value
   */
  static  FIXED = new Z4Rotation();

  /**
   * Next rotation is computed by cumulating previous rotation
   */
  static  CUMULATIVE = new Z4Rotation();

  /**
   * Next rotation is computed relative to a path
   */
  static  RELATIVE_TO_PATH = new Z4Rotation();

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

   rotation = new Z4FancifulValue();

   rotationMode = Z4Rotation.FIXED;

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

   rotationNext = 0;

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
   * @param context The context where to draw the demo
   * @param width The width
   * @param height The height
   */
   drawDemo(context, width, height) {
  }

  /**
   * Computes the next rotation
   *
   * @param tangentAngle The tangent angle
   * @return The next rotation (in radians)
   */
   nextRotation(tangentAngle) {
    let angle = Z4Math.deg2rad(this.rotation.next(0));
    if (this.rotationMode === Z4Rotation.FIXED) {
      return angle;
    } else if (this.rotationMode === Z4Rotation.CUMULATIVE) {
      this.rotationNext += angle;
      return this.rotationNext;
    } else if (this.rotationMode === Z4Rotation.RELATIVE_TO_PATH) {
      return angle + tangentAngle;
    } else {
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
    if (this.rotationMode === Z4Rotation.FIXED || this.rotationMode === Z4Rotation.CUMULATIVE) {
      z4Point.setSide(Z4Sign.POSITIVE);
    } else if (this.rotationMode === Z4Rotation.RELATIVE_TO_PATH) {
      z4Point.setSide(vector ? vector.direction(z4Point.getZ4Vector()) : Z4Sign.RANDOM);
    }
  }
}
/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
class Z4Stamper extends Z4PointIterator {

   draw(action, x, y) {
    if (action === Z4Action.START) {
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
      this.hasNext = false;
      let angle = this.nextRotation(0);
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"], this.P["y"], 1, angle));
      this.nextSide(this.z4Point, null);
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
      let next = this.next();
      let vector = next.getZ4Vector();
      next.setZ4Vector(Z4Vector.fromVector(vector.getX0(), vector.getY0(), 15, vector.getPhase()));
      context.save();
      context.translate(vector.getX0(), vector.getY0());
      context.rotate(vector.getPhase());
      arrowPainter.draw(context, next, gradientColor);
      context.restore();
    });
  }

   initDraw(w, h) {
    let size = parseInt(0.0005 * w * h);
    let array = new Array();
    for (let i = 0; i < size; i++) {
      let point = new Object();
      point["x"] = 10 + (w - 20) * Math.random();
      point["y"] = 10 + (h - 20) * Math.random();
      array.push(point);
    }
    return array;
  }
}
