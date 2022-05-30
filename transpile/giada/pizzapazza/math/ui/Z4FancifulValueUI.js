/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   uniformCheck = this.querySelector(".fanciful-value-uniform-check");

   constantUI = new Z4SignedValueUI().setCompact().setValueLabel("CONSTANT", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

   randomUI = new Z4SignedRandomValueUI().setCompact().setValueLabel("RANDOM", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

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
    let hr = document.createElement("li");
    hr.className = "dropdown-divider";
    let li = document.createElement("li");
    li.appendChild(hr);
    this.querySelector(".signed-value-sign-dropdown-menu").appendChild(li);
    li = document.createElement("li");
    li.className = "mx-1";
    li.appendChild(this.querySelector(".fanciful-value-uniform-form-switch"));
    this.querySelector(".signed-value-sign-dropdown-menu").appendChild(li);
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
    this.constantUI.setValueLabel(visible ? "CONSTANT" : "CONSTANT_SHORT", false, true);
    this.randomUI.setSignVisible(!this.uniformCheck.checked && visible);
    this.randomUI.setValueLabel(!this.uniformCheck.checked && visible ? "RANDOM" : "RANDOM_SHORT", false, true);
    return this;
  }

  /**
   * Sets the range of the constant component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @param tenMultiplier true to use the ten multiplier for range spinner,
   * false otherwise
   * @return This Z4FancifulValueUI
   */
   setConstantRange(min, max, tenMultiplier) {
    this.constantUI.setRange(min, max, tenMultiplier);
    return this;
  }

  /**
   * Sets the range of the random component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @param tenMultiplier true to use the ten multiplier for range spinner,
   * false otherwise
   * @return This Z4FancifulValueUI
   */
   setRandomRange(min, max, tenMultiplier) {
    this.randomUI.setRange(min, max, tenMultiplier);
    return this;
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @param tenMultiplier true to use the ten multiplier for range spinner,
   * false otherwise
   * @return This Z4FancifulValueUI
   */
   setRandomLengthRange(min, max, tenMultiplier) {
    this.randomUI.setLengthRange(min, max, tenMultiplier);
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
    let valueLabel = this.querySelector(".fanciful-value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.uniformCheck.checked = this.value.isUniformSign();
    this.setSignsVisible(this.constantUI.isSignVisible());
    this.constantUI.setValue(this.value.getConstant());
    this.randomUI.setValue(this.value.getRandom());
    return this;
  }

   dispose() {
  }
}
