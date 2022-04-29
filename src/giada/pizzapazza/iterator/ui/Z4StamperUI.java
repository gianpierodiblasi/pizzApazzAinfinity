package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4ComponentUI;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4StamperUI extends Z4ComponentUI<Z4Stamper, Z4StamperUI> {

  private final Z4FancifulValueUI intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY").setProportionalVisible(false).setSignsVisible(false, true, true).appendTo(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY").setProportionalVisible(false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendTo(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH").setProportionalVisible(false).setSignsVisible(false, true, true).appendTo(this.querySelector(".stamper-container"));

  private Z4Stamper stamper = new Z4Stamper();
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  public Z4StamperUI() {
    super(Z4StamperUI.UI);

    this.setValue(this.stamper);
  }

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4StamperUI
   */
  public Z4StamperUI setValue(Z4Stamper value) {
    this.stamper = value;

    this.intensity.setValue(this.stamper.getIntensity());
    this.multiplicity.setValue(this.stamper.getMultiplicity());
    this.push.setValue(this.stamper.getPush());

    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public Z4Stamper getValue() {
    return this.stamper;
  }
}
