package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSTextField;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;

/**
 * The panel to configure the export to file
 *
 * @author gianpiero.diblasi
 */
public class Z4ExportToFilePanel extends JSPanel {

  private final JSTextField filename = new JSTextField();
  private final JSRadioButton png = new JSRadioButton();
  private final JSRadioButton jpg = new JSRadioButton();
  private final JSSlider qualitySlider = new JSSlider();
  private final JSSpinner qualitySpinner = new JSSpinner();

  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  public Z4ExportToFilePanel() {
    super();
    this.cssAddClass("z4exporttofilepanel");
    this.setLayout(new GridBagLayout());

    this.addLabel(Z4Translations.FILENAME, 0, 0);

    this.filename.addActionListener(event -> this.onchange());

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 1;
    constraints.gridwidth = 2;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.weightx = 1;
    this.add(this.filename, constraints);

    ButtonGroup group = new ButtonGroup();
    group.add(this.png);
    group.add(this.jpg);

    this.addRadio(this.png, true, "PNG", 0);
    this.addRadio(this.jpg, false, "JPG", 1);

    this.addLabel(Z4Translations.QUALITY, 0, 3);

    this.qualitySlider.setEnabled(false);
    this.qualitySlider.setValue(100);
    this.qualitySlider.addChangeListener(event -> this.qualitySpinner.setValue(this.qualitySlider.getValue()));

    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 4;
    constraints.gridwidth = 2;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.weightx = 1;
    this.add(this.qualitySlider, constraints);

    this.qualitySpinner.cssAddClass("jsspinner_w_3rem");
    this.qualitySpinner.setEnabled(false);
    this.qualitySpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.qualitySpinner.addChangeListener(event -> this.qualitySlider.setValue((int) this.qualitySpinner.getValue()));
    
    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 3;
    constraints.anchor = GridBagConstraints.EAST;
    this.add(this.qualitySpinner, constraints);
  }

  private void addLabel(String text, int gridx, int gridy) {
    JSLabel label = new JSLabel();
    label.setText(text);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.WEST;
    this.add(label, constraints);
  }

  private void onchange() {
    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  private void addRadio(JSRadioButton button, boolean selected, String text, int gridx) {
    button.setSelected(selected);
    button.setText(text);
    button.addActionListener(event -> {
      this.qualitySlider.setEnabled(!selected);
      this.qualitySpinner.setEnabled(!selected);
    });

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 2;
    constraints.anchor = GridBagConstraints.WEST;
    this.add(button, constraints);
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }

  /**
   * Check if this panel has a valid content
   *
   * @return true if this panel has a valid content, false otherwise
   */
  public boolean isValid() {
    return $exists(this.filename.getText());
  }

  /**
   * Sets the file name
   *
   * @param filename The file name
   */
  public void setFilename(String filename) {
    this.filename.setText(filename);
  }

  /**
   * Returns the file name
   *
   * @return The file name
   */
  public String getFilename() {
    return this.filename.getText();
  }

  /**
   * Returns the file extension
   *
   * @return The file extension
   */
  public String getFileExtension() {
    return this.png.isSelected() ? ".png" : ".jpg";
  }

  /**
   * Returns the quality in the range [0,1]
   *
   * @return The quality in the range [0,1]
   */
  public double getQuality() {
    return this.qualitySpinner.getValue() / 100;
  }
}
