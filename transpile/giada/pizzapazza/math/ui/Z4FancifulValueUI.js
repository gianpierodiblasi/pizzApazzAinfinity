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

   fancifulValue = new Z4FancifulValue();

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
      this.constantUI.setSignVisible(!this.uniformCheck.checked);
      this.randomUI.setSignVisible(!this.uniformCheck.checked);
      this.randomUI.querySelector(".number-group").classList.add("input-group");
      this.proportionalUI.setSignVisible(!this.uniformCheck.checked);
      this.querySelector(".uniform-container").style.display = this.uniformCheck.checked ? "block" : "none";
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
        this.toggleRandom.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + button.getAttribute("data-value") + "-sm.png");
        this.onchange(this.fancifulValue);
        return null;
      };
    }
    this.randomUI.querySelector(".number-group").prepend(this.querySelector(".toggle-random-dropdown-menu"));
    this.randomUI.querySelector(".number-group").prepend(this.toggleRandom);
    this.randomUI.querySelector(".sign-label").style.marginLeft = "89px";
    this.constantUI.oninput = (event) => this.onInput();
    this.randomUI.oninput = (event) => this.onInput();
    this.proportionalUI.oninput = (event) => this.onInput();
    this.constantUI.onchange = (event) => this.onChange();
    this.randomUI.onchange = (event) => this.onChange();
    this.proportionalUI.onchange = (event) => this.onChange();
    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT");
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM");
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL");
  }

   onInput() {
    this.setUniformSign(this.constantUI.getSign());
    this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue());
    // this.fancifulValue.setRandom(this.randomUI.getSign(), this.constantUI.getValue());
    this.fancifulValue.setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue());
    this.oninput(this.fancifulValue);
    return null;
  }

   onChange() {
    this.setUniformSign(this.constantUI.getSign());
    this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue());
    // this.fancifulValue.setRandom(this.randomUI.getSign(), this.constantUI.getValue());
    this.fancifulValue.setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue());
    this.onchange(this.fancifulValue);
    return null;
  }

  /**
   * Sets the range of this Z4NumberUI
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setRange(int min, int max) {
  // this.value.setAttribute("min", "" + min);
  // this.value.setAttribute("max", "" + max);
  // return this;
  // }
  // 
  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setSignVisible(boolean visible) {
  // this.querySelector(".sign-label").style.display = visible ? "inline-block" : "none";
  // this.toggle.style.display = visible ? "inline-block" : "none";
  // 
  // if (visible) {
  // this.querySelector(".number-group").classList.add("input-group");
  // } else {
  // this.querySelector(".number-group").classList.remove("input-group");
  // }
  // 
  // return this;
  // }
  // 
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
   * Sets the Z4Sign
   *
   * @param sign The Z4Sign
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setSign(Z4Sign sign) {
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
  // this.toggle.setAttribute("data-value", str);
  // this.toggleImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + "-sm.png");
  // 
  // return this;
  // }
  // 
  /**
   * Returns the sign
   *
   * @return The sign
   */
  // public Z4Sign getSign() {
  // switch (this.toggle.getAttribute("data-value")) {
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
  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4NumberUI
   */
   setValue(value) {
    this.fancifulValue = value;
    this.constantUI.setSignVisible(this.fancifulValue.isUniformSign());
    this.randomUI.setSignVisible(this.fancifulValue.isUniformSign());
    this.proportionalUI.setSignVisible(this.fancifulValue.isUniformSign());
    this.querySelector(".uniform-container").style.display = this.fancifulValue.isUniformSign() ? "block" : "none";
    this.constantUI.setSign(this.fancifulValue.getConstantSign());
    this.constantUI.setValue(this.fancifulValue.getConstantValue());
    this.setUniformSign(this.fancifulValue.getConstantSign());
    return this;
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

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.fancifulValue;
  }
}
