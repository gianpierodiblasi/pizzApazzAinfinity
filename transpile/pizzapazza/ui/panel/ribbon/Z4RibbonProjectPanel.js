/**
 * The ribbon panel containing the project menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonProjectPanel extends Z4AbstractRibbonPanel {

   canvas = null;

   statusPanel = null;

   saveProjectButton = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonprojectpanel");
    Z4UI.addLabel(this, Z4Translations.NEW_PROJECT, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event => this.checkSaved(Z4Translations.CREATE, () => this.createFromColor()));
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", 0, event => this.checkSaved(Z4Translations.FROM_CLIPBOARD, () => this.createFromClipboard()));
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", 0, event => this.checkSaved(Z4Translations.FROM_FILE, () => this.createFromFile()));
    Z4UI.addVLine(this, new GBC(3, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.OPEN, new GBC(4, 0).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.OPEN_PROJECT, true, 4, 1, "", 0, event => this.checkSaved(Z4Translations.OPEN_PROJECT, () => this.openProject()));
    Z4UI.addVLine(this, new GBC(5, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.SAVE, new GBC(6, 0).w(2).a(GBC.WEST).i(5, 5, 2, 0));
    this.saveProjectButton = this.addButton(Z4Translations.SAVE_PROJECT, false, 6, 1, "left", 0, event => this.saveProject(null, false));
    this.addButton(Z4Translations.SAVE_PROJECT_AS, true, 7, 1, "right", 0, event => this.saveProject(null, true));
    this.addButton(Z4Translations.EXPORT, true, 6, 2, "", 0, event => this.exportToFile());
    Z4UI.addVLine(this, new GBC(9, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.TRANSFORM, new GBC(10, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.FLIP_HORIZONTAL, true, 10, 1, "left", 0, event => {
      document.querySelectorAll(".z4layerpreview .z4layerpreview-fliphorizontal").forEach(element => (element).click());
      this.afterTransform();
    }).getStyle().marginBottom = "5px";
    this.addButton(Z4Translations.FLIP_VERTICAL, true, 11, 1, "both", 0, event => {
      document.querySelectorAll(".z4layerpreview .z4layerpreview-flipvertical").forEach(element => (element).click());
      this.afterTransform();
    }).getStyle().marginBottom = "5px";
    this.addButton(Z4Translations.RESIZE, true, 12, 1, "right", 0, event => {
    }).getStyle().marginBottom = "5px";
    this.addButton(Z4Translations.ROTATE_PLUS_90, true, 10, 2, "left", 0, event => {
      for (let index = 0; index < this.canvas.getLayersCount(); index++) {
        let layer = this.canvas.getLayerAt(index);
        let offset = layer.getOffset();
        let size = layer.getSize();
        layer.move(-offset.y - parseInt(size.width / 2 - size.height / 2), offset.x - parseInt(size.height / 2 - size.width / 2));
      }
      this.canvas.rotatePlus90();
      document.querySelectorAll(".z4layerpreview .z4layerpreview-rotateplus90").forEach(element => (element).click());
      this.afterTransform();
    });
    this.addButton(Z4Translations.ROTATE_MINUS_90, true, 11, 2, "both", 0, event => {
      // this.canvas.rotatePlus90();
      // document.querySelectorAll(".z4layerpreview .z4layerpreview-rotateminus90").forEach(element -> ((HTMLElement) element).click());
      // this.afterTransform();
    });
    this.addButton(Z4Translations.ROTATE_180, true, 12, 2, "right", 0, event => {
      // document.querySelectorAll(".z4layerpreview .z4layerpreview-rotate180").forEach(element -> ((HTMLElement) element).click());
      // this.afterTransform();
    });
    Z4UI.addVLine(this, new GBC(16, 0).h(3).wxy(1, 1).f(GBC.VERTICAL).i(1, 2, 1, 2));
  }

   afterTransform() {
    this.canvas.setSaved(false);
    this.canvas.drawCanvas();
    this.canvas.drawCanvasBounds();
    this.canvas.setChanged(true);
    this.canvas.saveHistory("standard,tool");
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
    this.canvas.addEventListener("dragenter", event => this.onDrop(event, false));
    this.canvas.addEventListener("dragover", event => this.onDrop(event, false));
    this.canvas.addEventListener("dragleave", event => this.onDrop(event, false));
    this.canvas.addEventListener("drop", event => this.onDrop(event, true));
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

   checkSaved(title, apply) {
    if (this.canvas.isSaved()) {
      apply();
    } else {
      JSOptionPane.showConfirmDialog(Z4Translations.PROJECT_NOT_SAVED_MESSAGE, title, JSOptionPane.YES_NO_CANCEL_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
        switch(response) {
          case JSOptionPane.YES_OPTION:
            this.saveProject(apply, false);
            break;
          case JSOptionPane.NO_OPTION:
            apply();
            break;
        }
      });
    }
  }

   createFromColor() {
    let panel = new Z4NewImagePanel();
    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener => panel.addChangeListener(listener), () => {
      let size = panel.getSelectedSize();
      return 0 < size.width && size.width <= Z4Constants.MAX_IMAGE_SIZE && 0 < size.height && size.height < Z4Constants.MAX_IMAGE_SIZE;
    }, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let size = panel.getSelectedSize();
        this.canvas.create(size.width, size.height, panel.getSelectedFilling());
      }
    });
  }

   createFromFile() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.createFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.createFromFile(file)));
    }
  }

   createFromClipboard() {
    this.canvas.createFromClipboard();
  }

   openProject() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.PIZZAPAZZA_PROJECT_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.openProjectFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog(".z4i", JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.openProjectFromFile(file)));
    }
  }

   saveProject(apply, as) {
    if (typeof window["showSaveFilePicker"] === "function") {
      this.saveProjectToHandle(apply, as);
    } else {
      this.saveProjectToFile(apply, as);
    }
  }

   saveProjectToFile(apply, as) {
    if (as || !this.canvas.getProjectName()) {
      let panel = new JSPanel();
      panel.setLayout(new BorderLayout(0, 0));
      let label = new JSLabel();
      label.setText(Z4Translations.PROJECT_NAME);
      panel.add(label, BorderLayout.NORTH);
      let projectName = new JSTextField();
      projectName.setText(this.canvas.getProjectName());
      panel.add(projectName, BorderLayout.CENTER);
      JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener => projectName.addActionListener(event => listener(new ChangeEvent())), () => !!(projectName.getText()), response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.canvas.saveProjectToFile(projectName.getText(), apply);
        }
      });
    } else {
      this.canvas.saveProjectToFile(this.canvas.getProjectName(), apply);
    }
  }

   saveProjectToHandle(apply, as) {
    if (as || !this.canvas.getHandle()) {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.suggestedName = this.canvas.getProjectName();
      options.types = Z4Constants.PIZZAPAZZA_PROJECT_FILE_TYPE;
      JSFilePicker.showSaveFilePicker(options, handle => this.canvas.saveProjectToHandle(handle, apply));
    } else {
      this.canvas.saveProjectToHandle(this.canvas.getHandle(), apply);
    }
  }

   exportToFile() {
    if (typeof window["showSaveFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.suggestedName = this.canvas.getProjectName();
      options.types = Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE;
      JSFilePicker.showSaveFilePicker(options, handle => this.export(handle));
    } else {
      this.export(null);
    }
  }

   export(handle) {
    if (!handle) {
      let panel = new Z4ExportToFilePanel();
      panel.setFilename(this.canvas.getProjectName());
      JSOptionPane.showInputDialog(panel, Z4Translations.EXPORT, listener => panel.addChangeListener(listener), () => panel.isValid(), response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.canvas.exportToFile(panel.getFilename(), panel.getFileExtension(), panel.getQuality());
        }
      });
    } else if (handle.name.toLowerCase().endsWith(".png")) {
      this.canvas.exportToHandle(handle, 0);
    } else {
      handle.getFile().then(file => {
        let panel = new Z4ExportToFilePanel();
        panel.setFilename(file.name);
        panel.setFilenameEditable(false);
        panel.setFileExtension(".jpg");
        panel.setFileExtensionEnabled(false);
        JSOptionPane.showInputDialog(panel, Z4Translations.EXPORT, listener => panel.addChangeListener(listener), () => panel.isValid(), response => {
          if (response === JSOptionPane.OK_OPTION) {
            this.canvas.exportToHandle(handle, panel.getQuality());
          }
        });
      });
    }
  }

   onDrop(event, doUpload) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
    let files = new Array();
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i]["kind"] === "file") {
          let file = (event.dataTransfer.items[i]).getAsFile();
          files.push(file ? file : event.dataTransfer.items[i]);
        }
      }
    } else {
      event.dataTransfer.files.forEach(file => files.push(file));
    }
    if (files[0]) {
      event.dataTransfer.dropEffect = "copy";
      if (!doUpload) {
      } else if (files[0].name.toLowerCase().endsWith(".z4i")) {
        this.checkSaved(Z4Translations.OPEN_PROJECT, () => this.canvas.openProjectFromFile(files[0]));
      } else if (Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.some((format, index, array) => files[0].name.toLowerCase().endsWith(format))) {
        this.checkSaved(Z4Translations.FROM_FILE, () => this.canvas.createFromFile(files[0]));
      }
    }
  }

  /**
   * Enables the save project button
   *
   * @param b true to enable the save project button, false otherwise
   */
   setSaveEnabled(b) {
    this.saveProjectButton.setEnabled(b);
  }
}
