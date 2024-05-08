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
/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonSettingsPanel extends JSPanel {

   language = new JSComboBox();

   theme = new JSComboBox();

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
    constraints = new GridBagConstraints();
    constraints.gridx = 2;
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
}
/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.FILE, new Z4RibbonFilePanel());
    this.addTab(Z4Translations.SETTINGS, new Z4RibbonSettingsPanel());
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
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   */
   addLayer(width, height) {
    this.paper.addLayer(width, height);
    this.drawCanvas();
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

  static  CREATE_FROM_CLIPBOARD = "";

  static  OPEN = "";

  static  OPEN_FROM_DEVICE = "";

  static  OPEN_FROM_BROWSER = "";

  static  SAVE = "";

  static  SAVE_AS = "";

  // Ribbon Settings
  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

  static  REFRESH_PAGE_MESSAGE = "";

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
    Z4Translations.CREATE_FROM_CLIPBOARD = "Create from Clipboard";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_FROM_DEVICE = "Open from Device";
    Z4Translations.OPEN_FROM_BROWSER = "Open from Browser";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_AS = "Save As...";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
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
    Z4Translations.CREATE_FROM_CLIPBOARD = "Crea dagli Appunti";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_FROM_DEVICE = "Apri dal Dispositivo";
    Z4Translations.OPEN_FROM_BROWSER = "Apri dal Browser";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_AS = "Salva Come...";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
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
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   */
   drawPaper(ctx) {
    this.layers.forEach(layer => layer.drawLayer(ctx));
  }
}
