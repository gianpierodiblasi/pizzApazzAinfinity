package pizzapazza.ui.tab;

import javascript.swing.JSTabbedPane;
import pizzapazza.ui.panel.ribbon.Z4RibbonFilePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonSettingsPanel;
import pizzapazza.util.Z4Translations;

/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Ribbon extends JSTabbedPane {

  /**
   * Creates the object
   */
  public Z4Ribbon() {
    super();

    this.cssAddClass("z4ribbon");

    this.addTab(Z4Translations.FILE, new Z4RibbonFilePanel());
    this.addTab(Z4Translations.SETTINGS, new Z4RibbonSettingsPanel());
  }
}
