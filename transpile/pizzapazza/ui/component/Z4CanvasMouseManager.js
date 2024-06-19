/**
 * The mouse manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasMouseManager {

   canvas = null;

   selectedLayer = null;

   ctx = null;

   zoom = 0.0;

   ribbonHistoryPanel = null;

   statusPanel = null;

   drawingTool = new Z4DrawingTool(new Z4Spirograph(new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.RELATIVE_TO_PATH, false)), new Z4CenteredFigurePainter(Z4CenteredFigurePainterType.TYPE_0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 30), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)), 100), // new Z4Shape2DPainter(
  // new Z4FancifulValue(
  // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
  // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
  // false),
  // new Z4FancifulValue(
  // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
  // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
  // false),
  // false,
  // false,
  // 3,
  // new Z4FancifulValue(
  // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
  // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
  // false),
  // new Z4FancifulValue(
  // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
  // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
  // false),
  // new Color(0, 0, 0, 0),
  // new Z4FancifulValue(
  // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
  // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
  // false),
  // new Z4FancifulValue(
  // new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
  // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
  // false),
  // new Color(0, 0, 0, 0)
  // ),
  // Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)),
  Z4SpatioTemporalColor.fromGradientColor(new Z4GradientColor()), new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, 0.01, Z4Lighting.NONE));

   pressed = false;

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
   * Sets the drawing tool
   *
   * @param drawingTool The drawing tool
   */
   setDrawingTool(drawingTool) {
    this.drawingTool = drawingTool;
  }

  /**
   * The mouse event manager
   *
   * @param event The mouse event
   * @param type The event type
   */
   onMouse(event, type) {
    let size = this.canvas.getSize();
    let x = Math.min(size.width, Math.max(0, event.offsetX / this.zoom));
    let y = Math.min(size.height, Math.max(0, event.offsetY / this.zoom));
    switch(type) {
      case "enter":
        this.pressed = event.buttons === 1;
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

   onAction(action, x, y) {
    if (this.pressed && this.drawingTool.drawAction(action, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(action);
    }
  }

   onStop(x, y) {
    this.pressed = false;
    if (this.drawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    } else {
      this.startStandard();
    }
  }

   iteratePoints(action) {
    if (action !== Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint()) ;
      if (this.drawingTool.isInfinitePointGenerator() && this.pressed) {
        setTimeout(() => this.iteratePoints(action), this.drawingTool.getInfinitePointGeneratorSleep());
      }
    } else if (this.drawingTool.getNextCountOnSTOP()) {
      Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => this.iteratePoint(0));
    } else {
      this.startStandard();
    }
  }

   iteratePoint(value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.drawingTool.getNextCountOnSTOP());
    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() => this.iteratePoint(value + 1));
    } else {
      this.startStandard();
      Z4UI.pleaseWaitCompleted();
    }
  }

   drawNextPoint() {
    let next = this.drawingTool.next();
    if (!next) {
      return false;
    } else if (next.drawBounds) {
      if (this.zoom !== 1) {
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

   startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }
}
