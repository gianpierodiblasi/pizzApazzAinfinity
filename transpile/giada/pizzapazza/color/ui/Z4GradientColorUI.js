/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4AbstractComponentWithValueUI {

   startColorUI = new Z4ColorUI().setColorLabel("START", false, true).setOpacityBadgeVisible(false).appendToElement(this.querySelector(".gradient-color-start-container"));

   canvas = this.querySelector(".gradient-color-canvas");

   stopColorUI = new Z4ColorUI().setColorLabel("STOP", false, true).setOpacityBadgeVisible(false).appendToElement(this.querySelector(".gradient-color-stop-container"));

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   mirroredCheck = this.querySelector(".gradient-color-mirrored-check");

   rippleLabel = this.querySelector(".gradient-color-ripple-label");

   rippleRange = this.querySelector(".gradient-color-ripple-range");

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   horizontal = true;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    this.querySelector(".gradient-color-inverted").onclick = (event) => {
      this.setValue(this.value.inverted());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".gradient-color-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.mirroredCheck.id = this.getUniqueID();
    this.querySelector(".gradient-color-mirrored-label").setAttribute("for", this.mirroredCheck.id);
    this.mirroredCheck.onchange = (event) => {
      this.onchange(this.value.setMirrored(this.mirroredCheck.checked));
      this.drawCanvas();
      return null;
    };
    this.rippleRange.oninput = (event) => {
      this.rippleLabel.innerText = this.rippleRange.value;
      this.oninput(this.value.setRipple(this.rippleRange.valueAsNumber));
      this.drawCanvas();
      return null;
    };
    this.rippleRange.onchange = (event) => {
      this.rippleLabel.innerText = this.rippleRange.value;
      this.onchange(this.value.setRipple(this.rippleRange.valueAsNumber));
      this.drawCanvas();
      return null;
    };
    this.startColorUI.oninput = (z4Color) => {
      this.oninput(this.value.setStartColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.startColorUI.onchange = (z4Color) => {
      this.onchange(this.value.setStartColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.stopColorUI.oninput = (z4Color) => {
      this.oninput(this.value.setStopColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.stopColorUI.onchange = (z4Color) => {
      this.onchange(this.value.setStopColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.setValue(new Z4GradientColor());
  }

   setVertical() {
    this.horizontal = false;
    let gradientColorContainer = this.querySelector(".gradient-color-container");
    gradientColorContainer.parentElement.style.height = "100%";
    gradientColorContainer.style.flexDirection = "column";
    gradientColorContainer.style.alignItems = "start";
    gradientColorContainer.style.height = "calc(100% - 24px)";
    this.startColorUI.querySelector(".input-group").classList.add("dropend");
    this.stopColorUI.querySelector(".input-group").classList.add("dropend");
    this.querySelector(".gradient-color-input-group-canvas").style.flexDirection = "column";
    this.querySelector(".gradient-color-input-group-canvas").classList.add("dropend");
    this.canvas.removeAttribute("height");
    this.canvas.style.removeProperty("height");
    this.canvas.width = 71.8;
    this.canvas.style.width = "71.8px";
    this.canvas.style.borderTopRightRadius = "0.25rem";
    this.canvas.style.borderBottomLeftRadius = "0";
    let button = this.querySelector(".gradient-color-canvas-button");
    button.style.width = "71.8px";
    button.style.marginLeft = "0.25px";
    button.style.borderTopRightRadius = "0";
    button.style.borderBottomLeftRadius = "0.25rem";
    return this;
  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4GradientColorUI
   */
   setGradientColorLabel(token, bold, italic) {
    let gradientColorLabel = this.querySelector(".gradient-color-label");
    gradientColorLabel.setAttribute("data-token-lang-inner_text", token);
    gradientColorLabel.innerHTML = Z4MessageFactory.get(token);
    gradientColorLabel.style.fontWeight = bold ? "700" : "400";
    gradientColorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.mirroredCheck.checked = this.value.isMirrored();
    this.rippleRange.valueAsNumber = this.value.getRipple();
    this.rippleLabel.innerText = this.rippleRange.value;
    this.startColorUI.setValue(this.value.getStartColor());
    this.stopColorUI.setValue(this.value.getStopColor());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      if (this.horizontal) {
        for (let x = 0; x < this.canvas.clientWidth; x++) {
          offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / this.canvas.clientWidth, true, true).getHEX();
          offscreenCtx.fillRect(x, 0, 1, this.canvas.clientHeight);
        }
      } else {
        for (let y = 0; y < this.canvas.clientHeight; y++) {
          offscreenCtx.fillStyle = this.value.getZ4ColorAt(y / this.canvas.clientHeight, true, true).getHEX();
          offscreenCtx.fillRect(0, y, this.canvas.clientWidth, 1);
        }
      }
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.fillStyle = this.chessboard;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
