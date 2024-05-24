/**
 * The panel to create a new image
 *
 * @author gianpiero.diblasi
 */
class Z4NewImagePanel extends JSTabbedPane {

   width = new JSSpinner();

   height = new JSSpinner();

   resolution = new JSSpinner();

   dimensionMM = new JSLabel();

   dimensionIN = new JSLabel();

   fillingPanel = new Z4FillingPanel();

  constructor() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.getStyle().minWidth = "45rem";
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.addTab(Z4Translations.DIMENSION, panel);
    this.addLabel(panel, Z4Translations.WIDTH + " (px)", 0, 0, 1, 0);
    this.addSpinner(panel, this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    this.addLabel(panel, Z4Translations.HEIGHT + " (px)", 1, 0, 1, 0);
    this.addSpinner(panel, this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    this.addLabel(panel, Z4Translations.RESOLUTION + " (dpi)", 2, 0, 1, 0);
    this.addSpinner(panel, this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    this.addDimension(panel, this.dimensionMM, 3);
    this.addDimension(panel, this.dimensionIN, 4);
    this.addTab(Z4Translations.FILLING, this.fillingPanel);
    this.setDimensions();
  }

   addLabel(panel, text, gridx, gridy, gridwidth, top) {
    let label = new JSLabel();
    label.setText(text);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(top, 5, 0, 5);
    panel.add(label, constraints);
  }

   addSpinner(panel, spinner, value, max, gridx, gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => this.setDimensions());
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(0, 5, 0, 5);
    panel.add(spinner, constraints);
  }

   addDimension(panel, label, gridy) {
    let constraints = new GridBagConstraints();
    constraints.gridy = gridy;
    constraints.gridwidth = 3;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(2, 5, 0, 0);
    panel.add(label, constraints);
  }

   setDimensions() {
    let w = this.width.getValue();
    let h = this.height.getValue();
    let res = this.resolution.getValue();
    let dimWIN = w / res;
    let dimHIN = h / res;
    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " \u2716 " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " \u2716 " + new Number(dimHIN).toFixed(2) + " inch");
  }

  /**
   * Returns the selected size
   *
   * @return The selected size
   */
   getSelectedSize() {
    return new Dimension(this.width.getValue(), this.height.getValue());
  }

  /**
   * Returns the selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   *
   * @return The selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   getSelectedFilling() {
    return null;
  }
}
