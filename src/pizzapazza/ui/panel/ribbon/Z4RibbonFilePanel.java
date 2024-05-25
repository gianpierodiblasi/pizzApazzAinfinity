package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.document;
import javascript.awt.BorderLayout;
import javascript.awt.Dimension;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSFileChooser;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSTextField;
import javascript.swing.event.ChangeEvent;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.panel.Z4ExportToFilePanel;
import pizzapazza.ui.panel.Z4NewImagePanel;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.navigator;

/**
 * The ribbon panel containing the file menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonFilePanel extends JSPanel {

  private Z4Canvas canvas;
  private Z4StatusPanel statusPanel;

  /**
   * Creates the object
   */
  public Z4RibbonFilePanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonfilepanel");

    this.addLabel(Z4Translations.NEW_PROJECT, 0, 3);
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", event -> this.checkSaved(Z4Translations.CREATE, () -> this.createFromColor()));
    this.addButton(Z4Translations.FROM_CLIPBOARD, $typeof(navigator.clipboard.$get("read"), "function"), 1, 1, "both", event -> this.checkSaved(Z4Translations.FROM_CLIPBOARD, () -> this.createFromClipboard()));
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", event -> this.checkSaved(Z4Translations.FROM_FILE, () -> this.createFromFile()));
    this.addVLine(3, 0);

    this.addLabel(Z4Translations.OPEN, 4, 1);

    this.addButton(Z4Translations.OPEN_PROJECT, true, 4, 1, "", event -> this.checkSaved(Z4Translations.OPEN_PROJECT, () -> this.openProject()));
    this.addVLine(5, 0);

    this.addLabel(Z4Translations.SAVE, 6, 2);
    this.addButton(Z4Translations.SAVE_PROJECT, true, 6, 1, "left", event -> this.saveProject(null));
    this.addButton(Z4Translations.EXPORT, true, 7, 1, "right", event -> this.exportToFile());
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

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  private void addLabel(String text, int gridx, int gridwidth) {
    JSLabel label = new JSLabel();
    label.setText(text);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridwidth = gridwidth;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
  }

  private void addButton(String text, boolean enabled, int gridx, int gridy, String border, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.NORTH;
    switch (border) {
      case "left":
        constraints.insets = new Insets(0, 5, 0, 0);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
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

  private void checkSaved(String title, $Apply_0_Void apply) {
    if (this.canvas.isSaved()) {
      apply.$apply();
    } else {
      JSOptionPane.showConfirmDialog(Z4Translations.PROJECT_NOT_SAVED_MESSAGE, title, JSOptionPane.YES_NO_CANCEL_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
        switch (response) {
          case JSOptionPane.YES_OPTION:
            this.saveProject(apply);
            break;
          case JSOptionPane.NO_OPTION:
            apply.$apply();
            break;
        }
      });
    }
  }

  private void createFromColor() {
    Z4NewImagePanel panel = new Z4NewImagePanel();

    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener -> {
    }, () -> true, response -> {
      if (response == JSOptionPane.OK_OPTION) {
        Dimension size = panel.getSelectedSize();
        this.canvas.create(size.width, size.height, panel.getSelectedFilling());
      }
    });
  }

  private void createFromFile() {
    JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> this.canvas.createFromFile(file)));
  }

  private void createFromClipboard() {
    this.canvas.createFromClipboard();
  }

  private void openProject() {
    JSFileChooser.showOpenDialog(".z4i", JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> this.canvas.openProject(file)));
  }

  private void saveProject($Apply_0_Void apply) {
    JSPanel panel = new JSPanel();
    panel.setLayout(new BorderLayout(0, 0));

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.PROJECT_NAME);
    panel.add(label, BorderLayout.NORTH);

    JSTextField projectName = new JSTextField();
    projectName.setText(this.canvas.getProjectName());
    panel.add(projectName, BorderLayout.CENTER);

    JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener -> projectName.addActionListener(event -> listener.$apply(new ChangeEvent())), () -> $exists(projectName.getText()), response -> {
      if (response == JSOptionPane.OK_OPTION) {
        this.canvas.saveProject(projectName.getText(), apply);
      }
    });
  }

  private void exportToFile() {
    Z4ExportToFilePanel panel = new Z4ExportToFilePanel();
    panel.setFilename(this.canvas.getProjectName());

    JSOptionPane.showInputDialog(panel, Z4Translations.EXPORT, listener -> panel.addChangeListener(listener), () -> panel.isValid(), response -> {
      if (response == JSOptionPane.OK_OPTION) {
        this.canvas.exportToFile(panel.getFilename(), panel.getFileExtension(), panel.getQuality());
      }
    });
  }
}
