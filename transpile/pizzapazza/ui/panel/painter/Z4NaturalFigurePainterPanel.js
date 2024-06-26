/**
 * The panel to edit a Z4NaturalFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainterPanel extends Z4PainterPanel {

   radios = new Array();

  // private final JSComponent sample = new JSComponent(document.createElement("img"));
   size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   internalAngle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalAngle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   internalAngle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalAngle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   internalTension1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalTension1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   internalTension2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalTension2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalForceAngle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalForceTension = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   indentationSpinner = new JSSpinner();

   indentationSlider = new JSSlider();

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
    this.cssAddClass("z4naturalfigurepainterpanel");
    let tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.SHAPE, panel);
    // 
    // JSPanel panelType = new JSPanel();
    // panelType.setLayout(new BoxLayout(panelType, BoxLayout.Y_AXIS));
    // panel.add(panelType, new GBC(0, 0).h(5).i(1, 0, 0, 1));
    // 
    // this.sample.cssAddClass("z4naturalfigurepainterpanel-sample");
    // panelType.add(this.sample, null);
    // 
    // ButtonGroup buttonGroup = new ButtonGroup();
    // this.addRadio(Z4NaturalFigurePainterType.TYPE_0, panelType, buttonGroup);
    // this.addRadio(Z4NaturalFigurePainterType.TYPE_1, panelType, buttonGroup);
    // this.addRadio(Z4NaturalFigurePainterType.TYPE_2, panelType, buttonGroup);
    // this.addRadio(Z4NaturalFigurePainterType.TYPE_3, panelType, buttonGroup);
    // this.addRadio(Z4NaturalFigurePainterType.TYPE_4, panelType, buttonGroup);
    // this.addRadio(Z4NaturalFigurePainterType.TYPE_5, panelType, buttonGroup);
    // 
    this.size.setSignsVisible(false);
    this.size.setConstantRange(1, 50);
    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.cssAddClass("z4abstractvaluepanel-titled");
    this.size.addChangeListener(event => this.onfigurechange(this.size.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.size, new GBC(1, 0).i(1, 0, 1, 0));
    this.createPoint(panel, this.internalAngle1, this.internalTension1, Z4Translations.INTERNAL_BASE_POINT, "i1", 1);
    this.createPoint(panel, this.externalAngle1, this.externalTension1, Z4Translations.EXTERNAL_BASE_POINT, "e1", 3);
    this.createPoint(panel, this.internalAngle2, this.internalTension2, Z4Translations.INTERNAL_TERMINAL_POINT, "i2", 5);
    this.createPoint(panel, this.externalAngle2, this.externalTension2, Z4Translations.EXTERNAL_TERMINAL_POINT, "e2", 7);
    Z4UI.addLabel(panel, Z4Translations.EXTERNAL_FORCE, new GBC(1, 9).w(2).a(GBC.WEST)).getStyle().fontWeight = "bold";
    this.externalForceAngle.setConstantRange(0, 90);
    this.externalForceAngle.setRandomRange(0, 90);
    this.externalForceAngle.setLabel(Z4Translations.ANGLE + " (\u03B1)");
    this.externalForceAngle.cssAddClass("z4abstractvaluepanel-titled");
    this.externalForceAngle.addChangeListener(event => this.onfigurechange(this.externalForceAngle.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalForceAngle, new GBC(1, 10));
    this.externalForceTension.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.externalForceTension.setSignsVisible(false);
    this.externalForceTension.setConstantRange(1, 100);
    this.externalForceTension.setLabel(Z4Translations.TENSION + " (\u03C4)");
    this.externalForceTension.cssAddClass("z4abstractvaluepanel-titled");
    this.externalForceTension.addChangeListener(event => this.onfigurechange(this.externalForceTension.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalForceTension, new GBC(2, 10));
    Z4UI.addLabel(panel, Z4Translations.INDENTATION, new GBC(1, 11).a(GBC.WEST));
    this.indentationSpinner.cssAddClass("jsspinner_w_4rem");
    this.indentationSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.indentationSpinner.addChangeListener(event => this.onfigurechange(this.indentationSpinner.getValueIsAdjusting(), null, null, this.indentationSpinner.getValue()));
    panel.add(this.indentationSpinner, new GBC(2, 11).a(GBC.EAST));
    this.indentationSlider.addChangeListener(event => this.onfigurechange(this.indentationSlider.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.indentationSlider, new GBC(1, 12).w(2).f(GBC.HORIZONTAL));
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    this.shadowColorPanel.addChangeListener(event => this.onfigurechange(false, this.shadowColorPanel.getValue(), null, this.indentationSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPanel);
    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event => this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    this.borderColorPanel.addChangeListener(event => this.onfigurechange(false, null, this.borderColorPanel.getValue(), this.indentationSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPanel);
    // this.setValue(new Z4NaturalFigurePainter(
    // Z4NaturalFigurePainterType.TYPE_0,
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4Whirlpool(
    // Z4WhirlpoolBehavior.NONE,
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false)),
    // 100,
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Color(0, 0, 0, 255),
    // new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
    // false),
    // new Color(0, 0, 0, 255)
    // ));
  }

   addRadio(naturalFigurePainterType, panel, buttonGroup) {
    // JSRadioButton radio = new JSRadioButton();
    // radio.cssAddClass("z4naturalfigurepainterpanel-radio");
    // radio.getStyle().marginBottom = "1px";
    // radio.setContentAreaFilled(false);
    // radio.setToggle();
    // radio.setIcon(new Z4EmptyImageProducer<>(naturalFigurePainterType));
    // radio.addActionListener(event -> this.onfigurechange(false, null, null, this.indentationSlider.getValue()));
    // 
    // buttonGroup.add(radio);
    // this.radios.$set("" + naturalFigurePainterType, radio);
    // panel.add(radio, null);
  }

   createPoint(panel, angle, tension, title, suffix, y) {
    Z4UI.addLabel(panel, title, new GBC(1, y).w(2).a(GBC.WEST)).getStyle().fontWeight = "bold";
    angle.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    angle.setSignsVisible(false);
    angle.setConstantRange(0, 90);
    angle.setRandomRange(0, 90);
    angle.setLabel(Z4Translations.ANGLE + " (\u03B1" + suffix + ")");
    angle.cssAddClass("z4abstractvaluepanel-titled");
    angle.addChangeListener(event => this.onfigurechange(angle.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(angle, new GBC(1, y + 1).i(0, 0, 1, 1));
    tension.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    tension.setSignsVisible(false);
    tension.setConstantRange(1, 100);
    tension.setLabel(Z4Translations.TENSION + " (\u03C4" + suffix + ")");
    tension.cssAddClass("z4abstractvaluepanel-titled");
    tension.addChangeListener(event => this.onfigurechange(tension.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(tension, new GBC(2, y + 1));
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

   onfigurechange(b, shadowColor, borderColor, indentation) {
    this.valueIsAdjusting = b;
    this.indentationSpinner.setValue(indentation);
    this.indentationSlider.setValue(indentation);
    let type = null;
    switch("" + Object.keys(this.radios).find((key, index, array) => (this.radios[key]).isSelected())) {
      case "TYPE_0":
        type = Z4NaturalFigurePainterType.TYPE_0;
        break;
      case "TYPE_1":
        type = Z4NaturalFigurePainterType.TYPE_1;
        break;
      case "TYPE_2":
        type = Z4NaturalFigurePainterType.TYPE_2;
        break;
      case "TYPE_3":
        type = Z4NaturalFigurePainterType.TYPE_3;
        break;
    }
    // 
    // this.value = new Z4NaturalFigurePainter(
    // type,
    // this.size.getValue(), this.angle1.getValue(), this.angle2.getValue(),
    // this.tension.getValue(), this.externalforceangle.getValue(), this.hole.getValue(), this.whirlpool.getValue(), this.indentationSlider.getValue(),
    // this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), $exists(shadowColor) ? shadowColor : this.value.getShadowColor(),
    // this.borderSize.getValue(), $exists(borderColor) ? borderColor : this.value.getBorderColor()
    // );
    // 
    // this.sample.cssRemoveClass("z4naturalfigurepainterpanel-sample0_1_2");
    // this.sample.cssRemoveClass("z4naturalfigurepainterpanel-sample3_4_5");
    // if (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_0 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_1 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_2) {
    // this.sample.cssAddClass("z4naturalfigurepainterpanel-sample0_1_2");
    // } else if (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_4 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5) {
    // this.sample.cssAddClass("z4naturalfigurepainterpanel-sample3_4_5");
    // }
    // 
    // this.angle1.setEnabled(this.enabled && this.value.getNaturalFigurePainterType() != Z4NaturalFigurePainterType.TYPE_5);
    // this.angle2.setEnabled(this.enabled && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    // this.tension.setEnabled(this.enabled && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_4 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    // 
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    // ((JSRadioButton) this.radios.$get("" + value.getNaturalFigurePainterType())).setSelected(true);
    // 
    // this.sample.cssRemoveClass("z4naturalfigurepainterpanel-sample0_1_2");
    // this.sample.cssRemoveClass("z4naturalfigurepainterpanel-sample3_4_5");
    // if (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_0 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_1 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_2) {
    // this.sample.cssAddClass("z4naturalfigurepainterpanel-sample0_1_2");
    // } else if (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_4 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5) {
    // this.sample.cssAddClass("z4naturalfigurepainterpanel-sample3_4_5");
    // }
    // 
    this.size.setValue(this.value.getSize());
    this.internalAngle1.setValue(this.value.getInternalAngle1());
    // this.angle1.setEnabled(this.enabled && this.value.getNaturalFigurePainterType() != Z4NaturalFigurePainterType.TYPE_5);
    this.externalAngle1.setValue(this.value.getExternalAngle1());
    // this.angle2.setEnabled(this.enabled && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    this.internalAngle2.setValue(this.value.getInternalAngle2());
    // this.angle2.setEnabled(this.enabled && this.value.getNaturalFigurePainterType() != Z4NaturalFigurePainterType.TYPE_5);
    this.externalAngle2.setValue(this.value.getExternalAngle2());
    // this.angle2.setEnabled(this.enabled && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    this.internalTension1.setValue(this.value.getInternalTension1());
    // this.tension1.setEnabled(this.enabled && this.value.getNaturalFigurePainterType() != Z4NaturalFigurePainterType.TYPE_5);
    this.externalTension1.setValue(this.value.getExternalTension1());
    // this.tension2.setEnabled(this.enabled && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    this.internalTension2.setValue(this.value.getInternalTension2());
    // this.tension2.setEnabled(this.enabled && this.value.getNaturalFigurePainterType() != Z4NaturalFigurePainterType.TYPE_5);
    this.externalTension2.setValue(this.value.getExternalTension2());
    // this.tension2.setEnabled(this.enabled && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    this.externalForceAngle.setValue(this.value.getExternalForceAngle());
    this.externalForceTension.setValue(this.value.getExternalForceTension());
    this.indentationSpinner.setValue(this.value.getIndentation());
    this.indentationSlider.setValue(this.value.getIndentation());
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPanel.setValue(this.value.getShadowColor());
    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPanel.setValue(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    // Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setEnabled(b));
    // 
    this.size.setEnabled(b);
    // this.angle1.setEnabled(b && this.value.getNaturalFigurePainterType() != Z4NaturalFigurePainterType.TYPE_5);
    // this.angle2.setEnabled(b && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    // this.tension.setEnabled(b && (this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_3 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_4 || this.value.getNaturalFigurePainterType() == Z4NaturalFigurePainterType.TYPE_5));
    // 
    this.externalForceAngle.setEnabled(b);
    this.externalForceTension.setEnabled(b);
    this.indentationSpinner.setEnabled(b);
    this.indentationSlider.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);
    this.borderSize.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
