/**
 * The ribbon panel containing the file menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonFilePanel extends JSPanel {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.addLabel(Z4Translations.NEW, 0);
    this.addButton(Z4Translations.CREATE, 0, 1, null);
    this.addButton(Z4Translations.CREATE_FROM_CLIPBOARD, 0, 2, null);
    this.addLabel(Z4Translations.OPEN, 1);
    this.addButton(Z4Translations.OPEN_FROM_DEVICE, 1, 1, event => this.openFromDevice());
    this.addButton(Z4Translations.OPEN_FROM_BROWSER, 1, 2, null);
    this.addLabel(Z4Translations.SAVE, 2);
    this.addButton(Z4Translations.SAVE, 2, 1, null);
    this.addButton(Z4Translations.SAVE_AS, 2, 2, null);
    let label = new JSLabel();
    let constraints = new GridBagConstraints();
    constraints.gridx = 3;
    constraints.gridy = 0;
    constraints.fill = GridBagConstraints.BOTH;
    constraints.weightx = 1;
    this.add(label, constraints);
  }

   addLabel(text, gridx) {
    let label = new JSLabel();
    label.setText(text);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
  }

   addButton(text, gridx, gridy, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 2, 0);
    this.add(button, constraints);
  }

   openFromDevice() {
    JSFileChooser.showOpenDialog(".gif,.png,.jpeg,.jpg,.z4i", JSFileChooser.SINGLE_SELECTION, 0, files => {
      files.forEach(file => {
        // FileReader fileReader = new FileReader();
        // fileReader.onload = event -> {
        // $Image img = ($Image) document.createElement("img");
        // img.src = (String) fileReader.result;
        // 
        // document.querySelector(".center").appendChild(img);
        // return null;
        // };
        // fileReader.readAsDataURL(file);
      });
    });
  }
}
