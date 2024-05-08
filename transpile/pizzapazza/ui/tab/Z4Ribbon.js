/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

   filePanel = new Z4RibbonFilePanel();

   settingsPanel = new Z4RibbonSettingsPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.FILE, this.filePanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.filePanel.setCanvas(canvas);
  }
}
