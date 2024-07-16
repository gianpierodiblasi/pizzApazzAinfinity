package pizzapazza.ui.component;

import def.dom.MouseEvent;
import def.js.Set;
import javascript.awt.Dimension;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4TextInfo;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The text manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasTextManager {

  private final Z4Canvas canvas;

  private Z4Layer selectedLayer;
  private Z4TextInfo textInfo;

  private Dimension size;
  private double zoom;

  private final Set<Z4CanvasOverlayMode> canvasOverlayModes = new Set<>();

  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;
//
//  private boolean pressed;
//  private double onStartX;
//  private double onStartY;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   */
  public Z4CanvasTextManager(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the selected layer
   *
   * @param selectedLayer The selected layer
   */
  public void setSelectedLayer(Z4Layer selectedLayer) {
    this.selectedLayer = selectedLayer;
  }

  /**
   * Sets the text info
   *
   * @param textInfo The text info
   */
  public void setTextInfo(Z4TextInfo textInfo) {
    this.textInfo = textInfo;
  }

  /**
   * Sets the size
   *
   * @param size The size
   */
  public void setSize(Dimension size) {
    this.size = size;
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
  public void setZoom(double zoom) {
    this.zoom = zoom;
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
  public void setRibbonHistoryPanel(Z4RibbonHistoryPanel ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * The mouse event manager
   *
   * @param event The mouse event
   * @param type The event type
   */
  public void onMouse(MouseEvent event, String type) {
//    double x = Math.min(this.size.width, Math.max(0, event.offsetX / this.zoom));
//    double y = Math.min(this.size.height, Math.max(0, event.offsetY / this.zoom));
//    int xParsed = parseInt(x);
//    int yParsed = parseInt(y);
//
//    if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.PICK_COLOR)) {
//      switch (type) {
//        case "up":
//          this.statusPanel.colorPicked(this.canvas.getColorAt(xParsed, yParsed), this.canvas.getSelectedLayerColorAt(xParsed, yParsed));
//          break;
//        case "move":
//          this.statusPanel.setMousePosition(xParsed, yParsed);
//          break;
//      }
//    } else {
//      switch (type) {
//        case "enter":
//          this.pressed = event.buttons == 1;
//          this.onAction(Z4PointIteratorDrawingAction.START, x, y);
//          this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
//          break;
//        case "down":
//          this.pressed = true;
//          this.onAction(Z4PointIteratorDrawingAction.START, x, y);
//          break;
//        case "move":
//          this.statusPanel.setMousePosition(xParsed, yParsed);
//          this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
//          break;
//        case "up":
//          this.onStop(x, y);
//          break;
//        case "leave":
//          if (this.pressed) {
//            this.onStop(x, y);
//          }
//          break;
//      }
//    }
  }

//  private void onAction(Z4PointIteratorDrawingAction action, double x, double y) {
//    Z4Point point = this.checkPoint(action, x, y);
//
//    if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer) || !$exists(point)) {
//    } else if (this.pressed && this.selectedDrawingTool.drawAction(action, point.x, point.y)) {
//      this.ribbonHistoryPanel.stopStandard();
//      this.iteratePoints(action);
//    }
//  }
//  private void onStop(double x, double y) {
//    this.pressed = false;
//    if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer)) {
//    } else if (this.selectedDrawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
//      this.ribbonHistoryPanel.stopStandard();
//      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
//    } else {
//      this.startStandard();
//    }
//  }

  /**
   * Draws a text
   *
   * @param ctx The context used to draw the text
   * @param drawPath true to draw the path where the text is drawn, false
   * otherwise
   */
  public void drawText($CanvasRenderingContext2D ctx, boolean drawPath) {

  }
}
