/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
class Z4StatusPanel extends JSPanel {

   canvas = null;

   projectName = new JSLabel();

   projectSize = new JSLabel();

   zoom = new JSComboBox();

   mousePosition = new JSLabel();

   color = new JSLabel();

   pickProjectColor = new JSToggleButton();

   pickLayerColor = new JSToggleButton();

   drawingDirection = new JSButton();

   canvasGridPanel = new Z4CanvasGridPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());
    this.projectName.cssAddClass("z4statuspanel-projectname");
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.add(this.projectName, new GBC(0, 0).w(2).a(GBC.WEST).i(0, 5, 0, 5));
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + Z4Constants.DEFAULT_IMAGE_SIZE + " x " + Z4Constants.DEFAULT_IMAGE_SIZE);
    this.add(this.projectSize, new GBC(0, 1).a(GBC.WEST).i(0, 5, 0, 5));
    let zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    Z4Constants.ZOOM_LEVEL.forEach(level => zoomModelAndRenderer.addElement(new KeyValue("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue("FIT", Z4Translations.FIT));
    this.zoom.cssAddClass("z4statuspanel-zoom");
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.setSelectedItem(new KeyValue("1", ""));
    this.zoom.addActionListener(event => this.onZoom());
    this.add(this.zoom, new GBC(1, 1).a(GBC.EAST).i(0, 5, 0, 5));
    Z4UI.addVLine(this, new GBC(2, 0).h(2).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.mousePosition.getStyle().fontFamily = "monospace";
    this.setMousePosition(0, 0);
    this.add(this.mousePosition, new GBC(3, 0).h(2).i(0, 5, 0, 5));
    this.color.getStyle().fontFamily = "monospace";
    this.add(this.color, new GBC(4, 0).h(2).i(0, 5, 0, 5));
    this.pickProjectColor.cssAddClass("z4statuspanel-colorpicker");
    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setTooltip(Z4Translations.PICK_COLOR);
    this.pickProjectColor.setIcon(new Z4EmptyImageProducer(""));
    this.pickProjectColor.addActionListener(event => this.pickColor(this.pickProjectColor));
    this.add(this.pickProjectColor, new GBC(5, 0).i(0, 5, 0, 5));
    this.pickLayerColor.cssAddClass("z4statuspanel-colorpicker");
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setTooltip(Z4Translations.PICK_COLOR);
    this.pickLayerColor.setIcon(new Z4EmptyImageProducer(""));
    this.pickLayerColor.addActionListener(event => this.pickColor(this.pickLayerColor));
    this.add(this.pickLayerColor, new GBC(5, 1).i(0, 5, 0, 5));
    this.drawingDirection.setContentAreaFilled(false);
    this.drawingDirection.setTooltip(Z4Translations.DRAWING_DIRECTION);
    this.drawingDirection.setIcon(new Z4EmptyImageProducer(""));
    this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection");
    this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
    this.drawingDirection.addActionListener(event => this.setDrawingDirection(null));
    this.add(this.drawingDirection, new GBC(6, 0).h(2).i(0, 5, 0, 5));
    this.add(this.canvasGridPanel, new GBC(7, 0).h(2).i(0, 5, 0, 5));
    this.add(new JSLabel(), new GBC(8, 0).wx(1));
  }

   pickColor(pickColor) {
    let selected = pickColor.isSelected();
    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setSelected(false);
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setSelected(false);
    pickColor.setContentAreaFilled(selected);
    pickColor.setSelected(selected);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
    this.canvasGridPanel.setCanvas(canvas);
  }

  /**
   * Sets the project name
   *
   * @param projectName The project name
   */
   setProjectName(projectName) {
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": " + projectName);
    this.projectName.setAttribute("title", projectName);
  }

  /**
   * Sets the project size
   *
   * @param width The width
   * @param height The height
   */
   setProjectSize(width, height) {
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + width + " x " + height);
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
   setMousePosition(x, y) {
    this.mousePosition.setText(new Number(x).toFixed(0).padStart(4, "\u00A0") + " x " + new Number(y).toFixed(0).padEnd(4, "\u00A0"));
    this.canvasGridPanel.setMousePosition(x, y);
    let diff = 0;
    eval("diff = Z4Translations.PROJECT.length - Z4Translations.LAYER.length;");
    this.color.setProperty("innerHTML", this.getColorString(this.canvas ? this.canvas.getColorAt(x, y) : null, Z4Translations.PROJECT, diff < 0 ? -diff : 0) + "<br/>" + this.getColorString(this.canvas ? this.canvas.getSelectedLayerColorAt(x, y) : null, Z4Translations.LAYER, diff > 0 ? diff : 0));
  }

   getColorString(color, string, pad) {
    return string + ": " + new String("").padStart(pad, "\u00A0") + "(" + (color ? new Number(color.red).toFixed(0).padStart(3, "\u00A0") : "---") + ", " + (color ? new Number(color.green).toFixed(0).padStart(3, "\u00A0") : "---") + ", " + (color ? new Number(color.blue).toFixed(0).padStart(3, "\u00A0") : "---") + ", " + (color ? new Number(color.alpha).toFixed(0).padStart(3, "\u00A0") : "---") + ")";
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    if (Z4Constants.ZOOM_LEVEL.findIndex(value => value === zoom) !== -1) {
      this.zoom.setSelectedItem(new KeyValue("" + zoom, ""));
    } else {
      this.zoom.setSelectedItem(new KeyValue("FIT", ""));
    }
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-free");
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-horizontal");
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-vertical");
    if (drawingDirection === Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
    } else if (drawingDirection === Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-horizontal");
    } else if (drawingDirection === Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-vertical");
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-horizontal");
      this.canvas.setDrawingDirection(Z4DrawingDirection.HORIZONTAL);
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-vertical");
      this.canvas.setDrawingDirection(Z4DrawingDirection.VERTICAL);
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
      this.canvas.setDrawingDirection(Z4DrawingDirection.FREE);
    }
  }

  /**
   * Resets the canvas grid panel
   *
   * @param width The canvas width
   * @param height The canvas height
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
   resetCanvasGridPanel(width, height, resetOnlySize) {
    this.canvasGridPanel.reset(width, height, resetOnlySize);
  }

   onZoom() {
    let key = (this.zoom.getSelectedItem()).key;
    if (key === "FIT") {
      this.canvas.fitZoom();
    } else {
      this.canvas.setZoom(parseFloat(key));
    }
  }
}
