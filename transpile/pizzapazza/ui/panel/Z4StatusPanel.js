/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
class Z4StatusPanel extends JSPanel {

   canvas = null;

   projectName = new JSLabel();

   zoom = new JSComboBox();

   projectSize = new JSLabel();

   mousePosition = new JSLabel();

   drawingDirection = new JSButton();

   canvasGridPanel = new Z4CanvasGridPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.add(this.projectName, new GBC(0, 0).i(0, 5, 0, 5));
    Z4UI.addVLine(this, new GBC(1, 0).h(2).f(GBC.VERTICAL).i(1, 2, 1, 2));
    let zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    Z4Constants.ZOOM_LEVEL.forEach(level => zoomModelAndRenderer.addElement(new KeyValue("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue("FIT", Z4Translations.FIT));
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.getStyle().minWidth = "5rem";
    this.zoom.getChilStyleByQuery("ul").minWidth = "5rem";
    this.zoom.setSelectedItem(new KeyValue("1", ""));
    this.zoom.addActionListener(event => this.onZoom());
    this.add(this.zoom, new GBC(2, 0).i(0, 5, 0, 5));
    Z4UI.addVLine(this, new GBC(3, 0).h(2).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + Z4Constants.DEFAULT_IMAGE_SIZE + " x " + Z4Constants.DEFAULT_IMAGE_SIZE);
    this.add(this.projectSize, new GBC(4, 0).i(0, 5, 0, 5));
    Z4UI.addVLine(this, new GBC(5, 0).h(2).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.mousePosition.getStyle().fontFamily = "monospace";
    this.setMousePosition(0, 0);
    this.add(this.mousePosition, new GBC(6, 0).i(0, 5, 0, 5));
    Z4UI.addVLine(this, new GBC(7, 0).h(2).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.drawingDirection.setContentAreaFilled(false);
    this.drawingDirection.setTooltip(Z4Translations.DRAWING_DIRECTION);
    this.drawingDirection.setIcon(new Z4EmptyImageProducer(""));
    this.drawingDirection.cssAddClass("z4drawingdirection");
    this.drawingDirection.cssAddClass("z4drawingdirection-free");
    this.drawingDirection.addActionListener(event => this.setDrawingDirection(null));
    this.add(this.drawingDirection, new GBC(8, 0).i(0, 5, 0, 5));
    this.add(this.canvasGridPanel, new GBC(9, 0).i(0, 5, 0, 5));
    this.add(new JSLabel(), new GBC(10, 0).wx(1));
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
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom.setSelectedItem(new KeyValue("" + zoom, ""));
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection.cssRemoveClass("z4drawingdirection-free");
    this.drawingDirection.cssRemoveClass("z4drawingdirection-horizontal");
    this.drawingDirection.cssRemoveClass("z4drawingdirection-vertical");
    if (drawingDirection === Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4drawingdirection-free");
    } else if (drawingDirection === Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-horizontal");
    } else if (drawingDirection === Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-vertical");
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4drawingdirection-horizontal");
      this.canvas.setDrawingDirection(Z4DrawingDirection.HORIZONTAL);
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-vertical");
      this.canvas.setDrawingDirection(Z4DrawingDirection.VERTICAL);
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-free");
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
