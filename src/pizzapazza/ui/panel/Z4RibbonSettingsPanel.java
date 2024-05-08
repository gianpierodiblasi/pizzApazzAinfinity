package pizzapazza.ui.panel;

import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSComboBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Translations;

/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonSettingsPanel extends JSPanel {

  private final JSComboBox<String> language = new JSComboBox<>();
  private final JSComboBox<String> theme = new JSComboBox<>();

  /**
   * Creates the object
   */
  public Z4RibbonSettingsPanel() {
    super();

    this.cssAddClass("z4ribbonsettingspanel");

    this.setLayout(new GridBagLayout());

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.LANGUAGE);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    this.add(label, constraints);

    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets=new Insets(0, 0, 0, 0);
    this.add(this.language, constraints);

    label = new JSLabel();
    label.setText(Z4Translations.THEME);

    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 0;
    constraints.anchor = GridBagConstraints.WEST;
    this.add(label, constraints);

    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 1;
    constraints.fill = GridBagConstraints.HORIZONTAL;
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
