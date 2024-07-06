/**
 * The panel to resize an image
 *
 * @author gianpiero.diblasi
 */
class Z4ResizeImagePanel extends JSPanel {

   layerWidth = new JSSpinner();

   layerHeight = new JSSpinner();

   layerResolution = new JSSpinner();

   layerDimensionMM = new JSLabel();

   layerDimensionIN = new JSLabel();

   contentWidth = new JSSpinner();

   contentHeight = new JSSpinner();

   contentResolution = new JSSpinner();

   contentDimensionMM = new JSLabel();

   contentDimensionIN = new JSLabel();

   contentOffsetX = new JSSpinner();

   contentOffsetY = new JSSpinner();

   centerContent = new JSButton();

   resizeLayerAndContent = new JSRadioButton();

   resizeLayer = new JSRadioButton();

   resizeContent = new JSRadioButton();

   keepRatio = new JSCheckBox();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   canvas = null;

   canvasWidth = Z4Constants.DEFAULT_IMAGE_SIZE;

   canvasHeight = Z4Constants.DEFAULT_IMAGE_SIZE;

   canvasRatio = 1;

   listeners = new Array();

  static  SIZE = 200;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.LAYER, new GBC(0, 0).a(GBC.WEST).w(6));
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 1).a(GBC.WEST));
    this.addSpinner(this.layerWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 2);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 1).a(GBC.WEST));
    this.addSpinner(this.layerHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 2);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 1).a(GBC.WEST));
    this.addSpinner(this.layerResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 2);
    this.add(this.layerDimensionMM, new GBC(0, 3).w(6).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.layerDimensionIN, new GBC(0, 4).w(6).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    Z4UI.addLabel(this, Z4Translations.CONTENT, new GBC(0, 5).a(GBC.WEST).w(6));
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 6).a(GBC.WEST));
    this.addSpinner(this.contentWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 7);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 6).a(GBC.WEST));
    this.addSpinner(this.contentHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 7);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 6).a(GBC.WEST));
    this.addSpinner(this.contentResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 7);
    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(3, 6).a(GBC.WEST));
    this.addSpinner(this.contentOffsetX, 0, 0, Z4Constants.MAX_IMAGE_SIZE, 3, 7);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(4, 6).a(GBC.WEST));
    this.addSpinner(this.contentOffsetY, 0, 0, Z4Constants.MAX_IMAGE_SIZE, 4, 7);
    this.centerContent.setContentAreaFilled(false);
    this.centerContent.setText(Z4Translations.CENTER_VERB);
    // this.center.addActionListener(event -> {
    // });
    this.add(this.centerContent, new GBC(5, 7));
    this.add(this.contentDimensionMM, new GBC(0, 8).w(6).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.contentDimensionIN, new GBC(0, 9).w(6).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    let buttonGroup = new ButtonGroup();
    this.addRadio(this.resizeLayerAndContent, buttonGroup, Z4Translations.RESIZE_LAYER_AND_CONTENT, true, 10);
    this.addRadio(this.resizeLayer, buttonGroup, Z4Translations.RESIZE_LAYER, false, 11);
    this.addRadio(this.resizeContent, buttonGroup, Z4Translations.RESIZE_CONTENT, false, 12);
    this.keepRatio.setText(Z4Translations.KEEP_RATIO);
    this.keepRatio.setSelected(true);
    // this.keepRatio.addActionListener(event -> {
    // });
    this.add(this.keepRatio, new GBC(0, 13).a(GBC.WEST).w(6));
    this.add(this.preview, new GBC(6, 0).h(14).i(5, 5, 5, 5).wxy(1, 1));
    // 
    // this.setDimensions(false, false);
  }

   addSpinner(spinner, value, min, max, gridx, gridy) {
    spinner.setModel(new SpinnerNumberModel(value, min, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    // spinner.addChangeListener(event -> this.setDimensions(isW, isH));
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

   addRadio(radio, buttonGroup, text, selected, gridy) {
    radio.setText(text);
    radio.setSelected(selected);
    // radio.addActionListener(event -> this.setDimensions(selected, false));
    buttonGroup.add(radio);
    this.add(radio, new GBC(0, gridy).a(GBC.WEST).w(6));
  }

  // 
  // private void setDimensions(boolean isW, boolean isH) {
  // Dimension size = this.computeDimension(isW, isH);
  // this.width.setValue(size.width);
  // this.height.setValue(size.height);
  // 
  // double res = this.resolution.getValue();
  // double dimWIN = size.width / res;
  // double dimHIN = size.height / res;
  // 
  // this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
  // this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
  // 
  // double newRatio = size.width / size.height;
  // this.preview.setProperty("width", "" + parseInt(newRatio > 1 ? Z4ResizeImagePanel.SIZE : Z4ResizeImagePanel.SIZE * newRatio));
  // this.preview.setProperty("height", "" + parseInt(newRatio > 1 ? Z4ResizeImagePanel.SIZE / newRatio : Z4ResizeImagePanel.SIZE));
  // 
  // if (!$exists(this.canvasToResize)) {
  // } else if (this.resizeByKeepingRatio.isSelected()) {
  // this.setComponentsEnabled(false, false, false);
  // this.ctx.drawImage(this.canvasToResize, 0, 0, parseInt(this.preview.getProperty("width")), parseInt(this.preview.getProperty("height")));
  // } else if (this.adaptByKeepingRatio.isSelected()) {
  // this.setComponentsEnabled(false, false, true);
  // } else if (this.keepSize.isSelected()) {
  // this.setComponentsEnabled(true, true, true);
  // 
  // double scale = parseInt(this.preview.getProperty("width")) / this.originalWidth;
  // 
  // this.ctx.save();
  // this.ctx.scale(scale, scale);
  // this.ctx.drawImage(this.canvasToResize, 0, 0);
  // this.ctx.restore();
  // }
  // 
  // this.onchange();
  // }
  // private Dimension computeDimension(boolean isW, boolean isH) {
  // double w = this.width.getValue();
  // double h = this.height.getValue();
  // 
  // if (!this.resizeByKeepingRatio.isSelected()) {
  // } else if (isW) {
  // h = parseInt(w / this.originalRatio);
  // 
  // if (h < 1) {
  // w = parseInt(this.originalRatio);
  // h = 1;
  // } else if (h > Z4Constants.MAX_IMAGE_SIZE) {
  // w = parseInt(Z4Constants.MAX_IMAGE_SIZE * this.originalRatio);
  // h = Z4Constants.MAX_IMAGE_SIZE;
  // }
  // } else if (isH) {
  // w = parseInt(h * this.originalRatio);
  // 
  // if (w < 1) {
  // w = 1;
  // h = parseInt(1 / this.originalRatio);
  // } else if (w > Z4Constants.MAX_IMAGE_SIZE) {
  // w = Z4Constants.MAX_IMAGE_SIZE;
  // h = parseInt(Z4Constants.MAX_IMAGE_SIZE / this.originalRatio);
  // }
  // }
  // 
  // return new Dimension((int) w, (int) h);
  // }
  // private void setComponentsEnabled(boolean x, boolean y, boolean c) {
  // this.offsetX.setEnabled(x);
  // this.offsetY.setEnabled(y);
  // this.center.setEnabled(c);
  // }
  /**
   * Sets the canvas to resize
   *
   * @param canvas The canvas to resize;
   * @param width The canvas width
   * @param height The canvas height
   */
   setCanvas(canvas, width, height) {
    this.canvas = canvas;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvasRatio = width / height;
    this.layerWidth.setValue(width);
    this.layerHeight.setValue(height);
    this.contentWidth.setValue(width);
    this.contentHeight.setValue(height);
    // this.setDimensions(false, false);
  }

  /**
   * Returns the selected size
   *
   * @return The selected size
   */
  // public Dimension getSelectedSize() {
  // return new Dimension((int) this.width.getValue(), (int) this.height.getValue());
  // }
  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
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
