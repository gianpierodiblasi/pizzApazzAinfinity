/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   valueSpan = this.querySelector(".fanciful-value-span");

   uniformCheck = this.querySelector(".uniform-check");

   constantUI = new Z4SignedValueUI();

   randomUI = new Z4SignedRandomValueUI();

   proportionalUI = new Z4SignedValueUI();

   mutationObserver = new MutationObserver(() => this.setSpan());

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
      this.value.setUniformSign(this.uniformCheck.checked);
      this.setUI();
      this.setSpan();
      this.onchange(this.value);
      return null;
    };
    let imgs = this.querySelectorAll(".btn-group-uniform img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".btn-group-uniform button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        switch(button.getAttribute("data-value")) {
          case "positive":
            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.POSITIVE));
            break;
          case "negative":
            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.NEGATIVE));
            break;
          case "random":
            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.RANDOM));
            break;
          case "alternate":
            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.alternate()));
            break;
        }
        this.value.setConstant(this.constantUI.getValue());
        this.setUI();
        this.setSpan();
        this.onchange(this.value);
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
    let spans = this.querySelectorAll(".value-span");
    for (let i = 0; i < spans.length; i++) {
      (spans.item(i)).style.display = "none";
    }
    let array = new Array("class");
    let observerConfig = new Object();
    observerConfig["attributes"] = true;
    observerConfig["attributeFilter"] = array;
    this.mutationObserver.observe(document.querySelector("body"), observerConfig);
    this.setValue(new Z4FancifulValue());
  }

   onInput() {
    this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()).setProportional(this.proportionalUI.getValue());
    this.setSpan();
    this.oninput(this.value);
    return null;
  }

   onChange() {
    this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()).setProportional(this.proportionalUI.getValue());
    this.setSpan();
    this.onchange(this.value);
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
    this.constantVisible = constant;
    this.randomVisible = random;
    this.proportionalVisible = proportional;
    this.setUI();
    this.setSpan();
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
    this.setSpan();
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
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.uniformCheck.checked = this.value.isUniformSign();
    this.constantUI.setValue(this.value.getConstant());
    this.randomUI.setValue(this.value.getRandom());
    this.proportionalUI.setValue(this.value.getProportional());
    this.setUI();
    this.setSpan();
    return this;
  }

   setUI() {
    this.selector.forEach(sel => {
      this.querySelector(".fanciful-container").classList.remove(sel);
    });
    this.selector = new Array("cv-" + this.constantVisible, "rv-" + this.randomVisible, "pv-" + this.proportionalVisible, "csv-" + this.constantSignVisible, "rsv-" + this.randomSignVisible, "psv-" + this.proportionalSignVisible, "u-" + this.uniformCheck.checked);
    this.selector.forEach(sel => {
      this.querySelector(".fanciful-container").classList.add(sel);
    });
  }

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
    // if (Z4Setting.isLiteMode()) {
    // return this.constant.next();
    // } else if (Z4Setting.isStandardMode()) {
    // if (this.uniformSign) {
    // return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
    // } else {
    // return this.constant.next() + this.random.nextSigned();
    // }
    // } else if (Z4Setting.isProMode()) {
    // if (this.uniformSign) {
    // return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned() + sensibility * this.proportional.getValue());
    // } else {
    // return this.constant.next() + this.random.nextSigned() + sensibility * this.proportional.next();
    // }
    // } else {
    // return 0;
    // }
    // String sign = "";
    // if (!this.signedValueUI.isSignVisible()) {
    // } else if (this.value.getSign() == Z4Sign.POSITIVE) {
    // sign = "&plus;";
    // } else if (this.value.getSign() == Z4Sign.NEGATIVE) {
    // sign = "&minus;";
    // } else if (this.value.getSign() == Z4Sign.RANDOM) {
    // sign = "&plusmn;";
    // } else {
    // sign = "&plusmn;<sup>&UpArrowDownArrow;</sup>";
    // }
    // 
    // String rnd = "";
    // if (this.value.isClassic()) {
    // rnd = "rnd";
    // } else if (this.value.isBezier()) {
    // rnd = "rnd&#8767;<sup>" + this.value.getLength() + "</sup>";
    // } else if (this.value.isPolyline()) {
    // rnd = "rnd&#8896;<sup>" + this.value.getLength() + "</sup>";
    // } else if (this.value.isStepped()) {
    // rnd = "rnd&#8851;<sup>" + this.value.getLength() + "</sup>";
    // }
    // 
    // this.valueSpan.innerHTML = sign + rnd + "(" + this.value.getValue() + ")";
  }

   dispose() {
    this.mutationObserver.unobserve(document.querySelector("body"));
  }
}
