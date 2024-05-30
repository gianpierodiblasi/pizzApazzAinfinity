package pizzapazza.ui.component;

import def.dom.Event;
import def.dom.File;
import def.dom.FileReader;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.KeyboardEvent;
import def.dom.MouseEvent;
import def.dom.URL;
import def.dom.WheelEvent;
import def.js.Array;
import def.js.JSON;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.swing.JSComponent;
import pizzapazza.Z4Layer;
import pizzapazza.Z4Paper;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonFilePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import static simulation.filesaver.$FileSaver.saveAs;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.parseInt;
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
  private int width;
  private int height;
  private double zoom = 1;
  private boolean zooming;
  private boolean saved = true;
  private boolean changed = false;

  private final Z4Paper paper = new Z4Paper();

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4Canvas() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);

    this.canvas.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.canvas.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.canvas.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));

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
    this.ribbonHistoryPanel = ribbonHistoryPanel;
    this.ribbonLayerPanel = ribbonLayerPanel;

    this.ribbonFilePanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);

  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
    this.statusPanel.setCanvas(this);
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

    this.width = width;
    this.height = height;

    this.ribbonLayerPanel.reset();
    this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));

    this.ribbonHistoryPanel.resetHistory(() -> {
      this.afterCreate("", width, height);
      this.toHistory(json -> this.ribbonHistoryPanel.addHistory(json, key -> this.ribbonHistoryPanel.setCurrentKey(key), false));
    });

  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
  public void createFromFile(File file) {
    FileReader fileReader = new FileReader();
    fileReader.onload = event -> this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), (String) fileReader.result);
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   */
  public void createFromClipboard() {
    navigator.clipboard.read().then(items -> {
      items.forEach(item -> {
        String imageType = item.types.find((type, index, array) -> type.startsWith("image/"));

        item.getType(imageType).then(blob -> {
          this.createFromURL("", URL.createObjectURL(blob));
        });
      });
    });
  }

  private Object createFromURL(String projectName, String url) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.reset();
      this.paper.addLayerFromImage(Z4Translations.BACKGROUND_LAYER, image, (int) image.width, (int) image.height);

      this.width = (int) image.width;
      this.height = (int) image.height;

      this.ribbonLayerPanel.reset();
      this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));

      this.ribbonHistoryPanel.resetHistory(() -> {
        this.afterCreate(projectName, (int) image.width, (int) image.height);
        this.toHistory(json -> this.ribbonHistoryPanel.addHistory(json, key -> this.ribbonHistoryPanel.setCurrentKey(key), false));
      });

      return null;
    };

    image.src = url;
    return null;
  }

  private void afterCreate(String projectName, int width, int height) {
    this.projectName = projectName;

    this.statusPanel.setProjectName(projectName);
    this.statusPanel.setProjectSize(width, height);
    this.statusPanel.setZoom(1);

    this.zoom = 1;
    this.saved = true;
    this.changed = false;

    this.canvas.width = width;
    this.canvas.height = height;

    this.drawCanvas();
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
  public void openProject(File file) {
    Z4UI.pleaseWait(this, true, true, false, true, "", () -> {
      new $JSZip().loadAsync(file).then(zip -> {
        zip.file("manifest.json").async("string", null).then(str -> {
          this.paper.reset();
          this.ribbonLayerPanel.reset();
          this.ribbonHistoryPanel.resetHistory(() -> {
            $Object json = ($Object) JSON.parse("" + str);
            this.width = json.$get("width");
            this.height = json.$get("height");

            this.openLayer(zip, json, json.$get("layers"), 0);
          });
        });
      });
    });
  }

  @SuppressWarnings("unchecked")
  private void openLayer($JSZip zip, $Object json, Array<$Object> layers, int index) {
    zip.file("layers/layer" + index + ".png").async("blob", metadata -> Z4UI.setPleaseWaitProgressBarValue(metadata.$get("percent"))).then(blob -> {
      $Image image = ($Image) document.createElement("img");

      image.onload = event -> {
        this.paper.addLayerFromImage(layers.$get(index).$get("name"), image, (int) image.width, (int) image.height);
        Z4Layer layer = this.paper.getLayerAt(index);
        layer.setOpacity(layers.$get(index).$get("opacity"));
        layer.setCompositeOperation(layers.$get(index).$get("compositeOperation"));
        layer.move(layers.$get(index).$get("offsetX"), layers.$get(index).$get("offsetY"));
        this.ribbonLayerPanel.addLayerPreview(layer);

        if (index + 1 < layers.length) {
          this.openLayer(zip, json, layers, index + 1);
        } else if ($exists(json.$get("history"))) {
          this.jsonToHistory(zip, json, 0, json.$get("currentKeyHistory"), 0);
        } else {
          this.afterCreate(json.$get("projectName"), json.$get("width"), json.$get("height"));
          this.toHistory(json2 -> this.ribbonHistoryPanel.addHistory(json2, key -> this.ribbonHistoryPanel.setCurrentKey(key), false));
          Z4UI.pleaseWaitCompleted();
        }
        return null;
      };

      image.src = URL.createObjectURL(blob);
    });
  }

  private void jsonToHistory($JSZip zip, $Object json, int index, int previousCurrentKey, int newCurrentKey) {
    Array<Integer> history = json.$get("history");
    int key = history.$get(index);
    String folder = "history/history_" + key + "/";

    zip.file(folder + "manifest.json").async("string", null).then(str -> {
      $Object layerJSON = ($Object) JSON.parse("" + str);
      this.layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, 0, key);
    });
  }

  @SuppressWarnings({"unchecked", "null"})
  private void layerToHistory($JSZip zip, $Object json, int index, int previousCurrentKey, int newCurrentKey, String folder, $Object layerJSON, int layerIndex, int historyKey) {
    zip.file(folder + "layers/layer" + layerIndex + ".png").async("blob", metadata -> Z4UI.setPleaseWaitProgressBarValue(metadata.$get("percent"))).then(blob -> {
      Array<$Object> layers = layerJSON.$get("layers");
      $Object layer = layers.$get(layerIndex);
      layer.$set("data", blob);

      if (layerIndex + 1 < layers.length) {
        this.layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, layerIndex + 1, historyKey);
      } else if (index + 1 < ((Array<Integer>) json.$get("history")).length) {
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey -> this.jsonToHistory(zip, json, index + 1, previousCurrentKey, previousCurrentKey == historyKey ? currentKey : newCurrentKey), true);
      } else {
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey -> {
          this.ribbonHistoryPanel.setCurrentKey(previousCurrentKey == historyKey ? currentKey : newCurrentKey);
          this.afterCreate(json.$get("projectName"), json.$get("width"), json.$get("height"));
          Z4UI.pleaseWaitCompleted();
        }, true);
      }
    });
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param saveHistory true to save the history, false otherwise
   * @param apply The function to call after saving
   */
  public void saveProject(String projectName, boolean saveHistory, $Apply_0_Void apply) {
    Z4UI.pleaseWait(this, true, true, false, true, "", () -> {
      this.projectName = projectName;
      this.statusPanel.setProjectName(projectName);

      $JSZip zip = new $JSZip();
      this.layerToJSON(zip, new Array<>(), 0, obj -> {
        $Apply_0_Void finish = () -> {
          zip.file("manifest.json", JSON.stringify(obj), null);

          $Object options = new $Object();
          options.$set("type", "blob");
          options.$set("compression", "DEFLATE");
          options.$set("streamFiles", true);

          $Object compressionOptions = new $Object();
          compressionOptions.$set("level", 9);
          options.$set("compressionOptions", compressionOptions);

          zip.generateAsync(options, metadata -> Z4UI.setPleaseWaitProgressBarValue(metadata.$get("percent"))).then(zipped -> {
            saveAs(zipped, this.projectName + ".z4i");
            this.saved = true;

            Z4UI.pleaseWaitCompleted();
            if ($exists(apply)) {
              apply.$apply();
            }
          });
        };

        if (saveHistory) {
          obj.$set("currentKeyHistory", this.ribbonHistoryPanel.getCurrentKey());
          obj.$set("history", new Array<Integer>());
          this.historyToJSON(zip, obj, finish);
        } else {
          finish.$apply();
        }
      });
    });
  }

  @SuppressWarnings("unchecked")
  private void historyToJSON($JSZip zip, $Object obj, $Apply_0_Void finish) {
    this.ribbonHistoryPanel.iterateHistoryBuffer((key, value, apply) -> {
      if (key != -1) {
        ((Array<Integer>) obj.$get("history")).push(key);
        String folder = "history/history_" + key + "/";

        Array<$Object> layers = value.$get("layers");
        layers.forEach((layer, index, array) -> {
          zip.file(folder + "layers/layer" + index + ".png", layer.$get("data"), null);
          layer.$set("data", null);
        });

        zip.file(folder + "manifest.json", JSON.stringify(value), null);

        apply.$apply();
      } else {
        finish.$apply();
      }
    });
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
      layerJSON.$set("offsetX", offset.x);
      layerJSON.$set("offsetY", offset.y);

      layers.$set(index, layerJSON);

      if (index + 1 == this.paper.getLayersCount()) {
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
  @SuppressWarnings("StringEquality")
  public void exportToFile(String filename, String ext, double quality) {
    Z4UI.pleaseWait(this, false, false, false, false, "", () -> {
      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.width, this.height);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false, false);

      $Object options = new $Object();
      options.$set("type", ext == ".png" ? "image/png" : "image/jpeg");
      options.$set("quality", quality);

      offscreen.convertToBlob(options).then(blob -> {
        HTMLElement link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename + ext);

        document.body.appendChild(link);

        Event event = document.createEvent("MouseEvents");
        event.initEvent("click", false, false);
        link.dispatchEvent(event);

        document.body.removeChild(link);
      });
    });
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
   * @param file The file
   */
  public void addLayerFromFile(File file) {
    String name = file.name.substring(0, file.name.lastIndexOf('.'));

    FileReader fileReader = new FileReader();
    fileReader.onload = event -> this.addLayerFromURL(name, (String) fileReader.result);
    fileReader.readAsDataURL(file);
  }

  /**
   * Adds a layer from an image in the clipboard
   */
  public void addLayerFromClipboard() {
    navigator.clipboard.read().then(items -> {
      items.forEach(item -> {
        String imageType = item.types.find((type, index, array) -> type.startsWith("image/"));

        item.getType(imageType).then(blob -> {
          this.addLayerFromURL(this.findLayerName(), URL.createObjectURL(blob));
        });
      });
    });
  }

  @SuppressWarnings("StringEquality")
  private String findLayerName() {
    int counter = 0;
    String found = "";
    while (!$exists(found)) {
      found = Z4Translations.LAYER + "_" + counter;
      for (int index = 0; index < this.paper.getLayersCount(); index++) {
        if (found == this.paper.getLayerAt(index).getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

  private Object addLayerFromURL(String name, String url) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.addLayerFromImage(name, image, this.width, this.height);
      this.afterAddLayer();
      this.drawCanvas();
      return null;
    };

    image.src = url;
    return null;
  }

  private void afterAddLayer() {
    this.changed = true;
    this.ribbonHistoryPanel.saveHistory("standard,tool");
    this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));
    this.saved = false;
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

        Z4Layer duplicate = this.paper.getLayerAt(this.paper.getLayersCount() - 1);
        duplicate.setOpacity(layer.getOpacity());
        duplicate.setCompositeOperation(layer.getCompositeOperation());
        duplicate.move(offset.x, offset.y);
        this.ribbonLayerPanel.addLayerPreview(duplicate);

        this.saved = false;
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

    this.saved = false;
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
      this.saved = false;
      this.drawCanvas();
      return true;
    } else {
      return false;
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

  private void onMouse(MouseEvent event, String type) {
    switch (type) {
      case "down":
        break;
      case "move":
        this.statusPanel.setMousePosition(parseInt(Math.max(0, event.offsetX / this.zoom)), parseInt(Math.max(0, event.offsetY / this.zoom)));
        break;
      case "up":
        break;
    }
  }
}
