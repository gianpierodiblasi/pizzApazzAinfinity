package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Airbrush;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.ui.Z4SignedValueUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import static simulation.js.$Globals.$exists;

/**
 * The component to edit a Z4Airbrush
 *
 * @author gianpiero.di.blasi
 */
public class Z4AirbrushUI extends Z4PointIteratorUI<Z4Airbrush> {
  
  private final Z4SignedValueUI radius = new Z4SignedValueUI().setValueLabel("RADIUS", true, true).setRange(1, 100, false).setSignVisible(false).setCompact().appendToElement(this.querySelector(".airbrush-container-first-row"));
  private final Z4SignedValueUI speed = new Z4SignedValueUI().setValueLabel("SPEED", true, true).setRange(1, 100, false).setSignVisible(false).setCompact().appendToElement(this.querySelector(".airbrush-container-first-row"));

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4AirbrushUI.html");

  /**
   * Creates a Z4AirbrushUI
   */
  public Z4AirbrushUI() {
    super(Z4AirbrushUI.UI);
    
    this.radius.oninput = (v) -> this.setRS(v, null, false);
    this.radius.onchange = (v) -> this.setRS(v, null, true);
    this.speed.oninput = (v) -> this.setRS(null, v, false);
    this.speed.onchange = (v) -> this.setRS(null, v, true);
    
    this.setValue(new Z4Airbrush());
  }
  
  private void setRS(Z4SignedValue radius, Z4SignedValue speed, boolean onchange) {
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
    this.radius.setValue(new Z4SignedValue().setValue(value.getRadius()));
    this.speed.setValue(new Z4SignedValue().setValue(value.getSpeed()));
    
    return super.setValue(value);
  }
}
