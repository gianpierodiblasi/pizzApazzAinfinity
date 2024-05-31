package pizzapazza.ui.panel.ribbon;

import def.dom.DragEvent;
import def.dom.File;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
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
import simulation.js.$File;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.navigator;

/**
 * The ribbon panel containing the file menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonFilePanel extends Z4AbstractRibbonPanel {

  private Z4Canvas canvas;
  private Z4StatusPanel statusPanel;

  /**
   * Creates the object
   */
  public Z4RibbonFilePanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonfilepanel");

    Z4UI.addLabel(this, Z4Translations.NEW_PROJECT, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", event -> this.checkSaved(Z4Translations.CREATE, () -> this.createFromColor()));
    this.addButton(Z4Translations.FROM_CLIPBOARD, $typeof(navigator.clipboard.$get("read"), "function"), 1, 1, "both", event -> this.checkSaved(Z4Translations.FROM_CLIPBOARD, () -> this.createFromClipboard()));
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", event -> this.checkSaved(Z4Translations.FROM_FILE, () -> this.createFromFile()));
    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    Z4UI.addLabel(this, Z4Translations.OPEN, new GBC(4, 0).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.OPEN_PROJECT, true, 4, 1, "", event -> this.checkSaved(Z4Translations.OPEN_PROJECT, () -> this.openProject()));
    Z4UI.addVLine(this, new GBC(5, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    Z4UI.addLabel(this, Z4Translations.SAVE, new GBC(6, 0).w(2).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.SAVE_PROJECT, true, 6, 1, "left", event -> this.saveProject(null));
    this.addButton(Z4Translations.EXPORT, true, 7, 1, "right", event -> this.exportToFile());
    Z4UI.addVLine(this, new GBC(8, 0).h(2).wxy(1, 1).f(GBC.VERTICAL).i(1, 2, 1, 2));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
    this.canvas.addEventListener("dragenter", event -> this.onDrop((DragEvent) event, false));
    this.canvas.addEventListener("dragover", event -> this.onDrop((DragEvent) event, false));
    this.canvas.addEventListener("dragleave", event -> this.onDrop((DragEvent) event, false));
    this.canvas.addEventListener("drop", event -> this.onDrop((DragEvent) event, true));
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
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

    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener -> panel.addChangeListener(listener), () -> {
      Dimension size = panel.getSelectedSize();
      return size.width > 0 && size.height > 0;
    }, response -> {
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

    JSCheckBox saveHistory = new JSCheckBox();
    saveHistory.setText(Z4Translations.SAVE_HISTORY);
    panel.add(saveHistory, BorderLayout.SOUTH);

    JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener -> projectName.addActionListener(event -> listener.$apply(new ChangeEvent())), () -> $exists(projectName.getText()), response -> {
      if (response == JSOptionPane.OK_OPTION) {
        this.canvas.saveProject(projectName.getText(), saveHistory.isSelected(), apply);
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

  @SuppressWarnings("StringEquality")
  private void onDrop(DragEvent event, boolean doUpload) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";

    Array<File> files = new Array<>();
    if ($exists(event.dataTransfer.items)) {
      for (int i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items.$get(i).$get("kind") == "file") {
          File file = (($File) event.dataTransfer.items.$get(i)).getAsFile();
          files.push($exists(file) ? file : event.dataTransfer.items.$get(i));
        }
      }
    } else {
      event.dataTransfer.files.forEach(file -> files.push(file));
    }

    if ($exists(files.$get(0))) {
      event.dataTransfer.dropEffect = "copy";

      if (!doUpload) {
      } else if (files.$get(0).name.toLowerCase().endsWith(".z4i")) {
        this.checkSaved(Z4Translations.OPEN_PROJECT, () -> this.canvas.openProject(files.$get(0)));
      } else if (Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.some((format, index, array) -> files.$get(0).name.toLowerCase().endsWith(format))) {
        this.checkSaved(Z4Translations.FROM_FILE, () -> this.canvas.createFromFile(files.$get(0)));
      }
    }
  }
}
