/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
class Z4StatusPanel extends JSPanel {

   canvas = null;

   projectName = new JSLabel();

   projectSize = new JSLabel();

   mousePosition = new JSLabel();

   zoom = new JSComboBox();

  constructor() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.setLabel(this.projectName, 0);
    this.addPipe(1);
    let zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    Z4Constants.ZOOM_LEVEL.forEach(level => zoomModelAndRenderer.addElement(new KeyValue("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue("FIT", Z4Translations.FIT));
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.getStyle().minWidth = "5rem";
    this.zoom.getChilStyleByQuery("ul").minWidth = "5rem";
    this.zoom.setSelectedItem(new KeyValue("1", ""));
    this.zoom.addActionListener(event => this.onZoom());
    let constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 0;
    this.add(this.zoom, constraints);
    this.addPipe(3);
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + Z4Constants.DEFAULT_IMAGE_SIZE + " \u2716 " + Z4Constants.DEFAULT_IMAGE_SIZE);
    this.setLabel(this.projectSize, 4);
    this.addPipe(5);
    this.mousePosition.getStyle().fontFamily = "monospace";
    this.setMousePosition(0, 0);
    this.setLabel(this.mousePosition, 6);
    constraints = new GridBagConstraints();
    constraints.gridx = 7;
    constraints.gridy = 0;
    constraints.weightx = 1;
    this.add(new JSLabel(), constraints);
  }

   addPipe(gridx) {
    let pipe = new JSLabel();
    pipe.setText("|");
    pipe.getStyle().minWidth = "2rem";
    pipe.getStyle().textAlign = "center";
    this.setLabel(pipe, gridx);
  }

   setLabel(label, gridx) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.CENTER;
    this.add(label, constraints);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
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
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + width + " \u2716 " + height);
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
   setMousePosition(x, y) {
    this.mousePosition.setText(new Number(x).toFixed(0).padStart(4, "\u00A0") + " \u2716 " + new Number(y).toFixed(0).padEnd(4, "\u00A0"));
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom.setSelectedItem(new KeyValue("" + zoom, ""));
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
