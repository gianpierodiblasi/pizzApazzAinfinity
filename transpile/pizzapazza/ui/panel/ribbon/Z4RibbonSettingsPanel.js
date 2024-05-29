/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonSettingsPanel extends JSPanel {

   language = new JSComboBox();

   theme = new JSComboBox();

   color = new JSColorChooser();

   historyManagement = new JSComboBox();

   historyManagementDescription = new JSLabel();

   savingInterval = new JSSpinner();

   savingDelay = new JSSpinner();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonsettingspanel");
    this.addLabel(Z4Translations.LANGUAGE, 0, 1);
    let languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    languageModelAndRenderer.addElement(new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    languageModelAndRenderer.addElement(new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));
    this.language.setModelAndRenderer(languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event => this.onchangeLanguage());
    this.addComponent(this.language, 0, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));
    this.addLabel(Z4Translations.THEME, 1, 1);
    let selectedTheme = null;
    let z4theme = localStorage.getItem("z4theme");
    switch(z4theme) {
      case "light":
      case "dark":
      case "auto":
        selectedTheme = new KeyValue(z4theme, Z4Translations["THEME_" + z4theme.toUpperCase()]);
        break;
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
    this.addComponent(this.theme, 1, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));
    this.addLabel(Z4Translations.THEME_COLOR, 2, 1);
    let themeColor = localStorage.getItem("z4color");
    this.color.setSelectedColor(Color.fromRGB_HEX(themeColor ? themeColor : "#0d6efd"));
    this.color.setOpacityVisible(false);
    this.color.addChangeListener(event => this.onchangeColor());
    this.addComponent(this.color, 2, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));
    this.addVLine(3, 0);
    this.addLabel(Z4Translations.HISTORY_MANAGEMENT, 4, 1);
    let selectedHistoryManagement = null;
    let z4historyManagement = localStorage.getItem("z4historymanagement");
    switch(z4historyManagement) {
      case "standard":
      case "timer":
      case "manual":
      case "tool":
        selectedHistoryManagement = new KeyValue(z4historyManagement, Z4Translations[z4historyManagement.toUpperCase() + "_POLICY"]);
        break;
      default:
        selectedHistoryManagement = new KeyValue("standard", Z4Translations.STANDARD_POLICY);
        break;
    }
    let historyManagementModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    historyManagementModelAndRenderer.addElement(new KeyValue("standard", Z4Translations.STANDARD_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue("timer", Z4Translations.TIMER_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue("manual", Z4Translations.MANUAL_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue("tool", Z4Translations.TOOL_POLICY));
    this.historyManagement.setModelAndRenderer(historyManagementModelAndRenderer);
    this.historyManagement.setSelectedItem(selectedHistoryManagement);
    this.historyManagement.addActionListener(event => this.onchangeHistoryManagement());
    this.addComponent(this.historyManagement, 4, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 5));
    this.historyManagementDescription.setText(Z4Translations[selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"]);
    this.addComponent(this.historyManagementDescription, 4, 2, 4, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    // this.addLabel(Z4Translations.SAVING_DELAY, 5, 1);
    // 
    // int savingDelayValue = parseInt((String) localStorage.getItem("z4savingdelay"));
    // this.savingDelay.cssAddClass("jsspinner_w_4rem");
    // this.savingDelay.setModel(new SpinnerNumberModel($exists(savingDelayValue) ? savingDelayValue : Z4Constants.MAX_SAVING_DELAY, Z4Constants.MIN_SAVING_DELAY, Z4Constants.MAX_SAVING_DELAY, 10));
    // this.savingDelay.addChangeListener(event -> this.onchangeSavingDelay());
    // this.addComponent(this.savingDelay, 5, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 5));
    // 
    // this.addLabel(Z4Translations.SAVING_INTERVAL, 6, 1);
    // 
    // int savingIntervalValue = parseInt((String) localStorage.getItem("z4savinginterval"));
    // this.savingInterval.cssAddClass("jsspinner_w_4rem");
    // this.savingInterval.setModel(new SpinnerNumberModel($exists(savingIntervalValue) ? savingIntervalValue : Z4Constants.MIN_SAVING_INTERVAL, Z4Constants.MIN_SAVING_INTERVAL, Z4Constants.MAX_SAVING_INTERVAL, 1));
    // this.savingInterval.addChangeListener(event -> this.onchangeSavingInterval());
    // this.addComponent(this.savingInterval, 6, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 5));
    // 
    // this.addVLine(8, 1);
    // 
    // JSButton reset = new JSButton();
    // reset.setText(Z4Translations.RESET);
    // reset.setContentAreaFilled(false);
    // reset.addActionListener(event -> this.onreset());
    // 
    // this.addComponent(reset, 9, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.BOTH, new Insets(0, 5, 0, 5));
  }

   addLabel(text, gridx, gridwidth) {
    let label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, 0, gridwidth, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(5, 5, 2, 0));
  }

   addVLine(gridx, weightx) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    this.addComponent(div, gridx, 0, 1, 3, weightx, 1, GridBagConstraints.EAST, GridBagConstraints.VERTICAL, new Insets(1, 2, 1, 2));
  }

   addComponent(component, gridx, gridy, gridwidth, gridheight, weightx, weighty, anchor, fill, insets) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if (insets) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
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

   onchangeHistoryManagement() {
    let selectedHistoryManagement = this.historyManagement.getSelectedItem();
    localStorage.setItem("z4historymanagement", selectedHistoryManagement.key);
    this.historyManagementDescription.setText(Z4Translations[selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"]);
  }

   onchangeSavingDelay() {
    localStorage.setItem("z4savingdelay", "" + this.savingDelay.getValue());
  }

   onchangeSavingInterval() {
    localStorage.setItem("z4savinginterval", "" + this.savingDelay.getValue());
  }

   onreset() {
    localStorage.removeItem("z4language");
    localStorage.removeItem("z4theme");
    localStorage.removeItem("z4color");
    localStorage.removeItem("z4historymanagement");
    localStorage.removeItem("z4savingdelay");
    localStorage.removeItem("z4savinginterval");
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.RESET, JSOptionPane.INFORMATION_MESSAGE, null);
  }
}
