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

  // 
  // private boolean pressed;
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
   */
   setTextInfo(textInfo) {
    this.textInfo = textInfo;
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
        // case "enter":
        // this.pressed = event.buttons == 1;
        // this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        // this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        // break;
        // case "down":
        // this.pressed = true;
        // this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        // break;
        case "move":
          this.statusPanel.setMousePosition(xParsed, yParsed);
          break;
      }
    }
  }

  // private void onAction(Z4PointIteratorDrawingAction action, double x, double y) {
  // Z4Point point = this.checkPoint(action, x, y);
  // 
  // if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer) || !$exists(point)) {
  // } else if (this.pressed && this.selectedDrawingTool.drawAction(action, point.x, point.y)) {
  // this.ribbonHistoryPanel.stopStandard();
  // this.iteratePoints(action);
  // }
  // }
  // private void onStop(double x, double y) {
  // this.pressed = false;
  // if (!$exists(this.selectedDrawingTool) || !$exists(this.selectedLayer)) {
  // } else if (this.selectedDrawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
  // this.ribbonHistoryPanel.stopStandard();
  // this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
  // } else {
  // this.startStandard();
  // }
  // }
  // 
  /**
   * Draws a text
   *
   * @param ctx The context used to draw the text
   * @param drawPath true to draw the path where the text is drawn, false
   * otherwise
   */
   drawText(ctx, drawPath) {
    ctx.font = (this.textInfo.font.italic ? "italic " : "") + (this.textInfo.font.bold ? "bold " : "") + this.textInfo.font.size + "px '" + this.textInfo.font.family + "'";
    ctx.textAlign = "center";
    if (this.textInfo.shadow) {
      this.draw(ctx, this.textInfo.shadowText ? this.textInfo.shadowText : this.textInfo.textText, this.textInfo.shadowEmpty, this.textInfo.shadowColor, this.textInfo.shadowOffsetX, this.textInfo.shadowOffsetY, this.textInfo.shadowShearX, this.textInfo.shadowShearY, 0, null, this.textInfo.shadowReflex);
    }
    this.draw(ctx, this.textInfo.textText, this.textInfo.textEmpty, null, 0, 0, this.textInfo.textShearX, this.textInfo.textShearY, this.textInfo.textBorder, this.textInfo.textBorderColor, false);
  }

   draw(ctx, str, empty, color, offsetX, offsetY, shearX, shearY, border, borderColor, reflex) {
    shearX /= Z4CanvasTextManager.SHEARING_COEFFICIENT;
    shearY /= Z4CanvasTextManager.SHEARING_COEFFICIENT;
    let strLen = 0;
    eval("strLen = str.length;");
    let progress = 0;
    let strWidth = ctx.measureText(str).width;
    for (let i = 0; i < strLen; i++) {
      let s = str.substring(i, i + 1);
      let sWidth = ctx.measureText(s).width;
      let pos = sWidth / strWidth;
      let next = this.textInfo.shape.getTangentAt(progress + pos / 2);
      let c = color ? color.getRGBA_HEX() : this.textInfo.textColor.getColorAt(progress + pos / 2, true).getRGBA_HEX();
      progress += pos;
      ctx.save();
      ctx.translate(next.x0 + offsetX, next.y0 + offsetY);
      ctx.rotate(this.textInfo.rotation.next(next.phase));
      ctx.transform(1, shearY, -shearX, 1, 0, 0);
      if (reflex) {
        ctx.transform(1, 0, 0, -1, 0, 0);
      }
      ctx.strokeStyle = Z4Constants.getStyle(c);
      ctx.fillStyle = Z4Constants.getStyle(c);
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
  }
}
