package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.document;
import static def.dom.Globals.localStorage;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComboBox;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.MnR.DefaultKeyValueComboBoxModelAndRenderer;
import javascript.util.KeyValue;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonSettingsPanel extends JSPanel {

  private final JSComboBox<KeyValue<String, String>> language = new JSComboBox<>();
  private final JSComboBox<KeyValue<String, String>> theme = new JSComboBox<>();
  private final JSColorChooser color = new JSColorChooser();
  private final JSComboBox<KeyValue<String, String>> historyManagement = new JSComboBox<>();
  private final JSLabel historyManagementDescription = new JSLabel();
  private final JSComboBox<KeyValue<Integer, String>> savingInterval = new JSComboBox<>();
  private final JSComboBox<KeyValue<Integer, String>> savingDelay = new JSComboBox<>();

  private Z4RibbonHistoryPanel historyPanel;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4RibbonSettingsPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonsettingspanel");

    this.addLabel(Z4Translations.LANGUAGE, 0);

    DefaultKeyValueComboBoxModelAndRenderer<String, String> languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    languageModelAndRenderer.addElement(new KeyValue<>("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    languageModelAndRenderer.addElement(new KeyValue<>("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));

    this.language.setModelAndRenderer(languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event -> this.onchangeLanguage());

    this.addComponent(this.language, 0, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));

    this.addLabel(Z4Translations.THEME, 1);

    KeyValue<String, String> selectedTheme;
    String z4theme = (String) localStorage.getItem("z4theme");
    switch (z4theme) {
      case "light":
      case "dark":
      case "auto":
        selectedTheme = new KeyValue<>(z4theme, Z4Translations.$get("THEME_" + z4theme.toUpperCase()));
        break;
      default:
        selectedTheme = new KeyValue<>("auto", Z4Translations.THEME_AUTO);
        break;
    }

    DefaultKeyValueComboBoxModelAndRenderer<String, String> themeModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    themeModelAndRenderer.addElement(new KeyValue<>("auto", Z4Translations.THEME_AUTO));
    themeModelAndRenderer.addElement(new KeyValue<>("light", Z4Translations.THEME_LIGHT));
    themeModelAndRenderer.addElement(new KeyValue<>("dark", Z4Translations.THEME_DARK));

    this.theme.setModelAndRenderer(themeModelAndRenderer);
    this.theme.setSelectedItem(selectedTheme);
    this.theme.addActionListener(event -> this.onchangeTheme());

    this.addComponent(this.theme, 1, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));

    this.addLabel(Z4Translations.THEME_COLOR, 2);

    String themeColor = (String) localStorage.getItem("z4color");
    this.color.setSelectedColor(Color.fromRGB_HEX($exists(themeColor) ? themeColor : "#0d6efd"));
    this.color.setOpacityVisible(false);
    this.color.addChangeListener(event -> this.onchangeColor());

    this.addComponent(this.color, 2, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 5, 0, 5));

    this.addVLine(3, 0);

    this.addLabel(Z4Translations.HISTORY_MANAGEMENT, 4);

    KeyValue<String, String> selectedHistoryManagement;
    String z4historyManagement = (String) localStorage.getItem("z4historymanagement");
    switch (z4historyManagement) {
      case "standard":
      case "timer":
      case "manual":
      case "tool":
        selectedHistoryManagement = new KeyValue<>(z4historyManagement, Z4Translations.$get(z4historyManagement.toUpperCase() + "_POLICY"));
        break;
      default:
        selectedHistoryManagement = new KeyValue<>("standard", Z4Translations.STANDARD_POLICY);
        break;
    }

    DefaultKeyValueComboBoxModelAndRenderer<String, String> historyManagementModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    historyManagementModelAndRenderer.addElement(new KeyValue<>("standard", Z4Translations.STANDARD_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue<>("timer", Z4Translations.TIMER_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue<>("manual", Z4Translations.MANUAL_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue<>("tool", Z4Translations.TOOL_POLICY));

    this.historyManagement.getStyle().minWidth = "18rem";
    this.historyManagement.setModelAndRenderer(historyManagementModelAndRenderer);
    this.historyManagement.setSelectedItem(selectedHistoryManagement);
    this.historyManagement.addActionListener(event -> this.onchangeHistoryManagementSettings());

    this.addComponent(this.historyManagement, 4, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 5));

    this.historyManagementDescription.setText(Z4Translations.$get(selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"));
    this.addComponent(this.historyManagementDescription, 4, 2, 3, 1, 1, 0, GridBagConstraints.NORTHWEST, GridBagConstraints.NONE, new Insets(5, 0, 0, 0));

    this.addLabel(Z4Translations.SAVING_DELAY, 5);

    int savingDelayValue = parseInt((String) localStorage.getItem("z4savingdelay"));
    savingDelayValue = $exists(savingDelayValue) ? savingDelayValue : 1000;
    String savingDelayString = savingDelayValue < 1000 ? savingDelayValue + "ms" : (savingDelayValue / 1000 + "s");
    KeyValue<Integer, String> selectedSavingDelay = new KeyValue<>(savingDelayValue, savingDelayString);

    DefaultKeyValueComboBoxModelAndRenderer<Integer, String> savingDelayModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    savingDelayModelAndRenderer.addElement(new KeyValue<>(100, "100ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue<>(200, "200ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue<>(500, "500ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue<>(1000, "1s"));
    savingDelayModelAndRenderer.addElement(new KeyValue<>(2000, "2s"));
    savingDelayModelAndRenderer.addElement(new KeyValue<>(5000, "5s"));

    this.savingDelay.getStyle().minWidth = "6rem";
    this.savingDelay.setEnabled(selectedHistoryManagement.key == "standard");
    this.savingDelay.setModelAndRenderer(savingDelayModelAndRenderer);
    this.savingDelay.setSelectedItem(selectedSavingDelay);
    this.savingDelay.addActionListener(event -> this.onchangeHistoryManagementSettings());
    this.addComponent(this.savingDelay, 5, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));

    this.addLabel(Z4Translations.SAVING_INTERVAL, 6);

    int savingIntervalValue = parseInt((String) localStorage.getItem("z4savinginterval"));
    savingIntervalValue = $exists(savingIntervalValue) ? savingIntervalValue : 60000;
    String savingIntervalString = savingIntervalValue < 60000 ? savingIntervalValue / 1000 + "s" : (savingIntervalValue / 60000 + "min");
    KeyValue<Integer, String> selectedSavingInterval = new KeyValue<>(savingIntervalValue, savingIntervalString);

    DefaultKeyValueComboBoxModelAndRenderer<Integer, String> savingIntervalModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    savingIntervalModelAndRenderer.addElement(new KeyValue<>(10000, "10s"));
    savingIntervalModelAndRenderer.addElement(new KeyValue<>(30000, "30s"));
    savingIntervalModelAndRenderer.addElement(new KeyValue<>(60000, "1m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue<>(60000 * 2, "2m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue<>(60000 * 3, "3m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue<>(60000 * 5, "5m"));

    this.savingInterval.getStyle().minWidth = "6rem";
    this.savingInterval.setEnabled(selectedHistoryManagement.key == "timer");
    this.savingInterval.setModelAndRenderer(savingIntervalModelAndRenderer);
    this.savingInterval.setSelectedItem(selectedSavingInterval);
    this.savingInterval.addActionListener(event -> this.onchangeHistoryManagementSettings());
    this.addComponent(this.savingInterval, 6, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));

    this.addVLine(7, 0);

    JSButton reset = new JSButton();
    reset.setText(Z4Translations.RESET);
    reset.setContentAreaFilled(false);
    reset.addActionListener(event -> this.onreset());

    this.addComponent(reset, 8, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.BOTH, new Insets(0, 5, 0, 5));
  }

  private void addLabel(String text, int gridx) {
    JSLabel label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, 0, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(5, 5, 2, 0));
  }

  private void addVLine(int gridx, int weightx) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    this.addComponent(div, gridx, 0, 1, 3, weightx, 1, GridBagConstraints.EAST, GridBagConstraints.VERTICAL, new Insets(1, 2, 1, 2));
  }

  private void addComponent(JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int weightx, int weighty, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

  @SuppressWarnings("unchecked")
  private void onchangeLanguage() {
    localStorage.setItem("z4language", ((KeyValue<String, String>) this.language.getSelectedItem()).key);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.LANGUAGE, JSOptionPane.INFORMATION_MESSAGE, null);
  }

  @SuppressWarnings("unchecked")
  private void onchangeTheme() {
    localStorage.setItem("z4theme", ((KeyValue<String, String>) this.theme.getSelectedItem()).key);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.THEME, JSOptionPane.INFORMATION_MESSAGE, null);
  }

  private void onchangeColor() {
    if (!this.color.getValueIsAdjusting()) {
      localStorage.setItem("z4color", this.color.getSelectedColor().getRGB_HEX());
      JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.THEME_COLOR, JSOptionPane.INFORMATION_MESSAGE, null);
    }
  }

  @SuppressWarnings({"unchecked", "StringEquality"})
  private void onchangeHistoryManagementSettings() {
    KeyValue<String, String> selectedHistoryManagement = (KeyValue<String, String>) this.historyManagement.getSelectedItem();
    localStorage.setItem("z4historymanagement", selectedHistoryManagement.key);
    this.historyManagementDescription.setText(Z4Translations.$get(selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"));

    KeyValue<Integer, String> selectedSavingDelay = (KeyValue<Integer, String>) this.savingDelay.getSelectedItem();
    localStorage.setItem("z4savingdelay", "" + selectedSavingDelay.key);

    KeyValue<Integer, String> selectedSavingInterval = (KeyValue<Integer, String>) this.savingInterval.getSelectedItem();
    localStorage.setItem("z4savinginterval", "" + selectedSavingInterval.key);

    this.savingDelay.setEnabled(selectedHistoryManagement.key == "standard");
    this.savingInterval.setEnabled(selectedHistoryManagement.key == "timer");
    this.historyPanel.setHistoryManagementSettings(selectedHistoryManagement.key, selectedSavingDelay.key, selectedSavingInterval.key);
  }

  private void onreset() {
    localStorage.removeItem("z4language");
    localStorage.removeItem("z4theme");
    localStorage.removeItem("z4color");
    localStorage.removeItem("z4historymanagement");
    localStorage.removeItem("z4savingdelay");
    localStorage.removeItem("z4savinginterval");

    this.historyManagement.setSelectedItem(new KeyValue<>("standard", Z4Translations.STANDARD_POLICY));
    this.historyManagementDescription.setText(Z4Translations.STANDARD_POLICY_DESCRIPTION);
    this.savingDelay.setSelectedItem(new KeyValue<>(1000, "1s"));
    this.savingDelay.setEnabled(true);
    this.savingInterval.setSelectedItem(new KeyValue<>(60000, "1min"));
    this.savingInterval.setEnabled(false);

    this.historyPanel.setHistoryManagementSettings("standard", 1000, 60000);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.RESET, JSOptionPane.INFORMATION_MESSAGE, null);
  }

  /**
   * Sets the history panel
   *
   * @param historyPanel The history panel
   */
  @SuppressWarnings("unchecked")
  public void setHistoryPanel(Z4RibbonHistoryPanel historyPanel) {
    this.historyPanel = historyPanel;
    KeyValue<String, String> selectedHistoryManagement = (KeyValue<String, String>) this.historyManagement.getSelectedItem();
    KeyValue<Integer, String> selectedSavingDelay = (KeyValue<Integer, String>) this.savingDelay.getSelectedItem();
    KeyValue<Integer, String> selectedSavingInterval = (KeyValue<Integer, String>) this.savingInterval.getSelectedItem();
    this.historyPanel.setHistoryManagementSettings(selectedHistoryManagement.key, selectedSavingDelay.key, selectedSavingInterval.key);
  }
}
