/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 300;

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4StamperUI.WIDTH + "px";
    this.canvas.style.height = Z4StamperUI.HEIGHT + "px";
    this.intensity.oninput = (v) => this.set(v, null, null, null, false);
    this.intensity.onchange = (v) => this.set(v, null, null, null, true);
    this.rotation.oninput = (v) => this.set(null, v, null, null, false);
    this.rotation.onchange = (v) => this.set(null, v, null, null, true);
    this.multiplicity.oninput = (v) => this.set(null, null, v, null, false);
    this.multiplicity.onchange = (v) => this.set(null, null, v, null, true);
    this.push.oninput = (v) => this.set(null, null, null, v, false);
    this.push.onchange = (v) => this.set(null, null, null, v, true);
    this.setValue(new Z4Stamper());
  }

   set(intensity, rotation, multiplicity, push, onchange) {
    if (intensity) {
      this.value.setIntensity(intensity);
    }
    if (rotation) {
      this.value.setRotation(rotation);
    }
    if (multiplicity) {
      this.value.setMultiplicity(multiplicity);
    }
    if (push) {
      this.value.setMultiplicity(push);
    }
    this.drawCanvas();
    if (onchange) {
      this.onchange(this.value);
    } else {
      this.oninput(this.value);
    }
  }

   setValue(value) {
    this.value = value;
    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    this.canvas.width = Math.floor(Z4StamperUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4StamperUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4StamperUI.WIDTH, Z4StamperUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    this.value.drawDemo(offscreenCtx, Z4StamperUI.WIDTH, Z4StamperUI.HEIGHT);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
