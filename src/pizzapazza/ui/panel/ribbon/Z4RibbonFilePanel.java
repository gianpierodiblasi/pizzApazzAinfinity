package pizzapazza.ui.panel.ribbon;

import def.dom.FileReader;
import static def.dom.Globals.document;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSFileChooser;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Translations;
import simulation.dom.$Image;

/**
 * The ribbon panel containing the file menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonFilePanel extends JSPanel {

  /**
   * Creates the object
   */
  public Z4RibbonFilePanel() {
    super();

    this.setLayout(new GridBagLayout());

    this.addLabel(Z4Translations.NEW, 0);
    this.addButton(Z4Translations.CREATE, 0, 1, null);
    this.addButton(Z4Translations.CREATE_FROM_CLIPBOARD, 0, 2, null);
    this.addLabel(Z4Translations.OPEN, 1);
    this.addButton(Z4Translations.OPEN_FROM_DEVICE, 1, 1, event -> this.openFromDevice());
    this.addButton(Z4Translations.OPEN_FROM_BROWSER, 1, 2, null);
    this.addLabel(Z4Translations.SAVE, 2);
    this.addButton(Z4Translations.SAVE, 2, 1, null);
    this.addButton(Z4Translations.SAVE_AS, 2, 2, null);

    JSLabel label = new JSLabel();
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 3;
    constraints.gridy = 0;
    constraints.fill = GridBagConstraints.BOTH;
    constraints.weightx = 1;
    this.add(label, constraints);
  }

  private void addLabel(String text, int gridx) {
    JSLabel label = new JSLabel();
    label.setText(text);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
  }

  private void addButton(String text, int gridx, int gridy, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 2, 0);
    this.add(button, constraints);
  }

  private void openFromDevice() {
    JSFileChooser.showOpenDialog(".gif,.png,.jpeg,.jpg,.z4i", JSFileChooser.SINGLE_SELECTION, 0, files -> {
      files.forEach(file -> {
//        FileReader fileReader = new FileReader();
//        fileReader.onload = event -> {
//          $Image img = ($Image) document.createElement("img");
//          img.src = (String) fileReader.result;
//
//          document.querySelector(".center").appendChild(img);
//          return null;
//        };
//        fileReader.readAsDataURL(file);
      });
    });
  }
}
