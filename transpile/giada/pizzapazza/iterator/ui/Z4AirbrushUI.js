/**
 * The component to edit a Z4Airbrush
 *
 * @author gianpiero.di.blasi
 */
class Z4AirbrushUI extends Z4PointIteratorUI {

   radius = new Z4SignedValueUI().setValueLabel("RADIUS", true, true).setRange(1, 100, false).setSignVisible(false).setCompact().appendToElement(this.querySelector(".airbrush-container-first-row"));

   speed = new Z4SignedValueUI().setValueLabel("SPEED", true, true).setRange(1, 100, false).setSignVisible(false).setCompact().appendToElement(this.querySelector(".airbrush-container-first-row"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4AirbrushUI.html");

  /**
   * Creates a Z4AirbrushUI
   */
  constructor() {
    super(Z4AirbrushUI.UI);
    this.radius.oninput = (v) => this.setRS(v, null, false);
    this.radius.onchange = (v) => this.setRS(v, null, true);
    this.speed.oninput = (v) => this.setRS(null, v, false);
    this.speed.onchange = (v) => this.setRS(null, v, true);
    this.setValue(new Z4Airbrush());
  }

   setRS(radius, speed, onchange) {
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
    this.radius.setValue(new Z4SignedValue().setValue(value.getRadius()));
    this.speed.setValue(new Z4SignedValue().setValue(value.getSpeed()));
    return super.setValue(value);
  }
}
