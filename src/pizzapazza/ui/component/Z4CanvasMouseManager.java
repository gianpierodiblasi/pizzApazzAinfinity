package pizzapazza.ui.component;

import def.dom.MouseEvent;
import def.js.Array;
import def.js.Set;
import javascript.awt.Dimension;
import javascript.awt.Point;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.math.Z4DrawingDirection;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.math.geometricshape.Z4GeometricShape;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Kaleidoscope;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;
import simulation.js.$Path2D;

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
  private Z4Kaleidoscope kaleidoscope = new Z4Kaleidoscope(1, 0, 0);
  private Z4GeometricShape selectedGeometricShape;

  private Point centerGrid;
  private int plotWidthGrid;
  private boolean magneticGrid;

  private Dimension size;
  private double zoom;

  private final Set<Z4CanvasOverlayMode> canvasOverlayModes = new Set<>();

  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;

  private boolean pressed;
  private double onStartX;
  private double onStartY;
  private int selectedControlPoint;

  private final static int SELECTOR_RADIUS = 7;

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
   * Sets the kaleidoscope
   *
   * @param kaleidoscope The kaleidoscope
   */
  public void setKaleidoscope(Z4Kaleidoscope kaleidoscope) {
    this.kaleidoscope = kaleidoscope;
  }

  /**
   * Sets the selected geometric shape
   *
   * @param selectedGeometricShape The selected geometric shape
   */
  public void setSelectedGeometricShape(Z4GeometricShape selectedGeometricShape) {
    this.selectedGeometricShape = selectedGeometricShape;
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
   * Adds a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
  public void addCanvasOverlayMode(Z4CanvasOverlayMode canvasOverlayMode) {
    this.canvasOverlayModes.add(canvasOverlayMode);
  }

  /**
   * Removes a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
  public void removeCanvasOverlayMode(Z4CanvasOverlayMode canvasOverlayMode) {
    this.canvasOverlayModes.delete(canvasOverlayMode);
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
    int xParsed = parseInt(x);
    int yParsed = parseInt(y);

    if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.PICK_COLOR)) {
      switch (type) {
        case "up":
          this.statusPanel.colorPicked(this.canvas.getColorAt(xParsed, yParsed), this.canvas.getSelectedLayerColorAt(xParsed, yParsed));
          break;
        case "move":
          this.statusPanel.setMousePosition(xParsed, yParsed);
          break;
      }
    } else if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.DRAW_TEXT)) {
    } else if ($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths()) {
      if ($exists(this.selectedGeometricShape)) {
        switch (type) {
          case "enter":
            break;
          case "down":
            this.selectedGeometricShape.getControlPoints().forEach((point, index, array) -> {
              if (Z4Math.distance(point.x, point.y, x, y) <= Z4CanvasMouseManager.SELECTOR_RADIUS) {
                this.pressed = true;
                this.selectedControlPoint = index;
                this.selectedGeometricShape.getGeometricShapePreview().setSelectedControlPoint(index);
              }
            });
            break;
          case "move":
            this.statusPanel.setMousePosition(xParsed, yParsed);

            if (this.pressed) {
              this.selectedGeometricShape.getGeometricShapePreview().setSelectedControlPointPosition(xParsed, yParsed);
            } else {
              this.canvas.getChilStyleByQuery(".z4canvas-overlay").cursor = "default";
              this.selectedGeometricShape.getControlPoints().forEach((point, index, array) -> {
                if (Z4Math.distance(point.x, point.y, x, y) <= Z4CanvasMouseManager.SELECTOR_RADIUS) {
                  this.canvas.getChilStyleByQuery(".z4canvas-overlay").cursor = "pointer";
                }
              });
            }
            break;
          case "up":
            this.pressed = false;
            break;
          case "leave":
            if (this.pressed) {
              this.pressed = false;
            }
            break;
        }
      }
    } else {
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
          this.statusPanel.setMousePosition(xParsed, yParsed);
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
  }

  private void onAction(Z4PointIteratorDrawingAction action, double x, double y) {
    Z4Point point = this.checkPoint(action, x, y);

    if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer) || !$exists(point)) {
    } else if (this.pressed && this.selectedDrawingTool.drawAction(action, point.x, point.y)) {
      this.ribbonHistoryPanel.stopStandard();
      if (this.selectedDrawingTool.isDrawBoundsWhileMoving()) {
        this.canvas.drawCanvas();
      }
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
      this.selectedLayer.drawTool(this.selectedDrawingTool, next, this.kaleidoscope);
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

      double incAngle = Z4Math.TWO_PI / this.kaleidoscope.multiplicity;
      for (int index = 0; index < this.kaleidoscope.multiplicity; index++) {
        double angle = index * incAngle;

        this.ctx.save();
        this.ctx.translate(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY);
        this.ctx.rotate(angle);
        this.ctx.translate(next.z4Vector.x0 - this.kaleidoscope.offsetX, next.z4Vector.y0 - this.kaleidoscope.offsetY);
        this.ctx.rotate(next.z4Vector.phase);
        this.selectedDrawingTool.draw(this.ctx, next);
        this.ctx.restore();
      }

      return true;
    }
  }

  private void startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }

  /**
   * Draws the kaleidoscope center
   *
   * @param ctx The context used to draw the kaleidoscope
   */
  public void drawKaleidoscope($CanvasRenderingContext2D ctx) {
    ctx.lineWidth = 3 / this.zoom;

    $Path2D path = new $Path2D();
    path.moveTo(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY - 15 / this.zoom);
    path.lineTo(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY + 15 / this.zoom);
    path.moveTo(this.kaleidoscope.offsetX - 15 / this.zoom, this.kaleidoscope.offsetY);
    path.lineTo(this.kaleidoscope.offsetX + 15 / this.zoom, this.kaleidoscope.offsetY);
    path.moveTo(this.kaleidoscope.offsetX + 20 / this.zoom, this.kaleidoscope.offsetY);
    path.arc(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY, 20 / this.zoom, 0, Z4Math.TWO_PI);

    Array<Double> dash = new Array<>();
    ctx.strokeStyle = Z4Constants.$getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke(path);

    dash.push(ctx.lineWidth, ctx.lineWidth);
    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke(path);
  }

  /**
   * Draws the geometric shape
   *
   * @param ctx The context used to draw the kaleidoscope
   * @param withDirection true to show an arrow representing the direction of
   * the path, false otherwise
   */
  public void drawGeometricShape($CanvasRenderingContext2D ctx, boolean withDirection) {
    this.canvas.drawCanvas();
    boolean prevPressed = this.pressed;

    this.pressed = true;
    Z4Point p = this.selectedGeometricShape.getPointAt(0);
    this.onAction(Z4PointIteratorDrawingAction.START, p.x, p.y);
    this.onAction(Z4PointIteratorDrawingAction.CONTINUE, p.x, p.y);

    for (double s = 0.01; s <= 1; s += 0.01) {
      p = this.selectedGeometricShape.getPointAt(s);
      this.onAction(Z4PointIteratorDrawingAction.CONTINUE, p.x, p.y);
    }

    this.pressed = prevPressed;

    Array<Z4Point> controlPoints = this.selectedGeometricShape.getControlPoints();
    Array<Integer> controlPointConnections = this.selectedGeometricShape.getControlPointConnections();

    ctx.save();
    controlPoints.filter((point, index, array) -> index != this.selectedControlPoint).forEach((point, index, array) -> this.drawCircle(ctx, point, "black"));
    this.drawCircle(ctx, controlPoints.$get(this.selectedControlPoint), "red");

    for (int index = 0; index < controlPointConnections.length; index += 2) {
      this.drawLine(ctx, controlPoints.$get(controlPointConnections.$get(index)), controlPoints.$get(controlPointConnections.$get(index + 1)));
    }
    this.drawPolyline(ctx, this.selectedGeometricShape.getPath2D(), withDirection ? this.selectedGeometricShape.getDirectionArrows() : new Array<>());
    ctx.restore();
  }

  private void drawCircle($CanvasRenderingContext2D ctx, Z4Point point, String color) {
    ctx.lineWidth = 3 / this.zoom;

    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasMouseManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = Z4Constants.$getStyle(color);
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasMouseManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

  private void drawLine($CanvasRenderingContext2D ctx, Z4Point p1, Z4Point p2) {
    ctx.lineWidth = 2 / this.zoom;

    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = Z4Constants.$getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

  private void drawPolyline($CanvasRenderingContext2D ctx, $Path2D path2D, Array<$Path2D> directionArrows) {
    ctx.lineWidth = 3 / this.zoom;

    Array<Double> dash = new Array<>();

    ctx.strokeStyle = Z4Constants.$getStyle("green");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);

    dash.push(2.5, 2.5);

    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);

    ctx.setLineDash(new Array<>());
    directionArrows.forEach(directionArrow -> {
      ctx.fillStyle = Z4Constants.$getStyle("white");
      ctx.fill(directionArrow);

      ctx.strokeStyle = Z4Constants.$getStyle("green");
      ctx.stroke(directionArrow);
    });
  }
}
