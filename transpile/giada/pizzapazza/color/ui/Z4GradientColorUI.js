/* global Math, Object, OffscreenCanvas, Z4ColorUI, Z4ComponentUI, Z4GradientColor, Z4ImageFactory, Z4MessageFactory */

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

   z4ColorUI = new Z4ColorUI();

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
    let inverted = this.querySelector(".gradient-inverted");
    inverted.innerText = Z4MessageFactory.get("INVERTED");
    inverted.onclick = (event) => {
      this.setZ4GradientColor(this.gradientColor.inverted());
      this.onchange(this.gradientColor);
      return null;
    };
    let negative = this.querySelector(".gradient-negative");
    negative.innerText = Z4MessageFactory.get("NEGATIVE");
    negative.onclick = (event) => {
      this.setZ4GradientColor(this.gradientColor.negative());
      this.onchange(this.gradientColor);
      return null;
    };
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4GradientColorUI.WIDTH + "px";
    this.canvas.style.height = Z4GradientColorUI.HEIGHT + "px";
    this.querySelector(".ripple-color-label").innerText = Z4MessageFactory.get("RIPPLE");
    this.querySelector(".mirrored-label").innerText = Z4MessageFactory.get("MIRRORED");
    this.mirroredCheck.onchange = (event) => {
      this.gradientColor.setMirrored(this.mirroredCheck.checked);
      this.configureSliders();
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
    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.setZ4GradientColor(this.gradientColor);
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
   * Returns the Z4GradientColor
   *
   * @return The Z4GradientColor
   */
   getZ4GradientColor() {
    return this.gradientColor;
  }

  /**
   * Sets the Z4GradientColor
   *
   * @param color The Z4GradientColor
   * @return This Z4GradientColorUI
   */
   setZ4GradientColor(color) {
    this.gradientColor = color;
    this.mirroredCheck.checked = this.gradientColor.isMirrored();
    this.formRange.valueAsNumber = this.gradientColor.getRipple();
    this.configureSliders();
    this.drawCanvas();
    return this;
  }

   configureSliders() {
    let width = Z4GradientColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
    let sliders = this.querySelector(".sliders");
    sliders.innerHTML = "";
    this.gradientColor.getComponents().forEach((z4StopColor, index, array) => {
      let position = z4StopColor.getPosition();
      let left = width * position - (index * 16);
      let input = document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors");
      input.setAttribute("value", "" + position);
      input.setAttribute("style", "position:relative;left:" + left + "px");
      input.onchange = (event) => {
        this.z4ColorUI.setZ4Color(this.gradientColor.getComponents().find((color, idx, arr) => index === idx));
        return null;
      };
      if (index === 0) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setZ4Color(z4StopColor);
      }
      sliders.appendChild(input);
    });
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
