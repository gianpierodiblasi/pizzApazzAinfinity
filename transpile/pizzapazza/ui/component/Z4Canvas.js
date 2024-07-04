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

   ribbonFilePanel = null;

   ribbonLayerPanel = null;

   ribbonDrawingToolPanel = null;

   ribbonHistoryPanel = null;

   statusPanel = null;

   projectName = null;

   handle = null;

   width = 0;

   height = 0;

   zoom = 1;

   zooming = false;

   saved = true;

   changed = false;

   paper = new Z4Paper();

   selectedLayer = null;

   drawingTools = new Array();

   selectedDrawingTool = null;

   drawingDirection = Z4DrawingDirection.FREE;

   mouseManager = new Z4CanvasMouseManager(this, this.ctx);

   ioManager = new Z4CanvasIOManager(this, this.paper, this.drawingTools);

   historyManager = new Z4CanvasHistoryManager(this, this.paper);

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);
    this.appendNodeChild(this.canvasGrid);
    this.canvas.classList.add("main-canvas");
    this.canvas.addEventListener("mouseenter", event => this.mouseManager.onMouse(event, "enter"));
    this.canvas.addEventListener("mouseleave", event => this.mouseManager.onMouse(event, "leave"));
    this.canvas.addEventListener("mousedown", event => this.mouseManager.onMouse(event, "down"));
    this.canvas.addEventListener("mousemove", event => this.mouseManager.onMouse(event, "move"));
    this.canvas.addEventListener("mouseup", event => this.mouseManager.onMouse(event, "up"));
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
   * @param ribbonFilePanel The ribbon file panel
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonPanels(ribbonFilePanel, ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel) {
    this.ribbonFilePanel = ribbonFilePanel;
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
    this.ribbonFilePanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);
    this.ribbonDrawingToolPanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);
    this.mouseManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.ioManager.setRibbonPanels(ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel);
    this.historyManager.setRibbonLayerPanel(ribbonLayerPanel);
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
    this.ribbonHistoryPanel.resetHistory(() => {
      this.afterCreate("", width, height);
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
    this.statusPanel.setZoom(1);
    this.statusPanel.setDrawingDirection(Z4DrawingDirection.FREE);
    this.statusPanel.resetCanvasGridPanel(width, height);
    this.zoom = 1;
    this.mouseManager.setZoom(this.zoom);
    this.setDrawingDirection(Z4DrawingDirection.FREE);
    this.pathGrid = null;
    this.setSaved(true);
    this.changed = false;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasGrid.width = width;
    this.canvasGrid.height = height;
    this.drawCanvas();
    this.drawCanvasGrid();
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
    this.ribbonHistoryPanel.saveHistory("standard,tool");
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
        this.ribbonHistoryPanel.saveHistory("standard,tool");
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
   * @return The layer index
   */
   deleteLayer(layer) {
    let index = this.paper.deleteLayer(layer);
    if (this.selectedLayer === layer) {
      let count = this.getLayersCount();
      this.setSelectedLayer(this.paper.getLayerAt(count - 1));
      document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ") .z4layerpreview-selector").textContent = Z4LayerPreview.SELECTED_LAYER_CONTENT;
      (document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ")")).scrollIntoView();
    }
    this.changed = true;
    this.ribbonHistoryPanel.saveHistory("standard,tool");
    this.setSaved(false);
    this.drawCanvas();
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
      this.ribbonHistoryPanel.saveHistory("standard,tool");
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
      (document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ")")).scrollIntoView();
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
    this.ribbonHistoryPanel.saveHistory("tool");
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
    this.ribbonFilePanel.setSaveEnabled(!this.saved);
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
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom = zoom;
    this.mouseManager.setZoom(this.zoom);
    this.canvas.width = this.width * zoom;
    this.canvas.height = this.height * zoom;
    this.canvasGrid.width = this.width * zoom;
    this.canvasGrid.height = this.height * zoom;
    this.pathGrid = this.pathGrid ? this.createGrid() : null;
    this.drawCanvas();
    this.drawCanvasGrid();
  }

  /**
   * Sets the zoom to fit the available space
   */
   fitZoom() {
    this.setZoom(Math.min((this.canvas.parentElement.clientWidth - 20) / this.width, (this.canvas.parentElement.clientHeight - 20) / this.height));
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
   * Draws this canvas
   */
   drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx, false, false);
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
}
