/**
 * The component to edit a Z4Airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4AirbrushUI extends Z4PointIteratorUI {

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 100, true).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".airbrush-container-first-row"));

   radius = new Z4SignedValueUI().setValueLabel("RADIUS", true, true).setRange(1, 100, true).setSignVisible(false).setCompact().appendToElement(this.querySelector(".airbrush-container-first-row"));

   speed = new Z4SignedValueUI().setValueLabel("SPEED", true, true).setRange(1, 10, true).setSignVisible(false).setCompact().appendToElement(this.querySelector(".airbrush-container-first-row"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4AirbrushUI.html");

  /**
   * Creates a Z4AirbrushUI
   */
  constructor() {
    super(Z4AirbrushUI.UI);
    this.multiplicity.oninput = (v) => this.setMRS(v, null, null, false);
    this.multiplicity.onchange = (v) => this.setMRS(v, null, null, true);
    this.radius.oninput = (v) => this.setMRS(null, v, null, false);
    this.radius.onchange = (v) => this.setMRS(null, v, null, true);
    this.speed.oninput = (v) => this.setMRS(null, null, v, false);
    this.speed.onchange = (v) => this.setMRS(null, null, v, true);
    this.setValue(new Z4Airbrush());
  }

   setMRS(multiplicity, radius, speed, onchange) {
    if (multiplicity) {
      this.value.setMultiplicity(multiplicity);
    }
    if (radius) {
      this.value.setRadius(radius.getValue());
    }
    if (speed) {
      this.value.setSpeed(speed.getValue());
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
    this.radius.setValue(new Z4SignedValue().setValue(value.getRadius()));
    this.speed.setValue(new Z4SignedValue().setValue(value.getSpeed()));
    return super.setValue(value);
  }
}
