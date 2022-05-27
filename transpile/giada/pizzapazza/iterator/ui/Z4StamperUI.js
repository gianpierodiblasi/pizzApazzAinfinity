/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".stamper-canvas");

   ctx = this.canvas.getContext("2d");

  // 
  // private final Z4FancifulValueUI intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));
  // private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));
  // private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));
  // private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));
   resizeObserver = new ResizeObserver(() => this.drawCanvas());

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    // 
    // this.intensity.oninput = (v) -> this.set(v, null, null, null, false);
    // this.intensity.onchange = (v) -> this.set(v, null, null, null, true);
    // this.rotation.oninput = (v) -> this.set(null, v, null, null, false);
    // this.rotation.onchange = (v) -> this.set(null, v, null, null, true);
    // this.multiplicity.oninput = (v) -> this.set(null, null, v, null, false);
    // this.multiplicity.onchange = (v) -> this.set(null, null, v, null, true);
    // this.push.oninput = (v) -> this.set(null, null, null, v, false);
    // this.push.onchange = (v) -> this.set(null, null, null, v, true);
    this.setValue(new Z4Stamper());
  }

   set(intensity, rotation, multiplicity, push, onchange) {
    // if ($exists(intensity)) {
    // this.value.setIntensity(intensity);
    // }
    // if ($exists(rotation)) {
    // this.value.setRotation(rotation);
    // }
    // if ($exists(multiplicity)) {
    // this.value.setMultiplicity(multiplicity);
    // }
    // if ($exists(push)) {
    // this.value.setMultiplicity(push);
    // }
    // 
    // this.drawCanvas();
    // 
    // if (onchange) {
    // this.onchange.$apply(this.value);
    // } else {
    // this.oninput.$apply(this.value);
    // }
  }

   setValue(value) {
    this.value = value;
    // this.intensity.setValue(this.value.getIntensity());
    // this.rotation.setValue(this.value.getRotation());
    // this.multiplicity.setValue(this.value.getMultiplicity());
    // this.push.setValue(this.value.getPush());
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
  }
}
