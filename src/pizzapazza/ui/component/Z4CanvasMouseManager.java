package pizzapazza.ui.component;

import def.dom.MouseEvent;
import javascript.awt.Color;
import javascript.awt.Dimension;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.iterator.Z4Spirograph;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.math.Z4Vector;
import pizzapazza.math.Z4Whirlpool;
import pizzapazza.math.Z4WhirlpoolBehavior;
import pizzapazza.painter.Z4CenteredFigurePainter;
import pizzapazza.painter.Z4CenteredFigurePainterType;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
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
  private Z4Layer selectedLayer;
  private final $CanvasRenderingContext2D ctx;
  private Dimension size;
  private double zoom;

  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;

  private Z4DrawingTool drawingTool = new Z4DrawingTool(
          new Z4Spirograph(new Z4Rotation(0, new Z4FancifulValue(
                  new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                  new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                  false), Z4RotationBehavior.RELATIVE_TO_PATH, false)
          ),
          new Z4CenteredFigurePainter(
                  Z4CenteredFigurePainterType.TYPE_0,
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4Whirlpool(
                          Z4WhirlpoolBehavior.NONE,
                          new Z4FancifulValue(
                                  new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 30),
                                  new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                                  false)),
                  100,
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Color(255, 0, 0, 255),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Color(255, 255, 0, 255)
          ),
          //          new Z4Shape2DPainter(
          //                  new Z4FancifulValue(
          //                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
          //                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
          //                          false),
          //                  new Z4FancifulValue(
          //                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
          //                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
          //                          false),
          //                  false,
          //                  false,
          //                  3,
          //                  new Z4FancifulValue(
          //                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
          //                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
          //                          false),
          //                  new Z4FancifulValue(
          //                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
          //                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
          //                          false),
          //                  new Color(0, 0, 0, 0),
          //                  new Z4FancifulValue(
          //                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
          //                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
          //                          false),
          //                  new Z4FancifulValue(
          //                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
          //                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
          //                          false),
          //                  new Color(0, 0, 0, 0)
          //          ),
          //          Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)),
          Z4SpatioTemporalColor.fromGradientColor(new Z4GradientColor()),
          new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.01, Z4Lighting.NONE)
  );

  private boolean pressed;

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
   * Sets the drawing tool
   *
   * @param drawingTool The drawing tool
   */
  public void setDrawingTool(Z4DrawingTool drawingTool) {
    this.drawingTool = drawingTool;
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
    if (this.pressed && this.drawingTool.drawAction(action, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(action);
    }
  }

  private void onStop(double x, double y) {
    this.pressed = false;
    if (this.drawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    } else {
      this.startStandard();
    }
  }

  @SuppressWarnings("empty-statement")
  private void iteratePoints(Z4PointIteratorDrawingAction action) {
    if (action != Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint());

      if (this.drawingTool.isInfinitePointGenerator() && this.pressed) {
        setTimeout(() -> this.iteratePoints(action), this.drawingTool.getInfinitePointGeneratorSleep());
      }
    } else if ($exists(this.drawingTool.getNextCountOnSTOP())) {
      Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> this.iteratePoint(0));
    } else {
      this.startStandard();
    }
  }

  private void iteratePoint(int value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.drawingTool.getNextCountOnSTOP());

    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() -> this.iteratePoint(value + 1));
    } else {
      this.startStandard();
      Z4UI.pleaseWaitCompleted();
    }
  }

  private boolean drawNextPoint() {
    Z4DrawingPoint next = this.drawingTool.next();
    if (!$exists(next)) {
      return false;
    } else if (next.drawBounds) {
      if (this.zoom != 1) {
        next = new Z4DrawingPoint(Z4Vector.fromPoints(this.zoom * next.z4Vector.x0, this.zoom * next.z4Vector.y0, this.zoom * next.z4Vector.x, this.zoom * next.z4Vector.y), next.intensity, next.temporalPosition, next.drawBounds, next.side, next.useVectorModuleAsSize);
      }

      this.ctx.save();
      this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.ctx.rotate(next.z4Vector.phase);
      this.drawingTool.draw(this.ctx, next);
      this.ctx.restore();
      return true;
    } else {
      this.selectedLayer.drawTool(this.drawingTool, next);
      this.selectedLayer.getLayerPreview().drawLayer();
      this.canvas.drawCanvas();
      return true;
    }
  }

  private void startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }
}
