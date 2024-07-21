/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   canvasGrid = document.createElement("canvas");

   ctxGrid = this.canvasGrid.getContext("2d");

   pathGrid = null;

   centerGrid = null;

   plotWidthGrid = 0;

   dottedGrid = false;

   magneticGrid = false;

   colorGrid = null;

   canvasBounds = document.createElement("canvas");

   ctxBounds = this.canvasBounds.getContext("2d");

   showLayerBounds = false;

   canvasOverlay = document.createElement("canvas");

   ctxOverlay = this.canvasOverlay.getContext("2d");

   canvasOverlayModes = new Set();

   ribbonProjectPanel = null;

   ribbonLayerPanel = null;

   ribbonDrawingToolPanel = null;

   ribbonTextPanel = null;

   ribbonHistoryPanel = null;

   shapesAndPathsPanel = null;

   statusPanel = null;

   projectName = null;

   handle = null;

   width = 0;

   height = 0;

   zoom = 1;

   zooming = false;

   saved = true;

   changed = false;

   isOpenFromHistory = false;

   paper = new Z4Paper();

   selectedLayer = null;

   drawingTools = new Array();

   selectedDrawingTool = null;

   drawingDirection = Z4DrawingDirection.FREE;

   geometricShapes = new Array();

   selectedGeometricShape = null;

   textInfo = null;

   canvasArray = new Array(this.canvas, this.canvasGrid, this.canvasBounds, this.canvasOverlay);

   mouseManager = new Z4CanvasMouseManager(this, this.ctx);

   ioManager = new Z4CanvasIOManager(this, this.paper, this.drawingTools);

   textManager = new Z4CanvasTextManager(this);

   historyManager = new Z4CanvasHistoryManager(this, this.paper);

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);
    this.appendNodeChild(this.canvasGrid);
    this.appendNodeChild(this.canvasBounds);
    this.appendNodeChild(this.canvasOverlay);
    this.canvas.classList.add("main-canvas");
    this.canvas.addEventListener("mouseenter", event => this.mouseManager.onMouse(event, "enter"));
    this.canvas.addEventListener("mouseleave", event => this.mouseManager.onMouse(event, "leave"));
    this.canvas.addEventListener("mousedown", event => this.mouseManager.onMouse(event, "down"));
    this.canvas.addEventListener("mousemove", event => this.mouseManager.onMouse(event, "move"));
    this.canvas.addEventListener("mouseup", event => this.mouseManager.onMouse(event, "up"));
    this.canvasOverlay.addEventListener("mousemove", event => this.mouseManager.onMouse(event, "move"));
    this.canvasOverlay.addEventListener("mouseup", event => this.mouseManager.onMouse(event, "up"));
    this.canvasOverlay.addEventListener("mouseenter", event => this.textManager.onMouse(event, "enter"));
    this.canvasOverlay.addEventListener("mouseleave", event => this.textManager.onMouse(event, "leave"));
    this.canvasOverlay.addEventListener("mousedown", event => this.textManager.onMouse(event, "down"));
    this.canvasOverlay.addEventListener("mousemove", event => this.textManager.onMouse(event, "move"));
    this.canvasOverlay.addEventListener("mouseup", event => this.textManager.onMouse(event, "up"));
    this.addEventListener("wheel", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.deltaY < 0) {
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.find(level => level > this.zoom, null));
      } else if (evt.ctrlKey && evt.deltaY > 0) {
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.filter(level => level < this.zoom).pop());
      }
    });
    this.addEventListener("keydown", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.key === "+") {
        evt.stopPropagation();
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.find(level => level > this.zoom, null));
      } else if (evt.key === "-") {
        evt.stopPropagation();
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.filter(level => level < this.zoom).pop());
      }
    });
  }

  /**
   * Sets the ribbon panels
   *
   * @param ribbonProjectPanel The ribbon project panel
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   * @param ribbonTextPanel The ribbon text panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonPanels(ribbonProjectPanel, ribbonLayerPanel, ribbonDrawingToolPanel, ribbonTextPanel, ribbonHistoryPanel) {
    this.ribbonProjectPanel = ribbonProjectPanel;
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonTextPanel = ribbonTextPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
    this.ribbonProjectPanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);
    this.ribbonDrawingToolPanel.setCanvas(this);
    this.ribbonTextPanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);
    this.mouseManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.ioManager.setRibbonPanels(ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel);
    this.textManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.historyManager.setRibbonLayerPanel(ribbonLayerPanel);
  }

  /**
   * Sets the shapes and paths panel
   *
   * @param shapesAndPathsPanel The shapes and paths panel
   */
   setShapesAndPathsPanel(shapesAndPathsPanel) {
    this.shapesAndPathsPanel = shapesAndPathsPanel;
    this.shapesAndPathsPanel.setCanvas(this);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
    this.statusPanel.setCanvas(this);
    this.mouseManager.setStatusPanel(statusPanel);
    this.ioManager.setStatusPanel(statusPanel);
    this.textManager.setStatusPanel(statusPanel);
  }

  /**
   * Creates a new project
   *
   * @param width The image width
   * @param height The image height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   create(width, height, filling) {
    this.paper.reset();
    this.paper.addLayer(Z4Translations.BACKGROUND_LAYER, width, height, filling, width, height);
    this.setSize(width, height);
    this.ribbonLayerPanel.reset();
    this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);
    this.drawingTools.length = 0;
    this.ribbonDrawingToolPanel.reset();
    Color.resetHistory();
    Z4GradientColor.resetHistory();
    Z4BiGradientColor.resetHistory();
    this.ribbonHistoryPanel.resetHistory(() => {
      this.afterCreate("", width, height);
      this.fitZoomIfNeeded();
      this.toHistory(json => this.ribbonHistoryPanel.addHistory(json, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
    });
  }

  /**
   * Creates a new project from an image file
   *
   * @param handle The file handle
   */
   createFromHandle(handle) {
    this.ioManager.createFromHandle(handle);
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
   createFromFile(file) {
    this.ioManager.createFromFile(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   */
   createFromClipboard() {
    this.ioManager.createFromClipboard();
  }

  /**
   * The method called after create
   *
   * @param projectName The project name
   * @param width The width
   * @param height The height
   */
   afterCreate(projectName, width, height) {
    this.projectName = projectName;
    this.statusPanel.setProjectName(projectName);
    this.statusPanel.setProjectSize(width, height);
    if (!this.isOpenFromHistory) {
      this.statusPanel.setZoom(1);
      this.statusPanel.setDrawingDirection(Z4DrawingDirection.FREE);
      this.statusPanel.resetCanvasGridPanel(width, height, false);
      this.zoom = 1;
      this.mouseManager.setZoom(this.zoom);
      this.mouseManager.setMagneticGrid(null, 0, false);
      this.textManager.setZoom(this.zoom);
      this.setDrawingDirection(Z4DrawingDirection.FREE);
      this.pathGrid = null;
      this.showLayerBounds = false;
      this.setSaved(true);
      this.changed = false;
    }
    this.isOpenFromHistory = false;
    this.setCanvasSize(width, height, this.zoom);
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasOverlay();
  }

  /**
   * Opens a project
   *
   * @param handle The file handle
   */
   openProjectFromHandle(handle) {
    this.handle = handle;
    this.ioManager.openProjectFromHandle(handle);
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
   openProjectFromFile(file) {
    this.ioManager.openProjectFromFile(file);
  }

  /**
   * Opens an history
   *
   * @param json The history
   */
   openFromHistory(json) {
    this.isOpenFromHistory = true;
    this.historyManager.openFromHistory(json);
  }

  /**
   * Saves the project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   */
   saveProjectToHandle(handle, apply) {
    this.handle = handle;
    this.projectName = this.ioManager.saveProjectToHandle(handle, apply);
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
   saveProjectToFile(projectName, apply) {
    this.projectName = projectName;
    this.ioManager.saveProjectToFile(projectName, apply);
  }

  /**
   * Saves the history
   *
   * @param policies A comma-separated list of history management policies
   * indicating which criteria should perform saving
   */
   saveHistory(policies) {
    this.ribbonHistoryPanel.saveHistory(policies);
  }

  /**
   * Prepares the project for the history
   *
   * @param apply The function to call after preparation
   */
   toHistory(apply) {
    this.historyManager.toHistory(apply);
  }

  /**
   * Exports this project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
   exportToFile(filename, ext, quality) {
    this.ioManager.exportToFile(filename, ext, quality);
  }

  /**
   * Exports this project to an image file
   *
   * @param handle The file handle
   * @param quality The quality
   */
   exportToHandle(handle, quality) {
    this.ioManager.exportToHandle(handle, quality);
  }

  /**
   * Returns a layer
   *
   * @param index The index layer
   * @return The layer
   */
   getLayerAt(index) {
    return this.paper.getLayerAt(index);
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   addLayer(width, height, filling) {
    this.paper.addLayer(this.findLayerName(), width, height, filling, this.width, this.height);
    this.afterAddLayer();
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param handle The file handle
   */
   addLayerFromHandle(handle) {
    this.ioManager.addLayerFromHandle(handle);
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
   addLayerFromFile(file) {
    this.ioManager.addLayerFromFile(file);
  }

  /**
   * Adds a layer from an image in the clipboard
   */
   addLayerFromClipboard() {
    this.ioManager.addLayerFromClipboard();
  }

  /**
   * The method called after adding a layer
   */
   afterAddLayer() {
    this.changed = true;
    this.saveHistory("standard,tool");
    this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);
    this.setSaved(false);
  }

  /**
   * Duplicates a layer
   *
   * @param layer The layer
   */
   duplicateLayer(layer) {
    let offset = layer.getOffset();
    layer.convertToBlob(blob => {
      let image = document.createElement("img");
      image.onload = event => {
        this.paper.addLayerFromImage(this.findLayerName(), image, this.width, this.height);
        this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), duplicate => {
          duplicate.setOpacity(layer.getOpacity());
          duplicate.setCompositeOperation(layer.getCompositeOperation());
          duplicate.setHidden(layer.isHidden());
          duplicate.move(offset.x, offset.y);
        }, true);
        this.changed = true;
        this.saveHistory("standard,tool");
        this.setSaved(false);
        this.drawCanvas();
        return null;
      };
      image.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Deletes a layer
   *
   * @param layer The layer
   * @param fromMerge true if the delete is called from a merge action, false
   * otherwise
   * @return The layer index
   */
   deleteLayer(layer, fromMerge) {
    let index = this.paper.deleteLayer(layer);
    if (!fromMerge) {
      if (this.selectedLayer === layer) {
        let count = this.getLayersCount();
        this.setSelectedLayer(this.paper.getLayerAt(count - 1));
        document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ") .z4layerpreview-selector").textContent = Z4LayerPreview.SELECTED_LAYER_CONTENT;
        setTimeout(() => (document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ")")).scrollIntoView(), 0);
      }
      this.changed = true;
      this.saveHistory("standard,tool");
      this.setSaved(false);
      this.drawCanvas();
    }
    return index;
  }

  /**
   * Moves a layer to a position
   *
   * @param layer The layer
   * @param position The new position
   * @return true if the move has been performed, false otherwise
   */
   moveLayer(layer, position) {
    if (this.paper.moveLayer(layer, position)) {
      this.changed = true;
      this.saveHistory("standard,tool");
      this.setSaved(false);
      this.drawCanvas();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Merges an array of layers
   *
   * @param layers The layers
   */
   mergeLayers(layers) {
    this.ioManager.mergeLayers(layers);
  }

  /**
   * Finds a layer name
   *
   * @return The layer name
   */
   findLayerName() {
    let counter = 0;
    let found = "";
    while (!found) {
      found = Z4Translations.LAYER + "_" + counter;
      for (let index = 0; index < this.getLayersCount(); index++) {
        if (found === this.paper.getLayerAt(index).getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

  /**
   * Sets the selected layer
   *
   * @param selectedLayer The selected layer
   */
   setSelectedLayer(selectedLayer) {
    this.setSelectedLayerAndAddLayerPreview(selectedLayer, null, false);
  }

  /**
   * Sets the selected layer and adds the layer preview
   *
   * @param selectedLayer The selected layer
   * @param apply The function to apply before adding the layer preview
   * @param add true to add the layer preview, false otherwise
   */
   setSelectedLayerAndAddLayerPreview(selectedLayer, apply, add) {
    this.selectedLayer = selectedLayer;
    this.mouseManager.setSelectedLayer(this.selectedLayer);
    this.textManager.setSelectedLayer(this.selectedLayer);
    if (apply) {
      apply(this.selectedLayer);
    }
    if (add) {
      this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);
    }
  }

  /**
   * Returns the layers count
   *
   * @return The layers count
   */
   getLayersCount() {
    return this.paper.getLayersCount();
  }

  /**
   * Sets the visualization of the layer bounds
   *
   * @param showLayerBounds true to show the layer bounds, false otherwise
   */
   setShowLayerBounds(showLayerBounds) {
    this.showLayerBounds = showLayerBounds;
    this.drawCanvasBounds();
  }

  /**
   * Adds a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   addCanvasOverlayMode(canvasOverlayMode) {
    this.addRemoveCanvasOverlayMode(canvasOverlayMode, true);
  }

  /**
   * Removes a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   removeCanvasOverlayMode(canvasOverlayMode) {
    this.addRemoveCanvasOverlayMode(canvasOverlayMode, false);
  }

   addRemoveCanvasOverlayMode(canvasOverlayMode, add) {
    if (add) {
      this.canvasOverlayModes.add(canvasOverlayMode);
      this.mouseManager.addCanvasOverlayMode(canvasOverlayMode);
      this.textManager.addCanvasOverlayMode(canvasOverlayMode);
    } else {
      this.canvasOverlayModes.delete(canvasOverlayMode);
      this.mouseManager.removeCanvasOverlayMode(canvasOverlayMode);
      this.textManager.removeCanvasOverlayMode(canvasOverlayMode);
    }
    this.canvasOverlay.style.pointerEvents = this.canvasOverlayModes.size ? "auto" : "none";
    this.drawCanvasOverlay();
  }

  /**
   * Adds a drawing tool
   *
   * @param drawingTool The drawing tool
   */
   addDrawingTool(drawingTool) {
    this.drawingTools.push(drawingTool);
    this.setSelectedDrawingToolAndAddDrawingToolPreview(drawingTool, true);
    this.setSaved(false);
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param handle The file handle
   */
   addDrawingToolFromHandle(handle) {
    this.ioManager.addDrawingToolFromHandle(handle);
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param file The file
   */
   addDrawingToolFromFile(file) {
    this.ioManager.addDrawingToolFromFile(file);
  }

  /**
   * Replaces a drawing tool
   *
   * @param oldDrawingTool The old drawing tool
   * @param newDrawingTool The new drawing tool
   */
   replaceDrawingTool(oldDrawingTool, newDrawingTool) {
    let index = this.drawingTools.indexOf(oldDrawingTool);
    this.drawingTools[index] = newDrawingTool;
    if (this.selectedDrawingTool === oldDrawingTool) {
      this.setSelectedDrawingTool(newDrawingTool);
    }
    this.setSaved(false);
  }

  /**
   * Deletes a drawing tool
   *
   * @param drawingTool The drawing tool
   * @return The drawing tool index
   */
   deleteDrawingTool(drawingTool) {
    let index = this.drawingTools.indexOf(drawingTool);
    this.drawingTools.splice(index, 1);
    if (this.selectedDrawingTool !== drawingTool) {
    } else if (this.drawingTools.length) {
      this.setSelectedDrawingTool(this.drawingTools[this.drawingTools.length - 1]);
      document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ") .z4drawingtoolpreview-selector").textContent = Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT;
      setTimeout(() => (document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ")")).scrollIntoView(), 0);
    } else {
      this.setSelectedDrawingTool(null);
    }
    this.setSaved(false);
    return index;
  }

  /**
   * Finds a drawing tool name
   *
   * @return The drawing tool name
   */
   findDrawingToolName() {
    let counter = 0;
    let found = "";
    while (!found) {
      found = Z4Translations.DRAWING_TOOL + " " + counter;
      for (let index = 0; index < this.drawingTools.length; index++) {
        if (found === this.drawingTools[index].getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

  /**
   * Sets the selected drawing tool
   *
   * @param selectedDrawingTool The selected drawing tool
   */
   setSelectedDrawingTool(selectedDrawingTool) {
    this.setSelectedDrawingToolAndAddDrawingToolPreview(selectedDrawingTool, false);
  }

  /**
   * Sets the selected drawing tool and adds the drawing tool preview
   *
   * @param selectedDrawingTool The selected drawing tool
   * @param add true to add the drawing tool preview, false otherwise
   */
   setSelectedDrawingToolAndAddDrawingToolPreview(selectedDrawingTool, add) {
    this.selectedDrawingTool = selectedDrawingTool;
    this.mouseManager.setSelectedDrawingTool(selectedDrawingTool);
    this.saveHistory("tool");
    if (add) {
      this.ribbonDrawingToolPanel.addDrawingToolPreview(this.selectedDrawingTool);
    }
  }

  /**
   * Saves a drawing tool
   *
   * @param fileName The file name
   * @param drawingTool the drawing tool
   */
   saveDrawingToolToFile(fileName, drawingTool) {
    this.ioManager.saveDrawingToolToFile(fileName, drawingTool);
  }

  /**
   * Saves a drawing tool
   *
   * @param handle The file handle
   * @param drawingTool The drawing tool
   */
   saveDrawingToolToHandle(handle, drawingTool) {
    this.ioManager.saveDrawingToolToHandle(handle, drawingTool);
  }

  /**
   * Saves the drawing tools
   *
   * @param fileName The file name
   */
   saveDrawingToolsToFile(fileName) {
    this.ioManager.saveDrawingToolsToFile(fileName);
  }

  /**
   * Saves the drawing tools
   *
   * @param handle The file handle
   */
   saveDrawingToolsToHandle(handle) {
    this.ioManager.saveDrawingToolsToHandle(handle);
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
   getProjectName() {
    return this.projectName;
  }

  /**
   * Returns the file handle of this project
   *
   * @return The file handle of this project
   */
   getHandle() {
    return this.handle;
  }

  /**
   * Sets the size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    this.width = width;
    this.height = height;
    this.mouseManager.setSize(this.getSize());
    this.ioManager.setSize(this.getSize());
    this.textManager.setSize(this.getSize());
    this.historyManager.setSize(this.getSize());
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
   isSaved() {
    return this.saved;
  }

  /**
   * Sets the saved status of the canvas
   *
   * @param saved true to set the canvas as saved, false otherwise
   */
   setSaved(saved) {
    this.saved = saved;
    this.ribbonProjectPanel.setSaveEnabled(!this.saved);
  }

  /**
   * Checks if this canvas is changed
   *
   * @return true if this canvas is changed, false otherwise
   */
   isChanged() {
    return this.changed;
  }

  /**
   * Sets the changed status of the canvas
   *
   * @param changed true to set the canvas as changed, false otherwise
   */
   setChanged(changed) {
    this.changed = changed;
  }

  /**
   * Returns a pixel color
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
   getColorAt(x, y) {
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      let data = this.ctx.getImageData(x * this.zoom, y * this.zoom, 1, 1).data;
      return new Color(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
    } else {
      return null;
    }
  }

  /**
   * Returns a pixel color in the selected layer
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
   getSelectedLayerColorAt(x, y) {
    return this.selectedLayer.getColorAt(x, y);
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom = zoom;
    this.mouseManager.setZoom(this.zoom);
    this.textManager.setZoom(this.zoom);
    this.setCanvasSize(this.width, this.height, zoom);
    this.pathGrid = this.pathGrid ? this.createGrid() : null;
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasOverlay();
  }

  /**
   * Sets the zoom to fit the available space
   */
   fitZoom() {
    this.setZoom(Math.min((this.canvas.parentElement.clientWidth - 20) / this.width, (this.canvas.parentElement.clientHeight - 20) / this.height));
  }

  /**
   * Sets the zoom to fit the available space if needed, that is if the image is
   * bigger than the available space
   */
   fitZoomIfNeeded() {
    if ((this.canvas.parentElement.clientWidth - 20) < this.width || (this.canvas.parentElement.clientHeight - 20) < this.height) {
      this.fitZoom();
      this.statusPanel.setZoom(this.zoom);
    }
  }

   zoomInOut(apply) {
    if (this.zooming) {
    } else {
      this.zooming = true;
      let newZoom = apply();
      if (newZoom) {
        this.setZoom(newZoom);
        this.statusPanel.setZoom(this.zoom);
      }
      this.zooming = false;
    }
  }

  /**
   * Returns the drawing direction
   *
   * @return The drawing direction
   */
   getDrawingDirection() {
    return this.drawingDirection;
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection = drawingDirection;
    this.mouseManager.setDrawingDirection(drawingDirection);
  }

  /**
   * Sets the grid
   *
   * @param visible true if the grid is visible, false otherwise
   * @param center The grid center
   * @param plotWidth The grid plot width
   * @param dottedGrid true for the dotted grid, false otherwise
   * @param magnetic true for a magnetic grid, false otherwise
   * @param color The grid color
   */
   setGrid(visible, center, plotWidth, dottedGrid, magnetic, color) {
    this.centerGrid = center;
    this.plotWidthGrid = plotWidth;
    this.dottedGrid = dottedGrid;
    this.magneticGrid = magnetic;
    this.colorGrid = color;
    this.pathGrid = visible ? this.createGrid() : null;
    this.mouseManager.setMagneticGrid(center, plotWidth, visible && magnetic);
    this.drawCanvasGrid();
  }

   createGrid() {
    let grid = new Path2D();
    if (this.dottedGrid) {
      for (let x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createDottedGrid(grid, x);
      }
      for (let x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createDottedGrid(grid, x);
      }
    } else {
      for (let x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createLineGrid(grid, x, 0, x, this.height);
      }
      for (let x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createLineGrid(grid, x, 0, x, this.height);
      }
      for (let y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
        this.createLineGrid(grid, 0, y, this.width, y);
      }
      for (let y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
        this.createLineGrid(grid, 0, y, this.width, y);
      }
    }
    if (this.magneticGrid) {
      let magneticRadius = parseInt(this.plotWidthGrid * Z4Constants.MAGNETISM_PERCENTAGE);
      for (let x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createMagneticGrid(grid, x, magneticRadius);
      }
      for (let x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createMagneticGrid(grid, x, magneticRadius);
      }
    }
    return grid;
  }

   createDottedGrid(grid, x) {
    for (let y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
      grid.moveTo(x + 2 / this.zoom, y);
      grid.arc(x, y, 2 / this.zoom, 0, Z4Math.TWO_PI);
    }
    for (let y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
      grid.moveTo(x + 2 / this.zoom, y);
      grid.arc(x, y, 2 / this.zoom, 0, Z4Math.TWO_PI);
    }
  }

   createLineGrid(grid, x0, y0, x1, y1) {
    grid.moveTo(x0, y0);
    grid.lineTo(x1, y1);
  }

   createMagneticGrid(grid, x, magneticRadius) {
    for (let y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
      grid.moveTo(x + magneticRadius, y);
      grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
    }
    for (let y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
      grid.moveTo(x + magneticRadius, y);
      grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
    }
  }

  /**
   * Adds a geometric shape
   *
   * @param type The type
   */
   addGeometricShape(type) {
    this.geometricShapes.push(Z4GeometricShape.fromSize(type, this.width, this.height));
    this.setSelectedGeometricShapeAndAddGeometricShapePreview(this.geometricShapes[this.geometricShapes.length - 1], true);
    this.setSaved(false);
  }

  /**
   * Deletes a geometric shape
   *
   * @param shape The geometric shape
   * @return The geometric shape index
   */
   deleteGeometricShape(shape) {
    let index = this.geometricShapes.indexOf(shape);
    this.geometricShapes.splice(index, 1);
    if (this.selectedGeometricShape === shape) {
      this.setSelectedGeometricShape(null);
    }
    this.setSaved(false);
    return index;
  }

  /**
   * Sets the selected geometric shape
   *
   * @param shape The selected geometric shape
   */
   setSelectedGeometricShape(shape) {
    this.setSelectedGeometricShapeAndAddGeometricShapePreview(shape, false);
  }

  /**
   * Sets the selected geometric shape and adds the geometric shape preview
   *
   * @param shape The selected geometric shape
   * @param add true to add the layer preview, false otherwise
   */
   setSelectedGeometricShapeAndAddGeometricShapePreview(shape, add) {
    this.selectedGeometricShape = shape;
    this.ribbonTextPanel.setGeometricShape(shape);
    if (add) {
      this.shapesAndPathsPanel.addGeometricShapePreview(this.selectedGeometricShape);
    }
  }

  /**
   * Sets the text info
   *
   * @param textInfo The text info
   */
   setTextInfo(textInfo) {
    this.textInfo = textInfo;
    this.textManager.setTextInfo(textInfo);
    this.drawCanvasOverlay();
  }

  /**
   * Draws a text
   *
   * @param newLayer true to draw the text on a new layer, false otherwise
   */
   drawText(newLayer) {
    if (newLayer) {
      this.paper.addLayer(this.textInfo.textText + (this.textInfo.shadowText ? "/" + this.textInfo.shadowText : ""), this.width, this.height, null, this.width, this.height);
      this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);
    }
    this.selectedLayer.drawText(this.textManager);
    this.selectedLayer.getLayerPreview().drawLayer();
    this.drawCanvas();
    this.setChanged(true);
    this.setSaved(false);
    this.saveHistory("standard,tool");
  }

  /**
   * Rotates the canvas in clockwise
   */
   rotatePlus90() {
    this.resize(this.height, this.width);
  }

  /**
   * Resizes the canvas
   *
   * @param width The width
   * @param height The height
   */
   resize(width, height) {
    this.setSize(width, height);
    this.statusPanel.setProjectSize(this.width, this.height);
    this.statusPanel.resetCanvasGridPanel(this.width, this.height, true);
    this.setCanvasSize(this.width, this.height, this.zoom);
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasOverlay();
  }

   setCanvasSize(width, height, zoom) {
    this.canvasArray.forEach(c => {
      c.width = width * zoom;
      c.height = height * zoom;
    });
  }

  /**
   * Draws this canvas
   */
   drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx, false);
    this.ctx.restore();
  }

   drawCanvasGrid() {
    this.ctxGrid.clearRect(0, 0, this.canvasGrid.width, this.canvasGrid.height);
    if (this.pathGrid) {
      this.ctxGrid.save();
      this.ctxGrid.scale(this.zoom, this.zoom);
      this.ctxGrid.strokeStyle = Z4Constants.getStyle(this.colorGrid.getRGBA_HEX());
      this.ctxGrid.lineWidth = 1 / this.zoom;
      this.ctxGrid.stroke(this.pathGrid);
      this.ctxGrid.beginPath();
      this.ctxGrid.arc(this.centerGrid.x, this.centerGrid.y, 4 / this.zoom, 0, Z4Math.TWO_PI);
      this.ctxGrid.fillStyle = Z4Constants.getStyle(this.colorGrid.getRGBA_HEX());
      this.ctxGrid.fill();
      this.ctxGrid.restore();
    }
  }

  /**
   * Draws the canvas (and layer) bounds
   */
   drawCanvasBounds() {
    this.ctxBounds.clearRect(0, 0, this.canvasBounds.width, this.canvasBounds.height);
    let show = false;
    let bounds = new Path2D();
    for (let index = 0; index < this.getLayersCount(); index++) {
      let layer = this.paper.getLayerAt(index);
      if (this.showLayerBounds || layer.isShowBounds()) {
        show = true;
        bounds.rect(layer.getOffset().x, layer.getOffset().y, layer.getSize().width, layer.getSize().height);
      }
    }
    if (show) {
      this.ctxBounds.save();
      this.ctxBounds.scale(this.zoom, this.zoom);
      this.ctxBounds.lineWidth = 3 / this.zoom;
      let dash = new Array();
      this.ctxBounds.strokeStyle = Z4Constants.getStyle("black");
      this.ctxBounds.setLineDash(dash);
      this.ctxBounds.stroke(bounds);
      dash.push(2 * this.ctxBounds.lineWidth, 2 * this.ctxBounds.lineWidth);
      this.ctxBounds.strokeStyle = Z4Constants.getStyle("white");
      this.ctxBounds.setLineDash(dash);
      this.ctxBounds.stroke(bounds);
      this.ctxBounds.restore();
    }
  }

   drawCanvasOverlay() {
    this.ctxOverlay.clearRect(0, 0, this.canvasOverlay.width, this.canvasOverlay.height);
    if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.PICK_COLOR)) {
    } else if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.DRAW_TEXT) && this.textInfo && this.textInfo.shape) {
      this.ctxOverlay.save();
      this.ctxOverlay.scale(this.zoom, this.zoom);
      this.textManager.drawText(this.ctxOverlay, true);
      this.ctxOverlay.restore();
    }
  }
}
