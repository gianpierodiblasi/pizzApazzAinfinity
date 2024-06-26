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

  // 
  // private final Z4FancifulValuePanel hole = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  // private final Z4WhirlpoolPanel whirlpool = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL);
   indentationSpinner = new JSSpinner();

   indentationSlider = new JSSlider();

  // 
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
    panel.add(this.size, new GBC(1, 0));
    this.internalAngle1.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.internalAngle1.setSignsVisible(false);
    this.internalAngle1.setConstantRange(0, 90);
    this.internalAngle1.setRandomRange(0, 90);
    this.internalAngle1.setLabel(Z4Translations.INTERNAL_ANGLE + " 1 (\u03B1i1)");
    this.internalAngle1.cssAddClass("z4abstractvaluepanel-titled");
    this.internalAngle1.addChangeListener(event => this.onfigurechange(this.internalAngle1.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.internalAngle1, new GBC(1, 1));
    this.externalAngle1.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.externalAngle1.setSignsVisible(false);
    this.externalAngle1.setConstantRange(0, 90);
    this.externalAngle1.setRandomRange(0, 90);
    this.externalAngle1.setLabel(Z4Translations.EXTERNAL_ANGLE + " 1 (\u03B1e1)");
    this.externalAngle1.cssAddClass("z4abstractvaluepanel-titled");
    this.externalAngle1.addChangeListener(event => this.onfigurechange(this.externalAngle1.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalAngle1, new GBC(2, 1).w(2));
    this.internalAngle2.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.internalAngle2.setSignsVisible(false);
    this.internalAngle2.setConstantRange(0, 90);
    this.internalAngle2.setRandomRange(0, 90);
    this.internalAngle2.setLabel(Z4Translations.INTERNAL_ANGLE + " 2 (\u03B1i2)");
    this.internalAngle2.cssAddClass("z4abstractvaluepanel-titled");
    this.internalAngle2.addChangeListener(event => this.onfigurechange(this.internalAngle2.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.internalAngle2, new GBC(1, 2));
    this.externalAngle2.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.externalAngle2.setSignsVisible(false);
    this.externalAngle2.setConstantRange(0, 90);
    this.externalAngle2.setRandomRange(0, 90);
    this.externalAngle2.setLabel(Z4Translations.EXTERNAL_ANGLE + " 2 (\u03B1e2)");
    this.externalAngle2.cssAddClass("z4abstractvaluepanel-titled");
    this.externalAngle2.addChangeListener(event => this.onfigurechange(this.externalAngle2.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalAngle2, new GBC(2, 2).w(2));
    this.internalTension1.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.internalTension1.setSignsVisible(false);
    this.internalTension1.setConstantRange(1, 100);
    this.internalTension1.setLabel(Z4Translations.INTERNAL_TENSION + " 1 (\u03C4i1)");
    this.internalTension1.cssAddClass("z4abstractvaluepanel-titled");
    this.internalTension1.addChangeListener(event => this.onfigurechange(this.internalTension1.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.internalTension1, new GBC(1, 3));
    this.externalTension1.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.externalTension1.setSignsVisible(false);
    this.externalTension1.setConstantRange(1, 100);
    this.externalTension1.setLabel(Z4Translations.EXTERNAL_TENSION + " 1 (\u03C4e1)");
    this.externalTension1.cssAddClass("z4abstractvaluepanel-titled");
    this.externalTension1.addChangeListener(event => this.onfigurechange(this.externalTension1.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalTension1, new GBC(2, 3));
    this.internalTension2.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.internalTension2.setSignsVisible(false);
    this.internalTension2.setConstantRange(1, 100);
    this.internalTension2.setLabel(Z4Translations.INTERNAL_TENSION + " 2 (\u03C4i2)");
    this.internalTension2.cssAddClass("z4abstractvaluepanel-titled");
    this.internalTension2.addChangeListener(event => this.onfigurechange(this.internalTension2.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.internalTension2, new GBC(1, 4));
    this.externalTension2.getStyle().setProperty("grid-template-areas", "\"p1 p1 p1 p1\" \"p3 p4 p5 p6\"");
    this.externalTension2.setSignsVisible(false);
    this.externalTension2.setConstantRange(1, 100);
    this.externalTension2.setLabel(Z4Translations.EXTERNAL_TENSION + " 2 (\u03C4e2)");
    this.externalTension2.cssAddClass("z4abstractvaluepanel-titled");
    this.externalTension2.addChangeListener(event => this.onfigurechange(this.externalTension2.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalTension2, new GBC(2, 4));
    // 
    // this.multiplicity.setSignsVisible(false);
    // this.multiplicity.setConstantRange(3, 10);
    // this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    // this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    // this.multiplicity.addChangeListener(event -> this.onfigurechange(this.multiplicity.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    // panel.add(this.multiplicity, new GBC(1, 2).i(1, 0, 0, 1));
    // 
    // this.hole.setSignsVisible(false);
    // this.hole.setLabel(Z4Translations.HOLE);
    // this.hole.cssAddClass("z4abstractvaluepanel-titled");
    // this.hole.addChangeListener(event -> this.onfigurechange(this.hole.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    // panel.add(this.hole, new GBC(2, 2).w(2).i(1, 0, 0, 0));
    // 
    // this.whirlpool.cssAddClass("z4abstractvaluepanel-titled");
    // this.whirlpool.addChangeListener(event -> this.onfigurechange(this.whirlpool.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    // panel.add(this.whirlpool, new GBC(1, 3).h(2).i(1, 0, 0, 1));
    // 
    // Z4UI.addLabel(panel, Z4Translations.INDENTATION, new GBC(2, 3).a(GBC.SOUTHWEST).wy(1));
    // 
    // this.indentationSpinner.cssAddClass("jsspinner_w_4rem");
    // this.indentationSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    // this.indentationSpinner.addChangeListener(event -> this.onfigurechange(this.indentationSpinner.getValueIsAdjusting(), null, null, (int) this.indentationSpinner.getValue()));
    // panel.add(this.indentationSpinner, new GBC(3, 3).a(GBC.SOUTHEAST));
    // 
    // this.indentationSlider.addChangeListener(event -> this.onfigurechange(this.indentationSlider.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    // panel.add(this.indentationSlider, new GBC(2, 4).w(2).f(GBC.HORIZONTAL).a(GBC.SOUTH));
    // 
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
    // this.tension.getValue(), this.multiplicity.getValue(), this.hole.getValue(), this.whirlpool.getValue(), this.indentationSlider.getValue(),
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
    // this.multiplicity.setValue(this.value.getMultiplicity());
    // this.hole.setValue(this.value.getHole());
    // this.whirlpool.setValue(this.value.getWhirlpool());
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
    // this.multiplicity.setEnabled(b);
    // this.hole.setEnabled(b);
    // this.whirlpool.setEnabled(b);
    this.indentationSpinner.setEnabled(b);
    this.indentationSlider.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);
    this.borderSize.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
