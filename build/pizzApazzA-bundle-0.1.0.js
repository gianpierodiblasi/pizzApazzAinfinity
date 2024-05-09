/* global Translations, Z4Translations, SwingJS */

window.onload = event => {
  switch (localStorage.getItem("z4language")) {
    case "en":
      Translations.setEnglish();
      Z4Translations.setEnglish();
      break;
    case "it":
      Translations.setItalian();
      Z4Translations.setItalian();
      break;
  }

  switch (localStorage.getItem("z4theme")) {
    case "light":
      break;
    case "dark":
      SwingJS.instance().darkMode(true).build();
      break;
    case "auto":
    default:
      SwingJS.instance().darkMode(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches).build();
      break;
  }

  let color = localStorage.getItem("z4color");
  if (color) {
    SwingJS.instance().mainActionBGColor(color).build();
  }
  
  new Z4Frame();
};/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Frame extends JSFrame {

   ribbon = new Z4Ribbon();

   canvas = new Z4Canvas();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4frame");
    this.getContentPane().setLayout(new BorderLayout(5, 5));
    this.ribbon.setCanvas(this.canvas);
    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
    this.getContentPane().add(this.canvas, BorderLayout.CENTER);
  }
}
/**
 * The ribbon panel containing the file menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonFilePanel extends JSPanel {

   canvas = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonfilepanel");
    this.addLabel(Z4Translations.NEW, 0);
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", null);
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", event => this.createFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", event => this.createFromFile());
    this.addVLine(3, 0);
    this.addLabel(Z4Translations.OPEN, 4);
    this.addButton(Z4Translations.OPEN_PROJECT, true, 4, 1, "", null);
    this.addVLine(5, 0);
    this.addLabel(Z4Translations.SAVE, 6);
    this.addButton(Z4Translations.SAVE_PROJECT, true, 6, 1, "left", null);
    this.addButton(Z4Translations.EXPORT, true, 7, 1, "right", event => this.exportToFile());
    this.addVLine(8, 1);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
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

   addButton(text, enabled, gridx, gridy, border, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    switch(border) {
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

   createFromFile() {
    JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.createFromFile(file)));
  }

   createFromClipboard() {
    this.canvas.createFromClipboard();
  }

   exportToFile() {
    let panel = new Z4ExportToFilePanel();
    panel.setFilename(this.canvas.getProjectName());
    JSOptionPane.showInputDialog(panel, Z4Translations.EXPORT, listener => panel.addChangeListener(listener), () => panel.isValid(), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.canvas.exportToFile(panel.getFilename(), panel.getFileExtension(), panel.getQuality());
      }
    });
  }
}
/**
 * The ribbon panel containing the layer menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonLayerPanel extends JSPanel {

   canvas = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonlayerpanel");
    this.addLabel(Z4Translations.NEW, 0);
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", null);
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", event => this.addFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", event => this.addFromFile());
    this.addVLine(3, 1);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
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

   addButton(text, enabled, gridx, gridy, border, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    switch(border) {
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

   addFromFile() {
    JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.addLayerFromFile(file)));
  }

   addFromClipboard() {
    this.canvas.addLayerFromClipboard();
  }
}
/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonSettingsPanel extends JSPanel {

   language = new JSComboBox();

   theme = new JSComboBox();

   color = new JSColorChooser();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonsettingspanel");
    let label = new JSLabel();
    label.setText(Z4Translations.LANGUAGE);
    let constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
    let languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    languageModelAndRenderer.addElement(new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    languageModelAndRenderer.addElement(new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));
    this.language.setModelAndRenderer(languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event => this.onchangeLanguage());
    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(this.language, constraints);
    label = new JSLabel();
    label.setText(Z4Translations.THEME);
    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
    let selectedTheme = null;
    switch(localStorage.getItem("z4theme")) {
      case "light":
        selectedTheme = new KeyValue("light", Z4Translations.THEME_LIGHT);
        break;
      case "dark":
        selectedTheme = new KeyValue("dark", Z4Translations.THEME_DARK);
        break;
      case "auto":
      default:
        selectedTheme = new KeyValue("auto", Z4Translations.THEME_AUTO);
        break;
    }
    let themeModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    themeModelAndRenderer.addElement(new KeyValue("auto", Z4Translations.THEME_AUTO));
    themeModelAndRenderer.addElement(new KeyValue("light", Z4Translations.THEME_LIGHT));
    themeModelAndRenderer.addElement(new KeyValue("dark", Z4Translations.THEME_DARK));
    this.theme.setModelAndRenderer(themeModelAndRenderer);
    this.theme.setSelectedItem(selectedTheme);
    this.theme.addActionListener(event => this.onchangeTheme());
    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(this.theme, constraints);
    label = new JSLabel();
    label.setText(Z4Translations.THEME_COLOR);
    constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
    let themeColor = localStorage.getItem("z4color");
    this.color.setSelectedColor(Color.fromRGB_HEX(themeColor ? themeColor : "#0d6efd"));
    this.color.setOpacityVisible(false);
    this.color.addChangeListener(event => this.onchangeColor());
    constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(this.color, constraints);
    let reset = new JSButton();
    reset.setText(Z4Translations.RESET);
    reset.setContentAreaFilled(false);
    reset.addActionListener(event => this.onreset());
    constraints = new GridBagConstraints();
    constraints.gridx = 3;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(reset, constraints);
    label = new JSLabel();
    constraints = new GridBagConstraints();
    constraints.gridx = 4;
    constraints.gridy = 0;
    constraints.fill = GridBagConstraints.BOTH;
    constraints.weightx = 1;
    this.add(label, constraints);
  }

   onchangeLanguage() {
    localStorage.setItem("z4language", (this.language.getSelectedItem()).key);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.LANGUAGE, JSOptionPane.INFORMATION_MESSAGE, null);
  }

   onchangeTheme() {
    localStorage.setItem("z4theme", (this.theme.getSelectedItem()).key);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.THEME, JSOptionPane.INFORMATION_MESSAGE, null);
  }

   onchangeColor() {
    if (!this.color.getValueIsAdjusting()) {
      localStorage.setItem("z4color", this.color.getSelectedColor().getRGB_HEX());
      JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.THEME_COLOR, JSOptionPane.INFORMATION_MESSAGE, null);
    }
  }

   onreset() {
    localStorage.removeItem("z4language");
    localStorage.removeItem("z4theme");
    localStorage.removeItem("z4color");
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.RESET, JSOptionPane.INFORMATION_MESSAGE, null);
  }
}
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
    this.addLabel(Z4Translations.FILENAME, 0, 0);
    this.filename.addActionListener(event => this.onchange());
    let constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 1;
    constraints.gridwidth = 2;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.weightx = 1;
    this.add(this.filename, constraints);
    let group = new ButtonGroup();
    group.add(this.png);
    group.add(this.jpg);
    this.addRadio(this.png, true, "PNG", 0);
    this.addRadio(this.jpg, false, "JPG", 1);
    this.addLabel(Z4Translations.QUALITY, 0, 3);
    this.qualitySlider.setEnabled(false);
    this.qualitySlider.setValue(100);
    this.qualitySlider.addChangeListener(event => this.qualitySpinner.setValue(this.qualitySlider.getValue()));
    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 4;
    constraints.gridwidth = 2;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.weightx = 1;
    this.add(this.qualitySlider, constraints);
    this.qualitySpinner.setEnabled(false);
    this.qualitySpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.qualitySpinner.addChangeListener(event => this.qualitySlider.setValue(this.qualitySpinner.getValue()));
    this.qualitySpinner.getStyle().minWidth = "3rem";
    this.qualitySpinner.getChilStyleByQuery("input[type=number]").minWidth = "2.5rem";
    this.qualitySpinner.getChilStyleByQuery("input[type=number]").width = "2.5rem";
    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 3;
    constraints.anchor = GridBagConstraints.EAST;
    this.add(this.qualitySpinner, constraints);
  }

   addLabel(text, gridx, gridy) {
    let label = new JSLabel();
    label.setText(text);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.WEST;
    this.add(label, constraints);
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
    let constraints = new GridBagConstraints();
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
   * Returns the file extension
   *
   * @return The file extension
   */
   getFileExtension() {
    return this.png.isSelected() ? ".png" : ".jpg";
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
/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

   filePanel = new Z4RibbonFilePanel();

   layerPanel = new Z4RibbonLayerPanel();

   settingsPanel = new Z4RibbonSettingsPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.FILE, this.filePanel);
    this.addTab(Z4Translations.LAYER, this.layerPanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.filePanel.setCanvas(canvas);
    this.layerPanel.setCanvas(canvas);
  }
}
/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = null;

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   projectName = null;

   paper = new Z4Paper();

  static  WIDTH = 500;

  static  HEIGHT = 500;

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.resizeObserver.observe(this.canvas);
    this.canvas.width = Z4Canvas.WIDTH;
    this.canvas.height = Z4Canvas.HEIGHT;
    this.appendNodeChild(this.canvas);
    this.addLayer(Z4Canvas.WIDTH, Z4Canvas.HEIGHT);
    let image = document.createElement("img");
    image.onload = event => {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawCanvas();
      return null;
    };
    image.src = "image/chessboard.png";
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
   createFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let image = document.createElement("img");
      image.onload = event2 => {
        this.projectName = file.name.substring(0, file.name.lastIndexOf('.'));
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        this.paper.reset();
        this.paper.addLayerFromImage(image);
        this.drawCanvas();
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   */
   createFromClipboard() {
    navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        item.getType(imageType).then(blob => {
          let image = document.createElement("img");
          image.onload = event => {
            this.projectName = "";
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.paper.reset();
            this.paper.addLayerFromImage(image);
            this.drawCanvas();
            return null;
          };
          image.src = URL.createObjectURL(blob);
          return null;
        });
      });
    });
  }

  /**
   * Exports this project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
   exportToFile(filename, ext, quality) {
    let offscreen = new OffscreenCanvas(this.canvas.width, this.canvas.height);
    let offscreenCtx = offscreen.getContext("2d");
    this.paper.drawPaper(offscreenCtx);
    let options = new Object();
    options["type"] = ext === ".png" ? "image/png" : "image/jpeg";
    options["quality"] = quality;
    offscreen.convertToBlob(options).then(blob => {
      let link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", filename + ext);
      document.body.appendChild(link);
      let event = document.createEvent("MouseEvents");
      event.initEvent("click", false, false);
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   */
   addLayer(width, height) {
    this.paper.addLayer(width, height);
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
   addLayerFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let image = document.createElement("img");
      image.onload = event2 => {
        this.paper.addLayerFromImage(image);
        this.drawCanvas();
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

  /**
   * Adds a layer from an image in the clipboard
   */
   addLayerFromClipboard() {
    navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        item.getType(imageType).then(blob => {
          let image = document.createElement("img");
          image.onload = event => {
            this.paper.addLayerFromImage(image);
            this.drawCanvas();
            return null;
          };
          image.src = URL.createObjectURL(blob);
          return null;
        });
      });
    });
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
   getProjectName() {
    return this.projectName;
  }

   drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.paper.drawPaper(this.ctx);
  }
}
/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
class Z4Translations {

  static  CURRENT_LANGUAGE = null;

  // Ribbon File
  static  FILE = "";

  static  NEW = "";

  static  CREATE = "";

  static  FROM_CLIPBOARD = "";

  static  FROM_FILE = "";

  static  OPEN = "";

  static  OPEN_PROJECT = "";

  static  SAVE = "";

  static  SAVE_PROJECT = "";

  static  EXPORT = "";

  // Ribbon Layer
  static  LAYER = "";

  // Ribbon Settings
  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

  static  THEME_COLOR = "";

  static  REFRESH_PAGE_MESSAGE = "";

  // Other
  static  FILENAME = "";

  static  QUALITY = "";

  static  RESET = "";

  static {
    switch(navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  constructor() {
  }

  /**
   * Sets the English language
   */
  static  setEnglish() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW = "New";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.EXPORT = "Export";
    // Ribbon Layer
    Z4Translations.LAYER = "Layer";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.THEME_COLOR = "Color";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
    // Other
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";
    Z4Translations.RESET = "Reset";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW = "Nuovo";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.EXPORT = "Esporta";
    // Ribbon Layer
    Z4Translations.LAYER = "Livello";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.THEME_COLOR = "Colore";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    // Other
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";
    Z4Translations.RESET = "Ripristina";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
/**
 * Constants of the applications
 *
 * @author gianpiero.diblasi
 */
class Z4Constants {

  static  ACCEPTED_IMAGE_FILE_FORMAT = new Array(".gif", ".png", ".jpeg", ".jpg");

  constructor() {
  }
}
/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
class Z4Layer {

   offscreen = null;

   offscreenCtx = null;

   offsetX = 0;

   offsetY = 0;

  /**
   * Creates the object
   *
   * @param width The layer width
   * @param height The layer height
   */
  constructor(width, height) {
    this.offscreen = new OffscreenCanvas(width, height);
    this.offscreenCtx = this.offscreen.getContext("2d");
  }

  /**
   * Creates a Z4Layer from an image
   *
   * @param image The image
   * @return The layer
   */
  static  fromImage(image) {
    let layer = new Z4Layer(image.width, image.height);
    layer.offscreenCtx.drawImage(image, 0, 0);
    return layer;
  }

  /**
   * Shifts the layer
   *
   * @param offsetX The X offset from the upper left corner of the container
   * paper
   * @param offsetY The Y offset from the upper left corner of the container
   * paper
   */
   shiftLayer(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   */
   drawLayer(ctx) {
    ctx.drawImage(this.offscreen, this.offsetX, this.offsetY);
  }
}
/**
 * The object representing a paper
 *
 * @author gianpiero.diblasi
 */
class Z4Paper {

   layers = new Array();

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   */
   addLayer(width, height) {
    this.layers.push(new Z4Layer(width, height));
  }

  /**
   * Adds a layer from an aimeg
   *
   * @param image The image
   */
   addLayerFromImage(image) {
    this.layers.push(Z4Layer.fromImage(image));
  }

  /**
   * Resets the paper
   */
   reset() {
    this.layers.length = 0;
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   */
   drawPaper(ctx) {
    this.layers.forEach(layer => layer.drawLayer(ctx));
  }
}
