/**
 * The component to edit a Z4Spirograph
 *
 * @author gianpiero.di.blasi
 */
class Z4SpirographUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".spirograph-canvas");

   ctx = this.canvas.getContext("2d");

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".spirograph-container"));

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4SpirographUI.html");

  /**
   * Creates a Z4SpirographUI
   */
  constructor() {
    super(Z4SpirographUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    let config = new Object();
    config["attributeFilter"] = new Array("class");
    this.mutationObserver.observe(document.body, config);
    this.rotation.oninput = (v) => {
      this.oninput(this.value.setRotation(v));
      this.drawCanvas();
    };
    this.rotation.onchange = (v) => {
      this.onchange(this.value.setRotation(v));
      this.drawCanvas();
    };
    this.setValue(new Z4Spirograph());
  }

   setValue(value) {
    this.value = value;
    this.rotation.setValue(this.value.getRotation());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      this.value.drawDemo(offscreenCtx, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
