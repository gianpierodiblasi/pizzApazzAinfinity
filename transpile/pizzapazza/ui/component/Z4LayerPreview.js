/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4LayerPreview extends JSComponent {

   summary = new JSPanel();

   name = new JSLabel();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   editor = new JSTabbedPane();

   editName = new JSTextField();

   offsetXSlider = new JSSlider();

   offsetXSpinner = new JSSpinner();

   offsetYSlider = new JSSlider();

   offsetYSpinner = new JSSpinner();

   opacitySlider = new JSSlider();

   opacitySpinner = new JSSpinner();

   compositeOperations = new Array();

   compositeOperationsGroup = new ButtonGroup();

   delete = new JSButton();

   canvas = null;

   layer = null;

   zoom = 1;

   changed = false;

  static  PREVIEW_SIZE = 50;

  constructor() {
    super(document.createElement("details"));
    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
        this.getChilStyleByQuery(".z4layerpreview-editor").visibility = "visible";
        let rect = this.invokeInTree(".z4layerpreview-editor", "getBoundingClientRect()");
        let rectSummary = this.invokeInTree("summary", "getBoundingClientRect()");
        if (rectSummary.left + rect.width < document.body.scrollWidth) {
          this.getChilStyleByQuery(".z4layerpreview-editor").left = rectSummary.left + "px";
        } else if (rectSummary.right - rect.width > 0) {
          this.getChilStyleByQuery(".z4layerpreview-editor").left = (rectSummary.right - rect.width) + "px";
        } else {
          this.getChilStyleByQuery(".z4layerpreview-editor").left = "auto";
          this.getChilStyleByQuery(".z4layerpreview-editor").right = "5px";
        }
        if (rectSummary.bottom + rect.height < document.body.scrollHeight) {
          this.getChilStyleByQuery(".z4layerpreview-editor").top = rectSummary.bottom + "px";
        } else if (rectSummary.top - rect.height > 0) {
          this.getChilStyleByQuery(".z4layerpreview-editor").top = "calc(" + (rectSummary.top - rect.height) + "px - 1rem)";
        } else {
          this.getChilStyleByQuery(".z4layerpreview-editor").top = "auto";
          this.getChilStyleByQuery(".z4layerpreview-editor").bottom = "5px";
        }
        this.delete.setEnabled(document.querySelectorAll(".z4layerpreview").length > 1);
      } else {
        if (this.changed) {
          this.canvas.saveHistory();
        }
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("visibility");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("top");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("bottom");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("left");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("right");
      }
    });
    this.name.getStyle().width = Z4LayerPreview.PREVIEW_SIZE + "px";
    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.summary.setLayout(new BorderLayout(0, 0));
    this.summary.add(this.name, BorderLayout.NORTH);
    this.summary.add(this.preview, BorderLayout.CENTER);
    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);
    this.editor.cssAddClass("z4layerpreview-editor");
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
    this.addLabel(panelBasic, Z4Translations.LAYER_NAME, 0, 0, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.addComponent(panelBasic, this.editName, 0, 1, 5, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, new Insets(0, 0, 5, 0));
    this.addLabel(panelBasic, Z4Translations.OFFSET_X, 0, 2, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event => this.onChange(true, this.offsetXSpinner.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    this.addComponent(panelBasic, this.offsetXSpinner, 1, 2, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
    this.offsetXSlider.getStyle().minWidth = "20rem";
    this.offsetXSlider.addChangeListener(event => this.onChange(false, this.offsetXSlider.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    this.addComponent(panelBasic, this.offsetXSlider, 0, 3, 2, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    this.addLabel(panelBasic, Translations.JSColorChooser_OPACITY, 0, 4, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.opacitySpinner.cssAddClass("jsspinner_w_4rem");
    this.opacitySpinner.addChangeListener(event => this.onChange(true, this.opacitySpinner.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.addComponent(panelBasic, this.opacitySpinner, 1, 4, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
    this.opacitySlider.addChangeListener(event => this.onChange(false, this.opacitySlider.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.opacitySlider.getStyle().minWidth = "20rem";
    this.addComponent(panelBasic, this.opacitySlider, 0, 5, 2, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    this.addVLine(panelBasic, 2, 2, 1, 5, GridBagConstraints.CENTER, GridBagConstraints.VERTICAL);
    this.addLabel(panelBasic, Z4Translations.OFFSET_Y, 3, 5, 1, 1, GridBagConstraints.SOUTH, GridBagConstraints.NONE).cssAddClass("jslabel-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event => this.onChange(true, this.offsetYSpinner.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    this.addComponent(panelBasic, this.offsetYSpinner, 3, 2, 1, 3, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.NONE, null);
    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minHeight = "20rem";
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event => this.onChange(false, this.offsetYSlider.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    this.addComponent(panelBasic, this.offsetYSlider, 4, 2, 1, 4, 0, 1, GridBagConstraints.NORTH, GridBagConstraints.NONE, null);
    let button = new JSButton();
    button.setText(Z4Translations.DUPLICATE);
    button.addActionListener(event => {
      this.changed = true;
      this.canvas.duplicateLayer(this.layer);
      this.removeAttribute("open");
    });
    this.addComponent(panelBasic, button, 0, 6, 1, 1, 0, 0, GridBagConstraints.SOUTHWEST, GridBagConstraints.NONE, null);
    this.delete.setText(Z4Translations.DELETE);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_LAYER_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.changed = true;
        let index = this.canvas.deleteLayer(this.layer);
        document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
    this.addComponent(panelBasic, this.delete, 1, 6, 1, 1, 0, 0, GridBagConstraints.SOUTHEAST, GridBagConstraints.NONE, null);
    this.editor.addTab(Z4Translations.BASIC, panelBasic);
    let panelAdvanced = new JSPanel();
    panelAdvanced.setLayout(new GridBagLayout());
    this.addLabel(panelAdvanced, Z4Translations.COMPOSITE_OPERATION, 0, 0, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
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
        this.addComponent(panelAdvanced, radio, index2, index + 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, new Insets(1, 1, 1, 1));
      });
    });
    this.editor.addTab(Z4Translations.ADVANCED, panelAdvanced);
    let panelTranform = new JSPanel();
    panelTranform.setLayout(new GridBagLayout());
    this.editor.addTab(Z4Translations.TRANSFORM, panelTranform);
    this.addButton(panelTranform, Z4Translations.FLIP_HORIZONTAL, 0, 0, () => this.layer.flipHorizonal());
    this.addButton(panelTranform, Z4Translations.FLIP_VERTICAL, 1, 0, () => this.layer.flipVertical());
    this.addButton(panelTranform, Z4Translations.ROTATE_PLUS_90, 0, 1, () => {
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_MINUS_90, 1, 1, () => {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_180, 0, 2, () => {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
    });
    this.appendChild(this.editor);
  }

   addButton(panel, text, gridx, gridy, func) {
    let button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(event => {
      this.changed = true;
      func();
      this.drawLayer();
      this.canvas.setSaved(false);
      this.canvas.drawCanvas();
    });
    this.addComponent(panel, button, gridx, gridy, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(1, 1, 1, 1));
  }

   addLabel(panel, text, gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let label = new JSLabel();
    label.setText(text);
    this.addComponent(panel, label, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, null);
    return label;
  }

   addVLine(panel, gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    this.addComponent(panel, div, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, new Insets(1, 2, 1, 2));
  }

   addComponent(panel, component, gridx, gridy, gridwidth, gridheight, weightx, weighty, anchor, fill, insets) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if (insets) {
      constraints.insets = insets;
    }
    panel.add(component, constraints);
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
  }

   onAction(text) {
    this.changed = true;
    this.canvas.setSaved(false);
    this.layer.setCompositeOperation(text);
    this.canvas.drawCanvas();
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
    this.name.setText(this.layer.getName());
    this.editName.setText(this.layer.getName());
    this.setChildAttributeByQuery("summary", "title", this.layer.getName());
    let d = layer.getSize();
    let ratio = d.width / d.height;
    let w = 0.0;
    let h = 0.0;
    if (ratio > 1) {
      w = Z4LayerPreview.PREVIEW_SIZE;
      h = Z4LayerPreview.PREVIEW_SIZE / ratio;
    } else {
      w = Z4LayerPreview.PREVIEW_SIZE * ratio;
      h = Z4LayerPreview.PREVIEW_SIZE;
    }
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

   drawLayer() {
    if (this.layer) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true);
      this.ctx.restore();
    }
  }
}
