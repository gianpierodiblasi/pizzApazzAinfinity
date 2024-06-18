/**
 * The panel to edit a Z4Shape2DPainter
 *
 * @author gianpiero.diblasi
 */
class Z4Shape2DPainterPanel extends Z4PainterPanel {

   width = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   height = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   regular = new JSCheckBox();

   star = new JSCheckBox();

   vertexCounter = new JSSlider();

   shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   editShadowColor = new JSButton();

   shadowColorPreview = new Z4ColorPreview();

   borderWidth = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   borderHeight = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   editBorderColor = new JSButton();

   borderColorPreview = new Z4ColorPreview();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4shape2dpainterpanel");
    this.width.setSignsVisible(false);
    this.width.setConstantRange(1, 50);
    this.width.setLabel(Z4Translations.WIDTH);
    this.width.cssAddClass("z4abstractvaluepanel-titled");
    this.width.addChangeListener(event => this.onshape2dchange(this.width.getValueIsAdjusting(), null, null));
    this.height.setSignsVisible(false);
    this.height.setConstantRange(1, 50);
    this.height.setLabel(Z4Translations.HEIGHT);
    this.height.cssAddClass("z4abstractvaluepanel-titled");
    this.height.addChangeListener(event => this.onshape2dchange(this.height.getValueIsAdjusting(), null, null));
    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event => this.onshape2dchange(false, null, null));
    this.star.setText(Z4Translations.STAR);
    this.star.addActionListener(event => this.onshape2dchange(false, null, null));
    let vertexModelAndRenderer = new DefaultSliderModelAndRenderer();
    for (let vertex = 3; vertex < 10; vertex++) {
      vertexModelAndRenderer.addElement("" + vertex);
    }
    vertexModelAndRenderer.addElement("\u221E");
    this.vertexCounter.setModelAndRenderer(vertexModelAndRenderer);
    this.vertexCounter.addChangeListener(event => this.onshape2dchange(false, null, null));
    // this.getChilStyleByQuery("*:nth-child(13) datalist option:nth-child(8)").fontSize = "larger";
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onshape2dchange(this.shadowShiftX.getValueIsAdjusting(), null, null));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onshape2dchange(this.shadowShiftY.getValueIsAdjusting(), null, null));
    let label = new JSLabel();
    label.setText(Z4Translations.FILLING_COLOR);
    // 
    // this.colorPreview.getStyle().alignSelf = "center";
    // this.colorPreview.getStyle().minWidth = "15rem";
    // 
    this.editShadowColor.setText(Z4Translations.EDIT);
    this.editShadowColor.addActionListener(event => JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.value.getShadowColor(), true, null, color => this.onshape2dchange(false, color, null)));
    this.borderWidth.setSignsVisible(false);
    this.borderWidth.setLabel(Z4Translations.WIDTH);
    this.borderWidth.cssAddClass("z4abstractvaluepanel-titled");
    this.borderWidth.addChangeListener(event => this.onshape2dchange(this.borderWidth.getValueIsAdjusting(), null, null));
    this.borderHeight.setSignsVisible(false);
    this.borderHeight.setLabel(Z4Translations.HEIGHT);
    this.borderHeight.cssAddClass("z4abstractvaluepanel-titled");
    this.borderHeight.addChangeListener(event => this.onshape2dchange(this.borderHeight.getValueIsAdjusting(), null, null));
    label = new JSLabel();
    label.setText(Z4Translations.FILLING_COLOR);
    // 
    // this.colorPreview.getStyle().alignSelf = "center";
    // this.colorPreview.getStyle().minWidth = "15rem";
    // 
    this.editBorderColor.setText(Z4Translations.EDIT);
    this.editBorderColor.addActionListener(event => JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.value.getBorderColor(), true, null, color => this.onshape2dchange(false, null, color)));
    this.setValue(new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, 4, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255)));
  }

   onshape2dchange(b, shadowColor, borderColor) {
    this.valueIsAdjusting = b;
    if (shadowColor) {
      this.shadowColorPreview.setColor(shadowColor);
    }
    if (borderColor) {
      this.borderColorPreview.setColor(borderColor);
    }
    let vCount = this.vertexCounter.getValue();
    this.height.setEnabled(this.enabled && !this.regular.isSelected());
    this.star.setEnabled(this.enabled && vCount !== 7);
    this.value = new Z4Shape2DPainter(this.width.getValue(), this.height.getValue(), this.regular.isSelected(), this.star.isSelected(), vCount === 7 ? -1 : vCount + 3, this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), shadowColor ? shadowColor : this.value.getShadowColor(), this.borderWidth.getValue(), this.borderHeight.getValue(), borderColor ? borderColor : this.value.getBorderColor());
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    let vCount = this.value.getVertices();
    this.width.setValue(this.value.getWidth());
    this.height.setValue(this.value.getHeight());
    this.height.setEnabled(this.enabled && !this.value.isRegular());
    this.regular.setSelected(this.value.isRegular());
    this.star.setSelected(this.value.isStar());
    this.star.setEnabled(this.enabled && vCount !== -1);
    this.vertexCounter.setValue(vCount === -1 ? 7 : vCount - 3);
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPreview.setColor(this.value.getShadowColor());
    this.borderWidth.setValue(this.value.getBorderWidth());
    this.borderHeight.setValue(this.value.getBorderHeight());
    this.borderColorPreview.setColor(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.width.setEnabled(b);
    this.height.setEnabled(b && !this.regular.isSelected());
    this.regular.setEnabled(b);
    this.star.setEnabled(b && this.vertexCounter.getValue() !== 7);
    this.vertexCounter.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.editShadowColor.setEnabled(b);
    this.borderWidth.setEnabled(b);
    this.borderHeight.setEnabled(b);
    this.editBorderColor.setEnabled(b);
  }
}
