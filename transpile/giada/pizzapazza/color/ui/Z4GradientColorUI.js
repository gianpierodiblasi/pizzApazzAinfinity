/* global Math, Object, OffscreenCanvas, Z4ComponentUI, Z4GradientColor, Z4ImageFactory, Z4MessageFactory */

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4ComponentUI {

   gradientColorLabel = this.querySelector(".gradient-color-label");

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   formRangeLabel = this.querySelector(".form-range-label");

   mirroredCheck = this.querySelector(".mirrored-check");

   formRange = this.querySelector(".form-range");

   gradientColor = new Z4GradientColor();

   devicePixelRatioListener = null;

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 50;

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio();
    this.gradientColorLabel.innerText = Z4MessageFactory.get("GRADIENT_COLOR");
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4GradientColorUI.WIDTH + "px";
    this.canvas.style.height = Z4GradientColorUI.HEIGHT + "px";
    // this.gradientColor.addOrUpdateColor(0.75,128<<24|255<<16);
    let sliders = this.querySelector(".sliders");
    this.gradientColor.getComponents().forEach((z4StopColor, index, array) => {
      let position = z4StopColor.getPosition();
      let left = Z4GradientColorUI.WIDTH * position - (index * 16);
      let input = document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors");
      input.setAttribute("value", "" + position);
      input.setAttribute("style", "position:relative;left:" + left + "px");
      sliders.appendChild(input);
    });
    this.querySelector(".ripple-color-label").innerText = Z4MessageFactory.get("RIPPLE");
    this.querySelector(".mirrored-label").innerText = Z4MessageFactory.get("MIRRORED");
    this.mirroredCheck.onchange = (event) => {
      this.gradientColor.setMirrored(this.mirroredCheck.checked);
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
  // 
  /**
   * Returns the Z4GradientColor
   *
   * @return The Z4GradientColor
   */
   getZ4GradientColor() {
    return this.gradientColor;
  }

   initDevicePixelRatio() {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        this.drawCanvas();
        this.addDevicePixelRatioListener();
      };
      this.addDevicePixelRatioListener();
    }
  }

   addDevicePixelRatioListener() {
    let options = new Object();
    options["once"] = true;
    window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").addEventListener("change", this.devicePixelRatioListener, options);
  }

   drawCanvas() {
    this.canvas.width = Math.floor(Z4GradientColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4GradientColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4GradientColorUI.WIDTH; x++) {
      offscreenCtx.fillStyle = this.gradientColor.getZ4ColorAt(x / Z4GradientColorUI.WIDTH, true, true).getHEX();
      offscreenCtx.fillRect(x, 0, 1, Z4GradientColorUI.HEIGHT);
    }
    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
