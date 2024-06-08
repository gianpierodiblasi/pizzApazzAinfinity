/**
 * The panel to configure the export to file
 *
 * @author gianpiero.diblasi
 */
class Z4ExportToFilePanel extends JSPanel {

   filename = new JSTextField();

   png = new JSRadioButton();

   jpg = new JSRadioButton();

   qualitySlider = new JSSlider();

   qualitySpinner = new JSSpinner();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4exporttofilepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.FILENAME, new GBC(0, 0).a(GBC.WEST));
    this.filename.addActionListener(event => this.onchange());
    this.add(this.filename, new GBC(0, 1).w(2).f(GBC.HORIZONTAL).wx(1));
    let group = new ButtonGroup();
    group.add(this.png);
    group.add(this.jpg);
    this.addRadio(this.png, true, "PNG", 0);
    this.addRadio(this.jpg, false, "JPG", 1);
    Z4UI.addLabel(this, Z4Translations.QUALITY, new GBC(0, 3).a(GBC.WEST));
    this.qualitySlider.setEnabled(false);
    this.qualitySlider.setValue(100);
    this.qualitySlider.addChangeListener(event => this.qualitySpinner.setValue(this.qualitySlider.getValue()));
    this.add(this.qualitySlider, new GBC(0, 4).w(2).f(GBC.HORIZONTAL).wx(1));
    this.qualitySpinner.cssAddClass("jsspinner_w_3rem");
    this.qualitySpinner.setEnabled(false);
    this.qualitySpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.qualitySpinner.addChangeListener(event => this.qualitySlider.setValue(this.qualitySpinner.getValue()));
    this.add(this.qualitySpinner, new GBC(1, 3).a(GBC.EAST));
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

   addRadio(button, selected, text, gridx) {
    button.setSelected(selected);
    button.setText(text);
    button.addActionListener(event => {
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
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Check if this panel has a valid content
   *
   * @return true if this panel has a valid content, false otherwise
   */
   isValid() {
    return !!(this.filename.getText());
  }

  /**
   * Sets the file name
   *
   * @param filename The file name
   */
   setFilename(filename) {
    this.filename.setText(filename);
  }

  /**
   * Returns the file name
   *
   * @return The file name
   */
   getFilename() {
    return this.filename.getText();
  }

  /**
   * Sets the editability of the file name
   *
   * @param b true to sets the editability of the file name, false otherwise
   */
   setFilenameEditable(b) {
    this.filename.setEditable(b);
  }

  /**
   * Returns the file extension
   *
   * @return The file extension
   */
   getFileExtension() {
    return this.png.isSelected() ? ".png" : ".jpg";
  }

  /**
   * Sets the file extension
   *
   * @param ext The file extension
   */
   setFileExtension(ext) {
    switch(ext) {
      case ".png":
        this.png.setSelected(true);
        break;
      case ".jpg":
        this.jpg.setSelected(true);
        break;
    }
    this.qualitySlider.setEnabled(ext === ".jpg");
    this.qualitySpinner.setEnabled(ext === ".jpg");
  }

  /**
   * Enables the extensions
   *
   * @param b true to enable the extensions, false othewise
   */
   setFileExtensionEnabled(b) {
    this.png.setEnabled(b);
    this.jpg.setEnabled(b);
  }

  /**
   * Returns the quality in the range [0,1]
   *
   * @return The quality in the range [0,1]
   */
   getQuality() {
    return this.qualitySpinner.getValue() / 100;
  }
}
