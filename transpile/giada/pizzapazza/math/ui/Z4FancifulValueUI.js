/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   valueSpan = this.querySelector(".fanciful-value-span");

  // private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
  // private final HTMLElement toggleUniform = this.querySelector(".toggle-uniform");
  // private final HTMLElement toggleUniformImg = this.querySelector(".toggle-uniform img");
  // 
   constantUI = new Z4SignedValueUI();

   randomUI = new Z4SignedRandomValueUI();

   proportionalUI = new Z4SignedValueUI();

  // 
   mutationObserver = new MutationObserver(() => this.setSpan());

  // private boolean constantSignVisible = true;
  // private boolean randomSignVisible = true;
  // private boolean proportionalSignVisible = true;
  // private boolean constantVisible = true;
  // private boolean randomVisible = true;
  // private boolean proportionalVisible = true;
   selector = new Array();

  // 
  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    // this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    // this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    // this.uniformCheck.onchange = (event) -> {
    // this.setUI();
    // this.onchange.$apply(this.value.setUniformSign(this.uniformCheck.checked));
    // return null;
    // };
    // 
    // this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + ".svg");
    // 
    // NodeList imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    // for (int i = 0; i < imgs.length; i++) {
    // HTMLElement img = (HTMLElement) imgs.item(i);
    // img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    // }
    // 
    // NodeList buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    // for (int i = 0; i < buttons.length; i++) {
    // HTMLElement button = (HTMLElement) buttons.item(i);
    // button.onclick = (event) -> {
    // String str = button.getAttribute("data-value");
    // this.toggleUniform.setAttribute("data-value", str);
    // this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
    // 
    // this.constantUI.setValue(this.constantUI.getValue().setSign(this.getUniformSign(str)));
    // this.onchange.$apply(this.value.setConstant(this.constantUI.getValue()));
    // return null;
    // };
    // }
    // 
    this.constantUI.appendToElement(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT", false, true);
    this.randomUI.appendToElement(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM", false, true);
    this.proportionalUI.appendToElement(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL", false, true);
    // 
    // this.constantUI.oninput = (event) -> this.onInput();
    // this.randomUI.oninput = (event) -> this.onInput();
    // this.proportionalUI.oninput = (event) -> this.onInput();
    // this.constantUI.onchange = (event) -> this.onChange();
    // this.randomUI.onchange = (event) -> this.onChange();
    // this.proportionalUI.onchange = (event) -> this.onChange();
    // 
    let array = new Array("class");
    let observerConfig = new Object();
    observerConfig["attributes"] = true;
    observerConfig["attributeFilter"] = array;
    this.mutationObserver.observe(document.querySelector("body"), observerConfig);
    this.setValue(new Z4FancifulValue());
  }

   onInput() {
    // this.setUniformSign(this.constantUI.getValue().getSign());
    // 
    // this.oninput.$apply(this.value.
    // setConstant(this.constantUI.getValue()).
    // setRandom(this.randomUI.getValue()).
    // setProportional(this.proportionalUI.getValue())
    // );
    return null;
  }

   onChange() {
    // this.setUniformSign(this.constantUI.getValue().getSign());
    // 
    // this.onchange.$apply(this.value.
    // setConstant(this.constantUI.getValue()).
    // setRandom(this.randomUI.getValue()).
    // setProportional(this.proportionalUI.getValue())
    // );
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
    // this.constantVisible = constant;
    // this.randomVisible = random;
    // this.proportionalVisible = proportional;
    // 
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
    // this.constantSignVisible = constant;
    // this.randomSignVisible = random;
    // this.proportionalSignVisible = proportional;
    // 
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
    // this.constantUI.setRange(min, max);
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
    // this.randomUI.setRange(min, max);
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
    // this.randomUI.setLengthRange(min, max);
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
    // this.proportionalUI.setRange(min, max);
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
    // $HTMLElement valueLabel = this.querySelector(".fanciful-label");
    // valueLabel.setAttribute("data-token-lang-inner_text", token);
    // valueLabel.innerHTML = Z4MessageFactory.get(token);
    // valueLabel.style.fontWeight = bold ? "700" : "400";
    // valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    // 
    // this.uniformCheck.checked = this.value.isUniformSign();
    // 
    // this.constantUI.setValue(this.value.getConstant());
    // this.setUniformSign(this.value.getConstant().getSign());
    // this.randomUI.setValue(this.value.getRandom());
    // this.proportionalUI.setValue(this.value.getProportional());
    // 
    this.setUI();
    this.setSpan();
    return this;
  }

  // 
   setUI() {
    // this.selector.forEach(sel -> {
    // this.querySelector(".fanciful-label").classList.remove(sel);
    // this.querySelector(".form-check").classList.remove(sel);
    // this.querySelector(".fanciful-container").classList.remove(sel);
    // });
    // 
    // this.selector = new Array<>(
    // "cv-" + this.constantVisible,
    // "rv-" + this.randomVisible,
    // "pv-" + this.proportionalVisible,
    // "csv-" + this.constantSignVisible,
    // "rsv-" + this.randomSignVisible,
    // "psv-" + this.proportionalSignVisible,
    // "u-" + this.uniformCheck.checked
    // );
    // 
    // this.selector.forEach(sel -> {
    // this.querySelector(".fanciful-label").classList.add(sel);
    // this.querySelector(".form-check").classList.add(sel);
    // this.querySelector(".fanciful-container").classList.add(sel);
    // });
  }

  // 
   setUniformSign(sign) {
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
    // this.toggleUniform.setAttribute("data-value", str);
    // this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
  }

  // 
  // private Z4Sign getUniformSign(String str) {
  // switch (str) {
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
  }

   dispose() {
    this.mutationObserver.unobserve(document.querySelector("body"));
  }
}
