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

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   listeners = new Array();

   canvasToResize = null;

   originalWidth = Z4Constants.DEFAULT_IMAGE_SIZE;

   originalHeight = Z4Constants.DEFAULT_IMAGE_SIZE;

   originalRatio = 1;

  static  SIZE = 180;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.width, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, true, false, 0, 1);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.height, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, false, true, 1, 1);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.resolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, false, false, 2, 1);
    this.add(this.dimensionMM, new GBC(0, 2).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));
    this.add(this.dimensionIN, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));
    let buttonGroup = new ButtonGroup();
    this.addRadio(this.resizeByKeepingRatio, buttonGroup, Z4Translations.RESIZE_BY_KEEPING_RATIO, true, 4);
    this.addRadio(this.adaptByKeepingRatio, buttonGroup, Z4Translations.ADAPT_BY_KEEPING_RATIO, false, 5);
    this.addRadio(this.keepSize, buttonGroup, Z4Translations.KEEP_SIZE, false, 6);
    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(0, 7).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.offsetX, 0, 0, Z4Constants.MAX_IMAGE_SIZE, false, false, 0, 8);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(1, 7).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.offsetY, 0, 0, Z4Constants.MAX_IMAGE_SIZE, false, false, 1, 8);
    this.center.setContentAreaFilled(false);
    this.center.setText(Z4Translations.CENTER_VERB);
    this.center.addActionListener(event => {
    });
    this.add(this.center, new GBC(2, 8).a(GBC.EAST).i(0, 5, 0, 5));
    this.add(this.preview, new GBC(3, 0).h(9).i(5, 5, 5, 5));
    this.setDimensions(false, false);
  }

   addSpinner(spinner, value, min, max, isW, isH, gridx, gridy) {
    spinner.setModel(new SpinnerNumberModel(value, min, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => this.setDimensions(isW, isH));
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 5, 0, 5));
  }

   addRadio(radio, buttonGroup, text, selected, gridy) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event => this.setDimensions(selected, false));
    buttonGroup.add(radio);
    this.add(radio, new GBC(0, gridy).a(GBC.WEST).w(3));
  }

   setDimensions(isW, isH) {
    let size = this.computeDimension(isW, isH);
    this.width.setValue(size.width);
    this.height.setValue(size.height);
    let res = this.resolution.getValue();
    let dimWIN = size.width / res;
    let dimHIN = size.height / res;
    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
    let newRatio = size.width / size.height;
    this.preview.setProperty("width", "" + parseInt(newRatio > 1 ? Z4ResizeImagePanel.SIZE : Z4ResizeImagePanel.SIZE * newRatio));
    this.preview.setProperty("height", "" + parseInt(newRatio > 1 ? Z4ResizeImagePanel.SIZE / newRatio : Z4ResizeImagePanel.SIZE));
    if (!this.canvasToResize) {
    } else if (this.resizeByKeepingRatio.isSelected()) {
      this.setComponentsEnabled(false, false, false);
      this.ctx.drawImage(this.canvasToResize, 0, 0, parseInt(this.preview.getProperty("width")), parseInt(this.preview.getProperty("height")));
    } else if (this.adaptByKeepingRatio.isSelected()) {
      this.setComponentsEnabled(false, false, true);
    } else if (this.keepSize.isSelected()) {
      this.setComponentsEnabled(true, true, true);
      // 
      // double scale = parseInt(this.preview.getProperty("width")) / this.originalWidth;
      // 
      // this.ctx.save();
      // this.ctx.scale(scale, scale);
      // this.ctx.drawImage(this.canvasToResize, 0, 0);
      // this.ctx.restore();
    }
    this.onchange();
  }

   computeDimension(isW, isH) {
    let w = this.width.getValue();
    let h = this.height.getValue();
    if (!this.resizeByKeepingRatio.isSelected()) {
    } else if (isW) {
      h = parseInt(w / this.originalRatio);
      if (h < 1) {
        w = parseInt(this.originalRatio);
        h = 1;
      } else if (h > Z4Constants.MAX_IMAGE_SIZE) {
        w = parseInt(Z4Constants.MAX_IMAGE_SIZE * this.originalRatio);
        h = Z4Constants.MAX_IMAGE_SIZE;
      }
    } else if (isH) {
      w = parseInt(h * this.originalRatio);
      if (w < 1) {
        w = 1;
        h = parseInt(1 / this.originalRatio);
      } else if (w > Z4Constants.MAX_IMAGE_SIZE) {
        w = Z4Constants.MAX_IMAGE_SIZE;
        h = parseInt(Z4Constants.MAX_IMAGE_SIZE / this.originalRatio);
      }
    }
    return new Dimension(w, h);
  }

   setComponentsEnabled(x, y, c) {
    this.offsetX.setEnabled(x);
    this.offsetY.setEnabled(y);
    this.center.setEnabled(c);
  }

  /**
   * Sets the canvas to resize
   *
   * @param canvas The canvas to resize;
   * @param width The canvas width
   * @param height The canvas height
   */
   setCanvasToResize(canvas, width, height) {
    this.canvasToResize = canvas;
    this.originalWidth = width;
    this.originalHeight = height;
    this.originalRatio = width / height;
    this.width.setValue(width);
    this.height.setValue(height);
    this.setDimensions(false, false);
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
