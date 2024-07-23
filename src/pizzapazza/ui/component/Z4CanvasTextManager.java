package pizzapazza.ui.component;

import def.dom.CanvasGradient;
import def.dom.MouseEvent;
import def.js.Array;
import static def.js.Globals.eval;
import def.js.Set;
import javascript.awt.Color;
import javascript.awt.Dimension;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4TextInfo;
import pizzapazza.util.Z4TextInfoTextColorFilling;
import pizzapazza.util.Z4TextInfoTextColorOrientation;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$TextMetrics;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Path2D;

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

  private boolean pressed;
  private int selectedControlPoint;

  private final static int SELECTOR_RADIUS = 7;
  private final static double SHEARING_COEFFICIENT = 50;

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
   * @param selectedControlPoint The selected control point
   */
  public void setTextInfo(Z4TextInfo textInfo, int selectedControlPoint) {
    this.textInfo = textInfo;
    this.selectedControlPoint = selectedControlPoint;
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
    } else if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.DRAW_TEXT)) {
      switch (type) {
        case "enter":
          break;
        case "down":
          if ($exists(this.textInfo.shape)) {
            this.textInfo.shape.getControlPoints().forEach((point, index, array) -> {
              if (Z4Math.distance(point.x, point.y, x, y) <= Z4CanvasTextManager.SELECTOR_RADIUS) {
                this.pressed = true;
                this.selectedControlPoint = index;
                this.textInfo.shape.getGeometricShapePreview().setSelectedControlPoint(index);
              }
            });
          }
          break;
        case "move":
          this.statusPanel.setMousePosition(xParsed, yParsed);

          if (this.pressed) {
            this.textInfo.shape.getGeometricShapePreview().setSelectedControlPointPosition(xParsed, yParsed);
          } else {
            this.canvas.getChilStyleByQuery(".z4canvas-overlay").cursor = "default";
            if ($exists(this.textInfo.shape)) {
              this.textInfo.shape.getControlPoints().forEach((point, index, array) -> {
                if (Z4Math.distance(point.x, point.y, x, y) <= Z4CanvasTextManager.SELECTOR_RADIUS) {
                  this.canvas.getChilStyleByQuery(".z4canvas-overlay").cursor = "pointer";
                }
              });
            }
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
  }

  /**
   * Draws a text
   *
   * @param ctx The context used to draw the text
   * @param drawPath true to draw the path where the text is drawn, false
   * otherwise
   */
  public void drawText($CanvasRenderingContext2D ctx, boolean drawPath) {
    ctx.font = (this.textInfo.font.italic ? "italic " : "") + (this.textInfo.font.bold ? "bold " : "") + this.textInfo.font.size + "px '" + this.textInfo.font.family + "'";
    ctx.textAlign = "center";

    if (this.textInfo.shadow) {
      this.draw(ctx, $exists(this.textInfo.shadowText) ? this.textInfo.shadowText : this.textInfo.textText, this.textInfo.textText, this.textInfo.shadowEmpty, this.textInfo.shadowColor, this.textInfo.shadowOffsetX, this.textInfo.shadowOffsetY, this.textInfo.shadowShearX, this.textInfo.shadowShearY, 0, null, this.textInfo.shadowReflex);
    }

    this.draw(ctx, this.textInfo.textText, this.textInfo.textText, this.textInfo.textEmpty, this.textInfo.textColor, 0, 0, this.textInfo.textShearX, this.textInfo.textShearY, this.textInfo.textBorder, this.textInfo.textBorderColor, false);

    if (drawPath) {
      Array<Z4Point> controlPoints = this.textInfo.shape.getControlPoints();
      Array<Integer> controlPointConnections = this.textInfo.shape.getControlPointConnections();

      ctx.save();
      controlPoints.forEach((point, index, array) -> this.drawCircle(ctx, point, index));
      for (int index = 0; index < controlPointConnections.length; index += 2) {
        this.drawLine(ctx, controlPoints.$get(controlPointConnections.$get(index)), controlPoints.$get(controlPointConnections.$get(index + 1)));
      }
      this.drawPolyline(ctx, this.textInfo.shape.getPath2D());
      ctx.restore();
    }
  }

  private void draw($CanvasRenderingContext2D ctx, String strToPrint, String strForMeasure, boolean empty, Object color, int offsetX, int offsetY, int shearX, int shearY, int border, Color borderColor, boolean reflex) {
    shearX /= Z4CanvasTextManager.SHEARING_COEFFICIENT;
    shearY /= Z4CanvasTextManager.SHEARING_COEFFICIENT;

    int strToPrintLen = 0;
    eval("strToPrintLen = strToPrint.length;");
    int strForMeasureLen = 0;
    eval("strForMeasureLen = strForMeasure.length;");

    if (strToPrintLen == 1) {
      this.drawChar(ctx, strToPrint, this.textInfo.shape.getTangentAt(0.5), empty, this.getColor(ctx, strToPrint, color, 0.5, 0, 1), offsetX, offsetY, shearX, shearY, border, borderColor, reflex);
    } else if (strToPrintLen > 1) {
      double x0 = strToPrintLen == strForMeasureLen
              ? ctx.measureText(strForMeasure.substring(0, 1)).width / 2
              : ctx.measureText(strToPrint.substring(0, 1)).width / 2;

      double x1 = strToPrintLen == strForMeasureLen
              ? ctx.measureText(strForMeasure).width - ctx.measureText(strForMeasure.substring(strForMeasureLen - 1)).width / 2
              : ctx.measureText(strToPrint).width - ctx.measureText(strToPrint.substring(strToPrintLen - 1)).width / 2;

      double progress = 0;
      double x1_x0 = x1 - x0;
      double strWidth = ctx.measureText(strToPrint).width;

      for (int i = 0; i < strToPrintLen; i++) {
        String s = strToPrint.substring(i, i + 1);
        double x = strToPrintLen == strForMeasureLen ? ctx.measureText(strForMeasure.substring(i, i + 1)).width : ctx.measureText(s).width;

        double div = (x / 2 + progress - x0) / x1_x0;
        this.drawChar(ctx, s, this.textInfo.shape.getTangentAt(div), empty, this.getColor(ctx, s, color, div, progress / strWidth, (progress + x) / strWidth), offsetX, offsetY, shearX, shearY, border, borderColor, reflex);
        progress += x;
      }
    }
  }

  private Object getColor($CanvasRenderingContext2D ctx, String str, Object color, double div, double start, double end) {
    if (color instanceof Color) {
      return ((Color) color).getRGBA_HEX();
    } else if (this.textInfo.textColorFilling == Z4TextInfoTextColorFilling.UNIFORM) {
      return this.textInfo.textColor.getColorAt(div, false).getRGBA_HEX();
    } else if (this.textInfo.textColorFilling == Z4TextInfoTextColorFilling.SUBGRADIENT) {
      return this.getCanvasGradient(ctx, this.textInfo.textColor.subGradientColor(start, end), str);
    } else if (this.textInfo.textColorFilling == Z4TextInfoTextColorFilling.GRADIENT) {
      return this.getCanvasGradient(ctx, this.textInfo.textColor, str);
    } else {
      return null;
    }
  }

  private CanvasGradient getCanvasGradient($CanvasRenderingContext2D ctx, Z4GradientColor color, String str) {
    $TextMetrics textMetrics = ($TextMetrics) ctx.measureText(str);
    if (this.textInfo.textColorOrientation == Z4TextInfoTextColorOrientation.HORIZONTAL) {
      return color.createLinearGradient(ctx, -textMetrics.actualBoundingBoxLeft, 0, textMetrics.actualBoundingBoxRight, 0);
    } else if (this.textInfo.textColorOrientation == Z4TextInfoTextColorOrientation.VERTICAL) {
      return color.createLinearGradient(ctx, 0, -textMetrics.actualBoundingBoxAscent, 0, textMetrics.actualBoundingBoxDescent);
    } else {
      return null;
    }
  }

  private void drawChar($CanvasRenderingContext2D ctx, String s, Z4Vector next, boolean empty, Object color, int offsetX, int offsetY, int shearX, int shearY, int border, Color borderColor, boolean reflex) {
    ctx.save();

    ctx.translate(next.x0 + offsetX, next.y0 + offsetY);
    ctx.rotate(this.textInfo.rotation.next(next.phase));
    ctx.transform(1, shearY, -shearX, 1, 0, 0);
    if (reflex) {
      ctx.transform(1, 0, 0, -1, 0, 0);
    }

    ctx.strokeStyle = Z4Constants.$getStyle(color);
    ctx.fillStyle = Z4Constants.$getStyle(color);

    if (empty) {
      ctx.strokeText(s, 0, 0);
    } else {
      ctx.fillText(s, 0, 0);
    }

    if ($exists(border)) {
      ctx.lineWidth = border;
      ctx.strokeStyle = Z4Constants.$getStyle(borderColor.getRGBA_HEX());
      ctx.strokeText(s, 0, 0);
    }

    ctx.restore();
  }

  private void drawCircle($CanvasRenderingContext2D ctx, Z4Point point, int index) {
    ctx.lineWidth = 3 / this.zoom;

    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasTextManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = Z4Constants.$getStyle(index == this.selectedControlPoint ? "red" : "black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasTextManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
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

  private void drawPolyline($CanvasRenderingContext2D ctx, $Path2D path2D) {
    ctx.lineWidth = 3 / this.zoom;

    Array<Double> dash = new Array<>();

    ctx.strokeStyle = Z4Constants.$getStyle("green");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);

    dash.push(2.5, 2.5);

    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);
  }
}
