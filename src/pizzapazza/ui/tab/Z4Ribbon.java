package pizzapazza.ui.tab;

import javascript.swing.JSTabbedPane;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonDrawingToolPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHelpPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonProjectPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonSettingsPanel;
import pizzapazza.util.Z4Translations;

/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Ribbon extends JSTabbedPane {

  private final Z4RibbonProjectPanel projectPanel = new Z4RibbonProjectPanel();
  private final Z4RibbonLayerPanel layerPanel = new Z4RibbonLayerPanel();
  private final Z4RibbonDrawingToolPanel drawingToolPanel = new Z4RibbonDrawingToolPanel();
  private final Z4RibbonHistoryPanel historyPanel = new Z4RibbonHistoryPanel();
  private final Z4RibbonSettingsPanel settingsPanel = new Z4RibbonSettingsPanel();
  private final Z4RibbonHelpPanel helpPanel = new Z4RibbonHelpPanel();

  private Z4Canvas canvas;

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
    this.addTab(Z4Translations.HISTORY, this.historyPanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
    this.addTab(Z4Translations.HELP, this.helpPanel);
    this.addChangeListener(event -> {
      this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);

//      if (this.historyPanel.getStyle().display == "grid") {
//        this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
//      }
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
    canvas.setRibbonPanels(this.projectPanel, this.layerPanel, this.drawingToolPanel, this.historyPanel);
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
    this.historyPanel.setStatusPanel(statusPanel);
  }
}
