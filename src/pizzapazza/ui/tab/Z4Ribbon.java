package pizzapazza.ui.tab;

import javascript.swing.JSTabbedPane;
import pizzapazza.ui.panel.Z4RibbonSettingsPanel;
import pizzapazza.util.Z4Translations;

/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Ribbon extends JSTabbedPane {

  private final Z4RibbonSettingsPanel settingsPanel = new Z4RibbonSettingsPanel();

  /**
   * Creates the object
   */
  public Z4Ribbon() {
    super();

    this.cssAddClass("z4ribbon");

    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
  }
}
