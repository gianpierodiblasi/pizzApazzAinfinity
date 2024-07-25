/**
 * The text manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasTextManager {

   canvas = null;

   selectedLayer = null;

   textInfo = null;

   size = null;

   zoom = 0.0;

   canvasOverlayModes = new Set();

   ribbonHistoryPanel = null;

   statusPanel = null;

   pressed = false;

   selectedControlPoint = 0;

  static  SELECTOR_RADIUS = 7;

  static  SHEARING_COEFFICIENT = 50;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the selected layer
   *
   * @param selectedLayer The selected layer
   */
   setSelectedLayer(selectedLayer) {
    this.selectedLayer = selectedLayer;
  }

  /**
   * Sets the text info
   *
   * @param textInfo The text info
   * @param selectedControlPoint The selected control point
   */
   setTextInfo(textInfo, selectedControlPoint) {
    this.textInfo = textInfo;
    this.selectedControlPoint = selectedControlPoint;
  }

  /**
   * Sets the size
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom = zoom;
  }

  /**
   * Adds a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   addCanvasOverlayMode(canvasOverlayMode) {
    this.canvasOverlayModes.add(canvasOverlayMode);
  }

  /**
   * Removes a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   removeCanvasOverlayMode(canvasOverlayMode) {
    this.canvasOverlayModes.delete(canvasOverlayMode);
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonHistoryPanel(ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * The mouse event manager
   *
   * @param event The mouse event
   * @param type The event type
   */
   onMouse(event, type) {
    let x = Math.min(this.size.width, Math.max(0, event.offsetX / this.zoom));
    let y = Math.min(this.size.height, Math.max(0, event.offsetY / this.zoom));
    let xParsed = parseInt(x);
    let yParsed = parseInt(y);
    if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.PICK_COLOR)) {
    } else if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.DRAW_TEXT)) {
      switch(type) {
        case "enter":
          break;
        case "down":
          if (this.textInfo.shape) {
            this.textInfo.shape.getControlPoints().forEach((point, index, array) => {
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
            if (this.textInfo.shape) {
              this.textInfo.shape.getControlPoints().forEach((point, index, array) => {
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
   * @param withDirection true to show an arrow representing the direction of
   * the path, false otherwise
   */
   drawText(ctx, drawPath, withDirection) {
    ctx.font = (this.textInfo.font.italic ? "italic " : "") + (this.textInfo.font.bold ? "bold " : "") + this.textInfo.font.size + "px '" + this.textInfo.font.family + "'";
    ctx.textAlign = "center";
    if (this.textInfo.shadow) {
      this.draw(ctx, this.textInfo.shadowText ? this.textInfo.shadowText : this.textInfo.textText, this.textInfo.textText, this.textInfo.shadowEmpty, this.textInfo.shadowColor, this.textInfo.shadowOffsetX, this.textInfo.shadowOffsetY, this.textInfo.shadowShearX, this.textInfo.shadowShearY, 0, null, this.textInfo.shadowReflex);
    }
    this.draw(ctx, this.textInfo.textText, this.textInfo.textText, this.textInfo.textEmpty, this.textInfo.textColor, 0, 0, this.textInfo.textShearX, this.textInfo.textShearY, this.textInfo.textBorder, this.textInfo.textBorderColor, false);
    if (drawPath) {
      let controlPoints = this.textInfo.shape.getControlPoints();
      let controlPointConnections = this.textInfo.shape.getControlPointConnections();
      ctx.save();
      controlPoints.filter((point, index, array) => index !== this.selectedControlPoint).forEach((point, index, array) => this.drawCircle(ctx, point, "black"));
      this.drawCircle(ctx, controlPoints[this.selectedControlPoint], "red");
      for (let index = 0; index < controlPointConnections.length; index += 2) {
        this.drawLine(ctx, controlPoints[controlPointConnections[index]], controlPoints[controlPointConnections[index + 1]]);
      }
      this.drawPolyline(ctx, this.textInfo.shape.getPath2D(), withDirection ? this.textInfo.shape.getDirectionArrows() : new Array());
      ctx.restore();
    }
  }

   draw(ctx, strToPrint, strForMeasure, empty, color, offsetX, offsetY, shearX, shearY, border, borderColor, reflex) {
    shearX /= Z4CanvasTextManager.SHEARING_COEFFICIENT;
    shearY /= Z4CanvasTextManager.SHEARING_COEFFICIENT;
    let strToPrintLen = 0;
    eval("strToPrintLen = strToPrint.length;");
    let strForMeasureLen = 0;
    eval("strForMeasureLen = strForMeasure.length;");
    if (strToPrintLen === 1) {
      this.drawChar(ctx, strToPrint, this.textInfo.shape.getTangentAt(0.5), empty, this.getColor(ctx, strToPrint, color, 0.5, 0, 1), offsetX, offsetY, shearX, shearY, border, borderColor, reflex);
    } else if (strToPrintLen > 1) {
      let x0 = strToPrintLen === strForMeasureLen ? ctx.measureText(strForMeasure.substring(0, 1)).width / 2 : ctx.measureText(strToPrint.substring(0, 1)).width / 2;
      let x1 = strToPrintLen === strForMeasureLen ? ctx.measureText(strForMeasure).width - ctx.measureText(strForMeasure.substring(strForMeasureLen - 1)).width / 2 : ctx.measureText(strToPrint).width - ctx.measureText(strToPrint.substring(strToPrintLen - 1)).width / 2;
      let progress = 0;
      let x1_x0 = x1 - x0;
      let strWidth = ctx.measureText(strToPrint).width;
      for (let i = 0; i < strToPrintLen; i++) {
        let s = strToPrint.substring(i, i + 1);
        let x = strToPrintLen === strForMeasureLen ? ctx.measureText(strForMeasure.substring(i, i + 1)).width : ctx.measureText(s).width;
        let div = (x / 2 + progress - x0) / x1_x0;
        this.drawChar(ctx, s, this.textInfo.shape.getTangentAt(div), empty, this.getColor(ctx, s, color, div, progress / strWidth, (progress + x) / strWidth), offsetX, offsetY, shearX, shearY, border, borderColor, reflex);
        progress += x;
      }
    }
  }

   getColor(ctx, str, color, div, start, end) {
    if (color instanceof Color) {
      return (color).getRGBA_HEX();
    } else if (this.textInfo.textColorFilling === Z4TextInfoTextColorFilling.UNIFORM) {
      return this.textInfo.textColor.getColorAt(div, false).getRGBA_HEX();
    } else if (this.textInfo.textColorFilling === Z4TextInfoTextColorFilling.SUBGRADIENT) {
      return this.getCanvasGradient(ctx, this.textInfo.textColor.subGradientColor(start, end), str);
    } else if (this.textInfo.textColorFilling === Z4TextInfoTextColorFilling.GRADIENT) {
      return this.getCanvasGradient(ctx, this.textInfo.textColor, str);
    } else {
      return null;
    }
  }

   getCanvasGradient(ctx, color, str) {
    let textMetrics = ctx.measureText(str);
    if (this.textInfo.textColorOrientation === Z4TextInfoTextColorOrientation.HORIZONTAL) {
      return color.createLinearGradient(ctx, -textMetrics.actualBoundingBoxLeft, 0, textMetrics.actualBoundingBoxRight, 0);
    } else if (this.textInfo.textColorOrientation === Z4TextInfoTextColorOrientation.VERTICAL) {
      return color.createLinearGradient(ctx, 0, -textMetrics.actualBoundingBoxAscent, 0, textMetrics.actualBoundingBoxDescent);
    } else {
      return null;
    }
  }

   drawChar(ctx, s, next, empty, color, offsetX, offsetY, shearX, shearY, border, borderColor, reflex) {
    ctx.save();
    ctx.translate(next.x0 + offsetX, next.y0 + offsetY);
    ctx.rotate(this.textInfo.rotation.next(next.phase));
    ctx.transform(1, shearY, -shearX, 1, 0, 0);
    if (reflex) {
      ctx.transform(1, 0, 0, -1, 0, 0);
    }
    ctx.strokeStyle = Z4Constants.getStyle(color);
    ctx.fillStyle = Z4Constants.getStyle(color);
    if (empty) {
      ctx.strokeText(s, 0, 0);
    } else {
      ctx.fillText(s, 0, 0);
    }
    if (border) {
      ctx.lineWidth = border;
      ctx.strokeStyle = Z4Constants.getStyle(borderColor.getRGBA_HEX());
      ctx.strokeText(s, 0, 0);
    }
    ctx.restore();
  }

   drawCircle(ctx, point, color) {
    ctx.lineWidth = 3 / this.zoom;
    let dash = new Array();
    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasTextManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = Z4Constants.getStyle(color);
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasTextManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

   drawLine(ctx, p1, p2) {
    ctx.lineWidth = 2 / this.zoom;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

   drawPolyline(ctx, path2D, directionArrows) {
    ctx.lineWidth = 3 / this.zoom;
    let dash = new Array();
    ctx.strokeStyle = Z4Constants.getStyle("green");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);
    dash.push(2.5, 2.5);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);
    ctx.setLineDash(new Array());
    directionArrows.forEach(directionArrow => {
      ctx.fillStyle = Z4Constants.getStyle("white");
      ctx.fill(directionArrow);
      ctx.strokeStyle = Z4Constants.getStyle("green");
      ctx.stroke(directionArrow);
    });
  }
}
