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
      this.selectedLayer.drawTool(this.selectedDrawingTool, next);
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
      this.ctx.save();
      this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.ctx.rotate(next.z4Vector.phase);
      this.selectedDrawingTool.draw(this.ctx, next);
      this.ctx.restore();
      return true;
    }
  }

   startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }
}
