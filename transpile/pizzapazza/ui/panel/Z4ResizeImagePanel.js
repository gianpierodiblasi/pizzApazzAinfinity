/**
 * The panel to resize an image
 *
 * @author gianpiero.diblasi
 */
class Z4ResizeImagePanel extends JSPanel {

   containerWidth = new JSSpinner();

   containerHeight = new JSSpinner();

   containerResolution = new JSSpinner();

   containerLockRatio = new JSCheckBox();

   containerDimensionMM = new JSLabel();

   containerDimensionIN = new JSLabel();

   contentWidth = new JSSpinner();

   contentHeight = new JSSpinner();

   contentResolution = new JSSpinner();

   contentLockRatio = new JSCheckBox();

   contentDimensionMM = new JSLabel();

   contentDimensionIN = new JSLabel();

   contentOffsetX = new JSSpinner();

   contentOffsetY = new JSSpinner();

   centerContent = new JSButton();

   resizeLayerAdaptContent = new JSRadioButton();

   resizeLayerAndContent = new JSRadioButton();

   resizeLayer = new JSRadioButton();

   resizeContent = new JSRadioButton();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   canvas = null;

   canvasWidth = Z4Constants.DEFAULT_IMAGE_SIZE;

   canvasHeight = Z4Constants.DEFAULT_IMAGE_SIZE;

   canvasRatio = 1;

   listeners = new Array();

  static  SIZE = 150;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.CONTAINER, new GBC(0, 0).a(GBC.WEST).w(3)).getStyle().fontWeight = "bold";
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 1).a(GBC.WEST));
    this.addSpinner(this.containerWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 2, this.containerWidth, this.containerHeight, this.containerLockRatio);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 1).a(GBC.WEST));
    this.addSpinner(this.containerHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 2, this.containerWidth, this.containerHeight, this.containerLockRatio);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 1).a(GBC.WEST));
    this.addSpinner(this.containerResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 2, this.containerWidth, this.containerHeight, this.containerLockRatio);
    this.add(this.containerDimensionMM, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.containerDimensionIN, new GBC(0, 4).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.addCheckBox(this.containerLockRatio, this.containerWidth, this.containerHeight);
    this.add(this.containerLockRatio, new GBC(0, 5).a(GBC.WEST).w(3));
    Z4UI.addLabel(this, Z4Translations.CONTENT, new GBC(0, 6).a(GBC.WEST).w(3)).getStyle().fontWeight = "bold";
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 7).a(GBC.WEST));
    this.addSpinner(this.contentWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 7).a(GBC.WEST));
    this.addSpinner(this.contentHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 7).a(GBC.WEST));
    this.addSpinner(this.contentResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    this.add(this.contentDimensionMM, new GBC(0, 9).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.contentDimensionIN, new GBC(0, 10).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.addCheckBox(this.contentLockRatio, this.contentWidth, this.contentHeight);
    this.add(this.contentLockRatio, new GBC(0, 11).a(GBC.WEST).w(3));
    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(0, 12).a(GBC.WEST));
    this.addSpinner(this.contentOffsetX, 0, -Z4Constants.MAX_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 13, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(1, 12).a(GBC.WEST));
    this.addSpinner(this.contentOffsetY, 0, -Z4Constants.MAX_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 13, this.contentWidth, this.contentHeight, this.contentLockRatio);
    this.centerContent.setContentAreaFilled(false);
    this.centerContent.setText(Z4Translations.CENTER_VERB);
    this.centerContent.addActionListener(event => {
      this.contentOffsetX.setValue(parseInt((this.containerWidth.getValue() - this.contentWidth.getValue()) / 2));
      this.contentOffsetY.setValue(parseInt((this.containerHeight.getValue() - this.contentHeight.getValue()) / 2));
      this.setDimensions();
    });
    this.add(this.centerContent, new GBC(2, 13));
    let panel = new JSPanel();
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(3, 0).h(6).a(GBC.NORTHWEST));
    let buttonGroup = new ButtonGroup();
    this.addRadio(panel, this.resizeLayerAdaptContent, buttonGroup, Z4Translations.RESIZE_CONTAINER_AND_ADAPT_CONTENT, true);
    this.addRadio(panel, this.resizeLayerAndContent, buttonGroup, Z4Translations.RESIZE_CONTAINER_AND_CONTENT, false);
    this.addRadio(panel, this.resizeLayer, buttonGroup, Z4Translations.RESIZE_CONTAINER, false);
    this.addRadio(panel, this.resizeContent, buttonGroup, Z4Translations.RESIZE_CONTENT, false);
    this.add(this.preview, new GBC(3, 6).h(8).wxy(1, 1));
    this.setDimensions();
  }

   addSpinner(spinner, value, min, max, gridx, gridy, width, height, lockRatio) {
    spinner.setModel(new SpinnerNumberModel(value, min, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => {
      let size = this.computeDimension(width, height, lockRatio.isSelected(), spinner === width, spinner === height);
      width.setValue(size.width);
      height.setValue(size.height);
      this.setDimensions();
    });
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

   addCheckBox(checkBox, width, height) {
    checkBox.setText(Z4Translations.LOCK_ASPECT_RATIO);
    checkBox.setSelected(true);
    checkBox.addActionListener(event => {
      let size = this.computeDimension(width, height, checkBox.isSelected(), true, false);
      width.setValue(size.width);
      height.setValue(size.height);
      this.setDimensions();
    });
  }

   addRadio(panel, radio, buttonGroup, text, selected) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event => this.setDimensions());
    buttonGroup.add(radio);
    panel.add(radio, null);
  }

   computeDimension(width, height, lockRatio, isW, isH) {
    let w = width.getValue();
    let h = height.getValue();
    if (!lockRatio) {
    } else if (isW) {
      h = parseInt(w / this.canvasRatio);
      if (h < 1) {
        w = parseInt(this.canvasRatio);
        h = 1;
      } else if (h > Z4Constants.MAX_IMAGE_SIZE) {
        w = parseInt(Z4Constants.MAX_IMAGE_SIZE * this.canvasRatio);
        h = Z4Constants.MAX_IMAGE_SIZE;
      }
    } else if (isH) {
      w = parseInt(h * this.canvasRatio);
      if (w < 1) {
        w = 1;
        h = parseInt(1 / this.canvasRatio);
      } else if (w > Z4Constants.MAX_IMAGE_SIZE) {
        w = Z4Constants.MAX_IMAGE_SIZE;
        h = parseInt(Z4Constants.MAX_IMAGE_SIZE / this.canvasRatio);
      }
    }
    return new Dimension(w, h);
  }

   setDimensions() {
    if (this.resizeLayerAdaptContent.isSelected()) {
      this.setComponentsEnabled(true, false, false);
      this.contentWidth.setValue(this.containerWidth.getValue());
      this.contentHeight.setValue(this.containerHeight.getValue());
      this.contentOffsetX.setValue(0);
      this.contentOffsetY.setValue(0);
    } else if (this.resizeLayerAndContent.isSelected()) {
      this.setComponentsEnabled(true, true, true);
    } else if (this.resizeLayer.isSelected()) {
      this.setComponentsEnabled(true, false, true);
      this.contentWidth.setValue(this.canvasWidth);
      this.contentHeight.setValue(this.canvasHeight);
    } else if (this.resizeContent.isSelected()) {
      this.setComponentsEnabled(false, true, true);
      this.containerWidth.setValue(this.canvasWidth);
      this.containerHeight.setValue(this.canvasHeight);
    }
    this.setLabels(this.containerWidth, this.containerHeight, this.containerResolution, this.containerDimensionMM, this.containerDimensionIN);
    this.setLabels(this.contentWidth, this.contentHeight, this.contentResolution, this.contentDimensionMM, this.contentDimensionIN);
    let containerW = this.containerWidth.getValue();
    let containerH = this.containerHeight.getValue();
    let newRatio = containerW / containerH;
    let previewW = newRatio > 1 ? Z4ResizeImagePanel.SIZE : Z4ResizeImagePanel.SIZE * newRatio;
    let previewH = newRatio > 1 ? Z4ResizeImagePanel.SIZE / newRatio : Z4ResizeImagePanel.SIZE;
    this.preview.setProperty("width", "" + parseInt(previewW));
    this.preview.setProperty("height", "" + parseInt(previewH));
    if (this.canvas) {
      let scaleW = previewW / containerW;
      let scaleH = previewH / containerH;
      this.ctx.save();
      this.ctx.scale(scaleW, scaleH);
      this.ctx.drawImage(this.canvas, this.contentOffsetX.getValue(), this.contentOffsetY.getValue(), this.contentWidth.getValue(), this.contentHeight.getValue());
      this.ctx.restore();
    }
    this.onchange();
  }

   setComponentsEnabled(container, content, offset) {
    this.containerWidth.setEnabled(container);
    this.containerHeight.setEnabled(container);
    this.containerLockRatio.setEnabled(container);
    this.contentWidth.setEnabled(content);
    this.contentHeight.setEnabled(content);
    this.contentLockRatio.setEnabled(content);
    this.contentOffsetX.setEnabled(offset);
    this.contentOffsetY.setEnabled(offset);
    this.centerContent.setEnabled(offset);
  }

   setLabels(width, height, resolution, dimensionMM, dimensionIN) {
    let w = width.getValue();
    let h = height.getValue();
    let res = resolution.getValue();
    let dimWIN = w / res;
    let dimHIN = h / res;
    dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
  }

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
    this.containerWidth.setValue(width);
    this.containerHeight.setValue(height);
    this.contentWidth.setValue(width);
    this.contentHeight.setValue(height);
    this.setDimensions();
  }

  /**
   * Returns the resize options
   *
   * @return The resize options
   */
   getResizeOptions() {
    return new Z4ResizeOptions(this.containerWidth.getValue(), this.containerHeight.getValue(), this.contentWidth.getValue(), this.contentHeight.getValue(), this.contentOffsetX.getValue(), this.contentOffsetY.getValue());
  }

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
