/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.FILE, new Z4RibbonFilePanel());
    this.addTab(Z4Translations.SETTINGS, new Z4RibbonSettingsPanel());
  }
}
