/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   uniformCheck = this.querySelector(".fanciful-value-uniform-check");

   constantUI = new Z4SignedValueUI().setCompact().setValueLabel("CONSTANT", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

   randomUI = new Z4SignedRandomValueUI().setCompact().setValueLabel("RANDOM", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

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
    // this.uniformCheck.checked = this.value.isUniformSign();
    // this.constantUI.setValue(this.value.getConstant());
    // this.randomUI.setValue(this.value.getRandom());
    // 
    // this.setUI();
    // this.setSpan();
    return this;
  }

   setUI() {
    // this.selector.forEach(sel -> {
    // this.querySelector(".fanciful-container").classList.remove(sel);
    // });
    // 
    // this.selector = new Array<>(
    // "cv-" + this.constantVisible,
    // "rv-" + this.randomVisible,
    // "csv-" + this.constantSignVisible,
    // "rsv-" + this.randomSignVisible,
    // "u-" + this.uniformCheck.checked
    // );
    // 
    // this.selector.forEach(sel -> {
    // this.querySelector(".fanciful-container").classList.add(sel);
    // });
  }

  // private String decodeSign(Z4Sign sign) {
  // if (sign == Z4Sign.POSITIVE) {
  // return "&plus;";
  // } else if (sign == Z4Sign.NEGATIVE) {
  // return "&minus;";
  // } else if (sign == Z4Sign.RANDOM) {
  // return "&plusmn;";
  // } else {
  // return "&plusmn;<sup>&UpArrowDownArrow;</sup>";
  // }
  // }
  // private String decodeRandom(Z4SignedRandomValue value) {
  // if (value.isClassic()) {
  // return "rnd";
  // } else if (value.isBezier()) {
  // return "rnd&#8767;<sup>" + value.getLength() + "</sup>";
  // } else if (value.isPolyline()) {
  // return "rnd&#8896;<sup>" + value.getLength() + "</sup>";
  // } else if (value.isStepped()) {
  // return "rnd&#8851;<sup>" + value.getLength() + "</sup>";
  // } else {
  // return "";
  // }
  // }
   dispose() {
  }
}
