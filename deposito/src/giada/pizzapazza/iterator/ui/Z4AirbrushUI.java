package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Airbrush;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4SignedValueUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import static simulation.js.$Globals.$exists;

/**
 * The component to edit a Z4Airbrush
 *
 * @author gianpiero.diblasi
 */
public class Z4AirbrushUI extends Z4PointIteratorUI<Z4Airbrush> {

  /**
   * Creates a Z4AirbrushUI
   */
  public Z4AirbrushUI() {
    this.multiplicity.oninput = (v) -> this.setMRS(v, null, null, false);
    this.multiplicity.onchange = (v) -> this.setMRS(v, null, null, true);
    this.radius.oninput = (v) -> this.setMRS(null, v, null, false);
    this.radius.onchange = (v) -> this.setMRS(null, v, null, true);
    this.speed.oninput = (v) -> this.setMRS(null, null, v, false);
    this.speed.onchange = (v) -> this.setMRS(null, null, v, true);

    this.setValue(new Z4Airbrush());
  }

  private void setMRS(Z4FancifulValue multiplicity, Z4SignedValue radius, Z4SignedValue speed, boolean onchange) {
    if ($exists(multiplicity)) {
      this.value.setMultiplicity(multiplicity);
    }
    if ($exists(radius)) {
      this.value.setRadius(radius.getValue());
    }
    if ($exists(speed)) {
      this.value.setSpeed(speed.getValue());
    }

    this.drawCanvas();

    if (onchange) {
      this.onchange.$apply(this.value);
    } else {
      this.oninput.$apply(this.value);
    }
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Airbrush value) {
    this.multiplicity.setValue(value.getMultiplicity());
    this.radius.setValue(new Z4SignedValue().setValue(value.getRadius()));
    this.speed.setValue(new Z4SignedValue().setValue(value.getSpeed()));

    return super.setValue(value);
  }
}
