/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

   filePanel = new Z4RibbonFilePanel();

   layerPanel = new Z4RibbonLayerPanel();

   drawingToolPanel = new Z4RibbonDrawingToolPanel();

   historyPanel = new Z4RibbonHistoryPanel();

   settingsPanel = new Z4RibbonSettingsPanel();

   helpPanel = new Z4RibbonHelpPanel();

  /**
   * Creates the object
   */
  constructor() {
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
   setCanvas(canvas) {
    canvas.setRibbonPanels(this.filePanel, this.layerPanel, this.drawingToolPanel, this.historyPanel);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.filePanel.setStatusPanel(statusPanel);
    this.layerPanel.setStatusPanel(statusPanel);
    this.drawingToolPanel.setStatusPanel(statusPanel);
    this.historyPanel.setStatusPanel(statusPanel);
  }
}
