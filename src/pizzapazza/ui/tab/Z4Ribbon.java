package pizzapazza.ui.tab;

import javascript.swing.JSTabbedPane;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonDrawingToolPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonFilePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHelpPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonSettingsPanel;
import pizzapazza.util.Z4Translations;

/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Ribbon extends JSTabbedPane {

  private final Z4RibbonFilePanel filePanel = new Z4RibbonFilePanel();
  private final Z4RibbonLayerPanel layerPanel = new Z4RibbonLayerPanel();
  private final Z4RibbonDrawingToolPanel drawingToolPanel = new Z4RibbonDrawingToolPanel();
  private final Z4RibbonHistoryPanel historyPanel = new Z4RibbonHistoryPanel();
  private final Z4RibbonSettingsPanel settingsPanel = new Z4RibbonSettingsPanel();
  private final Z4RibbonHelpPanel helpPanel = new Z4RibbonHelpPanel();

  /**
   * Creates the object
   */
  public Z4Ribbon() {
    super();
    this.cssAddClass("z4ribbon");

    this.addTab(Z4Translations.FILE, this.filePanel);
    this.addTab(Z4Translations.LAYER, this.layerPanel);
    this.addTab(Z4Translations.DRAWING_TOOL, this.drawingToolPanel);
    this.addTab(Z4Translations.HISTORY, this.historyPanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
    this.addTab(Z4Translations.HELP, this.helpPanel);

    this.settingsPanel.setHistoryPanel(this.historyPanel);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    canvas.setRibbonPanels(this.filePanel, this.layerPanel, this.drawingToolPanel, this.historyPanel);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.filePanel.setStatusPanel(statusPanel);
    this.layerPanel.setStatusPanel(statusPanel);
    this.drawingToolPanel.setStatusPanel(statusPanel);
    this.historyPanel.setStatusPanel(statusPanel);
  }
}
