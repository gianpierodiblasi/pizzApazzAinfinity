/**
 * The panel to create a new image
 *
 * @author gianpiero.diblasi
 */
class Z4NewImagePanel extends JSPanel {

   width = new JSSpinner();

   height = new JSSpinner();

   resolution = new JSSpinner();

   dimensionMM = new JSLabel();

   dimensionIN = new JSLabel();

   colorPreview = new Z4ColorPreview();

   selectedColor = new Color(255, 255, 255, 255);

  constructor() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.setLayout(new GridBagLayout());
    this.addLabel(Z4Translations.WIDTH + " (px)", 0, 0, 1, 0);
    this.addSpinner(this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    this.addLabel(Z4Translations.HEIGHT + " (px)", 1, 0, 1, 0);
    this.addSpinner(this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    this.addLabel(Z4Translations.RESOLUTION + " (dpi)", 2, 0, 1, 0);
    this.addSpinner(this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    this.addDimension(this.dimensionMM, 3);
    this.addDimension(this.dimensionIN, 4);
    this.addLabel(Z4Translations.FILLING_COLOR, 0, 5, 3, 10);
    this.colorPreview.setColor(this.selectedColor);
    let constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 6;
    constraints.gridwidth = 2;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(this.colorPreview, constraints);
    let button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event => {
      JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.selectedColor, true, null, color => {
        this.selectedColor = color;
        this.colorPreview.setColor(color);
      });
    });
    constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 6;
    constraints.gridwidth = 1;
    constraints.anchor = GridBagConstraints.WEST;
    this.add(button, constraints);
    this.setDimensions();
  }

   addLabel(text, gridx, gridy, gridwidth, top) {
    let label = new JSLabel();
    label.setText(text);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(top, 5, 0, 5);
    this.add(label, constraints);
  }

   addSpinner(spinner, value, max, gridx, gridy) {
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
    this.add(spinner, constraints);
  }

   addDimension(label, gridy) {
    let constraints = new GridBagConstraints();
    constraints.gridy = gridy;
    constraints.gridwidth = 3;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(2, 5, 0, 0);
    this.add(label, constraints);
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
   * Returns the selected color
   *
   * @return The selected color
   */
   getSelectedColor() {
    return this.selectedColor;
  }
}