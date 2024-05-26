package pizzapazza.ui.panel;

import static def.js.Globals.parseFloat;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.swing.JSComboBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.MnR.DefaultKeyValueComboBoxModelAndRenderer;
import javascript.util.KeyValue;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Number;

/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
public class Z4StatusPanel extends JSPanel {

  private Z4Canvas canvas;

  private final JSLabel projectName = new JSLabel();
  private final JSLabel projectSize = new JSLabel();
  private final JSLabel mousePosition = new JSLabel();
  private final JSComboBox<KeyValue<String, String>> zoom = new JSComboBox<>();

  public Z4StatusPanel() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());

    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.setLabel(this.projectName, 0);

    this.addPipe(1);

    DefaultKeyValueComboBoxModelAndRenderer<String, String> zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    Z4Constants.ZOOM_LEVEL.forEach(level -> zoomModelAndRenderer.addElement(new KeyValue<>("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue<>("FIT", Z4Translations.FIT));
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.getStyle().minWidth = "5rem";
    this.zoom.getChilStyleByQuery("ul").minWidth = "5rem";
    this.zoom.setSelectedItem(new KeyValue<>("1", ""));
    this.zoom.addActionListener(event -> this.onZoom());

    GridBagConstraints constraints = new GridBagConstraints();
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

  private void addPipe(int gridx) {
    JSLabel pipe = new JSLabel();
    pipe.setText("|");
    pipe.getStyle().minWidth = "2rem";
    pipe.getStyle().textAlign = "center";
    this.setLabel(pipe, gridx);
  }

  private void setLabel(JSLabel label, int gridx) {
    GridBagConstraints constraints = new GridBagConstraints();
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
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the project name
   *
   * @param projectName The project name
   */
  public void setProjectName(String projectName) {
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": " + projectName);
  }

  /**
   * Sets the project size
   *
   * @param width The width
   * @param height The height
   */
  public void setProjectSize(int width, int height) {
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + width + " \u2716 " + height);
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
  public void setMousePosition(int x, int y) {
    this.mousePosition.setText(new $Number(x).toFixed(0).padStart(4, "\u00A0") + " \u2716 " + new $Number(y).toFixed(0).padEnd(4, "\u00A0"));
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
  public void setZoom(double zoom) {
    this.zoom.setSelectedItem(new KeyValue<>("" + zoom, ""));
  }

  @SuppressWarnings({"unchecked", "StringEquality"})
  private void onZoom() {
    String key = ((KeyValue<String, String>) this.zoom.getSelectedItem()).key;
    if (key == "FIT") {
      this.canvas.fitZoom();
    } else {
      this.canvas.setZoom(parseFloat(key));
    }
  }
}
