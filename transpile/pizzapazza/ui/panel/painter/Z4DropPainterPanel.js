/**
 * The panel to edit a Z4DropPainter
 *
 * @author gianpiero.diblasi
 */
class Z4DropPainterPanel extends Z4PainterPanel {

   radios = new Array();

   radius = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   intensitySpinner = new JSSpinner();

   intensitySlider = new JSSlider();

   gaussianCorrectionSpinner = new JSSpinner();

   gaussianCorrectionSlider = new JSSlider();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4droppainterpanel");
    let panelType = new JSPanel();
    this.add(panelType, new GBC(0, 0).w(2));
    let buttonGroup = new ButtonGroup();
    this.addRadio(Z4DropPainterType.THOUSAND_POINTS, panelType, buttonGroup);
    this.addRadio(Z4DropPainterType.THOUSAND_LINES, panelType, buttonGroup);
    this.addRadio(Z4DropPainterType.THOUSAND_AREAS, panelType, buttonGroup);
    this.radius.setSignsVisible(false);
    this.radius.setConstantRange(1, 100);
    this.radius.setLabel(Z4Translations.RADIUS);
    this.radius.cssAddClass("z4abstractvaluepanel-titled");
    this.radius.addChangeListener(event => this.ondropchange(this.radius.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.radius, new GBC(0, 1).w(2).i(0, 0, 1, 0));
    Z4UI.addLabel(this, Z4Translations.INTENSITY, new GBC(0, 2).a(GBC.WEST));
    this.intensitySpinner.cssAddClass("jsspinner_w_4rem");
    this.intensitySpinner.setModel(new SpinnerNumberModel(20, 1, 200, 1));
    this.intensitySpinner.addChangeListener(event => this.ondropchange(this.intensitySpinner.getValueIsAdjusting(), this.intensitySpinner.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.intensitySpinner, new GBC(1, 2).a(GBC.EAST));
    this.intensitySlider.setMinimum(1);
    this.intensitySlider.setMaximum(200);
    this.intensitySlider.addChangeListener(event => this.ondropchange(this.intensitySlider.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.intensitySlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));
    Z4UI.addLabel(this, Z4Translations.GAUSSIAN_CORRECTION, new GBC(0, 4).a(GBC.WEST));
    this.gaussianCorrectionSpinner.cssAddClass("jsspinner_w_4rem");
    this.gaussianCorrectionSpinner.setModel(new SpinnerNumberModel(10, 1, 100, 1));
    this.gaussianCorrectionSpinner.addChangeListener(event => this.ondropchange(this.gaussianCorrectionSpinner.getValueIsAdjusting(), this.gaussianCorrectionSpinner.getValue(), this.intensitySlider.getValue()));
    this.add(this.gaussianCorrectionSpinner, new GBC(1, 4).a(GBC.EAST));
    this.gaussianCorrectionSlider.setMinimum(1);
    this.gaussianCorrectionSlider.setMaximum(100);
    this.gaussianCorrectionSlider.addChangeListener(event => this.ondropchange(this.gaussianCorrectionSlider.getValueIsAdjusting(), this.gaussianCorrectionSlider.getValue(), this.intensitySlider.getValue()));
    this.add(this.gaussianCorrectionSlider, new GBC(0, 5).w(2).f(GBC.HORIZONTAL));
    this.setValue(new Z4DropPainter(Z4DropPainterType.THOUSAND_POINTS, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), 20, 10));
  }

   addRadio(dropPainterType, panel, buttonGroup) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4droppainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(dropPainterType));
    radio.addActionListener(event => this.ondropchange(false, this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    buttonGroup.add(radio);
    this.radios["" + dropPainterType] = radio;
    panel.add(radio, null);
  }

   ondropchange(b, intensity, gaussianCorrection) {
    this.valueIsAdjusting = b;
    this.intensitySpinner.setValue(intensity);
    this.intensitySlider.setValue(intensity);
    this.gaussianCorrectionSpinner.setValue(gaussianCorrection);
    this.gaussianCorrectionSlider.setValue(gaussianCorrection);
    let type = null;
    switch("" + Object.keys(this.radios).find((key, index, array) => (this.radios[key]).isSelected())) {
      case "THOUSAND_POINTS":
        type = Z4DropPainterType.THOUSAND_POINTS;
        break;
      case "THOUSAND_LINES":
        type = Z4DropPainterType.THOUSAND_LINES;
        break;
      case "THOUSAND_AREAS":
        type = Z4DropPainterType.THOUSAND_AREAS;
        break;
    }
    this.value = new Z4DropPainter(type, this.radius.getValue(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue());
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getDropPainterType()]).setSelected(true);
    this.radius.setValue(this.value.getRadius());
    this.intensitySpinner.setValue(this.value.getIntensity());
    this.intensitySlider.setValue(this.value.getIntensity());
    this.gaussianCorrectionSpinner.setValue(this.value.getGaussianCorrection());
    this.gaussianCorrectionSlider.setValue(this.value.getGaussianCorrection());
  }

   setEnabled(b) {
    super.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.radius.setEnabled(b);
    this.intensitySpinner.setEnabled(b);
    this.intensitySlider.setEnabled(b);
    this.gaussianCorrectionSpinner.setEnabled(b);
    this.gaussianCorrectionSlider.setEnabled(b);
  }
}
