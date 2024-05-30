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

   savingInterval = new JSComboBox();

   savingDelay = new JSComboBox();

   historyPanel = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonsettingspanel");
    this.addLabel(Z4Translations.LANGUAGE, 0);
    let languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    languageModelAndRenderer.addElement(new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    languageModelAndRenderer.addElement(new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));
    this.language.setModelAndRenderer(languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event => this.onchangeLanguage());
    this.addComponent(this.language, 0, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));
    this.addLabel(Z4Translations.THEME, 1);
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
    this.addLabel(Z4Translations.THEME_COLOR, 2);
    let themeColor = localStorage.getItem("z4color");
    this.color.setSelectedColor(Color.fromRGB_HEX(themeColor ? themeColor : "#0d6efd"));
    this.color.setOpacityVisible(false);
    this.color.addChangeListener(event => this.onchangeColor());
    this.addComponent(this.color, 2, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));
    this.addVLine(3, 0);
    this.addLabel(Z4Translations.HISTORY_MANAGEMENT, 4);
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
    this.historyManagement.getStyle().minWidth = "18rem";
    this.historyManagement.setModelAndRenderer(historyManagementModelAndRenderer);
    this.historyManagement.setSelectedItem(selectedHistoryManagement);
    this.historyManagement.addActionListener(event => this.onchangeHistoryManagementSettings());
    this.addComponent(this.historyManagement, 4, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 5));
    this.historyManagementDescription.setText(Z4Translations[selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"]);
    this.addComponent(this.historyManagementDescription, 4, 2, 3, 1, 1, 0, GridBagConstraints.NORTHWEST, GridBagConstraints.NONE, new Insets(5, 0, 0, 0));
    this.addLabel(Z4Translations.SAVING_DELAY, 5);
    let savingDelayValue = parseInt(localStorage.getItem("z4savingdelay"));
    savingDelayValue = savingDelayValue ? savingDelayValue : 1000;
    let savingDelayString = savingDelayValue < 1000 ? savingDelayValue + "ms" : (savingDelayValue / 1000 + "s");
    let selectedSavingDelay = new KeyValue(savingDelayValue, savingDelayString);
    let savingDelayModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    savingDelayModelAndRenderer.addElement(new KeyValue(100, "100ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue(200, "200ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue(500, "500ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue(1000, "1s"));
    savingDelayModelAndRenderer.addElement(new KeyValue(2000, "2s"));
    savingDelayModelAndRenderer.addElement(new KeyValue(5000, "5s"));
    this.savingDelay.getStyle().minWidth = "6rem";
    this.savingDelay.setEnabled(selectedHistoryManagement.key === "standard");
    this.savingDelay.setModelAndRenderer(savingDelayModelAndRenderer);
    this.savingDelay.setSelectedItem(selectedSavingDelay);
    this.savingDelay.addActionListener(event => this.onchangeHistoryManagementSettings());
    this.addComponent(this.savingDelay, 5, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.addLabel(Z4Translations.SAVING_INTERVAL, 6);
    let savingIntervalValue = parseInt(localStorage.getItem("z4savinginterval"));
    savingIntervalValue = savingIntervalValue ? savingIntervalValue : 60000;
    let savingIntervalString = savingIntervalValue < 60000 ? savingIntervalValue / 1000 + "s" : (savingIntervalValue / 60000 + "min");
    let selectedSavingInterval = new KeyValue(savingIntervalValue, savingIntervalString);
    let savingIntervalModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    savingIntervalModelAndRenderer.addElement(new KeyValue(10000, "10s"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(30000, "30s"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000, "1m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000 * 2, "2m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000 * 3, "3m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000 * 5, "5m"));
    this.savingInterval.getStyle().minWidth = "6rem";
    this.savingInterval.setEnabled(selectedHistoryManagement.key === "timer");
    this.savingInterval.setModelAndRenderer(savingIntervalModelAndRenderer);
    this.savingInterval.setSelectedItem(selectedSavingInterval);
    this.savingInterval.addActionListener(event => this.onchangeHistoryManagementSettings());
    this.addComponent(this.savingInterval, 6, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.addVLine(7, 0);
    let reset = new JSButton();
    reset.setText(Z4Translations.RESET);
    reset.setContentAreaFilled(false);
    reset.addActionListener(event => this.onreset());
    this.addComponent(reset, 8, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.BOTH, new Insets(0, 5, 0, 5));
  }

   addLabel(text, gridx) {
    let label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, 0, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(5, 5, 2, 0));
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

   onchangeHistoryManagementSettings() {
    let selectedHistoryManagement = this.historyManagement.getSelectedItem();
    localStorage.setItem("z4historymanagement", selectedHistoryManagement.key);
    this.historyManagementDescription.setText(Z4Translations[selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"]);
    let selectedSavingDelay = this.savingDelay.getSelectedItem();
    localStorage.setItem("z4savingdelay", "" + selectedSavingDelay.key);
    let selectedSavingInterval = this.savingInterval.getSelectedItem();
    localStorage.setItem("z4savinginterval", "" + selectedSavingInterval.key);
    this.savingDelay.setEnabled(selectedHistoryManagement.key === "standard");
    this.savingInterval.setEnabled(selectedHistoryManagement.key === "timer");
    this.historyPanel.setHistoryManagementSettings(selectedHistoryManagement.key, selectedSavingDelay.key, selectedSavingInterval.key);
  }

   onreset() {
    localStorage.removeItem("z4language");
    localStorage.removeItem("z4theme");
    localStorage.removeItem("z4color");
    localStorage.removeItem("z4historymanagement");
    localStorage.removeItem("z4savingdelay");
    localStorage.removeItem("z4savinginterval");
    this.historyManagement.setSelectedItem(new KeyValue("standard", Z4Translations.STANDARD_POLICY));
    this.historyManagementDescription.setText(Z4Translations.STANDARD_POLICY_DESCRIPTION);
    this.savingDelay.setSelectedItem(new KeyValue(1000, "1s"));
    this.savingDelay.setEnabled(true);
    this.savingInterval.setSelectedItem(new KeyValue(60000, "1min"));
    this.savingInterval.setEnabled(false);
    this.historyPanel.setHistoryManagementSettings("standard", 1000, 60000);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.RESET, JSOptionPane.INFORMATION_MESSAGE, null);
  }

  /**
   * Sets the history panel
   *
   * @param historyPanel The history panel
   */
   setHistoryPanel(historyPanel) {
    this.historyPanel = historyPanel;
    let selectedHistoryManagement = this.historyManagement.getSelectedItem();
    let selectedSavingDelay = this.savingDelay.getSelectedItem();
    let selectedSavingInterval = this.savingInterval.getSelectedItem();
    this.historyPanel.setHistoryManagementSettings(selectedHistoryManagement.key, selectedSavingDelay.key, selectedSavingInterval.key);
  }
}
