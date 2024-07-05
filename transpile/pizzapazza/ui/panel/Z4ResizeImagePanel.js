/**
 * The panel to resize an image
 *
 * @author gianpiero.diblasi
 */
class Z4ResizeImagePanel extends JSPanel {

   width = new JSSpinner();

   height = new JSSpinner();

   resolution = new JSSpinner();

   dimensionMM = new JSLabel();

   dimensionIN = new JSLabel();

   resizeByKeepingRatio = new JSRadioButton();

   adaptByKeepingRatio = new JSRadioButton();

   keepSize = new JSRadioButton();

   offsetX = new JSSpinner();

   offsetY = new JSSpinner();

   center = new JSButton();

   listeners = new Array();

   canvas = null;

   ratio = 0.0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    this.add(this.dimensionMM, new GBC(0, 2).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));
    this.add(this.dimensionIN, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));
    let buttonGroup = new ButtonGroup();
    this.addRadio(this.resizeByKeepingRatio, buttonGroup, Z4Translations.RESIZE_BY_KEEPING_RATIO, true, 4);
    this.addRadio(this.adaptByKeepingRatio, buttonGroup, Z4Translations.ADAPT_BY_KEEPING_RATIO, false, 5);
    this.addRadio(this.keepSize, buttonGroup, Z4Translations.KEEP_SIZE, false, 6);
    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(0, 7).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.offsetX, 0, Z4Constants.MAX_IMAGE_SIZE, 0, 8);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(1, 7).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.offsetY, 0, Z4Constants.MAX_IMAGE_SIZE, 1, 8);
    this.center.setContentAreaFilled(false);
    this.center.setText(Z4Translations.CENTER_VERB);
    this.center.addActionListener(event => {
    });
    this.add(this.center, new GBC(2, 8).a(GBC.EAST).i(0, 5, 0, 5));
    this.setDimensions();
  }

   addSpinner(spinner, value, max, gridx, gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => this.setDimensions());
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 5, 0, 5));
  }

   addRadio(radio, buttonGroup, text, selected, gridy) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event => this.setDimensions());
    buttonGroup.add(radio);
    this.add(radio, new GBC(0, gridy).a(GBC.WEST).w(3));
  }

   setDimensions() {
    let w = this.width.getValue();
    let h = this.height.getValue();
    let res = this.resolution.getValue();
    let dimWIN = w / res;
    let dimHIN = h / res;
    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
    this.onchange();
  }

  /**
   * Sets the canvas to resize
   *
   * @param canvas The canvas to resize;
   * @param width The canvas width
   * @param height The canvas height
   */
   setCanvasToResize(canvas, width, height) {
    this.canvas = canvas;
    this.ratio = width / height;
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
