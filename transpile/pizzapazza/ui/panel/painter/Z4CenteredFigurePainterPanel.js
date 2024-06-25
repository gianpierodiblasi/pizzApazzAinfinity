/**
 * The panel to edit a Z4CenteredFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4CenteredFigurePainterPanel extends Z4PainterPanel {

   radios = new Array();

   sample = new JSComponent(document.createElement("img"));

   size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   angle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   angle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   tension = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   hole = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   whirlpool = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL);

   coverSpinner = new JSSpinner();

   coverSlider = new JSSlider();

   shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowColorPanel = new Z4ColorPanel();

   borderSize = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   borderColorPanel = new Z4ColorPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4centeredfigurepainterpanel");
    let tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.SHAPE, panel);
    let panelType = new JSPanel();
    panelType.setLayout(new BoxLayout(panelType, BoxLayout.Y_AXIS));
    panel.add(panelType, new GBC(0, 0).h(5).i(1, 0, 0, 1));
    this.sample.cssAddClass("z4centeredfigurepainterpanel-sample");
    panelType.add(this.sample, null);
    let buttonGroup = new ButtonGroup();
    this.addRadio(Z4CenteredFigurePainterType.TYPE_0, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_1, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_2, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_3, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_4, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_5, panelType, buttonGroup);
    this.size.setSignsVisible(false);
    this.size.setConstantRange(1, 50);
    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.cssAddClass("z4abstractvaluepanel-titled");
    this.size.addChangeListener(event => this.onfigurechange(this.size.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.size, new GBC(1, 0).i(1, 0, 1, 1));
    this.angle1.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.angle1.setSignsVisible(false);
    this.angle1.setConstantRange(0, 90);
    this.angle1.setRandomRange(0, 90);
    this.angle1.setLabel(Z4Translations.ANGLE + " 1 (\u03B11)");
    this.angle1.cssAddClass("z4abstractvaluepanel-titled");
    this.angle1.addChangeListener(event => this.onfigurechange(this.angle1.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.angle1, new GBC(1, 1).i(0, 0, 0, 1));
    this.angle2.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.angle2.setSignsVisible(false);
    this.angle2.setConstantRange(0, 90);
    this.angle2.setRandomRange(0, 90);
    this.angle2.setLabel(Z4Translations.ANGLE + " 2 (\u03B12)");
    this.angle2.cssAddClass("z4abstractvaluepanel-titled");
    this.angle2.addChangeListener(event => this.onfigurechange(this.angle2.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.angle2, new GBC(2, 1).w(2));
    this.tension.setSignsVisible(false);
    this.tension.setConstantRange(1, 100);
    this.tension.setLabel(Z4Translations.TENSION + " (\u03C4)");
    this.tension.cssAddClass("z4abstractvaluepanel-titled");
    this.tension.addChangeListener(event => this.onfigurechange(this.tension.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.tension, new GBC(2, 0).w(2).i(1, 0, 0, 0));
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(3, 10);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onfigurechange(this.multiplicity.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.multiplicity, new GBC(1, 2).i(1, 0, 0, 1));
    this.hole.setSignsVisible(false);
    this.hole.setLabel(Z4Translations.HOLE);
    this.hole.cssAddClass("z4abstractvaluepanel-titled");
    this.hole.addChangeListener(event => this.onfigurechange(this.hole.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.hole, new GBC(2, 2).w(2).i(1, 0, 0, 0));
    this.whirlpool.cssAddClass("z4abstractvaluepanel-titled");
    this.whirlpool.addChangeListener(event => this.onfigurechange(this.whirlpool.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.whirlpool, new GBC(1, 3).h(2).i(1, 0, 0, 1));
    Z4UI.addLabel(panel, Z4Translations.COVER, new GBC(2, 3).a(GBC.SOUTHWEST).wy(1));
    this.coverSpinner.cssAddClass("jsspinner_w_4rem");
    this.coverSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.coverSpinner.addChangeListener(event => this.onfigurechange(this.coverSpinner.getValueIsAdjusting(), null, null, this.coverSpinner.getValue()));
    panel.add(this.coverSpinner, new GBC(3, 3).a(GBC.SOUTHEAST));
    this.coverSlider.addChangeListener(event => this.onfigurechange(this.coverSlider.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.coverSlider, new GBC(2, 4).w(2).f(GBC.HORIZONTAL).a(GBC.SOUTH));
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    this.shadowColorPanel.addChangeListener(event => this.onfigurechange(false, this.shadowColorPanel.getValue(), null, this.coverSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPanel);
    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event => this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    this.borderColorPanel.addChangeListener(event => this.onfigurechange(false, null, this.borderColorPanel.getValue(), this.coverSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPanel);
    this.setValue(new Z4CenteredFigurePainter(Z4CenteredFigurePainterType.TYPE_0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)), 100, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255)));
  }

   addRadio(centeredFigurePainterType, panel, buttonGroup) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4centeredfigurepainterpanel-radio");
    radio.getStyle().marginBottom = "1px";
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(centeredFigurePainterType));
    radio.addActionListener(event => this.onfigurechange(false, null, null, this.coverSlider.getValue()));
    buttonGroup.add(radio);
    this.radios["" + centeredFigurePainterType] = radio;
    panel.add(radio, null);
  }

   createPanel(tabbedPane, text, p1, p2, colorPanel) {
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);
    panel.add(p1, new GBC(0, 1).i(1, 0, 1, 0));
    if (p2) {
      panel.add(p2, new GBC(0, 2));
    }
    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    panel.add(colorPanel, new GBC(0, 3).f(GBC.HORIZONTAL));
  }

   onfigurechange(b, shadowColor, borderColor, cover) {
    this.valueIsAdjusting = b;
    this.coverSpinner.setValue(cover);
    this.coverSlider.setValue(cover);
    let type = null;
    switch("" + Object.keys(this.radios).find((key, index, array) => (this.radios[key]).isSelected())) {
      case "TYPE_0":
        type = Z4CenteredFigurePainterType.TYPE_0;
        break;
      case "TYPE_1":
        type = Z4CenteredFigurePainterType.TYPE_1;
        break;
      case "TYPE_2":
        type = Z4CenteredFigurePainterType.TYPE_2;
        break;
      case "TYPE_3":
        type = Z4CenteredFigurePainterType.TYPE_3;
        break;
      case "TYPE_4":
        type = Z4CenteredFigurePainterType.TYPE_4;
        break;
      case "TYPE_5":
        type = Z4CenteredFigurePainterType.TYPE_5;
        break;
    }
    this.value = new Z4CenteredFigurePainter(type, this.size.getValue(), this.angle1.getValue(), this.angle2.getValue(), this.tension.getValue(), this.multiplicity.getValue(), this.hole.getValue(), this.whirlpool.getValue(), this.coverSlider.getValue(), this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), shadowColor ? shadowColor : this.value.getShadowColor(), this.borderSize.getValue(), borderColor ? borderColor : this.value.getBorderColor());
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample0_1_2");
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample3_4_5");
    if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_0 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_1 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_2) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample0_1_2");
    } else if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample3_4_5");
    }
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getCenteredFigurePainterType()]).setSelected(true);
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample0_1_2");
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample3_4_5");
    if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_0 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_1 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_2) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample0_1_2");
    } else if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample3_4_5");
    }
    this.size.setValue(this.value.getSize());
    this.angle1.setValue(this.value.getAngle1());
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setValue(this.value.getAngle2());
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setValue(this.value.getTension());
    this.tension.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.hole.setValue(this.value.getHole());
    this.whirlpool.setValue(this.value.getWhirlpool());
    this.coverSpinner.setValue(this.value.getCover());
    this.coverSlider.setValue(this.value.getCover());
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPanel.setValue(this.value.getShadowColor());
    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPanel.setValue(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.size.setEnabled(b);
    this.angle1.setEnabled(b && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(b && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setEnabled(b && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.multiplicity.setEnabled(b);
    this.hole.setEnabled(b);
    this.whirlpool.setEnabled(b);
    this.coverSpinner.setEnabled(b);
    this.coverSlider.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);
    this.borderSize.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
