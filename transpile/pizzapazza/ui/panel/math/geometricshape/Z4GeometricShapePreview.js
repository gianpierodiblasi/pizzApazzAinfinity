/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapePreview extends JSDropDown {

   summary = new JSPanel();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   editor = new JSPanel();

   xSlider = new JSSlider();

   xSpinner = new JSSpinner();

   ySlider = new JSSlider();

   ySpinner = new JSSpinner();

   radioPanel = new JSPanel();

   spinnerPanel = new JSPanel();

   buttonPanel = new JSPanel();

   radios = new Array();

   shapesAndPathsPanel = null;

   canvas = null;

   shape = null;

   zoom = 1;

   selectedControlPoint = 0;

   changed = false;

   spinnerPanelDone = false;

  /**
   * The text content for the selected button
   */
  static  SELECTED_GEOMETRIC_SHAPE_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_GEOMETRIC_SHAPE_CONTENT = "-";

  static  PREVIEW_SIZE = 75;

  /**
   * Creates the object
   */
  constructor() {
    super(".z4geometricshapepreview-editor");
    this.cssAddClass("z4geometricshapepreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
      } else if (this.changed) {
        this.canvas.setSaved(false);
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
      this.canvas.setSelectedGeometricShape(this.shape, this.selectedControlPoint);
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendChildInTree("summary", this.summary);
    this.editor.cssAddClass("z4geometricshapepreview-editor");
    this.editor.setLayout(new GridBagLayout());
    Z4UI.addLabel(this.editor, "x", new GBC(0, 0).a(GBC.WEST));
    this.xSpinner.cssAddClass("jsspinner_w_4rem");
    this.xSpinner.addChangeListener(event => this.onChange(true, this.xSpinner.getValueIsAdjusting(), this.xSpinner, this.xSlider));
    this.editor.add(this.xSpinner, new GBC(1, 0).a(GBC.EAST));
    this.xSlider.getStyle().minWidth = "20rem";
    this.xSlider.addChangeListener(event => this.onChange(false, this.xSlider.getValueIsAdjusting(), this.xSpinner, this.xSlider));
    this.editor.add(this.xSlider, new GBC(0, 1).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    Z4UI.addVLine(this.editor, new GBC(2, 0).h(7).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this.editor, "y", new GBC(3, 3).h(4).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.editor.add(this.radioPanel, new GBC(0, 2).wh(2, 2).f(GBC.BOTH));
    this.spinnerPanel.setLayout(new GridBagLayout());
    this.editor.add(this.spinnerPanel, new GBC(0, 4).w(2).f(GBC.BOTH));
    this.editor.add(this.buttonPanel, new GBC(0, 5).w(2).f(GBC.BOTH));
    this.ySpinner.cssAddClass("jsspinner-vertical");
    this.ySpinner.cssAddClass("jsspinner_h_4rem");
    this.ySpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.ySpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.ySpinner.addChangeListener(event => this.onChange(true, this.ySpinner.getValueIsAdjusting(), this.ySpinner, this.ySlider));
    this.editor.add(this.ySpinner, new GBC(3, 0).h(3).a(GBC.NORTH));
    this.ySlider.setOrientation(JSSlider.VERTICAL);
    this.ySlider.setInverted(true);
    this.ySlider.getStyle().minHeight = "20rem";
    this.ySlider.getStyle().minWidth = "1.5rem";
    this.ySlider.addChangeListener(event => this.onChange(false, this.ySlider.getValueIsAdjusting(), this.ySpinner, this.ySlider));
    this.editor.add(this.ySlider, new GBC(4, 0).h(7).wy(1).a(GBC.NORTH).f(GBC.VERTICAL));
    let button = new JSButton();
    button.setText(Z4Translations.DUPLICATE);
    button.addActionListener(event => {
      this.changed = true;
      this.canvas.addGeometricShape(Z4GeometricShape.fromJSON(this.shape.toJSON()));
      this.removeAttribute("open");
      setTimeout(() => document.querySelector(".z4geometricshapepreview:nth-last-child(1)").setAttribute("open", "open"), 0);
    });
    this.editor.add(button, new GBC(0, 6).a(GBC.SOUTHWEST));
    button = new JSButton();
    button.setText(Z4Translations.DELETE);
    button.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_SHAPES_AND_PATHS_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.changed = true;
        let index = this.canvas.deleteGeometricShape(this.shape);
        document.querySelector(".z4geometricshapepreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
    this.editor.add(button, new GBC(1, 6).a(GBC.SOUTHEAST));
    // 
    // this.addButton(panelTransform, "", 3, 1, event -> this.setGeometriShape(this.canvas, this.shape)).cssAddClass("z4geometricshapepreview-setgeometricshape");
    this.appendChild(this.editor);
  }

   onChange(spTosl, adjusting, spinner, slider) {
    this.changed = true;
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    if (adjusting) {
      this.editor.setAttribute("transparent", "true");
    } else {
      this.editor.removeAttribute("transparent");
    }
    let newShape = this.shape.fromDataChanged(this.shape.getControlPoints(), this.xSlider.getValue(), this.ySlider.getValue(), this.selectedControlPoint, 0, -1, this.canvas.getSize().width, this.canvas.getSize().height);
    this.canvas.replaceGeometricShape(this.shape, newShape, this.selectedControlPoint);
    this.setGeometriShape(this.canvas, newShape);
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
    this.shape.setGeometricShapePreview(this);
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
    this.radios.length = 0;
    this.radioPanel.setContent("");
    let buttonGroup = new ButtonGroup();
    this.shape.getControlPoints().forEach((controlPoint, index, array) => {
      let radio = new JSRadioButton();
      radio.setSelected(index === this.selectedControlPoint);
      radio.setText("" + (index + 1));
      radio.addActionListener(event => this.setSelectedControlPoint(index));
      this.radios.push(radio);
      this.radioPanel.add(radio, null);
      buttonGroup.add(radio);
    });
    if (!this.spinnerPanelDone) {
      let map = new Array();
      let spinnerConfigurations = this.shape.getSpinnerConfigurations();
      spinnerConfigurations.forEach(spinnerConfiguration => {
        if (!map[spinnerConfiguration.grouping]) {
          map[spinnerConfiguration.grouping] = new Array();
        }
        (map[spinnerConfiguration.grouping]).push(spinnerConfiguration);
      });
      let max = Object.keys(map).length ? Object.keys(map).map(key => (map[key]).length).reduce((accumulator, current, index, array) => Math.max(accumulator, current)) : 0;
      Object.keys(map).forEach((key, index, array) => {
        if (key) {
          let grouping = new JSLabel();
          grouping.setText("" + key);
          this.spinnerPanel.add(grouping, new GBC(0, index * 3).w(max).a(GBC.WEST));
        }
        (map[key]).forEach((spinnerConfiguration, index2, array2) => {
          let label = new JSLabel();
          label.setText(spinnerConfiguration.label);
          this.spinnerPanel.add(label, new GBC(index2, index * 3 + 1).a(GBC.WEST));
          let spinner = new JSSpinner();
          spinner.cssAddClass("jsspinner_w_4rem");
          spinner.setModel(new SpinnerNumberModel(spinnerConfiguration.value, spinnerConfiguration.minimum, spinnerConfiguration.maximum, 1));
          spinner.addChangeListener(event => {
            let newShape = this.shape.fromDataChanged(this.shape.getControlPoints(), 0, 0, -1, spinner.getValue(), spinnerConfigurations.indexOf(spinnerConfiguration), this.canvas.getSize().width, this.canvas.getSize().height);
            this.canvas.replaceGeometricShape(this.shape, newShape, this.selectedControlPoint);
            this.setGeometriShape(this.canvas, newShape);
          });
          this.spinnerPanel.add(spinner, new GBC(index2, index * 3 + 2).f(GBC.HORIZONTAL).i(0, 0, 0, 5));
        });
      });
      this.spinnerPanelDone = true;
    }
    this.buttonPanel.setContent("");
    this.shape.getButtonConfigurations().forEach(buttonConfiguration => {
      let button = new JSButton();
      button.setText(buttonConfiguration.label);
      button.addActionListener(event => buttonConfiguration.onClick(this.shape.getControlPoints(), this.selectedControlPoint, newShape => {
        this.canvas.replaceGeometricShape(this.shape, newShape, this.selectedControlPoint);
        this.setGeometriShape(this.canvas, newShape);
      }));
      this.buttonPanel.add(button, null);
    });
    let p = this.shape.getControlPoints()[this.selectedControlPoint];
    let dC = this.canvas.getSize();
    this.xSlider.setMinimum(0);
    this.xSlider.setMaximum(dC.width);
    this.xSlider.setValue(parseInt(p.x));
    this.xSpinner.setModel(new SpinnerNumberModel(parseInt(p.x), 0, dC.width, 1));
    this.ySlider.setMinimum(0);
    this.ySlider.setMaximum(dC.height);
    this.ySlider.setValue(parseInt(p.y));
    this.ySpinner.setModel(new SpinnerNumberModel(parseInt(p.y), 0, dC.height, 1));
    this.drawShape();
  }

  /**
   * Sets the selected control point
   *
   * @param selectedControlPoint The selected control point
   */
   setSelectedControlPoint(selectedControlPoint) {
    this.selectedControlPoint = selectedControlPoint;
    this.radios[selectedControlPoint].setSelected(true);
    let p = this.shape.getControlPoints()[this.selectedControlPoint];
    this.xSlider.setValue(parseInt(p.x));
    this.xSpinner.setValue(parseInt(p.x));
    this.ySlider.setValue(parseInt(p.y));
    this.ySpinner.setValue(parseInt(p.y));
    this.canvas.replaceGeometricShape(this.shape, this.shape, this.selectedControlPoint);
  }

  /**
   * Sets the position of the selected control point
   *
   * @param x The x-axis coordinate of the selected control point
   * @param y The y-axis coordinate of the selected control point
   */
   setSelectedControlPointPosition(x, y) {
    this.xSlider.setValue(x);
    this.xSpinner.setValue(x);
    this.ySlider.setValue(y);
    this.ySpinner.setValue(y);
    let newShape = this.shape.fromDataChanged(this.shape.getControlPoints(), x, y, this.selectedControlPoint, 0, -1, this.canvas.getSize().width, this.canvas.getSize().height);
    this.canvas.replaceGeometricShape(this.shape, newShape, this.selectedControlPoint);
    this.setGeometriShape(this.canvas, newShape);
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
