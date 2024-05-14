package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.localStorage;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComboBox;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.MnR.DefaultKeyValueComboBoxModelAndRenderer;
import javascript.util.KeyValue;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$exists;

/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonSettingsPanel extends JSPanel {

  private final JSComboBox<KeyValue<String, String>> language = new JSComboBox<>();
  private final JSComboBox<KeyValue<String, String>> theme = new JSComboBox<>();
  private final JSColorChooser color = new JSColorChooser();

  /**
   * Creates the object
   */
  public Z4RibbonSettingsPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonsettingspanel");

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.LANGUAGE);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);

    DefaultKeyValueComboBoxModelAndRenderer<String, String> languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    languageModelAndRenderer.addElement(new KeyValue<>("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    languageModelAndRenderer.addElement(new KeyValue<>("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));

    this.language.setModelAndRenderer(languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event -> this.onchangeLanguage());

    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.anchor = GridBagConstraints.NORTH;
    constraints.weighty = 1;
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

    KeyValue<String, String> selectedTheme;
    switch ((String) localStorage.getItem("z4theme")) {
      case "light":
        selectedTheme = new KeyValue<>("light", Z4Translations.THEME_LIGHT);
        break;
      case "dark":
        selectedTheme = new KeyValue<>("dark", Z4Translations.THEME_DARK);
        break;
      case "auto":
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

    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.anchor = GridBagConstraints.NORTH;
    constraints.weighty = 1;
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

    String themeColor = (String) localStorage.getItem("z4color");
    this.color.setSelectedColor(Color.fromRGB_HEX($exists(themeColor) ? themeColor : "#0d6efd"));
    this.color.setOpacityVisible(false);
    this.color.addChangeListener(event -> this.onchangeColor());

    constraints = new GridBagConstraints();
    constraints.gridx = 2;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.anchor = GridBagConstraints.NORTH;
    constraints.weighty = 1;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(this.color, constraints);

    JSButton reset = new JSButton();
    reset.setText(Z4Translations.RESET);
    reset.setContentAreaFilled(false);
    reset.addActionListener(event -> this.onreset());

    constraints = new GridBagConstraints();
    constraints.gridx = 3;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.anchor = GridBagConstraints.NORTH;
    constraints.weighty = 1;
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

  private void onreset() {
    localStorage.removeItem("z4language");
    localStorage.removeItem("z4theme");
    localStorage.removeItem("z4color");

    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.RESET, JSOptionPane.INFORMATION_MESSAGE, null);
  }
}
