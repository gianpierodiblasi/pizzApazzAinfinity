/**
 * The panel to edit a Z4Airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4AirbrushPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   radius = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);

   speed = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);

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
    this.add(this.multiplicity, new GBC(0, 0).h(2).a(GBC.NORTH).i(0, 0, 0, 1));
    this.radius.setSignVisible(false);
    this.radius.setRange(1, 500);
    this.radius.setLabel(Z4Translations.RADIUS);
    this.radius.addChangeListener(event => this.onIteratorChange(this.radius.getValueIsAdjusting()));
    this.add(this.radius, new GBC(1, 0).a(GBC.WEST));
    this.speed.setSignVisible(false);
    this.speed.setRange(1, 10);
    this.speed.setLabel(Z4Translations.SPEED);
    this.speed.addChangeListener(event => this.onIteratorChange(this.speed.getValueIsAdjusting()));
    this.add(this.speed, new GBC(1, 1).a(GBC.WEST));
    this.add(this.rotation, new GBC(0, 2).w(2).a(GBC.WEST).i(1, 0, 0, 0));
    this.setValue(new Z4Airbrush(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), 100, 5, new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.value = new Z4Airbrush(this.multiplicity.getValue(), this.radius.getValue().getValue(), this.speed.getValue().getValue(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.radius.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getRadius()));
    this.speed.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getSpeed()));
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.radius.setEnabled(b);
    this.speed.setEnabled(b);
  }
}
