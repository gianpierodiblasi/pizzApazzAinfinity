/**
 * The panel to edit a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
class Z4TracerPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   step = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   assistedDrawing = new JSCheckBox();

   attack = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   sustain = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   release = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   endlessSustain = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4tracerpanel");
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0).i(0, 0, 0, 1));
    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event => this.onIteratorChange(this.push.getValueIsAdjusting()));
    this.add(this.push, new GBC(1, 0).i(0, 0, 0, 1));
    this.step.setSignsVisible(false);
    this.step.setConstantRange(1, 50);
    this.step.setLabel(Z4Translations.STEP);
    this.step.cssAddClass("z4abstractvaluepanel-titled");
    this.step.addChangeListener(event => this.onIteratorChange(this.step.getValueIsAdjusting()));
    this.add(this.step, new GBC(2, 0).i(0, 0, 0, 5));
    this.attack.setSignsVisible(false);
    this.attack.setLabel(Z4Translations.ATTACK);
    this.attack.cssAddClass("z4abstractvaluepanel-titled");
    this.attack.addChangeListener(event => this.onIteratorChange(this.attack.getValueIsAdjusting()));
    this.add(this.attack, new GBC(3, 0).i(0, 0, 0, 1));
    this.sustain.setSignsVisible(false);
    this.sustain.setLabel(Z4Translations.SUSTAIN);
    this.sustain.cssAddClass("z4abstractvaluepanel-titled");
    this.sustain.addChangeListener(event => this.onIteratorChange(this.sustain.getValueIsAdjusting()));
    this.sustain.add(this.endlessSustain, new GBC(0, 4).w(3).a(GBC.WEST));
    this.add(this.sustain, new GBC(4, 0).h(2).a(GBC.NORTH).i(0, 0, 0, 1));
    this.endlessSustain.setText(Z4Translations.ENDLESS);
    this.endlessSustain.addActionListener(event => this.onIteratorChange(false));
    this.release.setSignsVisible(false);
    this.release.setLabel(Z4Translations.RELEASE);
    this.release.cssAddClass("z4abstractvaluepanel-titled");
    this.release.addChangeListener(event => this.onIteratorChange(this.release.getValueIsAdjusting()));
    this.add(this.release, new GBC(5, 0));
    this.assistedDrawing.setText(Z4Translations.ASSISTED_DRAWING);
    this.assistedDrawing.addActionListener(event => this.onIteratorChange(false));
    this.add(this.assistedDrawing, new GBC(0, 1).w(3).a(GBC.WEST));
    this.add(this.rotation, new GBC(0, 2).w(3).a(GBC.WEST));
    this.setValue(new Z4Tracer(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), true, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), true, new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.sustain.setEnabled(this.enabled && !this.endlessSustain.isSelected());
    this.release.setEnabled(this.enabled && !this.endlessSustain.isSelected());
    this.value = new Z4Tracer(this.multiplicity.getValue(), this.push.getValue(), this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustain.isSelected(), this.step.getValue(), this.assistedDrawing.isSelected(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
    this.attack.setValue(value.getAttack());
    this.sustain.setValue(value.getSustain());
    this.sustain.setEnabled(this.enabled && !value.isEndlessSustain());
    this.release.setValue(value.getRelease());
    this.release.setEnabled(this.enabled && !value.isEndlessSustain());
    this.endlessSustain.setSelected(value.isEndlessSustain());
    this.step.setValue(value.getStep());
    this.assistedDrawing.setSelected(value.isAssistedDrawing());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);
    this.attack.setEnabled(b);
    this.sustain.setEnabled(b && !this.endlessSustain.isSelected());
    this.release.setEnabled(b && !this.endlessSustain.isSelected());
    this.endlessSustain.setEnabled(b);
    this.step.setEnabled(b);
    this.assistedDrawing.setEnabled(b);
  }
}
