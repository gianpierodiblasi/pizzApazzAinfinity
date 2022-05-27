/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4ColorUI extends Z4AbstractComponentWithValueUI {

   color = this.querySelector(".color-input");

   opacityLabel = this.querySelector(".color-opacity-range-label");

   opacityRange = this.querySelector(".color-opacity-range");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.querySelector(".color-gray").onclick = (event) => {
      this.setValue(this.value.gray());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".color-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.color.oninput = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.color.onchange = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.onchange(this.value);
      return null;
    };
    this.opacityRange.oninput = (event) => {
      this.opacityLabel.innerText = this.opacityRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.opacityRange.onchange = (event) => {
      this.opacityLabel.innerText = this.opacityRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.opacityRange.valueAsNumber);
      this.onchange(this.value);
      return null;
    };
    this.setValue(new Z4Color(255, 0, 0, 0));
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4ColorUI
   */
   setColorLabel(token, bold, italic) {
    let colorLabel = this.querySelector(".color-label");
    colorLabel.setAttribute("data-token-lang-inner_text", token);
    colorLabel.innerHTML = Z4MessageFactory.get(token);
    colorLabel.style.fontWeight = bold ? "700" : "400";
    colorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.color.value = this.value.getHEX().substring(0, 7);
    this.opacityRange.valueAsNumber = this.value.getComponents()[0];
    this.opacityLabel.innerText = this.opacityRange.value;
    return this;
  }

   dispose() {
  }
}
