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
