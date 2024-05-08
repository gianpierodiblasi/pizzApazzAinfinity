package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.document;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSFileChooser;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.Z4Constants;
import pizzapazza.ui.Z4Canvas;
import pizzapazza.util.Z4Translations;

/**
 * The ribbon panel containing the file menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonFilePanel extends JSPanel {

  private Z4Canvas canvas;

  /**
   * Creates the object
   */
  public Z4RibbonFilePanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonfilepanel");

    this.addLabel(Z4Translations.NEW, 0);
    this.addButton(Z4Translations.CREATE, 0, 1, "left", null);
    this.addButton(Z4Translations.CREATE_FROM_CLIPBOARD, 1, 1, "right", null);
    this.addVLine(2, 0);

    this.addLabel(Z4Translations.OPEN, 3);
    this.addButton(Z4Translations.OPEN_FROM_DEVICE, 3, 1, "left", event -> this.openFromDevice());
    this.addButton(Z4Translations.OPEN_FROM_BROWSER, 4, 1, "right", null);
    this.addVLine(5, 0);

    this.addLabel(Z4Translations.SAVE, 6);
    this.addButton(Z4Translations.SAVE, 6, 1, "left", null);
    this.addButton(Z4Translations.SAVE_AS, 7, 1, "right", null);
    this.addVLine(8, 1);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
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

  private void addButton(String text, int gridx, int gridy, String border, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    switch (border) {
      case "left":
        constraints.insets = new Insets(0, 5, 0, 0);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
        constraints.insets = new Insets(0, 5, 0, 5);
        button.getStyle().borderRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        constraints.insets = new Insets(0, 0, 0, 5);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }

    this.add(button, constraints);
  }

  private void addVLine(int gridx, double weightx) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor";

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridheight = 2;
    constraints.fill = GridBagConstraints.VERTICAL;
    constraints.weightx = weightx;
    constraints.weighty = 1;
    constraints.insets = new Insets(1, 2, 1, 2);
    this.add(div, constraints);
  }

  private void openFromDevice() {
    JSFileChooser.showOpenDialog(Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(",") + ",.z4i", JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> this.canvas.openFromDevice(file)));
  }
}
