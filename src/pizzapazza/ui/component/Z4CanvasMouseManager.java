package pizzapazza.ui.component;

import def.dom.MouseEvent;
import javascript.awt.Dimension;
import javascript.awt.Point;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.math.Z4DrawingDirection;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;

/**
 * The mouse manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasMouseManager {

  private final Z4Canvas canvas;
  private final $CanvasRenderingContext2D ctx;

  private Z4Layer selectedLayer;
  private Z4DrawingTool selectedDrawingTool;
  private Z4DrawingDirection drawingDirection = Z4DrawingDirection.FREE;

  private Point centerGrid;
  private int plotWidthGrid;
  private boolean magneticGrid;

  private Dimension size;
  private double zoom;

  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;

  private boolean pressed;
  private double onStartX;
  private double onStartY;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param ctx The canvas context
   */
  public Z4CanvasMouseManager(Z4Canvas canvas, $CanvasRenderingContext2D ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
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
   * Sets the selected drawing tool
   *
   * @param selectedDrawingTool The selected drawing tool
   */
  public void setSelectedDrawingTool(Z4DrawingTool selectedDrawingTool) {
    this.selectedDrawingTool = selectedDrawingTool;
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
  public void setDrawingDirection(Z4DrawingDirection drawingDirection) {
    this.drawingDirection = drawingDirection;
  }

  /**
   * Sets the magnetic grid
   *
   * @param center The grid center
   * @param plotWidth The grid plot width
   * @param b true to enable the magnetic grid, false otherwise
   */
  public void setMagneticGrid(Point center, int plotWidth, boolean b) {
    this.centerGrid = center;
    this.plotWidthGrid = plotWidth;
    this.magneticGrid = b;
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
    double x = Math.min(this.size.width, Math.max(0, event.offsetX / this.zoom));
    double y = Math.min(this.size.height, Math.max(0, event.offsetY / this.zoom));

    switch (type) {
      case "enter":
        this.pressed = event.buttons == 1;
        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        break;
      case "down":
        this.pressed = true;
        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        break;
      case "move":
        this.statusPanel.setMousePosition(parseInt(x), parseInt(y));
        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        break;
      case "up":
        this.onStop(x, y);
        break;
      case "leave":
        if (this.pressed) {
          this.onStop(x, y);
        }
        break;
    }
  }

  private void onAction(Z4PointIteratorDrawingAction action, double x, double y) {
    Z4Point point = this.checkPoint(action, x, y);

    if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer) || !$exists(point)) {
    } else if (this.pressed && this.selectedDrawingTool.drawAction(action, point.x, point.y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(action);
    }
  }

  private void onStop(double x, double y) {
    this.pressed = false;
    if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer)) {
    } else if (this.selectedDrawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    } else {
      this.startStandard();
    }
  }

  private Z4Point checkPoint(Z4PointIteratorDrawingAction action, double x, double y) {
    Z4Point point = this.magneticGrid ? Z4Math.nearestPointInGrid(x, y, this.centerGrid.x, this.centerGrid.y, this.plotWidthGrid, Z4Constants.MAGNETISM_PERCENTAGE) : new Z4Point(x, y);

    if (!$exists(point)) {
      if (action == Z4PointIteratorDrawingAction.START) {
        this.pressed = false;
      }

      return null;
    } else if (action == Z4PointIteratorDrawingAction.START) {
      this.onStartX = x;
      this.onStartY = y;

      return point;
    } else if (this.drawingDirection == Z4DrawingDirection.FREE) {
      return point;
    } else if (this.drawingDirection == Z4DrawingDirection.HORIZONTAL) {
      return new Z4Point(point.x, this.onStartY);
    } else if (this.drawingDirection == Z4DrawingDirection.VERTICAL) {
      return new Z4Point(this.onStartX, point.y);
    } else {
      return null;
    }
  }

  @SuppressWarnings("empty-statement")
  private void iteratePoints(Z4PointIteratorDrawingAction action) {
    if (action != Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint());

      if (this.selectedDrawingTool.isInfinitePointGenerator() && this.pressed) {
        setTimeout(() -> this.iteratePoints(action), this.selectedDrawingTool.getInfinitePointGeneratorSleep());
      }
    } else if ($exists(this.selectedDrawingTool.getNextCountOnSTOP())) {
      Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> this.iteratePoint(0));
    } else {
      this.startStandard();
    }
  }

  private void iteratePoint(int value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.selectedDrawingTool.getNextCountOnSTOP());

    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() -> this.iteratePoint(value + 1));
    } else {
      this.startStandard();
      Z4UI.pleaseWaitCompleted();
    }
  }

  private boolean drawNextPoint() {
    Z4DrawingPoint next = this.selectedDrawingTool.next();
    if (!$exists(next)) {
      return false;
    } else if (next.intent == Z4DrawingPointIntent.DRAW_OBJECTS) {
      this.selectedLayer.drawTool(this.selectedDrawingTool, next);
      this.selectedLayer.getLayerPreview().drawLayer();
      this.canvas.drawCanvas();
      return true;
    } else {
      if (this.zoom != 1) {
        next = new Z4DrawingPoint(Z4Vector.fromPoints(this.zoom * next.z4Vector.x0, this.zoom * next.z4Vector.y0, this.zoom * next.z4Vector.x, this.zoom * next.z4Vector.y), next.intensity, next.temporalPosition, next.intent, next.side, next.useVectorModuleAsSize);
      }

      if (next.intent == Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
        this.canvas.drawCanvas();
      }

      this.ctx.save();
      this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.ctx.rotate(next.z4Vector.phase);
      this.selectedDrawingTool.draw(this.ctx, next);
      this.ctx.restore();
      return true;
    }
  }

  private void startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }
}
