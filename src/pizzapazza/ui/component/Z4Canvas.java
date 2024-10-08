package pizzapazza.ui.component;

import def.dom.File;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.KeyboardEvent;
import def.dom.MouseEvent;
import def.dom.URL;
import def.dom.WheelEvent;
import def.js.Array;
import def.js.Set;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.swing.JSComponent;
import javascript.util.fsa.FileSystemFileHandle;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4DrawingDirection;
import pizzapazza.math.Z4Math;
import pizzapazza.math.geometricshape.Z4GeometricShape;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.math.geometricshape.Z4ShapesAndPathsPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonDrawingToolPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonProjectPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonRulerAndClippingPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonTextPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Kaleidoscope;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Paper;
import pizzapazza.util.Z4TextInfo;
import pizzapazza.util.Z4Translations;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.js.$Apply_0_T;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;
import simulation.js.$Object;
import simulation.js.$Path2D;
import simulation.js.$Uint8Array;

/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4Canvas extends JSComponent {

  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private final $Canvas canvasGrid = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctxGrid = this.canvasGrid.getContext("2d");
  private $Path2D pathGrid;
  private Point centerGrid;
  private int plotWidthGrid;
  private boolean dottedGrid;
  private boolean magneticGrid;
  private Color colorGrid;

  private final $Canvas canvasBounds = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctxBounds = this.canvasBounds.getContext("2d");
  private boolean showLayerBounds;

  private final $Canvas canvasRulerAndClipping = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctxRulerAndClipping = this.canvasRulerAndClipping.getContext("2d");
  private boolean showTopRuler;
  private boolean showBottomRuler;
  private boolean showLeftRuler;
  private boolean showRightRuler;
  private int topRulerPosition;
  private int bottomRulerPosition;
  private int leftRulerPosition;
  private int rightRulerPosition;
  private $Path2D clippingRegion;

  /**
   * The ruler size
   */
  public final static int RULER_SIZE = 10;

  private final $Canvas canvasOverlay = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctxOverlay = this.canvasOverlay.getContext("2d");
  private final Set<Z4CanvasOverlayMode> canvasOverlayModes = new Set<>();

  private Z4RibbonProjectPanel ribbonProjectPanel;
  private Z4RibbonLayerPanel ribbonLayerPanel;
  private Z4RibbonDrawingToolPanel ribbonDrawingToolPanel;
  private Z4RibbonTextPanel ribbonTextPanel;
  private Z4RibbonRulerAndClippingPanel ribbonRulerAndClippingPanel;
  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4ShapesAndPathsPanel shapesAndPathsPanel;
  private Z4StatusPanel statusPanel;

  private String projectName;
  private FileSystemFileHandle handle;
  private int width;
  private int height;
  private double zoom = 1;
  private boolean zooming;
  private boolean saved = true;
  private boolean changed = false;
  private boolean isOpenFromHistory;

  private final Z4Paper paper = new Z4Paper();
  private Z4Layer selectedLayer;

  private final Array<Z4DrawingTool> drawingTools = new Array<>();
  private Z4DrawingTool selectedDrawingTool;
  private Z4DrawingDirection drawingDirection = Z4DrawingDirection.FREE;
  private Z4Kaleidoscope kaleidoscope = new Z4Kaleidoscope(1, 0, 0);

  private final Array<Z4GeometricShape> geometricShapes = new Array<>();
  private Z4GeometricShape selectedGeometricShape;
  private boolean drawGeometricShapeDirection;
  private Z4TextInfo textInfo;

  private final Array<$Canvas> canvasArray = new Array<>(this.canvas, this.canvasGrid, this.canvasBounds, this.canvasOverlay, this.canvasRulerAndClipping);

  private final Z4CanvasMouseManager mouseManager = new Z4CanvasMouseManager(this, this.ctx);
  private final Z4CanvasIOManager ioManager = new Z4CanvasIOManager(this, this.paper, this.drawingTools, this.geometricShapes);
  private final Z4CanvasTextManager textManager = new Z4CanvasTextManager(this);
  private final Z4CanvasHistoryManager historyManager = new Z4CanvasHistoryManager(this, this.paper);

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4Canvas() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);
    this.appendNodeChild(this.canvasGrid);
    this.appendNodeChild(this.canvasBounds);
    this.appendNodeChild(this.canvasRulerAndClipping);
    this.appendNodeChild(this.canvasOverlay);

    this.canvas.classList.add("main-canvas");
    this.canvas.addEventListener("mouseenter", event -> this.mouseManager.onMouse((MouseEvent) event, "enter"));
    this.canvas.addEventListener("mouseleave", event -> this.mouseManager.onMouse((MouseEvent) event, "leave"));
    this.canvas.addEventListener("mousedown", event -> this.mouseManager.onMouse((MouseEvent) event, "down"));
    this.canvas.addEventListener("mousemove", event -> this.mouseManager.onMouse((MouseEvent) event, "move"));
    this.canvas.addEventListener("mouseup", event -> this.mouseManager.onMouse((MouseEvent) event, "up"));

    this.canvasOverlay.classList.add("z4canvas-overlay");
    this.canvasOverlay.addEventListener("mouseenter", event -> this.mouseManager.onMouse((MouseEvent) event, "enter"));
    this.canvasOverlay.addEventListener("mouseleave", event -> this.mouseManager.onMouse((MouseEvent) event, "leave"));
    this.canvasOverlay.addEventListener("mousedown", event -> this.mouseManager.onMouse((MouseEvent) event, "down"));
    this.canvasOverlay.addEventListener("mousemove", event -> this.mouseManager.onMouse((MouseEvent) event, "move"));
    this.canvasOverlay.addEventListener("mouseup", event -> this.mouseManager.onMouse((MouseEvent) event, "up"));

    this.canvasOverlay.addEventListener("mouseenter", event -> this.textManager.onMouse((MouseEvent) event, "enter"));
    this.canvasOverlay.addEventListener("mouseleave", event -> this.textManager.onMouse((MouseEvent) event, "leave"));
    this.canvasOverlay.addEventListener("mousedown", event -> this.textManager.onMouse((MouseEvent) event, "down"));
    this.canvasOverlay.addEventListener("mousemove", event -> this.textManager.onMouse((MouseEvent) event, "move"));
    this.canvasOverlay.addEventListener("mouseup", event -> this.textManager.onMouse((MouseEvent) event, "up"));

    this.addEventListener("wheel", event -> {
      WheelEvent evt = (WheelEvent) event;
      if (!evt.ctrlKey) {
      } else if (evt.deltaY < 0) {
        this.zoomInOut(() -> Z4Constants.ZOOM_LEVEL.find(level -> level > this.zoom, null));
      } else if (evt.ctrlKey && evt.deltaY > 0) {
        this.zoomInOut(() -> Z4Constants.ZOOM_LEVEL.filter(level -> level < this.zoom).pop());
      }
    });
    this.addEventListener("keydown", event -> {
      KeyboardEvent evt = (KeyboardEvent) event;
      if (!evt.ctrlKey) {
      } else if (evt.key == "+") {
        evt.stopPropagation();
        this.zoomInOut(() -> Z4Constants.ZOOM_LEVEL.find(level -> level > this.zoom, null));
      } else if (evt.key == "-") {
        evt.stopPropagation();
        this.zoomInOut(() -> Z4Constants.ZOOM_LEVEL.filter(level -> level < this.zoom).pop());
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
   * @param ribbonRulerAndClippingPanel The ruler and clipping panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
  public void setRibbonPanels(Z4RibbonProjectPanel ribbonProjectPanel, Z4RibbonLayerPanel ribbonLayerPanel, Z4RibbonDrawingToolPanel ribbonDrawingToolPanel, Z4RibbonTextPanel ribbonTextPanel, Z4RibbonRulerAndClippingPanel ribbonRulerAndClippingPanel, Z4RibbonHistoryPanel ribbonHistoryPanel) {
    this.ribbonProjectPanel = ribbonProjectPanel;
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonTextPanel = ribbonTextPanel;
    this.ribbonRulerAndClippingPanel = ribbonRulerAndClippingPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;

    this.ribbonProjectPanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);
    this.ribbonDrawingToolPanel.setCanvas(this);
    this.ribbonTextPanel.setCanvas(this);
    this.ribbonRulerAndClippingPanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);

    this.mouseManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.ioManager.setRibbonPanels(ribbonProjectPanel, ribbonLayerPanel, ribbonDrawingToolPanel, ribbonTextPanel, ribbonRulerAndClippingPanel, ribbonHistoryPanel);
    this.textManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.historyManager.setRibbonLayerPanel(ribbonLayerPanel);
  }

  /**
   * Sets the shapes and paths panel
   *
   * @param shapesAndPathsPanel The shapes and paths panel
   */
  public void setShapesAndPathsPanel(Z4ShapesAndPathsPanel shapesAndPathsPanel) {
    this.shapesAndPathsPanel = shapesAndPathsPanel;
    this.shapesAndPathsPanel.setCanvas(this);

    this.ioManager.setShapesAndPathsPanel(shapesAndPathsPanel);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
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
  public void create(int width, int height, Object filling) {
    this.paper.reset();
    this.paper.addLayer(Z4Translations.BACKGROUND_LAYER, width, height, filling, width, height);

    this.setSize(width, height);

    this.ribbonLayerPanel.reset();
    this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);

    this.drawingTools.length = 0;
    this.ribbonDrawingToolPanel.reset();
    this.ribbonDrawingToolPanel.refreshCanvasSize(false);

    this.ribbonTextPanel.reset();
    this.geometricShapes.length = 0;
    this.shapesAndPathsPanel.reset();

    this.ribbonRulerAndClippingPanel.reset();
    this.ribbonRulerAndClippingPanel.refreshCanvasSize(false);

    Color.resetHistory();
    Z4GradientColor.resetHistory();
    Z4BiGradientColor.resetHistory();

    this.ribbonHistoryPanel.resetHistory(() -> {
      this.afterCreate("", width, height);
      this.fitZoomIfNeeded();
      this.toHistory(json -> this.ribbonHistoryPanel.addHistory(json, key -> this.ribbonHistoryPanel.setCurrentKey(key), false));
    });
  }

  /**
   * Creates a new project from an image file
   *
   * @param handle The file handle
   */
  public void createFromHandle(FileSystemFileHandle handle) {
    this.ioManager.createFromHandle(handle);
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
  public void createFromFile(File file) {
    this.ioManager.createFromFile(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   */
  public void createFromClipboard() {
    this.ioManager.createFromClipboard();
  }

  /**
   * The method called after create
   *
   * @param projectName The project name
   * @param width The width
   * @param height The height
   */
  public void afterCreate(String projectName, int width, int height) {
    this.projectName = projectName;

    this.statusPanel.setProjectName(projectName);
    this.statusPanel.setProjectSize(width, height);

    if (!this.isOpenFromHistory) {
      this.selectedDrawingTool = null;
      this.selectedGeometricShape = null;

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

    this.drawAllCanvas();
  }

  /**
   * Opens a project
   *
   * @param handle The file handle
   */
  public void openProjectFromHandle(FileSystemFileHandle handle) {
    this.selectedDrawingTool = null;
    this.selectedGeometricShape = null;

    this.handle = handle;
    this.ioManager.openProjectFromHandle(handle);
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
  public void openProjectFromFile(File file) {
    this.selectedDrawingTool = null;
    this.selectedGeometricShape = null;

    this.ioManager.openProjectFromFile(file);
  }

  /**
   * Opens an history
   *
   * @param json The history
   */
  public void openFromHistory($Object json) {
    this.isOpenFromHistory = true;
    this.historyManager.openFromHistory(json);
  }

  /**
   * Saves the project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   */
  @SuppressWarnings("static-access")
  public void saveProjectToHandle(FileSystemFileHandle handle, $Apply_0_Void apply) {
    this.handle = handle;
    this.projectName = this.ioManager.saveProjectToHandle(handle, apply);
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
  public void saveProjectToFile(String projectName, $Apply_0_Void apply) {
    this.projectName = projectName;
    this.ioManager.saveProjectToFile(projectName, apply);
  }

  /**
   * Saves the history
   *
   * @param policies A comma-separated list of history management policies
   * indicating which criteria should perform saving
   */
  public void saveHistory(String policies) {
    this.ribbonHistoryPanel.saveHistory(policies);
  }

  /**
   * Prepares the project for the history
   *
   * @param apply The function to call after preparation
   */
  public void toHistory($Apply_1_Void<$Object> apply) {
    this.historyManager.toHistory(apply);
  }

  /**
   * Exports this project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
  public void exportToFile(String filename, String ext, double quality) {
    this.ioManager.exportToFile(filename, ext, quality);
  }

  /**
   * Exports this project to an image file
   *
   * @param handle The file handle
   * @param quality The quality
   */
  public void exportToHandle(FileSystemFileHandle handle, double quality) {
    this.ioManager.exportToHandle(handle, quality);
  }

  /**
   * Returns a layer
   *
   * @param index The index layer
   * @return The layer
   */
  public Z4Layer getLayerAt(int index) {
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
  public void addLayer(int width, int height, Object filling) {
    this.paper.addLayer(this.findLayerName(), width, height, filling, this.width, this.height);
    this.afterAddLayer();
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param handle The file handle
   */
  public void addLayerFromHandle(FileSystemFileHandle handle) {
    this.ioManager.addLayerFromHandle(handle);
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
  public void addLayerFromFile(File file) {
    this.ioManager.addLayerFromFile(file);
  }

  /**
   * Adds a layer from an image in the clipboard
   */
  public void addLayerFromClipboard() {
    this.ioManager.addLayerFromClipboard();
  }

  /**
   * The method called after adding a layer
   */
  public void afterAddLayer() {
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
  public void duplicateLayer(Z4Layer layer) {
    Point offset = layer.getOffset();
    layer.convertToBlob(blob -> {
      $Image image = ($Image) document.createElement("img");

      image.onload = event -> {
        this.paper.addLayerFromImage(this.findLayerName(), image, this.width, this.height);

        this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), duplicate -> {
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
  public int deleteLayer(Z4Layer layer, boolean fromMerge) {
    int index = this.paper.deleteLayer(layer);

    if (!fromMerge) {
      if (this.selectedLayer == layer) {
        int count = this.getLayersCount();
        this.setSelectedLayer(this.paper.getLayerAt(count - 1));

        document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ") .z4layerpreview-selector").textContent = Z4LayerPreview.SELECTED_LAYER_CONTENT;
        setTimeout(() -> ((HTMLElement) document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ")")).scrollIntoView(), 0);
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
  public boolean moveLayer(Z4Layer layer, int position) {
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
  public void mergeLayers(Array<Z4Layer> layers) {
    this.ioManager.mergeLayers(layers);
  }

  /**
   * Finds a layer name
   *
   * @return The layer name
   */
  @SuppressWarnings("StringEquality")
  public String findLayerName() {
    int counter = 0;
    String found = "";
    while (!$exists(found)) {
      found = Z4Translations.LAYER + "_" + counter;
      for (int index = 0; index < this.getLayersCount(); index++) {
        if (found == this.paper.getLayerAt(index).getName()) {
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
  public void setSelectedLayer(Z4Layer selectedLayer) {
    this.setSelectedLayerAndAddLayerPreview(selectedLayer, null, false);
  }

  /**
   * Sets the selected layer and adds the layer preview
   *
   * @param selectedLayer The selected layer
   * @param apply The function to apply before adding the layer preview
   * @param add true to add the layer preview, false otherwise
   */
  public void setSelectedLayerAndAddLayerPreview(Z4Layer selectedLayer, $Apply_1_Void<Z4Layer> apply, boolean add) {
    this.selectedLayer = selectedLayer;
    this.mouseManager.setSelectedLayer(this.selectedLayer);
    this.textManager.setSelectedLayer(this.selectedLayer);

    if ($exists(apply)) {
      apply.$apply(this.selectedLayer);
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
  public int getLayersCount() {
    return this.paper.getLayersCount();
  }

  /**
   * Sets the visualization of the layer bounds
   *
   * @param showLayerBounds true to show the layer bounds, false otherwise
   */
  public void setShowLayerBounds(boolean showLayerBounds) {
    this.showLayerBounds = showLayerBounds;
    this.drawCanvasBounds();
  }

  /**
   * Sets the rulers
   *
   * @param showTopRuler true to show the top ruler, false otherwise
   * @param showBottomRuler true to show the bottom ruler, false otherwise
   * @param showLeftRuler true to show the left ruler, false otherwise
   * @param showRightRuler true to show the right ruler, false otherwise
   * @param topRulerPosition The top ruler position
   * @param bottomRulerPosition The bottom ruler position
   * @param leftRulerPosition The left ruler position
   * @param rightRulerPosition The right ruler position
   */
  public void setRulers(
          boolean showTopRuler, boolean showBottomRuler, boolean showLeftRuler, boolean showRightRuler,
          int topRulerPosition, int bottomRulerPosition, int leftRulerPosition, int rightRulerPosition) {
    this.showTopRuler = showTopRuler;
    this.showBottomRuler = showBottomRuler;
    this.showLeftRuler = showLeftRuler;
    this.showRightRuler = showRightRuler;
    this.topRulerPosition = topRulerPosition;
    this.bottomRulerPosition = bottomRulerPosition;
    this.leftRulerPosition = leftRulerPosition;
    this.rightRulerPosition = rightRulerPosition;

    int x = this.showLeftRuler ? this.leftRulerPosition + Z4Canvas.RULER_SIZE : 0;
    int y = this.showTopRuler ? this.topRulerPosition + Z4Canvas.RULER_SIZE : 0;
    int w = this.width - (this.showRightRuler ? this.rightRulerPosition + Z4Canvas.RULER_SIZE : 0) - (this.showLeftRuler ? this.leftRulerPosition + Z4Canvas.RULER_SIZE : 0);
    int h = this.height - (this.showBottomRuler ? this.bottomRulerPosition + Z4Canvas.RULER_SIZE : 0) - (this.showTopRuler ? this.topRulerPosition + Z4Canvas.RULER_SIZE : 0);

    this.clippingRegion = new $Path2D();
    this.clippingRegion.rect(x, y, w, h);
    this.mouseManager.setClippingRegion(this.clippingRegion);
    
    this.drawCanvasRulerAndClipping();
  }

  /**
   * Adds a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
  public void addCanvasOverlayMode(Z4CanvasOverlayMode canvasOverlayMode) {
    this.addRemoveCanvasOverlayMode(canvasOverlayMode, true);
  }

  /**
   * Removes a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
  public void removeCanvasOverlayMode(Z4CanvasOverlayMode canvasOverlayMode) {
    this.addRemoveCanvasOverlayMode(canvasOverlayMode, false);
  }

  private void addRemoveCanvasOverlayMode(Z4CanvasOverlayMode canvasOverlayMode, boolean add) {
    if (add) {
      this.canvasOverlayModes.add(canvasOverlayMode);
      this.mouseManager.addCanvasOverlayMode(canvasOverlayMode);
      this.textManager.addCanvasOverlayMode(canvasOverlayMode);
    } else {
      this.canvasOverlayModes.delete(canvasOverlayMode);
      this.mouseManager.removeCanvasOverlayMode(canvasOverlayMode);
      this.textManager.removeCanvasOverlayMode(canvasOverlayMode);
    }

    this.canvasOverlay.style.pointerEvents = $exists(this.canvasOverlayModes.size) || ($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths() && $exists(this.selectedGeometricShape)) ? "auto" : "none";
    this.drawCanvasOverlay();
  }

  /**
   * Adds a drawing tool
   *
   * @param drawingTool The drawing tool
   */
  public void addDrawingTool(Z4DrawingTool drawingTool) {
    this.drawingTools.push(drawingTool);
    this.setSelectedDrawingToolAndAddDrawingToolPreview(drawingTool, true);
    this.setSaved(false);
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param handle The file handle
   */
  public void addDrawingToolFromHandle(FileSystemFileHandle handle) {
    this.ioManager.addDrawingToolFromHandle(handle);
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param file The file
   */
  public void addDrawingToolFromFile(File file) {
    this.ioManager.addDrawingToolFromFile(file);
  }

  /**
   * Replaces a drawing tool
   *
   * @param oldDrawingTool The old drawing tool
   * @param newDrawingTool The new drawing tool
   */
  public void replaceDrawingTool(Z4DrawingTool oldDrawingTool, Z4DrawingTool newDrawingTool) {
    int index = this.drawingTools.indexOf(oldDrawingTool);
    this.drawingTools.$set(index, newDrawingTool);

    if (this.selectedDrawingTool == oldDrawingTool) {
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
  public int deleteDrawingTool(Z4DrawingTool drawingTool) {
    int index = this.drawingTools.indexOf(drawingTool);
    this.drawingTools.splice(index, 1);

    if (this.selectedDrawingTool != drawingTool) {
    } else if ($exists(this.drawingTools.length)) {
      this.setSelectedDrawingTool(this.drawingTools.$get(this.drawingTools.length - 1));

      document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ") .z4drawingtoolpreview-selector").textContent = Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT;
      setTimeout(() -> ((HTMLElement) document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ")")).scrollIntoView(), 0);
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
  @SuppressWarnings("StringEquality")
  public String findDrawingToolName() {
    int counter = 0;
    String found = "";
    while (!$exists(found)) {
      found = Z4Translations.DRAWING_TOOL + " " + counter;
      for (int index = 0; index < this.drawingTools.length; index++) {
        if (found == this.drawingTools.$get(index).getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

  /**
   * Returns the selected drawing tool
   *
   * @return The selected drawing tool
   */
  public Z4DrawingTool getSelectedDrawingTool() {
    return this.selectedDrawingTool;
  }

  /**
   * Sets the selected drawing tool
   *
   * @param selectedDrawingTool The selected drawing tool
   */
  public void setSelectedDrawingTool(Z4DrawingTool selectedDrawingTool) {
    this.setSelectedDrawingToolAndAddDrawingToolPreview(selectedDrawingTool, false);
  }

  /**
   * Sets the selected drawing tool and adds the drawing tool preview
   *
   * @param selectedDrawingTool The selected drawing tool
   * @param add true to add the drawing tool preview, false otherwise
   */
  public void setSelectedDrawingToolAndAddDrawingToolPreview(Z4DrawingTool selectedDrawingTool, boolean add) {
    this.selectedDrawingTool = selectedDrawingTool;
    this.mouseManager.setSelectedDrawingTool(selectedDrawingTool);

    this.canvasOverlay.style.pointerEvents = $exists(this.canvasOverlayModes.size) || ($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths() && $exists(this.selectedGeometricShape)) ? "auto" : "none";

    if (this.selectedDrawingTool.useShapesAndPaths()) {
      this.shapesAndPathsPanel.getStyle().removeProperty("display");
    } else {
      this.shapesAndPathsPanel.getStyle().display = "none";
    }

    this.saveHistory("tool");

    this.ribbonDrawingToolPanel.setApplyEnabled($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths() && $exists(this.selectedGeometricShape));
    if (add) {
      this.ribbonDrawingToolPanel.addDrawingToolPreview(this.selectedDrawingTool);
    }

    this.drawCanvas();
    this.drawCanvasOverlay();
  }

  /**
   * Saves a drawing tool
   *
   * @param fileName The file name
   * @param drawingTool the drawing tool
   */
  public void saveDrawingToolToFile(String fileName, Z4DrawingTool drawingTool) {
    this.ioManager.saveDrawingToolToFile(fileName, drawingTool);
  }

  /**
   * Saves a drawing tool
   *
   * @param handle The file handle
   * @param drawingTool The drawing tool
   */
  @SuppressWarnings("static-access")
  public void saveDrawingToolToHandle(FileSystemFileHandle handle, Z4DrawingTool drawingTool) {
    this.ioManager.saveDrawingToolToHandle(handle, drawingTool);
  }

  /**
   * Saves the drawing tools
   *
   * @param fileName The file name
   */
  public void saveDrawingToolsToFile(String fileName) {
    this.ioManager.saveDrawingToolsToFile(fileName);
  }

  /**
   * Saves the drawing tools
   *
   * @param handle The file handle
   */
  public void saveDrawingToolsToHandle(FileSystemFileHandle handle) {
    this.ioManager.saveDrawingToolsToHandle(handle);
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
  public String getProjectName() {
    return this.projectName;
  }

  /**
   * Returns the file handle of this project
   *
   * @return The file handle of this project
   */
  public FileSystemFileHandle getHandle() {
    return this.handle;
  }

  /**
   * Sets the size
   *
   * @param width The width
   * @param height The height
   */
  public void setSize(int width, int height) {
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
  public Dimension getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
  public boolean isSaved() {
    return this.saved;
  }

  /**
   * Sets the saved status of the canvas
   *
   * @param saved true to set the canvas as saved, false otherwise
   */
  public void setSaved(boolean saved) {
    this.saved = saved;
    this.ribbonProjectPanel.setSaveEnabled(!this.saved);
  }

  /**
   * Checks if this canvas is changed
   *
   * @return true if this canvas is changed, false otherwise
   */
  public boolean isChanged() {
    return this.changed;
  }

  /**
   * Sets the changed status of the canvas
   *
   * @param changed true to set the canvas as changed, false otherwise
   */
  public void setChanged(boolean changed) {
    this.changed = changed;
  }

  /**
   * Returns a pixel color
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
  public Color getColorAt(int x, int y) {
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      $Uint8Array data = ($Uint8Array) this.ctx.getImageData(x * this.zoom, y * this.zoom, 1, 1).data;
      return new Color(parseInt(data.$get(0)), parseInt(data.$get(1)), parseInt(data.$get(2)), parseInt(data.$get(3)));
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
  public Color getSelectedLayerColorAt(int x, int y) {
    return this.selectedLayer.getColorAt(x, y);
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
  public void setZoom(double zoom) {
    this.zoom = zoom;
    this.mouseManager.setZoom(this.zoom);
    this.textManager.setZoom(this.zoom);
    this.setCanvasSize(this.width, this.height, zoom);

    this.pathGrid = $exists(this.pathGrid) ? this.createGrid() : null;

    this.drawAllCanvas();
  }

  /**
   * Sets the zoom to fit the available space
   */
  public void fitZoom() {
    this.setZoom(Math.min((this.canvas.parentElement.clientWidth - 20) / this.width, (this.canvas.parentElement.clientHeight - 20) / this.height));
  }

  /**
   * Sets the zoom to fit the available space if needed, that is if the image is
   * bigger than the available space
   */
  public void fitZoomIfNeeded() {
    if ((this.canvas.parentElement.clientWidth - 20) < this.width || (this.canvas.parentElement.clientHeight - 20) < this.height) {
      this.fitZoom();
      this.statusPanel.setZoom(this.zoom);
    }
  }

  private void zoomInOut($Apply_0_T<Double> apply) {
    if (this.zooming) {
    } else {
      this.zooming = true;
      double newZoom = apply.$apply();
      if ($exists(newZoom)) {
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
  public Z4DrawingDirection getDrawingDirection() {
    return this.drawingDirection;
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
  public void setDrawingDirection(Z4DrawingDirection drawingDirection) {
    this.drawingDirection = drawingDirection;
    this.mouseManager.setDrawingDirection(drawingDirection);
  }

  /**
   * Sets the kaleidoscope
   *
   * @param kaleidoscope The kaleidoscope
   */
  public void setKaleidoscope(Z4Kaleidoscope kaleidoscope) {
    this.kaleidoscope = kaleidoscope;
    this.mouseManager.setKaleidoscope(kaleidoscope);
    this.drawCanvasOverlay();
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
  public void setGrid(boolean visible, Point center, int plotWidth, boolean dottedGrid, boolean magnetic, Color color) {
    this.centerGrid = center;
    this.plotWidthGrid = plotWidth;
    this.dottedGrid = dottedGrid;
    this.magneticGrid = magnetic;
    this.colorGrid = color;

    this.pathGrid = visible ? this.createGrid() : null;
    this.mouseManager.setMagneticGrid(center, plotWidth, visible && magnetic);

    this.drawCanvasGrid();
  }

  private $Path2D createGrid() {
    $Path2D grid = new $Path2D();

    if (this.dottedGrid) {
      for (int x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createDottedGrid(grid, x);
      }
      for (int x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createDottedGrid(grid, x);
      }
    } else {
      for (int x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createLineGrid(grid, x, 0, x, this.height);
      }
      for (int x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createLineGrid(grid, x, 0, x, this.height);
      }
      for (int y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
        this.createLineGrid(grid, 0, y, this.width, y);
      }
      for (int y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
        this.createLineGrid(grid, 0, y, this.width, y);
      }
    }

    if (this.magneticGrid) {
      int magneticRadius = parseInt(this.plotWidthGrid * Z4Constants.MAGNETISM_PERCENTAGE);

      for (int x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createMagneticGrid(grid, x, magneticRadius);
      }
      for (int x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createMagneticGrid(grid, x, magneticRadius);
      }
    }

    return grid;
  }

  private void createDottedGrid($Path2D grid, int x) {
    for (int y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
      grid.moveTo(x + 2 / this.zoom, y);
      grid.arc(x, y, 2 / this.zoom, 0, Z4Math.TWO_PI);
    }
    for (int y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
      grid.moveTo(x + 2 / this.zoom, y);
      grid.arc(x, y, 2 / this.zoom, 0, Z4Math.TWO_PI);
    }
  }

  private void createLineGrid($Path2D grid, int x0, int y0, int x1, int y1) {
    grid.moveTo(x0, y0);
    grid.lineTo(x1, y1);
  }

  private void createMagneticGrid($Path2D grid, int x, int magneticRadius) {
    for (int y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
      grid.moveTo(x + magneticRadius, y);
      grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
    }
    for (int y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
      grid.moveTo(x + magneticRadius, y);
      grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
    }
  }

  /**
   * Applies the selected geometric shape to the selected drawing tool
   */
  public void applyGeometricShape() {
    this.mouseManager.applyGeometricShape();
  }

  /**
   * Adds a geometric shape
   *
   * @param shape The geometric shape
   */
  public void addGeometricShape(Z4GeometricShape shape) {
    this.geometricShapes.push(shape);
    this.setSelectedGeometricShapeAndAddGeometricShapePreview(shape, 0, true);
    this.setSaved(false);
  }

  /**
   * Replaces a geometric shape
   *
   * @param oldShape The old geometric shape
   * @param newShape The new geometric shape
   * @param selectedControlPoint The selected control point
   */
  public void replaceGeometricShape(Z4GeometricShape oldShape, Z4GeometricShape newShape, int selectedControlPoint) {
    int index = this.geometricShapes.indexOf(oldShape);
    this.geometricShapes.$set(index, newShape);

    if (this.selectedGeometricShape == oldShape) {
      this.setSelectedGeometricShape(newShape, selectedControlPoint);
    }

    this.setSaved(false);
  }

  /**
   * Deletes a geometric shape
   *
   * @param shape The geometric shape
   * @return The geometric shape index
   */
  public int deleteGeometricShape(Z4GeometricShape shape) {
    int index = this.geometricShapes.indexOf(shape);
    this.geometricShapes.splice(index, 1);
    if (this.selectedGeometricShape == shape) {
      this.setSelectedGeometricShape(null, 0);
    }
    this.setSaved(false);
    return index;
  }

  /**
   * Sets the selected geometric shape
   *
   * @param shape The selected geometric shape
   * @param selectedControlPoint The selected control point
   */
  public void setSelectedGeometricShape(Z4GeometricShape shape, int selectedControlPoint) {
    this.setSelectedGeometricShapeAndAddGeometricShapePreview(shape, selectedControlPoint, false);
  }

  /**
   * Sets the selected geometric shape and adds the geometric shape preview
   *
   * @param shape The selected geometric shape
   * @param selectedControlPoint The selected control point
   * @param add true to add the layer preview, false otherwise
   */
  public void setSelectedGeometricShapeAndAddGeometricShapePreview(Z4GeometricShape shape, int selectedControlPoint, boolean add) {
    this.selectedGeometricShape = shape;
    this.mouseManager.setSelectedGeometricShape(shape);

    this.canvasOverlay.style.pointerEvents = $exists(this.canvasOverlayModes.size) || ($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths() && $exists(this.selectedGeometricShape)) ? "auto" : "none";

    this.ribbonDrawingToolPanel.setApplyEnabled($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths() && $exists(this.selectedGeometricShape));
    this.ribbonTextPanel.setGeometricShape(shape, selectedControlPoint);

    if (add) {
      this.shapesAndPathsPanel.addGeometricShapePreview(this.selectedGeometricShape);
    }

    this.drawCanvas();
    this.drawCanvasOverlay();
  }

  /**
   * Returns a geometric shape
   *
   * @param index The geometric shape index
   * @return The geometric shape
   */
  public Z4GeometricShape getGeometricShapeAt(int index) {
    return this.geometricShapes.$get(index);
  }

  /**
   * Returns the geometric shapes count
   *
   * @return The geometric shapes count
   */
  public int getGeometricShapesCount() {
    return this.geometricShapes.length;
  }

  /**
   * Sets if to show an arrow representing the direction of a geometric shape
   *
   * @param drawGeometricShapeDirection true to show an arrow representing the
   * direction of a geometric shape, false otherwise
   */
  public void setDrawGeometricShapeDirection(boolean drawGeometricShapeDirection) {
    this.drawGeometricShapeDirection = drawGeometricShapeDirection;
    this.drawCanvasOverlay();
  }

  /**
   * Sets the text info
   *
   * @param textInfo The text info
   * @param selectedControlPoint The selected control point
   */
  public void setTextInfo(Z4TextInfo textInfo, int selectedControlPoint) {
    this.textInfo = textInfo;
    this.textManager.setTextInfo(textInfo, selectedControlPoint);
    this.drawCanvasOverlay();
  }

  /**
   * Draws a text
   *
   * @param newLayer true to draw the text on a new layer, false otherwise
   */
  public void drawText(boolean newLayer) {
    if (newLayer) {
      this.paper.addLayer(this.textInfo.textText + ($exists(this.textInfo.shadowText) ? "/" + this.textInfo.shadowText : ""), this.width, this.height, null, this.width, this.height);
      this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);
    }

    this.selectedLayer.drawText(this.textManager, this.clippingRegion);
    this.selectedLayer.getLayerPreview().drawLayer();
    this.drawCanvas();

    this.setChanged(true);
    this.setSaved(false);
    this.saveHistory("standard,tool");
  }

  /**
   * Rotates the canvas in clockwise
   */
  @SuppressWarnings("SuspiciousNameCombination")
  public void rotatePlus90() {
    this.resize(this.height, this.width);
  }

  /**
   * Resizes the canvas
   *
   * @param width The width
   * @param height The height
   */
  public void resize(int width, int height) {
    this.setSize(width, height);
    this.ribbonDrawingToolPanel.refreshCanvasSize(true);
    this.ribbonRulerAndClippingPanel.refreshCanvasSize(true);

    this.statusPanel.setProjectSize(this.width, this.height);
    this.statusPanel.resetCanvasGridPanel(this.width, this.height, true);
    this.setCanvasSize(this.width, this.height, this.zoom);

    this.drawAllCanvas();
  }

  private void setCanvasSize(int width, int height, double zoom) {
    this.canvasArray.forEach(c -> {
      c.width = width * zoom;
      c.height = height * zoom;
    });
  }

  private void drawAllCanvas() {
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasRulerAndClipping();
    this.drawCanvasOverlay();
  }

  /**
   * Draws this canvas
   */
  public void drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx, false);
    this.ctx.restore();
  }

  private void drawCanvasGrid() {
    this.ctxGrid.clearRect(0, 0, this.canvasGrid.width, this.canvasGrid.height);

    if ($exists(this.pathGrid)) {
      this.ctxGrid.save();
      this.ctxGrid.scale(this.zoom, this.zoom);

      this.ctxGrid.strokeStyle = Z4Constants.$getStyle(this.colorGrid.getRGBA_HEX());
      this.ctxGrid.lineWidth = 1 / this.zoom;
      this.ctxGrid.stroke(this.pathGrid);

      this.ctxGrid.beginPath();
      this.ctxGrid.arc(this.centerGrid.x, this.centerGrid.y, 4 / this.zoom, 0, Z4Math.TWO_PI);
      this.ctxGrid.fillStyle = Z4Constants.$getStyle(this.colorGrid.getRGBA_HEX());
      this.ctxGrid.fill();

      this.ctxGrid.restore();
    }
  }

  /**
   * Draws the canvas (and layer) bounds
   */
  public void drawCanvasBounds() {
    this.ctxBounds.clearRect(0, 0, this.canvasBounds.width, this.canvasBounds.height);

    boolean show = false;
    $Path2D bounds = new $Path2D();

    for (int index = 0; index < this.getLayersCount(); index++) {
      Z4Layer layer = this.paper.getLayerAt(index);
      if (this.showLayerBounds || layer.isShowBounds()) {
        show = true;
        bounds.rect(layer.getOffset().x, layer.getOffset().y, layer.getSize().width, layer.getSize().height);
      }
    }

    if (show) {
      this.ctxBounds.save();
      this.ctxBounds.scale(this.zoom, this.zoom);
      this.ctxBounds.lineWidth = 3 / this.zoom;

      Array<Double> dash = new Array<>();
      this.ctxBounds.strokeStyle = Z4Constants.$getStyle("black");
      this.ctxBounds.setLineDash(dash);
      this.ctxBounds.stroke(bounds);

      dash.push(2 * this.ctxBounds.lineWidth, 2 * this.ctxBounds.lineWidth);
      this.ctxBounds.strokeStyle = Z4Constants.$getStyle("white");
      this.ctxBounds.setLineDash(dash);
      this.ctxBounds.stroke(bounds);

      this.ctxBounds.restore();
    }
  }

  private void drawCanvasRulerAndClipping() {
    this.ctxRulerAndClipping.clearRect(0, 0, this.canvasRulerAndClipping.width, this.canvasRulerAndClipping.height);

    this.ctxRulerAndClipping.save();
    this.ctxRulerAndClipping.scale(this.zoom, this.zoom);
    this.ctxRulerAndClipping.fillStyle = Z4Constants.$getStyle("blue");
    this.ctxRulerAndClipping.strokeStyle = Z4Constants.$getStyle("black");

    if (this.showTopRuler) {
      this.ctxRulerAndClipping.fillRect(0, this.topRulerPosition, this.width, Z4Canvas.RULER_SIZE);
      this.ctxRulerAndClipping.strokeRect(0, this.topRulerPosition, this.width, Z4Canvas.RULER_SIZE);
    }

    if (this.showBottomRuler) {
      this.ctxRulerAndClipping.fillRect(0, this.height - Z4Canvas.RULER_SIZE - this.bottomRulerPosition, this.width, Z4Canvas.RULER_SIZE);
      this.ctxRulerAndClipping.strokeRect(0, this.height - Z4Canvas.RULER_SIZE - this.bottomRulerPosition, this.width, Z4Canvas.RULER_SIZE);
    }

    if (this.showLeftRuler) {
      this.ctxRulerAndClipping.fillRect(this.leftRulerPosition, 0, Z4Canvas.RULER_SIZE, this.height);
      this.ctxRulerAndClipping.strokeRect(this.leftRulerPosition, 0, Z4Canvas.RULER_SIZE, this.height);
    }

    if (this.showRightRuler) {
      this.ctxRulerAndClipping.fillRect(this.width - this.rightRulerPosition - Z4Canvas.RULER_SIZE, 0, Z4Canvas.RULER_SIZE, this.height);
      this.ctxRulerAndClipping.strokeRect(this.width - this.rightRulerPosition - Z4Canvas.RULER_SIZE, 0, Z4Canvas.RULER_SIZE, this.height);
    }

    this.ctxRulerAndClipping.restore();
  }

  private void drawCanvasOverlay() {
    this.ctxOverlay.clearRect(0, 0, this.canvasOverlay.width, this.canvasOverlay.height);

    if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.PICK_COLOR)) {
      this.drawCanvas();
    } else if (this.canvasOverlayModes.has(Z4CanvasOverlayMode.DRAW_TEXT)) {
      if ($exists(this.textInfo) && $exists(this.textInfo.shape)) {
        this.ctxOverlay.save();
        this.ctxOverlay.scale(this.zoom, this.zoom);
        this.textManager.drawText(this.ctxOverlay, true, this.drawGeometricShapeDirection);
        this.ctxOverlay.restore();
      }
    } else {
      if (this.kaleidoscope.multiplicity > 1) {
        this.ctxOverlay.save();
        this.ctxOverlay.scale(this.zoom, this.zoom);
        this.mouseManager.drawKaleidoscope(this.ctxOverlay);
        this.ctxOverlay.restore();
      }

      if ($exists(this.selectedDrawingTool) && this.selectedDrawingTool.useShapesAndPaths() && $exists(this.selectedGeometricShape)) {
        this.ctxOverlay.save();
        this.ctxOverlay.scale(this.zoom, this.zoom);
        this.mouseManager.drawGeometricShape(this.ctxOverlay, this.drawGeometricShapeDirection);
        this.ctxOverlay.restore();
      }
    }
  }
}
