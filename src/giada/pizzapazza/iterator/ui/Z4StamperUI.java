package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import static simulation.js.$Globals.$exists;

/**
 * The component to edit a Z4Stamper
 *
 * @author gianpiero.di.blasi
 */
public class Z4StamperUI extends Z4PointIteratorUI<Z4Stamper> {

  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  public Z4StamperUI() {
    super(Z4StamperUI.UI);

    this.multiplicity.oninput = (v) -> this.setMP(v, null, false);
    this.multiplicity.onchange = (v) -> this.setMP(v, null, true);
    this.push.oninput = (v) -> this.setMP(null, v, false);
    this.push.onchange = (v) -> this.setMP(null, v, true);

    this.setValue(new Z4Stamper());
  }

  private void setMP(Z4FancifulValue multiplicity, Z4FancifulValue push, boolean onchange) {
    if ($exists(multiplicity)) {
      this.value.setMultiplicity(multiplicity);
    }
    if ($exists(push)) {
      this.value.setPush(push);
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
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Stamper value) {
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());

    return super.setValue(value);
  }
}
