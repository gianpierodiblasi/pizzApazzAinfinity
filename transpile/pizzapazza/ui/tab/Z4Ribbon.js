/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

   projectPanel = new Z4RibbonProjectPanel();

   layerPanel = new Z4RibbonLayerPanel();

   drawingToolPanel = new Z4RibbonDrawingToolPanel();

   textPanel = new Z4RibbonTextPanel();

   historyPanel = new Z4RibbonHistoryPanel();

   settingsPanel = new Z4RibbonSettingsPanel();

   helpPanel = new Z4RibbonHelpPanel();

   canvas = null;

   shapesAndPathsPanel = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.PROJECT, this.projectPanel);
    this.addTab(Z4Translations.LAYER, this.layerPanel);
    this.addTab(Z4Translations.DRAWING_TOOL, this.drawingToolPanel);
    this.addTab(Z4Translations.TEXT, this.textPanel);
    this.addTab(Z4Translations.HISTORY, this.historyPanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
    this.addTab(Z4Translations.HELP, this.helpPanel);
    this.addChangeListener(event => {
      if (this.textPanel.getStyle().display !== "none") {
        this.textPanel.checkFonts();
        this.shapesAndPathsPanel.getStyle().removeProperty("display");
      } else {
        this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
        this.shapesAndPathsPanel.getStyle().display = "none";
      }
    });
    this.settingsPanel.setHistoryPanel(this.historyPanel);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
    canvas.setRibbonPanels(this.projectPanel, this.layerPanel, this.drawingToolPanel, this.textPanel, this.historyPanel);
  }

  /**
   * Sets the shapes and paths panel
   *
   * @param shapesAndPathsPanel The shapes and paths panel
   */
   setShapesAndPathsPanel(shapesAndPathsPanel) {
    this.shapesAndPathsPanel = shapesAndPathsPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.projectPanel.setStatusPanel(statusPanel);
    this.layerPanel.setStatusPanel(statusPanel);
    this.drawingToolPanel.setStatusPanel(statusPanel);
    this.historyPanel.setStatusPanel(statusPanel);
  }
}
