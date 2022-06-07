/**
 * The component to edit a Z4Tracer
 *
 * @author gianpiero.di.blasi
 */
class Z4TracerUI extends Z4PointIteratorUI {

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

   step = new Z4FancifulValueUI().setValueLabel("STEP", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

   attack = new Z4FancifulValueUI().setValueLabel("ATTACK", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

   sustain = new Z4FancifulValueUI().setValueLabel("SUSTAIN", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

   release = new Z4FancifulValueUI().setValueLabel("RELEASE", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

   endlessSustainCheck = this.querySelector(".tracer-endless-sustain-check");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4TracerUI.html");

  /**
   * Creates a Z4TracerUI
   */
  constructor() {
    super(Z4TracerUI.UI);
    this.multiplicity.oninput = (v) => this.setMPS(v, null, null, false);
    this.multiplicity.onchange = (v) => this.setMPS(v, null, null, true);
    this.push.oninput = (v) => this.setMPS(null, v, null, false);
    this.push.onchange = (v) => this.setMPS(null, v, null, true);
    this.step.oninput = (v) => this.setMPS(null, null, v, false);
    this.step.onchange = (v) => this.setMPS(null, null, v, true);
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

   setMPS(multiplicity, push, step, onchange) {
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
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
    this.step.setValue(value.getStep());
    this.attack.setValue(value.getAttack());
    this.sustain.setValue(value.getSustain());
    this.release.setValue(value.getRelease());
    this.endlessSustainCheck.checked = value.isEndlessSustain();
    this.sustain.setEnabled(!this.endlessSustainCheck.checked);
    this.release.setEnabled(!this.endlessSustainCheck.checked);
    return super.setValue(value);
  }
}
