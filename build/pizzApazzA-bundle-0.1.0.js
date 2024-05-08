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

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4frame");
    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
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

   languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();

   themeModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbonsettingspanel");
    this.setLayout(new GridBagLayout());
    let label = new JSLabel();
    label.setText(Z4Translations.LANGUAGE);
    let constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
    this.languageModelAndRenderer.addElement(new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    this.languageModelAndRenderer.addElement(new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));
    this.language.setModelAndRenderer(this.languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event => this.onchangeLanguage());
    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 0);
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
    this.themeModelAndRenderer.addElement(new KeyValue("auto", Z4Translations.THEME_AUTO));
    this.themeModelAndRenderer.addElement(new KeyValue("light", Z4Translations.THEME_LIGHT));
    this.themeModelAndRenderer.addElement(new KeyValue("dark", Z4Translations.THEME_DARK));
    this.theme.setModelAndRenderer(this.themeModelAndRenderer);
    this.theme.setSelectedItem(selectedTheme);
    this.theme.addActionListener(event => this.onchangeTheme());
    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 5, 0, 0);
    this.add(this.theme, constraints);
    label = new JSLabel();
    constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 0;
    constraints.gridheight = 2;
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

   settingsPanel = new Z4RibbonSettingsPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
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

  static  REFRESH_PAGE_MESSAGE = "";

  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

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
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
