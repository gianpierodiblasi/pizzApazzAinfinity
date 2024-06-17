package pizzapazza.ui.panel.iterator;

import pizzapazza.iterator.Z4Stamper;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;

/**
 *
 * @author gianpiero.diblasi
 */
public class Z4StamperPanel extends Z4PointIteratorPanel<Z4Stamper> {

  private final Z4FancifulValuePanel multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  public Z4StamperPanel() {
    super();
    this.cssAddClass("z4stamperpanel");

    this.multiplicity.addChangeListener(event -> this.onIteratorChange());
    this.push.addChangeListener(event -> this.onIteratorChange());
    
    this.setValue(new Z4Stamper(
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 5),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(5, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(10, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4Rotation(0, new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(30, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), Z4RotationBehavior.FIXED, false))
    );
  }

  @Override
  protected void onIteratorChange() {
    this.value = new Z4Stamper(this.multiplicity.getValue(), this.push.getValue(), this.rotation.getValue());
    this.onchange();
  }

  @Override
  public void setValue(Z4Stamper value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);
  }
}
