/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
class Z4StatusPanel extends JSPanel {

   canvas = null;

   projectName = new JSLabel();

   zoom = new JSComboBox();

   progressBar = new JSProgressBar();

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
    constraints = new GridBagConstraints();
    constraints.gridx = 4;
    constraints.gridy = 0;
    constraints.weightx = 1;
    constraints.fill = GridBagConstraints.BOTH;
    this.add(this.progressBar, constraints);
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
   * Sets the progress bar value
   *
   * @param value The progress bar value
   */
   setProgressBarValue(value) {
    this.progressBar.setStringPainted(!!(value));
    this.progressBar.setValue(value);
  }

  /**
   * Sets the progress bar as indeterminate
   *
   * @param b true to sets the progress bar as indeterminate, false otherwise
   */
   setProgressBarIndeterminate(b) {
    this.progressBar.setIndeterminate(b);
  }

  /**
   * Sets the progress bar string
   *
   * @param string The string
   */
   setProgressBarString(string) {
    this.progressBar.setStringPainted(!!(string));
    this.progressBar.setString(string);
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
