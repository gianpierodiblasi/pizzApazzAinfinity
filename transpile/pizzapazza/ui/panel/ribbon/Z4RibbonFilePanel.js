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
    this.cssAddClass("z4ribbonfilepanel");
    this.addLabel(Z4Translations.NEW, 0);
    this.addButton(Z4Translations.CREATE, 0, 1, null);
    this.addButton(Z4Translations.CREATE_FROM_CLIPBOARD, 1, 1, null);
    this.addVLine(2, 0);
    this.addLabel(Z4Translations.OPEN, 3);
    this.addButton(Z4Translations.OPEN_FROM_DEVICE, 3, 1, event => this.openFromDevice());
    this.addButton(Z4Translations.OPEN_FROM_BROWSER, 4, 1, null);
    this.addVLine(5, 0);
    this.addLabel(Z4Translations.SAVE, 6);
    this.addButton(Z4Translations.SAVE, 6, 1, null);
    this.addButton(Z4Translations.SAVE_AS, 7, 1, null);
    this.addVLine(8, 1);
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
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(button, constraints);
  }

   addVLine(gridx, weightx) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor";
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridheight = 2;
    constraints.fill = GridBagConstraints.VERTICAL;
    constraints.weightx = weightx;
    constraints.weighty = 1;
    constraints.insets = new Insets(1, 2, 1, 2);
    this.add(div, constraints);
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
