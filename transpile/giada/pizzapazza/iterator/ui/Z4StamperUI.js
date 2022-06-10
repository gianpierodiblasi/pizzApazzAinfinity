/**
 * The component to edit a Z4Stamper
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4PointIteratorUI {

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, true).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.multiplicity.oninput = (v) => this.setMP(v, null, false);
    this.multiplicity.onchange = (v) => this.setMP(v, null, true);
    this.push.oninput = (v) => this.setMP(null, v, false);
    this.push.onchange = (v) => this.setMP(null, v, true);
    this.setValue(new Z4Stamper());
  }

   setMP(multiplicity, push, onchange) {
    if (multiplicity) {
      this.value.setMultiplicity(multiplicity);
    }
    if (push) {
      this.value.setPush(push);
    }
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
    return super.setValue(value);
  }
}
