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
