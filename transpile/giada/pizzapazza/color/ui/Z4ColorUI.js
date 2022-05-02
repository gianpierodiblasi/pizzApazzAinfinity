/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4ColorUI extends Z4AbstractComponentWithValueUI {

   color = this.querySelector(".form-control-color");

   formRangeLabel = this.querySelector(".form-range-label");

   formRange = this.querySelector(".form-range");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.querySelector(".gray").onclick = (event) => {
      this.setValue(this.value.gray());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.color.oninput = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.color.onchange = (event) => {
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.onchange(this.value);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
      this.oninput(this.value);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value = Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
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
    colorLabel.innerText = Z4MessageFactory.get(token);
    colorLabel.style.fontWeight = bold ? "700" : "400";
    colorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    super.setValue(value);
    this.color.value = this.value.getHEX().substring(0, 7);
    this.formRange.valueAsNumber = this.value.getComponents()[0];
    this.formRangeLabel.innerText = this.formRange.value;
    return this;
  }
}
