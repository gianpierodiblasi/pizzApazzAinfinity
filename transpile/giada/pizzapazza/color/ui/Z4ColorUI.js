/* global Z4Color, Z4ComponentUI, Z4MessageFactory */

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4ColorUI extends Z4ComponentUI {

   colorLabel = this.querySelector(".color-label");

   color = this.querySelector(".form-control");

   formRange = this.querySelector(".form-range");

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4ColorUI.UI);
    this.colorLabel.innerText = Z4MessageFactory.get("COLOR");
    this.querySelector(".opacity-color-label").innerText = Z4MessageFactory.get("OPACITY");
    this.color.onchange = (event) => {
      this.onchange(this.getZ4Color());
      return null;
    };
    let formRangeLabel = this.querySelector(".form-range-label");
    this.formRange.oninput = (event) => {
      formRangeLabel.innerText = this.formRange.value;
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
   * Returns the Z4Color
   *
   * @return The Z4Color
   */
   getZ4Color() {
    return Z4Color.fromHEX(this.color.value, this.formRange.valueAsNumber);
  }
}
