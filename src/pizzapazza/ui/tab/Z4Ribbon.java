package pizzapazza.ui.tab;

import javascript.swing.JSTabbedPane;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.math.geometricshape.Z4ShapesAndPathsPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonDrawingToolPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHelpPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonProjectPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonRulerAndClippingPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonSettingsPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonTextPanel;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$exists;

/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Ribbon extends JSTabbedPane {

  private final Z4RibbonProjectPanel projectPanel = new Z4RibbonProjectPanel();
  private final Z4RibbonLayerPanel layerPanel = new Z4RibbonLayerPanel();
  private final Z4RibbonDrawingToolPanel drawingToolPanel = new Z4RibbonDrawingToolPanel();
  private final Z4RibbonTextPanel textPanel = new Z4RibbonTextPanel();
  private final Z4RibbonRulerAndClippingPanel rulerAndClippingPanel = new Z4RibbonRulerAndClippingPanel();
  private final Z4RibbonHistoryPanel historyPanel = new Z4RibbonHistoryPanel();
  private final Z4RibbonSettingsPanel settingsPanel = new Z4RibbonSettingsPanel();
  private final Z4RibbonHelpPanel helpPanel = new Z4RibbonHelpPanel();

  private Z4Canvas canvas;
  private Z4ShapesAndPathsPanel shapesAndPathsPanel;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4Ribbon() {
    super();
    this.cssAddClass("z4ribbon");

    this.addTab(Z4Translations.PROJECT, this.projectPanel);
    this.addTab(Z4Translations.LAYER, this.layerPanel);
    this.addTab(Z4Translations.DRAWING_TOOL, this.drawingToolPanel);
    this.addTab(Z4Translations.TEXT, this.textPanel);
    this.addTab(Z4Translations.RULER_AND_CLIPPING, this.rulerAndClippingPanel);
    this.addTab(Z4Translations.HISTORY, this.historyPanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
    this.addTab(Z4Translations.HELP, this.helpPanel);

    this.addChangeListener(event -> {
      if (this.textPanel.getStyle().display != "none") {
        this.textPanel.checkFonts();
        this.shapesAndPathsPanel.getStyle().removeProperty("display");
      } else if (this.drawingToolPanel.getStyle().display != "none" && $exists(this.canvas.getSelectedDrawingTool()) && this.canvas.getSelectedDrawingTool().useShapesAndPaths()) {
        this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
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
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
    canvas.setRibbonPanels(this.projectPanel, this.layerPanel, this.drawingToolPanel, this.textPanel, this.rulerAndClippingPanel, this.historyPanel);
  }

  /**
   * Sets the shapes and paths panel
   *
   * @param shapesAndPathsPanel The shapes and paths panel
   */
  public void setShapesAndPathsPanel(Z4ShapesAndPathsPanel shapesAndPathsPanel) {
    this.shapesAndPathsPanel = shapesAndPathsPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.projectPanel.setStatusPanel(statusPanel);
    this.layerPanel.setStatusPanel(statusPanel);
    this.drawingToolPanel.setStatusPanel(statusPanel);
    this.rulerAndClippingPanel.setStatusPanel(statusPanel);
    this.historyPanel.setStatusPanel(statusPanel);
  }
}
