package pizzapazza.ui.panel.iterator;

import javascript.awt.GBC;
import javascript.swing.JSLabel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.iterator.Z4Airbrush;
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
import pizzapazza.util.Z4UI;

/**
 * The panel to edit a Z4Airbrush
 *
 * @author gianpiero.diblasi
 */
public class Z4AirbrushPanel extends Z4PointIteratorPanel<Z4Airbrush> {

  private final Z4FancifulValuePanel multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final JSSpinner radiusSpinner = new JSSpinner();
  private final JSSlider radiusSlider = new JSSlider();
  private final JSSlider speed = new JSSlider();
  private final JSLabel speedLabel = new JSLabel();

  /**
   * Creates the object
   */
  public Z4AirbrushPanel() {
    super();
    this.cssAddClass("z4airbrushpanel");

    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event -> this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0).h(3).i(0, 0, 0, 1));

    Z4UI.addLabel(this, Z4Translations.RADIUS, new GBC(1, 0).a(GBC.WEST));

    this.radiusSpinner.cssAddClass("jsspinner_w_4rem");
    this.radiusSpinner.setModel(new SpinnerNumberModel(100, 1, 500, 1));
    this.radiusSpinner.addChangeListener(event -> {
      this.radiusSlider.setValue((int) this.radiusSpinner.getValue());
      this.onIteratorChange(this.radiusSpinner.getValueIsAdjusting());
    });
    this.add(this.radiusSpinner, new GBC(2, 0).a(GBC.EAST));

    this.radiusSlider.setMinimum(1);
    this.radiusSlider.setMaximum(500);
    this.radiusSlider.addChangeListener(event -> {
      this.radiusSpinner.setValue(this.radiusSlider.getValue());
      this.onIteratorChange(this.radiusSlider.getValueIsAdjusting());
    });
    this.add(this.radiusSlider, new GBC(1, 1).w(2).wx(3).f(GBC.HORIZONTAL));

    Z4UI.addLabel(this, Z4Translations.SPEED + ":", new GBC(3, 0).a(GBC.EAST).wx(2));

    this.speedLabel.getStyle().minWidth = "1.5rem";
    this.speedLabel.getStyle().textAlign = "right";
    this.add(this.speedLabel, new GBC(4, 0));

    this.speed.setMinimum(1);
    this.speed.setMaximum(10);
    this.speed.addChangeListener(event -> this.onIteratorChange(this.speed.getValueIsAdjusting()));
    this.add(this.speed, new GBC(3, 1).w(2).f(GBC.HORIZONTAL));

    this.add(this.rotation, new GBC(1, 2).w(4).wy(1).a(GBC.SOUTH));

    this.setValue(new Z4Airbrush(
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            100,
            5,
            new Z4Rotation(0, new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), Z4RotationBehavior.FIXED, false))
    );
  }

  @Override
  protected void onIteratorChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.speedLabel.setText("" + this.speed.getValue());

    this.value = new Z4Airbrush(this.multiplicity.getValue(), this.radiusSlider.getValue(), this.speed.getValue(), this.rotation.getValue());
    this.onchange();
  }

  @Override
  public void setValue(Z4Airbrush value) {
    super.setValue(value);

    this.multiplicity.setValue(value.getMultiplicity());

    this.radiusSpinner.setValue(value.getRadius());
    this.radiusSlider.setValue(value.getRadius());
    this.speed.setValue(value.getSpeed());
    this.speedLabel.setText("" + value.getSpeed());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    this.multiplicity.setEnabled(b);
    this.radiusSpinner.setEnabled(b);
    this.radiusSlider.setEnabled(b);
    this.speed.setEnabled(b);
  }
}
