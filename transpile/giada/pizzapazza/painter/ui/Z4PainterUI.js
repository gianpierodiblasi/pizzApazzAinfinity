/**
 * The abstract component to edit a Z4Painter
 *
 * @author gianpiero.di.blasi
 * @param <S>
 */
class Z4PainterUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".painter-canvas");

   ctx = this.canvas.getContext("2d");

   pointIterator = new Z4Stamper();

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  /**
   * Creates a Z4PainterUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    super(ui);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    let config = new Object();
    config["attributeFilter"] = new Array("class");
    this.mutationObserver.observe(document.body, config);
  }

  /**
   * Sets the Z4PointIterator to draw the demo
   *
   * @param <T>
   * @param pointIterator The Z4PointIterator
   * @return This Z4PainterUI
   */
   setPointIterator(pointIterator) {
    this.pointIterator = pointIterator;
    this.drawCanvas();
    return this;
  }

  /**
   * Draws the demo canvas
   */
   drawCanvas() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      this.pointIterator.drawDemo(offscreenCtx, this.value, null, this.canvas.clientWidth, this.canvas.clientHeight);
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
