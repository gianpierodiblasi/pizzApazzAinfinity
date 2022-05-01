/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4ComponentUI {

   uniformCheck = this.querySelector(".uniform-check");

   toggleUniform = this.querySelector(".toggle-uniform");

   toggleUniformImg = this.querySelector(".toggle-uniform img");

   constantUI = new Z4NumberUI();

   randomUI = new Z4NumberUI();

   proportionalUI = new Z4NumberUI();

   toggleRandom = this.querySelector(".toggle-random");

   toggleRandomImg = this.querySelector(".toggle-random img");

   valueLength = this.querySelector(".random-length");

   spinnerLength = this.querySelector(".random-length-spinner");

   fancifulValue = new Z4FancifulValue();

   constantSignVisible = true;

   randomSignVisible = true;

   proportionalSignVisible = true;

   constantVisible = true;

   randomVisible = true;

   proportionalVisible = true;

   selector = new Array();

   applySpin = () => this.spin();

   isApplySpin = false;

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
      this.onchange(this.fancifulValue.setUniformSign(this.uniformCheck.checked));
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
        this.toggleUniform.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + button.getAttribute("data-value") + ".svg");
        this.constantUI.setSign(this.getUniformSign());
        this.onchange(this.fancifulValue.setConstant(this.getUniformSign(), this.constantUI.getValue()));
        return null;
      };
    }
    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + this.toggleRandom.getAttribute("data-value") + ".svg");
    imgs = this.querySelectorAll(".toggle-random-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    buttons = this.querySelectorAll(".toggle-random-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleRandom.setAttribute("data-value", str);
        this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + ".svg");
        // JS equality for strings
        this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
        // JS equality for strings
        this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
        this.onchange(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
        return null;
      };
    }
    this.valueLength.oninput = (event) => {
      this.oninput(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
      return null;
    };
    this.valueLength.onchange = (event) => {
      this.onchange(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
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
    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT");
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM");
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL");
    this.querySelector(".fanciful-random > div").prepend(this.querySelector(".random-type-label"));
    this.randomUI.querySelector(".number-group").prepend(this.querySelector(".toggle-random-dropdown-menu"));
    this.randomUI.querySelector(".number-group").prepend(this.toggleRandom);
    this.randomUI.querySelector(".sign-label").style.width = "64px";
    this.constantUI.oninput = (event) => this.onInput();
    this.randomUI.oninput = (event) => this.onInput();
    this.proportionalUI.oninput = (event) => this.onInput();
    this.constantUI.onchange = (event) => this.onChange();
    this.randomUI.onchange = (event) => this.onChange();
    this.proportionalUI.onchange = (event) => this.onChange();
    this.setValue(this.fancifulValue);
  }

   onInput() {
    this.setUniformSign(this.constantUI.getSign());
    this.oninput(this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue()).setRandom(this.randomUI.getSign(), this.getRandom()).setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue()));
    return null;
  }

   onChange() {
    this.setUniformSign(this.constantUI.getSign());
    this.onchange(this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue()).setRandom(this.randomUI.getSign(), this.getRandom()).setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue()));
    return null;
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
      this.oninput(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
    }
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
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
   setRandomLengthRange(min, max) {
    this.valueLength.setAttribute("min", "" + min);
    this.valueLength.setAttribute("max", "" + max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4FancifulValueUI
   */
   setValueLabel(token) {
    let valueLabel = this.querySelector(".fanciful-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
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

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4FancifulValueUI
   */
   setValue(value) {
    this.fancifulValue = value;
    this.uniformCheck.checked = this.fancifulValue.isUniformSign();
    this.constantUI.setSign(this.fancifulValue.getConstantSign());
    this.constantUI.setValue(this.fancifulValue.getConstantValue());
    this.setUniformSign(this.fancifulValue.getConstantSign());
    this.randomUI.setSign(this.fancifulValue.getRandomSign());
    this.setRandom(this.fancifulValue.getRandomValue());
    this.proportionalUI.setSign(this.fancifulValue.getProportionalSign());
    this.proportionalUI.setValue(this.fancifulValue.getProportionalValue());
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

   getUniformSign() {
    switch(this.toggleUniform.getAttribute("data-value")) {
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

   setRandom(random) {
    let str = null;
    if (random.isClassic()) {
      str = "classic";
    } else if (random.isBezier()) {
      str = "bezier";
    } else if (random.isPolyline()) {
      str = "polyline";
    } else if (random.isStepped()) {
      str = "stepped";
    }
    this.toggleRandom.setAttribute("data-value", str);
    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + ".svg");
    this.randomUI.setValue(random.getValue());
    // JS equality for strings
    this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
    // JS equality for strings
    this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
    this.valueLength.value = "" + random.getLength();
  }

   getRandom() {
    switch(this.toggleRandom.getAttribute("data-value")) {
      case "classic":
        return Z4RandomValue.classic(this.randomUI.getValue());
      case "bezier":
        return Z4RandomValue.bezier(this.randomUI.getValue(), this.valueLength.valueAsNumber);
      case "polyline":
        return Z4RandomValue.polyline(this.randomUI.getValue(), this.valueLength.valueAsNumber);
      case "stepped":
        return Z4RandomValue.stepped(this.randomUI.getValue(), this.valueLength.valueAsNumber);
      default:
        return null;
    }
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.fancifulValue;
  }
}
