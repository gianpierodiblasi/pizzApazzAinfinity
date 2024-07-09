/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4LayerPreview extends JSDropDown {

   summary = new JSPanel();

   name = new JSLabel();

   eye = new JSButton();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   editor = new JSTabbedPane();

   editName = new JSTextField();

   size = new JSLabel();

   offsetXSlider = new JSSlider();

   offsetXSpinner = new JSSpinner();

   offsetYSlider = new JSSlider();

   offsetYSpinner = new JSSpinner();

   opacitySlider = new JSSlider();

   opacitySpinner = new JSSpinner();

   compositeOperations = new Array();

   compositeOperationsGroup = new ButtonGroup();

   delete = new JSButton();

   ribbonLayerPanel = null;

   canvas = null;

   layer = null;

   zoom = 1;

   changed = false;

  /**
   * The text content for the selected button
   */
  static  SELECTED_LAYER_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_LAYER_CONTENT = "-";

  /**
   * The text content for the visible button
   */
  static  VISIBLE_LAYER_CONTENT = "#";

  static  PREVIEW_SIZE = 50;

  constructor() {
    super(".z4layerpreview-editor");
    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
        this.delete.setEnabled(this.canvas.getLayersCount() > 1);
      } else if (this.changed) {
        this.canvas.setChanged(true);
        this.canvas.saveHistory("standard,tool");
      }
    });
    this.name.getStyle().width = (Z4LayerPreview.PREVIEW_SIZE + 35) + "px";
    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.summary.setLayout(new GridBagLayout());
    this.summary.add(this.name, new GBC(0, 0).w(3));
    this.summary.add(this.preview, new GBC(1, 1).h(3).f(GBC.BOTH));
    this.eye.setText(Z4LayerPreview.VISIBLE_LAYER_CONTENT);
    this.eye.setTooltip(Z4Translations.VISIBLE);
    this.eye.setContentAreaFilled(false);
    this.eye.addActionListener(event => {
      let b = !this.layer.isHidden();
      if (b) {
        this.eye.getStyle().removeProperty("color");
      } else {
        this.eye.getStyle().color = "var(--main-action-bgcolor)";
      }
      this.layer.setHidden(b);
      this.canvas.setChanged(true);
      this.canvas.setSaved(false);
      this.canvas.drawCanvas();
    });
    this.summary.add(this.eye, new GBC(0, 1).f(GBC.BOTH).i(0, 0, 0, 2));
    let selector = new JSButton();
    selector.setText(Z4LayerPreview.SELECTED_LAYER_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4layerpreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      document.querySelectorAll(".z4layerpreview .z4layerpreview-selector").forEach(element => element.textContent = Z4LayerPreview.UNSELECTED_LAYER_CONTENT);
      selector.setText(Z4LayerPreview.SELECTED_LAYER_CONTENT);
      this.canvas.setSelectedLayer(this.layer);
    });
    this.summary.add(selector, new GBC(2, 1).f(GBC.BOTH).i(0, 2, 0, 0));
    let button = new JSButton();
    button.setText("\uD83E\uDC08");
    button.setTooltip(Z4Translations.MOVE_DOWN);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.move(-1));
    this.summary.add(button, new GBC(0, 2).f(GBC.BOTH).i(0, 0, 0, 2));
    button = new JSButton();
    button.setText("\u2BEC");
    button.setTooltip(Z4Translations.MOVE_BOTTOM);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.ribbonLayerPanel.moveLayer(this, this.layer, 0));
    this.summary.add(button, new GBC(0, 3).f(GBC.BOTH).i(0, 0, 0, 2));
    button = new JSButton();
    button.setText("\uD83E\uDC0A");
    button.setTooltip(Z4Translations.MOVE_UP);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.move(2));
    this.summary.add(button, new GBC(2, 2).f(GBC.BOTH).i(0, 2, 0, 0));
    button = new JSButton();
    button.setText("\u2BEE");
    button.setTooltip(Z4Translations.MOVE_TOP);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.ribbonLayerPanel.moveLayer(this, this.layer, this.canvas.getLayersCount()));
    this.summary.add(button, new GBC(2, 3).f(GBC.BOTH).i(0, 2, 0, 0));
    Z4UI.addVLine(this.summary, new GBC(3, 0).h(4).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.appendChildInTree("summary", this.summary);
    this.editor.cssAddClass("z4layerpreview-editor");
    this.editor.addChangeListener(event => this.computePopupPosition());
    let panelBasic = new JSPanel();
    panelBasic.setLayout(new GridBagLayout());
    this.editName.addActionListener(event => {
      let newName = this.editName.getText();
      if (newName) {
        this.changed = true;
        this.canvas.setSaved(false);
        this.name.setText(newName);
        this.layer.setName(newName);
        this.setChildAttributeByQuery("summary", "title", newName);
      }
    });
    Z4UI.addLabel(panelBasic, Z4Translations.LAYER_NAME, new GBC(0, 0).a(GBC.WEST).wx(1));
    panelBasic.add(this.size, new GBC(1, 0).a(GBC.EAST).w(4));
    panelBasic.add(this.editName, new GBC(0, 1).w(5).a(GBC.WEST).f(GBC.HORIZONTAL).i(0, 0, 5, 0));
    Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_X, new GBC(0, 2).a(GBC.WEST));
    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event => this.onChange(true, this.offsetXSpinner.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    panelBasic.add(this.offsetXSpinner, new GBC(1, 2).a(GBC.EAST));
    this.offsetXSlider.getStyle().minWidth = "20rem";
    this.offsetXSlider.addChangeListener(event => this.onChange(false, this.offsetXSlider.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    panelBasic.add(this.offsetXSlider, new GBC(0, 3).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    Z4UI.addLabel(panelBasic, Translations.JSColorChooser_OPACITY, new GBC(0, 4).a(GBC.WEST));
    this.opacitySpinner.cssAddClass("jsspinner_w_4rem");
    this.opacitySpinner.addChangeListener(event => this.onChange(true, this.opacitySpinner.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    panelBasic.add(this.opacitySpinner, new GBC(1, 4).a(GBC.EAST));
    this.opacitySlider.addChangeListener(event => this.onChange(false, this.opacitySlider.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.opacitySlider.getStyle().minWidth = "20rem";
    panelBasic.add(this.opacitySlider, new GBC(0, 5).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    Z4UI.addVLine(panelBasic, new GBC(2, 2).h(6).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_Y, new GBC(3, 5).h(3).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event => this.onChange(true, this.offsetYSpinner.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    panelBasic.add(this.offsetYSpinner, new GBC(3, 2).h(3).a(GBC.NORTH));
    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minHeight = "20rem";
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event => this.onChange(false, this.offsetYSlider.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    panelBasic.add(this.offsetYSlider, new GBC(4, 2).h(6).wy(1).a(GBC.NORTH));
    let showLayerBounds = new JSCheckBox();
    showLayerBounds.setText(Z4Translations.SHOW_LAYER_BOUNDS);
    showLayerBounds.addActionListener(event => {
      this.layer.setShowBounds(showLayerBounds.isSelected());
      this.canvas.drawCanvasBounds();
    });
    panelBasic.add(showLayerBounds, new GBC(0, 6).a(GBC.NORTHWEST));
    button = new JSButton();
    button.setText(Z4Translations.DUPLICATE);
    button.addActionListener(event => {
      this.changed = true;
      this.canvas.duplicateLayer(this.layer);
      this.removeAttribute("open");
    });
    panelBasic.add(button, new GBC(0, 7).a(GBC.SOUTHWEST));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_LAYER_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.changed = true;
        let index = this.canvas.deleteLayer(this.layer, false);
        document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
    panelBasic.add(this.delete, new GBC(1, 7).a(GBC.SOUTHEAST));
    this.editor.addTab(Z4Translations.BASIC, panelBasic);
    let panelAdvanced = new JSPanel();
    panelAdvanced.setLayout(new GridBagLayout());
    Z4UI.addLabel(panelAdvanced, Z4Translations.COMPOSITE_OPERATION, new GBC(0, 0).a(GBC.WEST));
    Z4Constants.COMPOSITE_OPERATION.forEach((array, index, parent) => {
      array.forEach((element, index2, array2) => {
        let radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setText(element);
        radio.setTooltip(Z4Translations["COMPOSITE_OPERATION_" + element.toUpperCase().replace("-", "_")]);
        radio.addActionListener(event => this.onAction(element));
        this.compositeOperations.push(radio);
        this.compositeOperationsGroup.add(radio);
        panelAdvanced.add(radio, new GBC(index2, index + 1).a(GBC.WEST).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
      });
    });
    this.editor.addTab(Z4Translations.ADVANCED, panelAdvanced);
    let panelTransform = new JSPanel();
    panelTransform.setLayout(new GridBagLayout());
    this.editor.addTab(Z4Translations.TRANSFORM, panelTransform);
    this.addButton(panelTransform, Z4Translations.FLIP_HORIZONTAL, 0, 0, event => {
      this.layer.flipHorizonal();
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.FLIP_VERTICAL, 1, 0, event => {
      this.layer.flipVertical();
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.RESIZE, 2, 0, event => {
      let layerSize = this.layer.getSize();
      let offsetCanvas = new OffscreenCanvas(layerSize.width, layerSize.height);
      this.layer.draw(offsetCanvas.getContext("2d"), true);
      let resizeImagePanel = new Z4ResizeImagePanel();
      resizeImagePanel.setCanvas(offsetCanvas, layerSize.width, layerSize.height);
      JSOptionPane.showInputDialog(resizeImagePanel, Z4Translations.RESIZE, listener => resizeImagePanel.addChangeListener(listener), () => {
        let resizeOptions = resizeImagePanel.getResizeOptions();
        let containerOK = 0 < resizeOptions.containerWidth && resizeOptions.containerWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.containerHeight && resizeOptions.containerHeight < Z4Constants.MAX_IMAGE_SIZE;
        let contentOK = 0 < resizeOptions.contentWidth && resizeOptions.contentWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.contentHeight && resizeOptions.contentHeight < Z4Constants.MAX_IMAGE_SIZE;
        return containerOK && contentOK;
      }, response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.layer.resize(resizeImagePanel.getResizeOptions());
          this.setLayer(this.canvas, this.layer);
          this.afterTransform();
        }
      });
    });
    this.addButton(panelTransform, Z4Translations.ROTATE_PLUS_90, 0, 1, event => {
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.ROTATE_MINUS_90, 1, 1, event => {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.ROTATE_180, 2, 1, event => {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTransform, "", 3, 1, event => this.setLayer(this.canvas, this.layer)).cssAddClass("z4layerpreview-setlayer");
    this.appendChild(this.editor);
  }

   addButton(panel, text, gridx, gridy, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    panel.add(button, new GBC(gridx, gridy).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
    return button;
  }

   afterTransform() {
    this.changed = true;
    this.drawLayer();
    this.canvas.setSaved(false);
    this.canvas.drawCanvas();
    this.canvas.drawCanvasBounds();
  }

   onChange(spTosl, adjusting, spinner, slider) {
    this.changed = true;
    this.canvas.setSaved(false);
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    if (adjusting) {
      this.editor.setAttribute("offset", "true");
    } else {
      this.editor.removeAttribute("offset");
    }
    this.layer.setOpacity(this.opacitySpinner.getValue() / 100);
    this.layer.move(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.canvas.drawCanvas();
    this.canvas.drawCanvasBounds();
  }

   onAction(text) {
    this.changed = true;
    this.canvas.setSaved(false);
    this.layer.setCompositeOperation(text);
    this.canvas.drawCanvas();
  }

   move(direction) {
    this.cssAddClass("z4layerpreview-move");
    let moveIndex = -1;
    let move = document.querySelector(".z4layerpreview-move");
    for (let index = 0; index < move.parentElement.children.length; index++) {
      if (move === move.parentElement.children.item(index)) {
        moveIndex = index;
      }
    }
    if ((direction < 0 && moveIndex > 0) || (direction > 0 && moveIndex < this.canvas.getLayersCount() - 1)) {
      this.removeAttribute("open");
      this.ribbonLayerPanel.moveLayer(this, this.layer, moveIndex + direction);
    }
    this.cssRemoveClass("z4layerpreview-move");
  }

  /**
   * Sets the riboon layer panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   */
   setRibbonLayerPanel(ribbonLayerPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
  }

  /**
   * Sets the layer
   *
   * @param canvas The canvas
   * @param layer The layer
   */
   setLayer(canvas, layer) {
    this.canvas = canvas;
    this.layer = layer;
    this.layer.setLayerPreview(this);
    this.name.setText(this.layer.getName());
    this.size.setText(this.layer.getSize().width + " x " + this.layer.getSize().height);
    this.editName.setText(this.layer.getName());
    this.setChildAttributeByQuery("summary", "title", this.layer.getName());
    if (this.layer.isHidden()) {
      this.eye.getStyle().removeProperty("color");
    } else {
      this.eye.getStyle().color = "var(--main-action-bgcolor)";
    }
    let d = layer.getSize();
    let ratio = d.width / d.height;
    let w = ratio > 1 ? Z4LayerPreview.PREVIEW_SIZE : Z4LayerPreview.PREVIEW_SIZE * ratio;
    let h = ratio > 1 ? Z4LayerPreview.PREVIEW_SIZE / ratio : Z4LayerPreview.PREVIEW_SIZE;
    this.zoom = Math.min(w / d.width, h / d.height);
    this.preview.setAttribute("width", "" + w);
    this.preview.setAttribute("height", "" + h);
    this.preview.getStyle().marginTop = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginBottom = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginLeft = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.preview.getStyle().marginRight = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    let p = layer.getOffset();
    let dC = this.canvas.getSize();
    this.offsetXSlider.setMinimum(-d.width);
    this.offsetXSlider.setMaximum(dC.width);
    this.offsetXSlider.setValue(p.x);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(p.x, -d.width, dC.width, 1));
    this.offsetYSlider.setMinimum(-d.height);
    this.offsetYSlider.setMaximum(dC.height);
    this.offsetYSlider.setValue(p.y);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(p.y, -d.height, dC.height, 1));
    this.opacitySlider.setValue(parseInt(100 * layer.getOpacity()));
    this.opacitySpinner.setModel(new SpinnerNumberModel(parseInt(100 * layer.getOpacity()), 0, 100, 1));
    this.compositeOperations.forEach(button => button.setSelected(button.getText() === layer.getCompositeOperation()));
    this.drawLayer();
  }

  /**
   * Draws the layer
   */
   drawLayer() {
    if (this.layer) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true);
      this.ctx.restore();
    }
  }
}
