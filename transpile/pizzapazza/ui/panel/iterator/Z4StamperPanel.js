/**
 * The panel to edit a Z4Stamper
 * @author gianpiero.diblasi
 */
class Z4StamperPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4stamperpanel");
    this.add(this.multiplicity, new GBC(0, 0).a(GBC.WEST).i(0, 0, 1, 0));
    this.add(this.push, new GBC(0, 1).a(GBC.WEST).i(0, 0, 1, 0));
    this.add(this.rotation, new GBC(0, 2));
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event => this.onIteratorChange(this.push.getValueIsAdjusting()));
    this.setValue(new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.value = new Z4Stamper(this.multiplicity.getValue(), this.push.getValue(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);
  }
}
