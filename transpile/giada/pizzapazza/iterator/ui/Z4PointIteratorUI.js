/**
 * The abstract component to edit a Z4PointIterator
 *
 * @author gianpiero.di.blasi
 * @param <S>
 */
class Z4PointIteratorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".point-iterator-canvas");

   ctx = this.canvas.getContext("2d");

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".point-iterator-container"));

   progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".point-iterator-container"));

   arrowModule = this.querySelector(".point-iterator-arrow-module-range");

   arrowPainter = new Z4ArrowPainter();

   painter = null;

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  /**
   * Creates a Z4PointIteratorUI
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
    this.rotation.oninput = (v) => this.setRP(v, null, false);
    this.rotation.onchange = (v) => this.setRP(v, null, true);
    this.progression.oninput = (v) => this.setRP(null, v, false);
    this.progression.onchange = (v) => this.setRP(null, v, true);
    this.arrowModule.oninput = (event) => this.setModule();
    this.arrowModule.onchange = (event) => this.setModule();
  }

   setRP(rotation, progression, onchange) {
    if (rotation) {
      this.value.setRotation(rotation);
    }
    if (progression) {
      this.value.setProgression(progression);
    }
    this.drawCanvas();
    if (onchange) {
      this.onchange(this.value);
    } else {
      this.oninput(this.value);
    }
  }

   setModule() {
    this.arrowPainter.setModule(this.arrowModule.valueAsNumber);
    this.drawCanvas();
    return null;
  }

  /**
   * Sets the Z4Painter to draw the demo
   *
   * @param <T>
   * @param painter The Z4Painter, it can be null
   * @return This Z4PointIteratorUI
   */
   setPainter(painter) {
    this.painter = painter;
    this.querySelector(".point-iterator-arrow-module-container").style.display = this.painter ? "none" : "flex";
    this.drawCanvas();
    return this;
  }

   setValue(value) {
    this.value = value;
    this.rotation.setValue(this.value.getRotation());
    this.progression.setValue(this.value.getProgression());
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
      this.value.drawDemo(offscreenCtx, this.painter ? this.painter : this.arrowPainter, null, this.canvas.clientWidth, this.canvas.clientHeight);
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
