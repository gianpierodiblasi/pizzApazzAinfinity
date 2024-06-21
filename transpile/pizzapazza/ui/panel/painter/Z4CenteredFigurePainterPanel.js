/**
 * The panel to edit a Z4CenteredFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4CenteredFigurePainterPanel extends Z4PainterPanel {

   radios = new Array();

   size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   angle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   angle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   editShadowColor = new JSButton();

   shadowColorPreview = new Z4ColorPreview();

   borderSize = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   editBorderColor = new JSButton();

   borderColorPreview = new Z4ColorPreview();

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
    let buttonGroup = new ButtonGroup();
    panel.add(panelType, new GBC(0, 0).a(GBC.WEST).f(GBC.HORIZONTAL));
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
    this.size.addChangeListener(event => this.onfigurechange(this.size.getValueIsAdjusting(), null, null));
    panel.add(this.size, new GBC(0, 1).a(GBC.WEST));
    this.angle1.setSignsVisible(false);
    this.angle1.setConstantRange(0, 90);
    this.angle1.setRandomRange(0, 90);
    this.angle1.setLabel(Z4Translations.ANGLE + " 1");
    this.angle1.cssAddClass("z4abstractvaluepanel-titled");
    this.angle1.addChangeListener(event => this.onfigurechange(this.angle1.getValueIsAdjusting(), null, null));
    panel.add(this.angle1, new GBC(0, 2).a(GBC.WEST));
    this.angle2.setSignsVisible(false);
    this.angle2.setConstantRange(0, 90);
    this.angle2.setRandomRange(0, 90);
    this.angle2.setLabel(Z4Translations.ANGLE + " 2");
    this.angle2.cssAddClass("z4abstractvaluepanel-titled");
    this.angle2.addChangeListener(event => this.onfigurechange(this.angle2.getValueIsAdjusting(), null, null));
    panel.add(this.angle2, new GBC(0, 3).a(GBC.WEST));
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null));
    this.editShadowColor.setText(Z4Translations.EDIT);
    this.editShadowColor.addActionListener(event => JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.value.getShadowColor(), true, null, color => this.onfigurechange(false, color, null)));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPreview, this.editShadowColor);
    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event => this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null));
    this.editBorderColor.setText(Z4Translations.EDIT);
    this.editBorderColor.addActionListener(event => JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.value.getBorderColor(), true, null, color => this.onfigurechange(false, null, color)));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPreview, this.editBorderColor);
    this.setValue(new Z4CenteredFigurePainter(Z4CenteredFigurePainterType.TYPE_0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)), 100, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255)));
  }

   addRadio(centeredFigurePainterType, panel, buttonGroup) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4centeredfigurepainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(centeredFigurePainterType));
    radio.addActionListener(event => this.onfigurechange(false, null, null));
    buttonGroup.add(radio);
    this.radios["" + centeredFigurePainterType] = radio;
    panel.add(radio, null);
  }

   createPanel(tabbedPane, text, p1, p2, preview, button) {
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);
    panel.add(p1, new GBC(0, 1).w(2).i(1, 0, 1, 0));
    if (p2) {
      panel.add(p2, new GBC(0, 2).w(2));
    }
    Z4UI.addLabel(panel, Z4Translations.FILLING_COLOR, new GBC(0, 3).w(2).a(GBC.WEST));
    panel.add(preview, new GBC(0, 4).wx(1).f(GBC.HORIZONTAL).i(0, 0, 0, 5));
    panel.add(button, new GBC(1, 4));
  }

   onfigurechange(b, shadowColor, borderColor) {
    this.valueIsAdjusting = b;
    if (shadowColor) {
      this.shadowColorPreview.setColor(shadowColor);
    }
    if (borderColor) {
      this.borderColorPreview.setColor(borderColor);
    }
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
    this.value = new Z4CenteredFigurePainter(type, this.size.getValue(), this.angle1.getValue(), this.angle2.getValue(), null, null, null, null, 0, this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), shadowColor ? shadowColor : this.value.getShadowColor(), this.borderSize.getValue(), borderColor ? borderColor : this.value.getBorderColor());
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getCenteredFigurePainterType()]).setSelected(true);
    this.size.setValue(this.value.getSize());
    this.angle1.setValue(this.value.getAngle1());
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setValue(this.value.getAngle2());
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPreview.setColor(this.value.getShadowColor());
    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPreview.setColor(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.size.setEnabled(b);
    this.angle1.setEnabled(b && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(b && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.editShadowColor.setEnabled(b);
    this.borderSize.setEnabled(b);
    this.editBorderColor.setEnabled(b);
  }
}
