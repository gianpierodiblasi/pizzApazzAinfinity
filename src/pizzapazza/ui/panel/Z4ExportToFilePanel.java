package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSTextField;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
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

    Z4UI.addLabel(this, Z4Translations.FILENAME, new GBC(0, 0).a(GBC.WEST));

    this.filename.addActionListener(event -> this.onchange());
    this.add(this.filename, new GBC(0, 1).w(2).f(GBC.HORIZONTAL).wx(1));

    ButtonGroup group = new ButtonGroup();
    group.add(this.png);
    group.add(this.jpg);

    this.addRadio(this.png, true, "PNG", 0);
    this.addRadio(this.jpg, false, "JPG", 1);

    Z4UI.addLabel(this, Z4Translations.QUALITY, new GBC(0, 3).a(GBC.WEST));

    this.qualitySlider.setEnabled(false);
    this.qualitySlider.setValue(100);
    this.qualitySlider.addChangeListener(event -> this.qualitySpinner.setValue(this.qualitySlider.getValue()));
    this.add(this.qualitySlider, new GBC(0, 4).w(2).f(GBC.HORIZONTAL).wx(1));

    this.qualitySpinner.cssAddClass("jsspinner_w_3rem");
    this.qualitySpinner.setEnabled(false);
    this.qualitySpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.qualitySpinner.addChangeListener(event -> this.qualitySlider.setValue((int) this.qualitySpinner.getValue()));
    this.add(this.qualitySpinner, new GBC(1, 3).a(GBC.EAST));
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

    this.add(button, new GBC(gridx, 2).a(GBC.WEST));
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
   * Sets the editability of the file name
   *
   * @param b true to sets the editability of the file name, false otherwise
   */
  public void setFilenameEditable(boolean b) {
    this.filename.setEditable(b);
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
   * Sets the file extension
   *
   * @param ext The file extension
   */
  @SuppressWarnings("StringEquality")
  public void setFileExtension(String ext) {
    switch (ext) {
      case ".png":
        this.png.setSelected(true);
        break;
      case ".jpg":
        this.jpg.setSelected(true);
        break;
    }

    this.qualitySlider.setEnabled(ext == ".jpg");
    this.qualitySpinner.setEnabled(ext == ".jpg");
  }

  /**
   * Sets the extensions as enabled
   *
   * @param b true to set the extensions as enabled, false othewise
   */
  public void setFileExtensionEnabled(boolean b) {
    this.png.setEnabled(b);
    this.jpg.setEnabled(b);
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
