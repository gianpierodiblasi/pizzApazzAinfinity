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
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T appendToComponent(Z4AbstractComponentUI parent) {
  // parent.root.appendChild(this.root);
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
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValueUI extends Z4AbstractComponentWithValueUI {

   valueLabel = this.querySelector(".signed-value-value-label");

   checkSpinner = this.querySelector(".signed-value-check-spinner");

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
    this.checkSpinner.onchange = (event) => {
      let list = this.querySelectorAll(".signed-value-form-control .form-label");
      for (let i = 0; i < list.length; i++) {
        (list.item(i)).style.display = this.checkSpinner.checked ? "inline-block" : "none";
      }
      if (this.checkSpinner.checked) {
        this.spinner.setAttribute("min", "-50");
        this.spinner.setAttribute("max", "50");
        this.spinner.value = "0";
      } else {
        this.configureRange();
      }
      return null;
    };
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
      if (!this.checkSpinner.checked) {
        let v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.oninput(this.value.setValue(v));
      }
      return null;
    };
    this.spinner.onchange = (event) => {
      if (!this.checkSpinner.checked) {
        let v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.onchange(this.value.setValue(v));
      }
      return null;
    };
    this.setValue(new Z4SignedValue());
  }

   startSpin() {
    if (this.checkSpinner.checked) {
      this.isApplySpin = true;
      this.applySpin();
    }
    return null;
  }

   stopSpin() {
    if (this.checkSpinner.checked) {
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
    if (!this.checkSpinner.checked) {
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
    if (!this.checkSpinner.checked) {
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
