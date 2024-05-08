package pizzapazza.ui.tab;

import javascript.swing.JSTabbedPane;
import pizzapazza.ui.Z4Canvas;
import pizzapazza.ui.panel.ribbon.Z4RibbonFilePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonSettingsPanel;
import pizzapazza.util.Z4Translations;

/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Ribbon extends JSTabbedPane {

  private final Z4RibbonFilePanel filePanel = new Z4RibbonFilePanel();
  private final Z4RibbonSettingsPanel settingsPanel = new Z4RibbonSettingsPanel();

  /**
   * Creates the object
   */
  public Z4Ribbon() {
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
  public void setCanvas(Z4Canvas canvas) {
    this.filePanel.setCanvas(canvas);
  }
}
