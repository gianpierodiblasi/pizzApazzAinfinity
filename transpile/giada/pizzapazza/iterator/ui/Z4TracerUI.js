/**
 * The component to edit a Z4Tracer
 *
 * @author gianpiero.di.blasi
 */
class Z4TracerUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".tracer-canvas");

   ctx = this.canvas.getContext("2d");

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).insertBeforeElement(this.querySelector(".tracer-container-second-row"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

   attack = new Z4FancifulValueUI().setValueLabel("ATTACK", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

   sustain = new Z4FancifulValueUI().setValueLabel("SUSTAIN", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

   release = new Z4FancifulValueUI().setValueLabel("RELEASE", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

   endlessSustainCheck = this.querySelector(".tracer-endless-sustain-check");

   step = new Z4FancifulValueUI().setValueLabel("STEP", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-third-row"));

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4TracerUI.html");

  /**
   * Creates a Z4TracerUI
   */
  constructor() {
    super(Z4TracerUI.UI);
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
    this.step.oninput = (v) => this.set(null, null, null, null, v, false);
    this.step.onchange = (v) => this.set(null, null, null, null, v, true);
    this.attack.oninput = (v) => this.setEnvelope(false);
    this.attack.onchange = (v) => this.setEnvelope(true);
    this.sustain.oninput = (v) => this.setEnvelope(false);
    this.sustain.onchange = (v) => this.setEnvelope(true);
    this.release.oninput = (v) => this.setEnvelope(false);
    this.release.onchange = (v) => this.setEnvelope(true);
    this.endlessSustainCheck.id = this.getUniqueID();
    this.querySelector(".tracer-endless-sustain-label").setAttribute("for", this.endlessSustainCheck.id);
    this.endlessSustainCheck.onchange = (event) => {
      this.sustain.setEnabled(!this.endlessSustainCheck.checked);
      this.release.setEnabled(!this.endlessSustainCheck.checked);
      this.value.setEnvelope(this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustainCheck.checked);
      this.drawCanvas();
      this.onchange(this.value);
      return null;
    };
    this.sustain.querySelector(".fanciful-value-label").parentElement.insertBefore(this.querySelector(".tracer-endless-sustain-switch"), this.sustain.querySelector(".fanciful-value-container"));
    this.setValue(new Z4Tracer());
  }

   set(intensity, rotation, multiplicity, push, step, onchange) {
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
    if (step) {
      this.value.setStep(step);
    }
    this.drawCanvas();
    if (onchange) {
      this.onchange(this.value);
    } else {
      this.oninput(this.value);
    }
  }

   setEnvelope(onchange) {
    this.value.setEnvelope(this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustainCheck.checked);
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
    this.step.setValue(this.value.getStep());
    this.attack.setValue(this.value.getAttack());
    this.sustain.setValue(this.value.getSustain());
    this.release.setValue(this.value.getRelease());
    this.endlessSustainCheck.checked = this.value.isEndlessSustain();
    this.sustain.setEnabled(!this.endlessSustainCheck.checked);
    this.release.setEnabled(!this.endlessSustainCheck.checked);
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
