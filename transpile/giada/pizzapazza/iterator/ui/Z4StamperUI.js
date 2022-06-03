/**
 * The component to edit a Z4Stamper
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".stamper-canvas");

   ctx = this.canvas.getContext("2d");

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".stamper-container"));

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    let config = new Object();
    config["attributeFilter"] = new Array("class");
    this.mutationObserver.observe(document.body, config);
    this.intensity.oninput = (v) => this.set(v, null, null, null, null, false);
    this.intensity.onchange = (v) => this.set(v, null, null, null, null, true);
    this.rotation.oninput = (v) => this.set(null, v, null, null, null, false);
    this.rotation.onchange = (v) => this.set(null, v, null, null, null, true);
    this.multiplicity.oninput = (v) => this.set(null, null, v, null, null, false);
    this.multiplicity.onchange = (v) => this.set(null, null, v, null, null, true);
    this.push.oninput = (v) => this.set(null, null, null, v, null, false);
    this.push.onchange = (v) => this.set(null, null, null, v, null, true);
    this.progression.oninput = (v) => this.set(null, null, null, null, v, false);
    this.progression.onchange = (v) => this.set(null, null, null, null, v, true);
    this.setValue(new Z4Stamper());
  }

   set(intensity, rotation, multiplicity, push, progression, onchange) {
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
      this.value.setPush(push);
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

   setValue(value) {
    this.value = value;
    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    this.progression.setValue(this.value.getProgression());
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
