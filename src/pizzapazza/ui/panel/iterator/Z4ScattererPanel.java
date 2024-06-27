package pizzapazza.ui.panel.iterator;

import javascript.awt.GBC;
import pizzapazza.iterator.Z4Scatterer;
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
import pizzapazza.util.Z4Translations;

/**
 * The panel to edit a Z4Scatterer
 *
 * @author gianpiero.diblasi
 */
public class Z4ScattererPanel extends Z4PointIteratorPanel<Z4Scatterer> {

  private final Z4FancifulValuePanel multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel scattering = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  public Z4ScattererPanel() {
    super();
    this.cssAddClass("z4scattererpanel");

    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event -> this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0));

    this.scattering.setSignsVisible(false);
    this.scattering.setLabel(Z4Translations.SCATTERING);
    this.scattering.cssAddClass("z4abstractvaluepanel-titled");
    this.scattering.addChangeListener(event -> this.onIteratorChange(this.scattering.getValueIsAdjusting()));
    this.add(this.scattering, new GBC(0, 1).i(1, 0, 0, 0));

    this.add(this.rotation, new GBC(1, 0).h(2).a(GBC.NORTH).i(0, 1, 0, 0));

    this.setValue(new Z4Scatterer(
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4Rotation(0, new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), Z4RotationBehavior.FIXED, false))
    );
  }

  @Override
  protected void onIteratorChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;

    this.value = new Z4Scatterer(this.multiplicity.getValue(), this.scattering.getValue(), this.rotation.getValue());
    this.onchange();
  }

  @Override
  public void setValue(Z4Scatterer value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.scattering.setValue(value.getScattering());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.scattering.setEnabled(b);
  }
}
