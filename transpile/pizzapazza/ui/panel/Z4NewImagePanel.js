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

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.getStyle().width = "60rem";
    this.getStyle().height = "45rem";
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.addTab(Z4Translations.DIMENSION, panel);
    Z4UI.addLabel(panel, Z4Translations.WIDTH + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 0, 0, 5));
    this.addSpinner(panel, this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    Z4UI.addLabel(panel, Z4Translations.HEIGHT + " (px)", new GBC(2, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(panel, this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 2, 1);
    Z4UI.addLabel(panel, Z4Translations.RESOLUTION + " (dpi)", new GBC(3, 0).a(GBC.WEST).i(5, 0, 0, 5));
    this.addSpinner(panel, this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 3, 1);
    panel.add(this.dimensionMM, new GBC(1, 2).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    panel.add(this.dimensionIN, new GBC(1, 3).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    let p1 = new JSPanel();
    p1.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    Z4Constants.STANDARD_IMAGE_SIZE.forEach(dimension => this.addButton(p1, dimension));
    panel.add(p1, new GBC(0, 4).w(5).i(5, 0, 0, 0));
    let p2 = new JSPanel();
    p2.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    Z4Constants.STANDARD_IMAGE_SIZE.forEach(dimension => this.addButton(p2, new Dimension(dimension.height, dimension.width)));
    panel.add(p2, new GBC(0, 5).w(5).wy(1).a(GBC.NORTH).i(5, 0, 0, 0));
    this.addTab(Z4Translations.FILLING, this.fillingPanel);
    this.setDimensions();
  }

   addSpinner(panel, spinner, value, max, gridx, gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => this.setDimensions());
    panel.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

   addButton(panel, dimension) {
    let button = new JSButton();
    button.setText(dimension.width + " x " + dimension.height);
    button.addActionListener(event => {
      this.width.setValue(dimension.width);
      this.height.setValue(dimension.height);
      this.setDimensions();
    });
    panel.add(button, null);
  }

   setDimensions() {
    let w = this.width.getValue();
    let h = this.height.getValue();
    let res = this.resolution.getValue();
    let dimWIN = w / res;
    let dimHIN = h / res;
    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
    this.fillingPanel.setSize(w, h);
    this.onchange();
  }

  /**
   * Sets the selected size
   *
   * @param width The selected width
   * @param height The selected height
   */
   setSelectedSize(width, height) {
    this.width.setValue(width);
    this.height.setValue(height);
    this.setDimensions();
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
    return this.fillingPanel.getSelectedFilling();
  }

   addChangeListener(listener) {
    this.listeners.push(listener);
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
