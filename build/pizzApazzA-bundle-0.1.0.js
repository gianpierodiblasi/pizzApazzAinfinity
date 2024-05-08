/* global Translations, Z4Translations */

window.onload = event => {
  var language = localStorage.getItem("z4language");
  switch (language) {
    case "en":
      Translations.setEnglish();
      Z4Translations.setEnglish();
      break;
    case "it":
      Translations.setItalian();
      Z4Translations.setItalian();
      break;
  }

  localStorage.getItem("z4darkmode");
  
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
    constraints.insets = new Insets(5, 5, 0, 0);
    this.add(label, constraints);
    this.languageModelAndRenderer.addElement(new KeyValue("en", Z4Translations.ENGLISH));
    this.languageModelAndRenderer.addElement(new KeyValue("it", Z4Translations.ITALIAN));
    this.language.setModelAndRenderer(this.languageModelAndRenderer);
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
    constraints.insets = new Insets(5, 5, 0, 0);
    this.add(label, constraints);
    this.themeModelAndRenderer.addElement(new KeyValue("auto", Z4Translations.AUTO));
    this.themeModelAndRenderer.addElement(new KeyValue("light", Z4Translations.LIGHT));
    this.themeModelAndRenderer.addElement(new KeyValue("dark", Z4Translations.DARK));
    this.theme.setModelAndRenderer(this.themeModelAndRenderer);
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

  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  ENGLISH = "";

  static  ITALIAN = "";

  static  THEME = "";

  static  AUTO = "";

  static  LIGHT = "";

  static  DARK = "";

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
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.ENGLISH = "English";
    Z4Translations.ITALIAN = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.AUTO = "Auto";
    Z4Translations.LIGHT = "Light";
    Z4Translations.DARK = "Dark";
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.ENGLISH = "English";
    Z4Translations.ITALIAN = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.AUTO = "Auto";
    Z4Translations.LIGHT = "Chiaro";
    Z4Translations.DARK = "Scuro";
  }
}
