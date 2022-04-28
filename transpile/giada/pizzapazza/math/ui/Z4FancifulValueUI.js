/**
 * The component to edit a numeric value
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

   applySpin = () => this.spin();

   isApplySpin = false;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) => {
      this.setUniform(this.uniformCheck.checked);
      this.onchange(this.fancifulValue.setUniformSign(this.uniformCheck.checked));
      return null;
    };
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + "-sm.png");
    let imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".png");
    }
    let buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.toggleUniform.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + button.getAttribute("data-value") + "-sm.png");
        this.fancifulValue.setConstant(this.getUniformSign(), this.constantUI.getValue());
        this.constantUI.setSign(this.getUniformSign());
        this.onchange(this.fancifulValue);
        return null;
      };
    }
    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + this.toggleRandom.getAttribute("data-value") + "-sm.png");
    imgs = this.querySelectorAll(".toggle-random-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".png");
    }
    buttons = this.querySelectorAll(".toggle-random-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleRandom.setAttribute("data-value", str);
        this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + "-sm.png");
        // JS equality for strings
        this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
        // JS equality for strings
        this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
        this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
        this.onchange(this.fancifulValue);
        return null;
      };
    }
    this.valueLength.setAttribute("min", "1");
    this.valueLength.setAttribute("value", "1");
    this.valueLength.oninput = (event) => {
      this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
      this.oninput(this.fancifulValue);
      return null;
    };
    this.valueLength.onchange = (event) => {
      this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
      this.onchange(this.fancifulValue);
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
  }

   onInput() {
    this.setUniformSign(this.constantUI.getSign());
    this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue());
    this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
    this.fancifulValue.setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue());
    this.oninput(this.fancifulValue);
    return null;
  }

   onChange() {
    this.setUniformSign(this.constantUI.getSign());
    this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue());
    this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
    this.fancifulValue.setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue());
    this.onchange(this.fancifulValue);
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
      this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
      this.oninput(this.fancifulValue);
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
      this.onchange(this.fancifulValue);
    }
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
   * Sets the visibility of the random component
   *
   * @param visible true to make the random component visible, false otherwise
   * @return This Z4FancifulValueUI
   */
   setRandomVisible(visible) {
    if (visible) {
      this.querySelector(".fanciful-random").classList.remove("fanciful-random-not-visible");
    } else {
      this.querySelector(".fanciful-random").classList.add("fanciful-random-not-visible");
    }
    this.setUniform(this.fancifulValue.isUniformSign());
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
   * Sets the visibility of the proportional component
   *
   * @param visible true to make the proportional component visible, false
   * otherwise
   * @return This Z4FancifulValueUI
   */
   setProportionalVisible(visible) {
    if (visible) {
      this.querySelector(".fanciful-proportional").classList.remove("fanciful-proportional-not-visible");
    } else {
      this.querySelector(".fanciful-proportional").classList.add("fanciful-proportional-not-visible");
    }
    this.setUniform(this.fancifulValue.isUniformSign());
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
   * @return This Z4NumberUI
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
   * @return This Z4NumberUI
   */
   setValue(value) {
    this.fancifulValue = value;
    this.setUniform(this.fancifulValue.isUniformSign());
    this.constantUI.setSign(this.fancifulValue.getConstantSign());
    this.constantUI.setValue(this.fancifulValue.getConstantValue());
    this.setUniformSign(this.fancifulValue.getConstantSign());
    this.randomUI.setSign(this.fancifulValue.getRandomSign());
    this.setRandom(this.fancifulValue.getRandomValue());
    this.proportionalUI.setSign(this.fancifulValue.getProportionalSign());
    this.proportionalUI.setValue(this.fancifulValue.getProportionalValue());
    return this;
  }

   setUniform(uniform) {
    this.uniformCheck.checked = uniform;
    let b = this.querySelector(".fanciful-random").classList.contains("fanciful-random-not-visible") && this.querySelector(".fanciful-proportional").classList.contains("fanciful-proportional-not-visible");
    this.constantUI.setSignVisible(!this.uniformCheck.checked || b);
    this.randomUI.setSignVisible(!this.uniformCheck.checked);
    this.randomUI.querySelector(".number-group").classList.add("input-group");
    this.proportionalUI.setSignVisible(!this.uniformCheck.checked);
    if (!this.uniformCheck.checked || b) {
      this.querySelector(".uniform-container").classList.add("uniform-container-not-visible");
    } else {
      this.querySelector(".uniform-container").classList.remove("uniform-container-not-visible");
    }
    if (b) {
      this.querySelector(".uniform-label").classList.add("uniform-label-not-visible");
      this.uniformCheck.classList.add("uniform-check-not-visible");
    } else {
      this.querySelector(".uniform-label").classList.remove("uniform-label-not-visible");
      this.uniformCheck.classList.remove("uniform-check-not-visible");
    }
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
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + "-sm.png");
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
    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + "-sm.png");
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
