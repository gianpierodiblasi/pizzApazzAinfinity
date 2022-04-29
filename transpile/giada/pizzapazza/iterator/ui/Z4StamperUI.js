/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4ComponentUI {

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY").setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendTo(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY").setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendTo(this.querySelector(".stamper-container"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH").setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendTo(this.querySelector(".stamper-container"));

   stamper = new Z4Stamper();

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.setValue(this.stamper);
  }

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4StamperUI
   */
   setValue(value) {
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
   getValue() {
    return this.stamper;
  }
}
