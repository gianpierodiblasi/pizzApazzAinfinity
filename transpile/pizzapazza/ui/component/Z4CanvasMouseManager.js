/**
 * The mouse manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasMouseManager {

   canvas = null;

   ctx = null;

   selectedLayer = null;

   selectedDrawingTool = null;

   drawingDirection = Z4DrawingDirection.FREE;

   kaleidoscope = new Z4Kaleidoscope(1, 0, 0);

   selectedGeometricShape = null;

   centerGrid = null;

   plotWidthGrid = 0;

   magneticGrid = false;

   size = null;

   zoom = 0.0;

   canvasOverlayModes = new Set();

   ribbonHistoryPanel = null;

   statusPanel = null;

   pressed = false;

   onStartX = 0.0;

   onStartY = 0.0;

   selectedControlPoint = 0;

  static  SELECTOR_RADIUS = 7;

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
   * Sets the selected drawing tool
   *
   * @param selectedDrawingTool The selected drawing tool
   */
   setSelectedDrawingTool(selectedDrawingTool) {
    this.selectedDrawingTool = selectedDrawingTool;
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection = drawingDirection;
  }

  /**
   * Sets the kaleidoscope
   *
   * @param kaleidoscope The kaleidoscope
   */
   setKaleidoscope(kaleidoscope) {
    this.kaleidoscope = kaleidoscope;
  }

  /**
   * Sets the selected geometric shape
   *
   * @param selectedGeometricShape The selected geometric shape
   */
   setSelectedGeometricShape(selectedGeometricShape) {
    this.selectedGeometricShape = selectedGeometricShape;
  }

  /**
   * Sets the magnetic grid
   *
   * @param center The grid center
   * @param plotWidth The grid plot width
   * @param b true to enable the magnetic grid, false otherwise
   */
   setMagneticGrid(center, plotWidth, b) {
    this.centerGrid = center;
    this.plotWidthGrid = plotWidth;
    this.magneticGrid = b;
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
      switch(type) {
        case "up":
          this.statusPanel.colorPicked(this.canvas.getColorAt(xParsed, yParsed), this.canvas.getSelectedLayerColorAt(xParsed, yParsed));
          break;
        case "move":
          this.statusPanel.setMousePosition(xParsed, yParsed);
          break;
      }
    } else if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.DRAW_TEXT)) {
    } else if (this.selectedDrawingTool && this.selectedDrawingTool.useShapesAndPaths()) {
      if (this.selectedGeometricShape) {
        switch(type) {
          case "enter":
            break;
          case "down":
            this.selectedGeometricShape.getControlPoints().forEach((point, index, array) => {
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
              this.selectedGeometricShape.getControlPoints().forEach((point, index, array) => {
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

   onAction(action, x, y) {
    let point = this.checkPoint(action, x, y);
    if (!this.selectedDrawingTool || !this.selectedLayer || !point) {
    } else if (this.pressed && this.selectedDrawingTool.drawAction(action, point.x, point.y)) {
      this.ribbonHistoryPanel.stopStandard();
      if (this.selectedDrawingTool.isDrawBoundsWhileMoving()) {
        this.canvas.drawCanvas();
      }
      this.iteratePoints(action);
    }
  }

   onStop(x, y) {
    this.pressed = false;
    if (!this.selectedDrawingTool || !this.selectedLayer) {
    } else if (this.selectedDrawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    } else {
      this.startStandard();
    }
  }

   checkPoint(action, x, y) {
    let point = this.magneticGrid ? Z4Math.nearestPointInGrid(x, y, this.centerGrid.x, this.centerGrid.y, this.plotWidthGrid, Z4Constants.MAGNETISM_PERCENTAGE) : new Z4Point(x, y);
    if (!point) {
      if (action === Z4PointIteratorDrawingAction.START) {
        this.pressed = false;
      }
      return null;
    } else if (action === Z4PointIteratorDrawingAction.START) {
      this.onStartX = x;
      this.onStartY = y;
      return point;
    } else if (this.drawingDirection === Z4DrawingDirection.FREE) {
      return point;
    } else if (this.drawingDirection === Z4DrawingDirection.HORIZONTAL) {
      return new Z4Point(point.x, this.onStartY);
    } else if (this.drawingDirection === Z4DrawingDirection.VERTICAL) {
      return new Z4Point(this.onStartX, point.y);
    } else {
      return null;
    }
  }

   iteratePoints(action) {
    if (action !== Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint()) ;
      if (this.selectedDrawingTool.isInfinitePointGenerator() && this.pressed) {
        setTimeout(() => this.iteratePoints(action), this.selectedDrawingTool.getInfinitePointGeneratorSleep());
      }
    } else if (this.selectedDrawingTool.getNextCountOnSTOP()) {
      Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => this.iteratePoint(0));
    } else {
      this.startStandard();
    }
  }

   iteratePoint(value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.selectedDrawingTool.getNextCountOnSTOP());
    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() => this.iteratePoint(value + 1));
    } else {
      this.startStandard();
      Z4UI.pleaseWaitCompleted();
    }
  }

   drawNextPoint() {
    let next = this.selectedDrawingTool.next();
    if (!next) {
      return false;
    } else if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS) {
      this.selectedLayer.drawTool(this.selectedDrawingTool, next, this.kaleidoscope);
      this.selectedLayer.getLayerPreview().drawLayer();
      this.canvas.drawCanvas();
      return true;
    } else {
      if (this.zoom !== 1) {
        next = new Z4DrawingPoint(Z4Vector.fromPoints(this.zoom * next.z4Vector.x0, this.zoom * next.z4Vector.y0, this.zoom * next.z4Vector.x, this.zoom * next.z4Vector.y), next.intensity, next.temporalPosition, next.intent, next.side, next.useVectorModuleAsSize);
      }
      if (next.intent === Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
        this.canvas.drawCanvas();
      }
      let incAngle = Z4Math.TWO_PI / this.kaleidoscope.multiplicity;
      for (let index = 0; index < this.kaleidoscope.multiplicity; index++) {
        let angle = index * incAngle;
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

   startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }

  /**
   * Draws the kaleidoscope center
   *
   * @param ctx The context used to draw the kaleidoscope
   */
   drawKaleidoscope(ctx) {
    ctx.lineWidth = 3 / this.zoom;
    let path = new Path2D();
    path.moveTo(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY - 15 / this.zoom);
    path.lineTo(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY + 15 / this.zoom);
    path.moveTo(this.kaleidoscope.offsetX - 15 / this.zoom, this.kaleidoscope.offsetY);
    path.lineTo(this.kaleidoscope.offsetX + 15 / this.zoom, this.kaleidoscope.offsetY);
    path.moveTo(this.kaleidoscope.offsetX + 20 / this.zoom, this.kaleidoscope.offsetY);
    path.arc(this.kaleidoscope.offsetX, this.kaleidoscope.offsetY, 20 / this.zoom, 0, Z4Math.TWO_PI);
    let dash = new Array();
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke(path);
    dash.push(ctx.lineWidth, ctx.lineWidth);
    ctx.strokeStyle = Z4Constants.getStyle("white");
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
   drawGeometricShape(ctx, withDirection) {
    this.canvas.drawCanvas();
    let prevPressed = this.pressed;
    this.pressed = true;
    let p = this.selectedGeometricShape.getPointAt(0);
    this.onAction(Z4PointIteratorDrawingAction.START, p.x, p.y);
    this.onAction(Z4PointIteratorDrawingAction.CONTINUE, p.x, p.y);
    for (let s = 0.01; s <= 1; s += 0.01) {
      p = this.selectedGeometricShape.getPointAt(s);
      this.onAction(Z4PointIteratorDrawingAction.CONTINUE, p.x, p.y);
    }
    this.pressed = prevPressed;
    let controlPoints = this.selectedGeometricShape.getControlPoints();
    let controlPointConnections = this.selectedGeometricShape.getControlPointConnections();
    ctx.save();
    controlPoints.filter((point, index, array) => index !== this.selectedControlPoint).forEach((point, index, array) => this.drawCircle(ctx, point, "black"));
    this.drawCircle(ctx, controlPoints[this.selectedControlPoint], "red");
    for (let index = 0; index < controlPointConnections.length; index += 2) {
      this.drawLine(ctx, controlPoints[controlPointConnections[index]], controlPoints[controlPointConnections[index + 1]]);
    }
    this.drawPolyline(ctx, this.selectedGeometricShape.getPath2D(), withDirection ? this.selectedGeometricShape.getDirectionArrows() : new Array());
    ctx.restore();
  }

   drawCircle(ctx, point, color) {
    ctx.lineWidth = 3 / this.zoom;
    let dash = new Array();
    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasMouseManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = Z4Constants.getStyle(color);
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.arc(point.x, point.y, Z4CanvasMouseManager.SELECTOR_RADIUS, 0, 2 * Math.PI);
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
