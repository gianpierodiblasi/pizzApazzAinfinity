/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapePreview extends JSDropDown {

   summary = new JSPanel();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

  // private final JSSlider offsetXSlider = new JSSlider();
  // private final JSSpinner offsetXSpinner = new JSSpinner();
  // private final JSSlider offsetYSlider = new JSSlider();
  // private final JSSpinner offsetYSpinner = new JSSpinner();
   delete = new JSButton();

   shapesAndPathsPanel = null;

   canvas = null;

   shape = null;

   zoom = 1;

   changed = false;

  /**
   * The text content for the selected button
   */
  static  SELECTED_GEOMETRIC_SHAPE_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_GEOMETRIC_SHAPE_CONTENT = "-";

  static  PREVIEW_SIZE = 75;

  constructor() {
    super(".z4geometricshapepreview-editor");
    this.cssAddClass("z4geometricshapepreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
      } else if (this.changed) {
        // this.canvas.setChanged(true);
        // this.canvas.saveHistory("standard,tool");
      }
    });
    this.preview.setAttribute("width", "" + Z4GeometricShapePreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4GeometricShapePreview.PREVIEW_SIZE);
    this.summary.setLayout(new GridBagLayout());
    this.summary.add(this.preview, new GBC(0, 0));
    let selector = new JSButton();
    selector.setText(Z4GeometricShapePreview.SELECTED_GEOMETRIC_SHAPE_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4geometricshapepreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      document.querySelectorAll(".z4geometricshapepreview .z4geometricshapepreview-selector").forEach(element => element.textContent = Z4GeometricShapePreview.UNSELECTED_GEOMETRIC_SHAPE_CONTENT);
      selector.setText(Z4GeometricShapePreview.SELECTED_GEOMETRIC_SHAPE_CONTENT);
      this.canvas.setSelectedGeometricShape(this.shape);
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendChildInTree("summary", this.summary);
    // 
    // this.editor.cssAddClass("z4geometricshapepreview-editor");
    // this.editor.addChangeListener(event -> this.computePopupPosition());
    // 
    // JSPanel panelBasic = new JSPanel();
    // panelBasic.setLayout(new GridBagLayout());
    // 
    // this.editName.addActionListener(event -> {
    // String newName = this.editName.getText();
    // if ($exists(newName)) {
    // this.changed = true;
    // this.canvas.setSaved(false);
    // this.name.setText(newName);
    // this.layer.setName(newName);
    // this.setChildAttributeByQuery("summary", "title", newName);
    // }
    // });
    // 
    // Z4UI.addLabel(panelBasic, Z4Translations.LAYER_NAME, new GBC(0, 0).a(GBC.WEST).wx(1));
    // panelBasic.add(this.size, new GBC(1, 0).a(GBC.EAST).w(4));
    // panelBasic.add(this.editName, new GBC(0, 1).w(5).a(GBC.WEST).f(GBC.HORIZONTAL).i(0, 0, 5, 0));
    // 
    // Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_X, new GBC(0, 2).a(GBC.WEST));
    // 
    // this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    // this.offsetXSpinner.addChangeListener(event -> this.onChange(true, this.offsetXSpinner.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    // panelBasic.add(this.offsetXSpinner, new GBC(1, 2).a(GBC.EAST));
    // 
    // this.offsetXSlider.getStyle().minWidth = "20rem";
    // this.offsetXSlider.addChangeListener(event -> this.onChange(false, this.offsetXSlider.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    // panelBasic.add(this.offsetXSlider, new GBC(0, 3).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    // 
    // Z4UI.addLabel(panelBasic, Translations.JSColorChooser_OPACITY, new GBC(0, 4).a(GBC.WEST));
    // 
    // this.opacitySpinner.cssAddClass("jsspinner_w_4rem");
    // this.opacitySpinner.addChangeListener(event -> this.onChange(true, this.opacitySpinner.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    // panelBasic.add(this.opacitySpinner, new GBC(1, 4).a(GBC.EAST));
    // 
    // this.opacitySlider.addChangeListener(event -> this.onChange(false, this.opacitySlider.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    // this.opacitySlider.getStyle().minWidth = "20rem";
    // panelBasic.add(this.opacitySlider, new GBC(0, 5).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    // 
    // Z4UI.addVLine(panelBasic, new GBC(2, 2).h(6).f(GBC.VERTICAL).i(1, 2, 1, 2));
    // Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_Y, new GBC(3, 5).h(3).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    // 
    // this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    // this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    // this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    // this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    // this.offsetYSpinner.addChangeListener(event -> this.onChange(true, this.offsetYSpinner.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    // panelBasic.add(this.offsetYSpinner, new GBC(3, 2).h(3).a(GBC.NORTH));
    // 
    // this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    // this.offsetYSlider.setInverted(true);
    // this.offsetYSlider.getStyle().minHeight = "20rem";
    // this.offsetYSlider.getStyle().minWidth = "1.5rem";
    // this.offsetYSlider.addChangeListener(event -> this.onChange(false, this.offsetYSlider.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    // panelBasic.add(this.offsetYSlider, new GBC(4, 2).h(6).wy(1).a(GBC.NORTH));
    // 
    // JSCheckBox showLayerBounds = new JSCheckBox();
    // showLayerBounds.setText(Z4Translations.SHOW_LAYER_BOUNDS);
    // showLayerBounds.addActionListener(event -> {
    // this.layer.setShowBounds(showLayerBounds.isSelected());
    // this.canvas.drawCanvasBounds();
    // });
    // panelBasic.add(showLayerBounds, new GBC(0, 6).a(GBC.NORTHWEST));
    // 
    // button = new JSButton();
    // button.setText(Z4Translations.DUPLICATE);
    // button.addActionListener(event -> {
    // this.changed = true;
    // this.canvas.duplicateLayer(this.layer);
    // this.removeAttribute("open");
    // });
    // panelBasic.add(button, new GBC(0, 7).a(GBC.SOUTHWEST));
    // 
    // this.delete.setText(Z4Translations.DELETE);
    // this.delete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_LAYER_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
    // if (response == JSOptionPane.YES_OPTION) {
    // this.changed = true;
    // int index = this.canvas.deleteLayer(this.layer, false);
    // document.querySelector(".z4geometricshapepreview:nth-child(" + (index + 1) + ")").remove();
    // }
    // }));
    // panelBasic.add(this.delete, new GBC(1, 7).a(GBC.SOUTHEAST));
    // 
    // this.editor.addTab(Z4Translations.BASIC, panelBasic);
    // 
    // JSPanel panelAdvanced = new JSPanel();
    // panelAdvanced.setLayout(new GridBagLayout());
    // 
    // Z4UI.addLabel(panelAdvanced, Z4Translations.COMPOSITE_OPERATION, new GBC(0, 0).a(GBC.WEST));
    // 
    // Z4Constants.COMPOSITE_OPERATION.forEach((array, index, parent) -> {
    // array.forEach((element, index2, array2) -> {
    // JSRadioButton radio = new JSRadioButton();
    // radio.setContentAreaFilled(false);
    // radio.setToggle();
    // radio.setText(element);
    // radio.setTooltip(Z4Translations.$get("COMPOSITE_OPERATION_" + element.toUpperCase().replace("-", "_")));
    // radio.addActionListener(event -> this.onAction(element));
    // 
    // this.compositeOperations.push(radio);
    // this.compositeOperationsGroup.add(radio);
    // 
    // panelAdvanced.add(radio, new GBC(index2, index + 1).a(GBC.WEST).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
    // });
    // });
    // 
    // this.editor.addTab(Z4Translations.ADVANCED, panelAdvanced);
    // 
    // JSPanel panelTransform = new JSPanel();
    // panelTransform.setLayout(new GridBagLayout());
    // 
    // this.editor.addTab(Z4Translations.TRANSFORM, panelTransform);
    // this.addButton(panelTransform, Z4Translations.FLIP_HORIZONTAL, 0, 0, event -> {
    // this.layer.flipHorizonal();
    // this.afterTransform();
    // });
    // this.addButton(panelTransform, Z4Translations.FLIP_VERTICAL, 1, 0, event -> {
    // this.layer.flipVertical();
    // this.afterTransform();
    // });
    // this.addButton(panelTransform, Z4Translations.RESIZE, 2, 0, event -> {
    // Dimension layerSize = this.layer.getSize();
    // $OffscreenCanvas offsetCanvas = new $OffscreenCanvas(layerSize.width, layerSize.height);
    // this.layer.draw(offsetCanvas.getContext("2d"), true);
    // 
    // Z4ResizeImagePanel resizeImagePanel = new Z4ResizeImagePanel();
    // resizeImagePanel.setCanvas(offsetCanvas, layerSize.width, layerSize.height);
    // 
    // JSOptionPane.showInputDialog(resizeImagePanel, Z4Translations.RESIZE, listener -> resizeImagePanel.addChangeListener(listener), () -> {
    // Z4ResizeOptions resizeOptions = resizeImagePanel.getResizeOptions();
    // boolean containerOK = 0 < resizeOptions.containerWidth && resizeOptions.containerWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.containerHeight && resizeOptions.containerHeight <= Z4Constants.MAX_IMAGE_SIZE;
    // boolean contentOK = 0 < resizeOptions.contentWidth && resizeOptions.contentWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.contentHeight && resizeOptions.contentHeight <= Z4Constants.MAX_IMAGE_SIZE;
    // return containerOK && contentOK;
    // }, response -> {
    // if (response == JSOptionPane.OK_OPTION) {
    // this.layer.resize(resizeImagePanel.getResizeOptions());
    // this.setLayer(this.canvas, this.layer);
    // this.afterTransform();
    // }
    // });
    // });
    // this.addButton(panelTransform, Z4Translations.ROTATE_PLUS_90, 0, 1, event -> {
    // this.layer.rotatePlus90();
    // this.setLayer(this.canvas, this.layer);
    // this.afterTransform();
    // });
    // this.addButton(panelTransform, Z4Translations.ROTATE_MINUS_90, 1, 1, event -> {
    // this.layer.rotatePlus90();
    // this.layer.rotatePlus90();
    // this.layer.rotatePlus90();
    // this.setLayer(this.canvas, this.layer);
    // this.afterTransform();
    // });
    // this.addButton(panelTransform, Z4Translations.ROTATE_180, 2, 1, event -> {
    // this.layer.rotatePlus90();
    // this.layer.rotatePlus90();
    // this.setLayer(this.canvas, this.layer);
    // this.afterTransform();
    // });
    // this.addButton(panelTransform, "", 3, 1, event -> this.setLayer(this.canvas, this.layer)).cssAddClass("z4geometricshapepreview-setlayer");
    // this.appendChild(this.editor);
  }

   addButton(panel, text, gridx, gridy, listener) {
    let button = new JSButton();
    // button.setText(text);
    // button.setContentAreaFilled(false);
    // button.addActionListener(listener);
    // panel.add(button, new GBC(gridx, gridy).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
    return button;
  }

   onChange(spTosl, adjusting, spinner, slider) {
    // this.changed = true;
    // this.canvas.setSaved(false);
    // 
    // if (spTosl) {
    // slider.setValue((int) spinner.getValue());
    // } else {
    // spinner.setValue(slider.getValue());
    // }
    // 
    // if (adjusting) {
    // this.editor.setAttribute("transparent", "true");
    // } else {
    // this.editor.removeAttribute("transparent");
    // }
    // 
    // this.layer.setOpacity(this.opacitySpinner.getValue() / 100);
    // this.layer.move(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    // this.canvas.drawCanvas();
    // this.canvas.drawCanvasBounds();
  }

   onAction(text) {
    // this.changed = true;
    // this.canvas.setSaved(false);
    // this.layer.setCompositeOperation(text);
    // this.canvas.drawCanvas();
  }

  /**
   * Sets the shapes and paths panel
   *
   * @param shapesAndPathsPanel The shapes and paths panel
   */
   setShapesAndPathsPanel(shapesAndPathsPanel) {
    this.shapesAndPathsPanel = shapesAndPathsPanel;
  }

  /**
   * Sets the geometric shape
   *
   * @param canvas The canvas
   * @param shape The geometric shape
   */
   setGeometriShape(canvas, shape) {
    this.canvas = canvas;
    this.shape = shape;
    // this.layer.setLayerPreview(this);
    // 
    let d = canvas.getSize();
    let ratio = d.width / d.height;
    let w = ratio > 1 ? Z4GeometricShapePreview.PREVIEW_SIZE : Z4GeometricShapePreview.PREVIEW_SIZE * ratio;
    let h = ratio > 1 ? Z4GeometricShapePreview.PREVIEW_SIZE / ratio : Z4GeometricShapePreview.PREVIEW_SIZE;
    this.zoom = Math.min(w / d.width, h / d.height);
    this.preview.setAttribute("width", "" + w);
    this.preview.setAttribute("height", "" + h);
    this.preview.getStyle().marginTop = (Z4GeometricShapePreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginBottom = (Z4GeometricShapePreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginLeft = (Z4GeometricShapePreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.preview.getStyle().marginRight = (Z4GeometricShapePreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    // Point p = layer.getOffset();
    // Dimension dC = this.canvas.getSize();
    // this.offsetXSlider.setMinimum(-d.width);
    // this.offsetXSlider.setMaximum(dC.width);
    // this.offsetXSlider.setValue(p.x);
    // this.offsetXSpinner.setModel(new SpinnerNumberModel(p.x, -d.width, dC.width, 1));
    // this.offsetYSlider.setMinimum(-d.height);
    // this.offsetYSlider.setMaximum(dC.height);
    // this.offsetYSlider.setValue(p.y);
    // this.offsetYSpinner.setModel(new SpinnerNumberModel(p.y, -d.height, dC.height, 1));
    // 
    this.drawShape();
  }

  /**
   * Draws the geometric shape
   */
   drawShape() {
    if (this.shape) {
      let polyline = this.shape.getPolyline();
      this.ctx.save();
      this.ctx.lineWidth = 3 / this.zoom;
      this.ctx.scale(this.zoom, this.zoom);
      let dash = new Array();
      this.ctx.beginPath();
      polyline.getControlPoints().forEach((point, index, array) => {
        if (index) {
          this.ctx.lineTo(point.x, point.y);
        } else {
          this.ctx.moveTo(point.x, point.y);
        }
      });
      this.ctx.strokeStyle = Z4Constants.getStyle("green");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();
      dash.push(2.5, 2.5);
      this.ctx.beginPath();
      polyline.getControlPoints().forEach((point, index, array) => {
        if (index) {
          this.ctx.lineTo(point.x, point.y);
        } else {
          this.ctx.moveTo(point.x, point.y);
        }
      });
      this.ctx.strokeStyle = Z4Constants.getStyle("white");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}
