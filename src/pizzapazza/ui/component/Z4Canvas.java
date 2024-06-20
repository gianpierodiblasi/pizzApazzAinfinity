package pizzapazza.ui.component;

import def.dom.File;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.KeyboardEvent;
import def.dom.MouseEvent;
import def.dom.URL;
import def.dom.WheelEvent;
import def.js.Array;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.swing.JSComponent;
import javascript.util.fsa.FileSystemFileHandle;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonFilePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Paper;
import pizzapazza.util.Z4Translations;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.jszip.$JSZip;

/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4Canvas extends JSComponent {

  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private Z4RibbonFilePanel ribbonFilePanel;
  private Z4RibbonLayerPanel ribbonLayerPanel;
  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;

  private String projectName;
  private FileSystemFileHandle handle;
  private int width;
  private int height;
  private double zoom = 1;
  private boolean zooming;
  private boolean saved = true;
  private boolean changed = false;

  private final Z4Paper paper = new Z4Paper();
  private final Z4CanvasMouseManager mouseManager = new Z4CanvasMouseManager(this, this.ctx);
  private final Z4CanvasIOManager ioManager = new Z4CanvasIOManager(this, this.paper);

  private Z4Layer selectedLayer;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4Canvas() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);

    this.canvas.addEventListener("mouseenter", event -> this.mouseManager.onMouse((MouseEvent) event, "enter"));
    this.canvas.addEventListener("mouseleave", event -> this.mouseManager.onMouse((MouseEvent) event, "leave"));
    this.canvas.addEventListener("mousedown", event -> this.mouseManager.onMouse((MouseEvent) event, "down"));
    this.canvas.addEventListener("mousemove", event -> this.mouseManager.onMouse((MouseEvent) event, "move"));
    this.canvas.addEventListener("mouseup", event -> this.mouseManager.onMouse((MouseEvent) event, "up"));

    this.addEventListener("wheel", event -> {
      WheelEvent evt = (WheelEvent) event;
      if (!evt.ctrlKey) {
      } else if (evt.deltaY < 0) {
        this.zoomIn();
      } else if (evt.ctrlKey && evt.deltaY > 0) {
        this.zoomOut();
      }
    });
    this.addEventListener("keydown", event -> {
      KeyboardEvent evt = (KeyboardEvent) event;
      if (!evt.ctrlKey) {
      } else if (evt.key == "+") {
        evt.stopPropagation();
        this.zoomIn();
      } else if (evt.key == "-") {
        evt.stopPropagation();
        this.zoomOut();
      }
    });
  }

  /**
   * Sets the ribbon panels
   *
   * @param ribbonFilePanel The ribbon file panel
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
  public void setRibbonPanels(Z4RibbonFilePanel ribbonFilePanel, Z4RibbonLayerPanel ribbonLayerPanel, Z4RibbonHistoryPanel ribbonHistoryPanel) {
    this.ribbonFilePanel = ribbonFilePanel;
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;

    this.ribbonFilePanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);

    this.mouseManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.ioManager.setRibbonPanels(ribbonLayerPanel, ribbonHistoryPanel);
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

    this.ribbonHistoryPanel.resetHistory(() -> {
      this.afterCreate("", width, height);
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
    this.statusPanel.setZoom(1);

    this.zoom = 1;
    this.mouseManager.setZoom(this.zoom);

    this.setSaved(true);
    this.changed = false;

    this.canvas.width = width;
    this.canvas.height = height;

    this.drawCanvas();
  }

  /**
   * Opens a project
   *
   * @param handle The file handle
   */
  public void openProjectFromHandle(FileSystemFileHandle handle) {
    this.handle = handle;
    this.ioManager.openProjectFromHandle(handle);
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
  public void openProjectFromFile(File file) {
    this.ioManager.openProjectFromFile(file);
  }

  /**
   * Opens an history
   *
   * @param json The history
   */
  public void openFromHistory($Object json) {
    this.paper.reset();
    this.ribbonLayerPanel.reset();

    this.setSize(json.$get("width"), json.$get("height"));

    this.openLayerFromHistory(json, json.$get("layers"), 0);
  }

  private void openLayerFromHistory($Object json, Array<$Object> layers, int index) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.addLayerFromImage(layers.$get(index).$get("name"), image, (int) image.width, (int) image.height);

      this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), layer -> {
        layer.setOpacity(layers.$get(index).$get("opacity"));
        layer.setCompositeOperation(layers.$get(index).$get("compositeOperation"));
        layer.setHidden(layers.$get(index).$get("hidden"));
        layer.move(layers.$get(index).$get("offsetX"), layers.$get(index).$get("offsetY"));
      }, true);

      if (index + 1 < layers.length) {
        this.openLayerFromHistory(json, layers, index + 1);
      } else {
        this.afterCreate(json.$get("projectName"), json.$get("width"), json.$get("height"));
        this.setSaved(false);
      }
      return null;
    };

    image.src = URL.createObjectURL(layers.$get(index).$get("data"));

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
   * Prepare the project for the history
   *
   * @param apply The function to call after preparation
   */
  public void toHistory($Apply_1_Void<$Object> apply) {
    this.layerToJSON(null, new Array<>(), 0, apply);
  }

  private void layerToJSON($JSZip zip, Array<$Object> layers, int index, $Apply_1_Void<$Object> apply) {
    Z4Layer layer = this.paper.getLayerAt(index);

    layer.convertToBlob(blob -> {
      if ($exists(zip)) {
        zip.file("layers/layer" + index + ".png", blob, null);
      }

      Point offset = layer.getOffset();

      $Object layerJSON = new $Object();
      if (!$exists(zip)) {
        layerJSON.$set("data", blob);
      }
      layerJSON.$set("name", layer.getName());
      layerJSON.$set("opacity", layer.getOpacity());
      layerJSON.$set("compositeOperation", layer.getCompositeOperation());
      layerJSON.$set("hidden", layer.isHidden());
      layerJSON.$set("offsetX", offset.x);
      layerJSON.$set("offsetY", offset.y);

      layers.$set(index, layerJSON);

      if (index + 1 == this.getLayersCount()) {
        $Object JSON = new $Object();
        JSON.$set("projectName", this.projectName);
        JSON.$set("width", this.width);
        JSON.$set("height", this.height);
        JSON.$set("layers", layers);

        apply.$apply(JSON);
      } else {
        this.layerToJSON(zip, layers, index + 1, apply);
      }
    });
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
    this.ribbonHistoryPanel.saveHistory("standard,tool");

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
  public int deleteLayer(Z4Layer layer) {
    int index = this.paper.deleteLayer(layer);

    if (this.selectedLayer == layer) {
      int count = this.getLayersCount();
      this.setSelectedLayer(this.paper.getLayerAt(count - 1));

      document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ") .z4layerpreview-selector").textContent = Z4LayerPreview.SELECTED_LAYER_CONTENT;
      ((HTMLElement) document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ")")).scrollIntoView();
    }

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
  public boolean moveLayer(Z4Layer layer, int position) {
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
    this.ribbonFilePanel.setSaveEnabled(!this.saved);
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
   * Sets the zoom
   *
   * @param zoom The zoom
   */
  public void setZoom(double zoom) {
    this.zoom = zoom;
    this.mouseManager.setZoom(this.zoom);

    this.canvas.width = this.width * zoom;
    this.canvas.height = this.height * zoom;
    this.drawCanvas();
  }

  /**
   * Sets the zoom to fit the available space
   */
  public void fitZoom() {
    this.setZoom(Math.min((this.canvas.parentElement.clientWidth - 20) / this.width, (this.canvas.parentElement.clientHeight - 20) / this.height));
  }

  private void zoomIn() {
    if (this.zooming) {
    } else {
      this.zooming = true;
      double newZoom = Z4Constants.ZOOM_LEVEL.find(level -> level > this.zoom, null);
      if ($exists(newZoom)) {
        this.zoom = newZoom;
        this.mouseManager.setZoom(this.zoom);

        this.canvas.width = this.width * newZoom;
        this.canvas.height = this.height * newZoom;
        this.statusPanel.setZoom(this.zoom);
        this.drawCanvas();
      }
      this.zooming = false;
    }
  }

  private void zoomOut() {
    if (this.zooming) {
    } else {
      this.zooming = true;
      double newZoom = Z4Constants.ZOOM_LEVEL.filter(level -> level < this.zoom).pop();
      if ($exists(newZoom)) {
        this.zoom = newZoom;
        this.mouseManager.setZoom(this.zoom);

        this.canvas.width = this.width * newZoom;
        this.canvas.height = this.height * newZoom;
        this.statusPanel.setZoom(this.zoom);
        this.drawCanvas();
      }
      this.zooming = false;
    }
  }

  /**
   * Draws this canvas
   */
  public void drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx, false, false);
    this.ctx.restore();
  }
}
