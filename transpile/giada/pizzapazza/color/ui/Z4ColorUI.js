/* global Z4Color, Z4ColorUI, Z4ComponentUI, Z4MessageFactory */

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4ColorUI extends Z4ComponentUI {

   colorLabel = this.querySelector(".color-label");

   color = this.querySelector(".form-control-color");

   formRangeLabel = this.querySelector(".form-range-label");

   formRange = this.querySelector(".form-range");

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.querySelector(".gray").onclick = (event) => {
      this.setZ4Color(this.getZ4Color().gray());
      this.onchange(this.getZ4Color());
      return null;
    };
    this.querySelector(".negative").onclick = (event) => {
      this.setZ4Color(this.getZ4Color().negative());
      this.onchange(this.getZ4Color());
      return null;
    };
    this.color.oninput = (event) => {
      this.oninput(this.getZ4Color());
      return null;
    };
    this.color.onchange = (event) => {
      this.onchange(this.getZ4Color());
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.oninput(this.getZ4Color());
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.onchange(this.getZ4Color());
      return null;
    };
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4ColorUI
   */
   setColorLabel(token) {
    this.colorLabel.setAttribute("data-token-lang", token);
    this.colorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the Z4Color
   *
   * @param color The Z4Color
   * @return This Z4ColorUI
   */
   setZ4Color(color) {
    this.color.value = color.getHEX().substring(0, 7);
    this.formRange.valueAsNumber = color.getComponents()[0];
    this.formRangeLabel.innerText = this.formRange.value;
    return this;
  }

  /**
   * Returns the Z4Color
   *
   * @return The Z4Color
   */
   getZ4Color() {
    return Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
  }
}
