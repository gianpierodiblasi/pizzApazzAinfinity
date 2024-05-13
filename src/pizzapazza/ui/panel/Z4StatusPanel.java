package pizzapazza.ui.panel;

import static def.js.Globals.parseFloat;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.swing.JSComboBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSProgressBar;
import javascript.swing.MnR.DefaultKeyValueComboBoxModelAndRenderer;
import javascript.util.KeyValue;
import pizzapazza.Z4Constants;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.parseInt;

/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
public class Z4StatusPanel extends JSPanel {
  
  private Z4Canvas canvas;
  
  private final JSLabel projectName = new JSLabel();
  private final JSComboBox<KeyValue<String, String>> zoom = new JSComboBox<>();
  private final JSProgressBar progressBar = new JSProgressBar();
  
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
    
    this.progressBar.setStringPainted(true);
    
    constraints = new GridBagConstraints();
    constraints.gridx = 4;
    constraints.gridy = 0;
    constraints.weightx = 1;
    constraints.fill = GridBagConstraints.BOTH;
    this.add(this.progressBar, constraints);
  }
  
  private void addPipe(int gridx) {
    JSLabel pipe = new JSLabel();
    pipe.setText(" | ");
    this.setLabel(pipe, gridx);
  }
  
  private void setLabel(JSLabel label, int gridx) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
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
   * Sets the progress bar value
   *
   * @param value The progress bar value
   */
  public void setProgressBarValue(int value) {
    this.progressBar.setValue(value);
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
