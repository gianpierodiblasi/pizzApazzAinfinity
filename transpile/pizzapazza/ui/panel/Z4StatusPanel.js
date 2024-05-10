/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
class Z4StatusPanel extends JSPanel {

   projectName = new JSLabel();

   progressBar = new JSProgressBar();

  constructor() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.setLabel(this.projectName, 0);
    this.addPipe(1);
    this.progressBar.setStringPainted(true);
    let constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 0;
    constraints.weightx = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    this.add(this.progressBar, constraints);
  }

   addPipe(gridx) {
    let pipe = new JSLabel();
    pipe.setText("|");
    this.setLabel(pipe, gridx);
  }

   setLabel(label, gridx) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    this.add(label, constraints);
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
    this.progressBar.setValue(value);
  }
}
