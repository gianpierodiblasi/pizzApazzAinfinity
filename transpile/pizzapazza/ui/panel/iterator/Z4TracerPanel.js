/**
 * The panel to edit a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
class Z4TracerPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   attack = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   sustain = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   release = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   endlessSustain = new JSCheckBox();

   step = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

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
    this.add(this.multiplicity, new GBC(0, 0).a(GBC.WEST).i(0, 0, 1, 0));
    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event => this.onIteratorChange(this.push.getValueIsAdjusting()));
    this.add(this.push, new GBC(0, 1).a(GBC.WEST).i(0, 0, 1, 0));
    this.attack.setSignsVisible(false);
    this.attack.setLabel(Z4Translations.ATTACK);
    this.attack.cssAddClass("z4abstractvaluepanel-titled");
    this.attack.addChangeListener(event => this.onIteratorChange(this.attack.getValueIsAdjusting()));
    this.add(this.attack, new GBC(0, 2).a(GBC.WEST).i(0, 0, 1, 0));
    this.sustain.setSignsVisible(false);
    this.sustain.setLabel(Z4Translations.SUSTAIN);
    this.sustain.cssAddClass("z4abstractvaluepanel-titled");
    this.sustain.addChangeListener(event => this.onIteratorChange(this.sustain.getValueIsAdjusting()));
    this.add(this.sustain, new GBC(0, 3).a(GBC.WEST).i(0, 0, 1, 0));
    this.release.setSignsVisible(false);
    this.release.setLabel(Z4Translations.RELEASE);
    this.release.cssAddClass("z4abstractvaluepanel-titled");
    this.release.addChangeListener(event => this.onIteratorChange(this.release.getValueIsAdjusting()));
    this.add(this.release, new GBC(0, 4).a(GBC.WEST).i(0, 0, 1, 0));
    this.step.setSignsVisible(false);
    this.step.setLabel(Z4Translations.STEP);
    this.step.cssAddClass("z4abstractvaluepanel-titled");
    this.step.addChangeListener(event => this.onIteratorChange(this.step.getValueIsAdjusting()));
    this.add(this.step, new GBC(0, 5).a(GBC.WEST).i(0, 0, 1, 0));
    // this.add(this.rotation, new GBC(0, 2));
  }

   onIteratorChange(valueIsAdjusting) {
    // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    throw new UnsupportedOperationException("Not supported yet.");
  }
}
