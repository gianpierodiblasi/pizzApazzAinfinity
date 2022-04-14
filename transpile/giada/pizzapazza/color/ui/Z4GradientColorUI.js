/* global OffscreenCanvas, Z4ComponentUI, Z4GradientColor, Z4MessageFactory */

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4ComponentUI {

   gradientColorLabel = this.querySelector(".gradient-color-label");

   canvas = this.querySelector(".canvas");

   formRangeLabel = this.querySelector(".form-range-label");

   formCheckInput = this.querySelector(".form-check-input");

   formRange = this.querySelector(".form-range");

   gradientColor = new Z4GradientColor();

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.html.style.textAlign = "center";
    this.gradientColorLabel.innerText = Z4MessageFactory.get("GRADIENT_COLOR");
    this.canvas.style.border = "1px dashed gray";
    this.querySelector(".ripple-color-label").innerText = Z4MessageFactory.get("RIPPLE");
    this.querySelector(".mirrored-label").innerText = Z4MessageFactory.get("MIRRORED");
    this.formCheckInput.onchange = (event) => {
      this.gradientColor.setMirrored(this.formCheckInput.checked);
      this.drawCanvas();
      this.onchange(this.gradientColor);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.gradientColor.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.onchange(this.gradientColor);
      return null;
    };
    this.drawCanvas();
  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @return This Z4GradientColorUI
   */
   setGradientColorLabel(token) {
    this.gradientColorLabel.setAttribute("data-token-lang", token);
    this.gradientColorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the Z4Color
   *
   * @param color The Z4Color
   * @return This Z4GradientColorUI
   */
  // public Z4GradientColorUI setZ4Color(Z4Color color) {
  // this.color.value = color.getHEX().substring(0, 7);
  // this.formRange.valueAsNumber = color.getComponents().$get(0);
  // this.formRangeLabel.innerText = this.formRange.value;
  // return this;
  // }
  /**
   * Returns the Z4GradientColor
   *
   * @return The Z4GradientColor
   */
   getZ4GradientColor() {
    return this.gradientColor;
  }

   drawCanvas() {
    let offscreen = new OffscreenCanvas(this.canvas.width, this.canvas.height);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < this.canvas.width; x++) {
      offscreenCtx.fillStyle = this.gradientColor.getZ4ColorAt(x / this.canvas.width, true, true).getHEX();
      offscreenCtx.fillRect(x, 0, 1, this.canvas.height);
    }
    let ctx = this.canvas.getContext("2d");
    ctx.drawImage(offscreen, 0, 0);
  }
}
