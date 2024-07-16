/**
 * The text manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasTextManager {

   canvas = null;

   ctx = null;

   selectedLayer = null;

   textInfo = null;

   size = null;

   zoom = 0.0;

   canvasOverlayModes = new Set();

   ribbonHistoryPanel = null;

   statusPanel = null;

  // 
  // private boolean pressed;
  // private double onStartX;
  // private double onStartY;
  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param ctx The canvas context
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
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
    // double x = Math.min(this.size.width, Math.max(0, event.offsetX / this.zoom));
    // double y = Math.min(this.size.height, Math.max(0, event.offsetY / this.zoom));
    // int xParsed = parseInt(x);
    // int yParsed = parseInt(y);
    // 
    // if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.PICK_COLOR)) {
    // switch (type) {
    // case "up":
    // this.statusPanel.colorPicked(this.canvas.getColorAt(xParsed, yParsed), this.canvas.getSelectedLayerColorAt(xParsed, yParsed));
    // break;
    // case "move":
    // this.statusPanel.setMousePosition(xParsed, yParsed);
    // break;
    // }
    // } else {
    // switch (type) {
    // case "enter":
    // this.pressed = event.buttons == 1;
    // this.onAction(Z4PointIteratorDrawingAction.START, x, y);
    // this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
    // break;
    // case "down":
    // this.pressed = true;
    // this.onAction(Z4PointIteratorDrawingAction.START, x, y);
    // break;
    // case "move":
    // this.statusPanel.setMousePosition(xParsed, yParsed);
    // this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
    // break;
    // case "up":
    // this.onStop(x, y);
    // break;
    // case "leave":
    // if (this.pressed) {
    // this.onStop(x, y);
    // }
    // break;
    // }
    // }
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
  // private Z4Point checkPoint(Z4PointIteratorDrawingAction action, double x, double y) {
  // Z4Point point = this.magneticGrid ? Z4Math.nearestPointInGrid(x, y, this.centerGrid.x, this.centerGrid.y, this.plotWidthGrid, Z4Constants.MAGNETISM_PERCENTAGE) : new Z4Point(x, y);
  // 
  // if (!$exists(point)) {
  // if (action == Z4PointIteratorDrawingAction.START) {
  // this.pressed = false;
  // }
  // 
  // return null;
  // } else if (action == Z4PointIteratorDrawingAction.START) {
  // this.onStartX = x;
  // this.onStartY = y;
  // 
  // return point;
  // } else if (this.drawingDirection == Z4DrawingDirection.FREE) {
  // return point;
  // } else if (this.drawingDirection == Z4DrawingDirection.HORIZONTAL) {
  // return new Z4Point(point.x, this.onStartY);
  // } else if (this.drawingDirection == Z4DrawingDirection.VERTICAL) {
  // return new Z4Point(this.onStartX, point.y);
  // } else {
  // return null;
  // }
  // }
  // @SuppressWarnings("empty-statement")
  // private void iteratePoints(Z4PointIteratorDrawingAction action) {
  // if (action != Z4PointIteratorDrawingAction.STOP) {
  // while (this.drawNextPoint());
  // 
  // if (this.selectedDrawingTool.isInfinitePointGenerator() && this.pressed) {
  // setTimeout(() -> this.iteratePoints(action), this.selectedDrawingTool.getInfinitePointGeneratorSleep());
  // }
  // } else if ($exists(this.selectedDrawingTool.getNextCountOnSTOP())) {
  // Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> this.iteratePoint(0));
  // } else {
  // this.startStandard();
  // }
  // }
  // private void iteratePoint(int value) {
  // Z4UI.setPleaseWaitProgressBarValue(100 * value / this.selectedDrawingTool.getNextCountOnSTOP());
  // 
  // if (this.drawNextPoint()) {
  // Z4UI.pleaseWaitAdvanced(() -> this.iteratePoint(value + 1));
  // } else {
  // this.startStandard();
  // Z4UI.pleaseWaitCompleted();
  // }
  // }
  // private boolean drawNextPoint() {
  // Z4DrawingPoint next = this.selectedDrawingTool.next();
  // if (!$exists(next)) {
  // return false;
  // } else if (next.intent == Z4DrawingPointIntent.DRAW_OBJECTS) {
  // this.selectedLayer.drawTool(this.selectedDrawingTool, next);
  // this.selectedLayer.getLayerPreview().drawLayer();
  // this.canvas.drawCanvas();
  // return true;
  // } else {
  // if (this.zoom != 1) {
  // next = new Z4DrawingPoint(Z4Vector.fromPoints(this.zoom * next.z4Vector.x0, this.zoom * next.z4Vector.y0, this.zoom * next.z4Vector.x, this.zoom * next.z4Vector.y), next.intensity, next.temporalPosition, next.intent, next.side, next.useVectorModuleAsSize);
  // }
  // 
  // if (next.intent == Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
  // this.canvas.drawCanvas();
  // }
  // 
  // this.ctx.save();
  // this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
  // this.ctx.rotate(next.z4Vector.phase);
  // this.selectedDrawingTool.draw(this.ctx, next);
  // this.ctx.restore();
  // return true;
  // }
  // }
  // private void startStandard() {
  // this.canvas.setChanged(true);
  // this.canvas.setSaved(false);
  // this.ribbonHistoryPanel.startStandard();
  // }
}
