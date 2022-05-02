package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4StamperUI extends Z4AbstractComponentWithValueUI<Z4Stamper> {

  private final Z4FancifulValueUI intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", false, false).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));
  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", false, false).appendToElement(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", false, false).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", false, false).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  public Z4StamperUI() {
    super(Z4StamperUI.UI);

    this.setValue(new Z4Stamper());
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Stamper value) {
    this.value = value;

    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());

    return (T) this;
  }

}
