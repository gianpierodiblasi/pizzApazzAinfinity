/**
 * The panel to edit a Z4Airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4AirbrushPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   radiusSpinner = new JSSpinner();

   radiusSlider = new JSSlider();

   speed = new JSSlider();

   speedLabel = new JSLabel();

   gaussianCorrectionSpinner = new JSSpinner();

   gaussianCorrectionSlider = new JSSlider();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4airbrushpanel");
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0).h(6).i(0, 0, 0, 1));
    Z4UI.addLabel(this, Z4Translations.RADIUS, new GBC(1, 0).a(GBC.WEST));
    this.radiusSpinner.cssAddClass("jsspinner_w_4rem");
    this.radiusSpinner.setModel(new SpinnerNumberModel(100, 1, 500, 1));
    this.radiusSpinner.addChangeListener(event => {
      this.radiusSlider.setValue(this.radiusSpinner.getValue());
      this.onIteratorChange(this.radiusSpinner.getValueIsAdjusting());
    });
    this.add(this.radiusSpinner, new GBC(2, 0).a(GBC.EAST));
    this.radiusSlider.setMinimum(1);
    this.radiusSlider.setMaximum(500);
    this.radiusSlider.getStyle().minWidth = "18rem";
    this.radiusSlider.addChangeListener(event => {
      this.radiusSpinner.setValue(this.radiusSlider.getValue());
      this.onIteratorChange(this.radiusSlider.getValueIsAdjusting());
    });
    this.add(this.radiusSlider, new GBC(1, 1).w(2).f(GBC.HORIZONTAL));
    Z4UI.addLabel(this, Z4Translations.GAUSSIAN_CORRECTION, new GBC(1, 2).a(GBC.WEST));
    this.gaussianCorrectionSpinner.cssAddClass("jsspinner_w_4rem");
    this.gaussianCorrectionSpinner.setModel(new SpinnerNumberModel(10, 1, 100, 1));
    this.gaussianCorrectionSpinner.addChangeListener(event => {
      this.gaussianCorrectionSlider.setValue(this.gaussianCorrectionSpinner.getValue());
      this.onIteratorChange(this.gaussianCorrectionSpinner.getValueIsAdjusting());
    });
    this.add(this.gaussianCorrectionSpinner, new GBC(2, 2).a(GBC.EAST));
    this.gaussianCorrectionSlider.setMinimum(1);
    this.gaussianCorrectionSlider.setMaximum(100);
    this.gaussianCorrectionSlider.addChangeListener(event => {
      this.gaussianCorrectionSpinner.setValue(this.gaussianCorrectionSlider.getValue());
      this.onIteratorChange(this.gaussianCorrectionSlider.getValueIsAdjusting());
    });
    this.add(this.gaussianCorrectionSlider, new GBC(1, 3).w(2).f(GBC.HORIZONTAL));
    Z4UI.addLabel(this, Z4Translations.SPEED, new GBC(1, 4).wx(1).a(GBC.WEST));
    this.add(this.speedLabel, new GBC(2, 4));
    this.speed.setMinimum(1);
    this.speed.setMaximum(10);
    this.speed.addChangeListener(event => this.onIteratorChange(this.speed.getValueIsAdjusting()));
    this.add(this.speed, new GBC(1, 5).w(2).f(GBC.HORIZONTAL).wy(1).a(GBC.NORTH));
    this.add(this.rotation, new GBC(3, 0).h(6).a(GBC.NORTH).i(1, 1, 0, 0));
    this.setValue(new Z4Airbrush(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), 100, 5, 10, new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.speedLabel.setText("" + this.speed.getValue());
    this.value = new Z4Airbrush(this.multiplicity.getValue(), this.radiusSlider.getValue(), this.speed.getValue(), this.gaussianCorrectionSlider.getValue(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.radiusSpinner.setValue(value.getRadius());
    this.radiusSlider.setValue(value.getRadius());
    this.speed.setValue(value.getSpeed());
    this.speedLabel.setText("" + value.getSpeed());
    this.gaussianCorrectionSpinner.setValue(value.getGaussianCorrection());
    this.gaussianCorrectionSlider.setValue(value.getGaussianCorrection());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.radiusSpinner.setEnabled(b);
    this.radiusSlider.setEnabled(b);
    this.speed.setEnabled(b);
    this.gaussianCorrectionSpinner.setEnabled(b);
    this.gaussianCorrectionSlider.setEnabled(b);
  }
}
