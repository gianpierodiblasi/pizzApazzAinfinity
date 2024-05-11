package pizzapazza.ui.panel;

import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSProgressBar;
import pizzapazza.ui.Z4Canvas;
import pizzapazza.util.Z4Translations;

/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
public class Z4StatusPanel extends JSPanel {

  private Z4Canvas canvas;
  
  private final JSLabel projectName = new JSLabel();
  private final JSProgressBar progressBar = new JSProgressBar();

  public Z4StatusPanel() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());

    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.setLabel(this.projectName, 0);
    this.addPipe(1);

    this.progressBar.setStringPainted(true);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 0;
    constraints.weightx = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
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
}
