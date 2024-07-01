package pizzapazza.ui.component;

import def.dom.Blob;
import def.dom.Event;
import def.dom.File;
import def.dom.FileReader;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.URL;
import def.js.Array;
import static def.js.Globals.eval;
import def.js.JSON;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.util.fsa.FileSystemFileHandle;
import javascript.util.fsa.FileSystemWritableFileStreamCreateOptions;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonDrawingToolPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Paper;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import static simulation.filesaver.$FileSaver.saveAs;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import simulation.js.$Apply_2_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import simulation.js.$Object;
import simulation.jszip.$JSZip;
import simulation.jszip.$ZipObject;

/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasIOManager {

  private final Z4Canvas canvas;
  private final Z4Paper paper;
  private final Array<Z4DrawingTool> drawingTools;
  private Dimension size;

  private Z4RibbonLayerPanel ribbonLayerPanel;
  private Z4RibbonDrawingToolPanel ribbonDrawingToolPanel;
  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   * @param drawingTools The drawing tools
   */
  public Z4CanvasIOManager(Z4Canvas canvas, Z4Paper paper, Array<Z4DrawingTool> drawingTools) {
    this.canvas = canvas;
    this.paper = paper;
    this.drawingTools = drawingTools;
  }

  /**
   * Sets the ribbon panels
   *
   * @param size The size
   */
  public void setSize(Dimension size) {
    this.size = size;
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
  public void setRibbonPanels(Z4RibbonLayerPanel ribbonLayerPanel, Z4RibbonDrawingToolPanel ribbonDrawingToolPanel, Z4RibbonHistoryPanel ribbonHistoryPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Creates a new canvas project from an image file
   *
   * @param handle The file handle
   */
  public void createFromHandle(FileSystemFileHandle handle) {
    handle.getFile().then(file -> {
      this.createFromFile(file);
    });
  }

  /**
   * Creates a new canvas project from an image file
   *
   * @param file The file
   */
  public void createFromFile(File file) {
    FileReader fileReader = new FileReader();
    fileReader.onload = event -> this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), (String) fileReader.result);
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new canvas project from an image in the clipboard
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

      this.canvas.setSize((int) image.width, (int) image.height);

      this.ribbonLayerPanel.reset();
      this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.canvas.getLayersCount() - 1), null, true);

      this.drawingTools.length = 0;
      this.ribbonDrawingToolPanel.reset();

      this.ribbonHistoryPanel.resetHistory(() -> {
        this.canvas.afterCreate(projectName, (int) image.width, (int) image.height);
        this.canvas.toHistory(json -> this.ribbonHistoryPanel.addHistory(json, key -> this.ribbonHistoryPanel.setCurrentKey(key), false));
      });

      return null;
    };

    image.src = url;
    return null;
  }

  /**
   * Opens a canvas project
   *
   * @param handle The file handle
   */
  public void openProjectFromHandle(FileSystemFileHandle handle) {
    handle.getFile().then(file -> {
      this.openProjectFromFile(file);
    });
  }

  /**
   * Opens a canvas project
   *
   * @param file The file
   */
  public void openProjectFromFile(File file) {
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> {
      new $JSZip().loadAsync(file).then(zip -> {
        zip.file("manifest.json").async("string", null).then(str -> {
          this.paper.reset();
          this.ribbonLayerPanel.reset();

          this.drawingTools.length = 0;
          this.ribbonDrawingToolPanel.reset();

          this.ribbonHistoryPanel.resetHistory(() -> {
            $Object json = ($Object) JSON.parse("" + str);
            this.canvas.setSize(json.$get("width"), json.$get("height"));

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

        this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), selectedLayer -> {
          selectedLayer.setOpacity(layers.$get(index).$get("opacity"));
          selectedLayer.setCompositeOperation(layers.$get(index).$get("compositeOperation"));
          selectedLayer.setHidden(layers.$get(index).$get("hidden"));
          selectedLayer.move(layers.$get(index).$get("offsetX"), layers.$get(index).$get("offsetY"));
        }, true);

        if (index + 1 < layers.length) {
          this.openLayer(zip, json, layers, index + 1);
        } else if ($exists(json.$get("history"))) {
          this.jsonToHistory(zip, json, 0, json.$get("currentKeyHistory"), 0);
        } else {
          this.jsonToDrawingTools(zip, () -> {
            this.canvas.afterCreate(json.$get("projectName"), json.$get("width"), json.$get("height"));
            this.canvas.toHistory(json2 -> this.ribbonHistoryPanel.addHistory(json2, key -> this.ribbonHistoryPanel.setCurrentKey(key), false));
            Z4UI.pleaseWaitCompleted();
          });
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
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey -> this.jsonToDrawingTools(zip, () -> {
          this.ribbonHistoryPanel.setCurrentKey(previousCurrentKey == historyKey ? currentKey : newCurrentKey);
          this.canvas.afterCreate(json.$get("projectName"), json.$get("width"), json.$get("height"));
          Z4UI.pleaseWaitCompleted();
        }), true);
      }
    });
  }

  @SuppressWarnings("unchecked")
  private void jsonToDrawingTools($JSZip zip, $Apply_0_Void apply) {
    $ZipObject zipObject = zip.file("drawingTools.json");
    if ($exists(zipObject)) {
      zipObject.async("string", null).then(str -> {
        ((Iterable<$Object>) (($Object) JSON.parse((String) str)).$get("drawingTools")).forEach(drawingTool -> this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
        apply.$apply();
      });
    } else {
      apply.$apply();
    }
  }

  /**
   * Saves a canvas project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   * @return The project name
   */
  @SuppressWarnings("static-access")
  public String saveProjectToHandle(FileSystemFileHandle handle, $Apply_0_Void apply) {
    String projectName = handle.name.substring(0, handle.name.lastIndexOf('.'));

    this.saveProject(projectName, (zipped, name) -> handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable -> {
      writable.write(zipped);
      writable.close();
    }), apply);

    return projectName;
  }

  /**
   * Saves a canvas project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
  public void saveProjectToFile(String projectName, $Apply_0_Void apply) {
    this.saveProject(projectName, (zipped, name) -> saveAs(zipped, name), apply);
  }

  private void saveProject(String projectName, $Apply_2_Void<Object, String> save, $Apply_0_Void apply) {
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> {
      this.statusPanel.setProjectName(projectName);

      $JSZip zip = new $JSZip();
      this.layerToJSON(zip, projectName, new Array<>(), 0, obj -> {
        $Apply_0_Void finish = () -> {
          $Object json = new $Object();
          Array<$Object> array = new Array<>();
          this.drawingTools.forEach(drawingTool -> array.push(drawingTool.toJSON()));
          json.$set("drawingTools", array);
          zip.file("drawingTools.json", JSON.stringify(json), null);

          zip.file("manifest.json", JSON.stringify(obj), null);

          $Object options = new $Object();
          options.$set("type", "blob");
          options.$set("compression", "DEFLATE");
          options.$set("streamFiles", true);

          $Object compressionOptions = new $Object();
          compressionOptions.$set("level", 9);
          options.$set("compressionOptions", compressionOptions);

          zip.generateAsync(options, metadata -> Z4UI.setPleaseWaitProgressBarValue(metadata.$get("percent"))).then(zipped -> {
            save.$apply(zipped, projectName + ".z4i");
            this.canvas.setSaved(true);

            Z4UI.pleaseWaitCompleted();
            if ($exists(apply)) {
              apply.$apply();
            }
          });
        };

        obj.$set("currentKeyHistory", this.ribbonHistoryPanel.getCurrentKey());
        obj.$set("history", new Array<Integer>());
        this.historyToJSON(zip, obj, finish);
      });
    });
  }

  private void layerToJSON($JSZip zip, String projectName, Array<$Object> layers, int index, $Apply_1_Void<$Object> apply) {
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

      if (index + 1 == this.canvas.getLayersCount()) {
        $Object JSON = new $Object();
        JSON.$set("projectName", projectName);
        JSON.$set("width", this.size.width);
        JSON.$set("height", this.size.height);
        JSON.$set("layers", layers);

        apply.$apply(JSON);
      } else {
        this.layerToJSON(zip, projectName, layers, index + 1, apply);
      }
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
   * Exports a canvas project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
  public void exportToFile(String filename, String ext, double quality) {
    this.exportTo(ext, quality, blob -> {
      HTMLElement link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", filename + ext);

      document.body.appendChild(link);

      Event event = document.createEvent("MouseEvents");
      event.initEvent("click", false, false);
      link.dispatchEvent(event);

      document.body.removeChild(link);
    });
  }

  /**
   * Exports a canvas project to an image file
   *
   * @param handle The file handle
   * @param quality The quality
   */
  public void exportToHandle(FileSystemFileHandle handle, double quality) {
    handle.getFile().then(file -> {
      this.exportTo(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.')), quality, blob -> handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable -> {
        writable.write(blob);
        writable.close();
      }));
    });
  }

  @SuppressWarnings("StringEquality")
  private void exportTo(String ext, double quality, $Apply_1_Void<Blob> apply) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () -> {
      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.size.width, this.size.height);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false, false);

      $Object options = new $Object();
      options.$set("type", ext == ".png" ? "image/png" : "image/jpeg");
      options.$set("quality", quality);

      offscreen.convertToBlob(options).then(blob -> {
        apply.$apply(blob);
      });
    });
  }

  /**
   * Adds a canvas layer from an image file
   *
   * @param handle The file handle
   */
  public void addLayerFromHandle(FileSystemFileHandle handle) {
    handle.getFile().then(file -> {
      this.addLayerFromFile(file);
    });
  }

  /**
   * Adds a canvas layer from an image file
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
   * Adds a canvas layer from an image in the clipboard
   */
  public void addLayerFromClipboard() {
    navigator.clipboard.read().then(items -> {
      items.forEach(item -> {
        String imageType = item.types.find((type, index, array) -> type.startsWith("image/"));

        item.getType(imageType).then(blob -> {
          this.addLayerFromURL(this.canvas.findLayerName(), URL.createObjectURL(blob));
        });
      });
    });
  }

  /**
   * Merges an array of layers in the canvas
   *
   * @param layers The layers
   */
  public void mergeLayers(Array<Z4Layer> layers) {
    $OffscreenCanvas offscreen = new $OffscreenCanvas(this.size.width, this.size.height);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    layers.forEach(layer -> layer.draw(offscreenCtx, false, false));

    $Object options = new $Object();
    options.$set("type", "image/png");
    offscreen.convertToBlob(options).then(converted -> {
      this.addLayerFromURL(this.canvas.findLayerName(), URL.createObjectURL(converted));
    });
  }

  private Object addLayerFromURL(String name, String url) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.addLayerFromImage(name, image, this.size.width, this.size.height);
      this.canvas.afterAddLayer();
      this.canvas.drawCanvas();
      return null;
    };

    image.src = url;
    return null;
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param handle The file handle
   */
  public void addDrawingToolFromHandle(FileSystemFileHandle handle) {
    handle.getFile().then(file -> {
      this.addDrawingToolFromFile(file);
    });
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param file The file
   */
  @SuppressWarnings("unchecked")
  public void addDrawingToolFromFile(File file) {
    FileReader fileReader = new FileReader();
    fileReader.onload = event -> {
      $Object json = ($Object) JSON.parse((String) fileReader.result);

      if (file.name.toLowerCase().endsWith(".z4ts")) {
        ((Iterable<$Object>) json.$get("drawingTools")).forEach(drawingTool -> this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
      } else {
        this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(json));
      }

      return null;
    };
    fileReader.readAsText(file);
  }

  /**
   * Saves the drawing tools
   *
   * @param fileName The file name
   */
  public void saveDrawingToolsToFile(String fileName) {
    if (!fileName.toLowerCase().endsWith(".z4ts")) {
      fileName += ".z4ts";
    }
    this.saveDrawingTools(fileName, (json, name) -> {
      Blob blob = null;
      eval("blob = new Blob([JSON.stringify(json)], {type: 'application/json'});");
      saveAs(blob, name);
    });
  }

  /**
   * Saves the drawing tools
   *
   * @param handle The file handle
   */
  @SuppressWarnings("static-access")
  public void saveDrawingToolsToHandle(FileSystemFileHandle handle) {
    String fileName = handle.name.substring(0, handle.name.lastIndexOf('.'));

    this.saveDrawingTools(fileName, (json, name) -> handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable -> {
      writable.write(JSON.stringify(json));
      writable.close();
    }));
  }

  private void saveDrawingTools(String fileName, $Apply_2_Void<Object, String> save) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () -> {
      Array<$Object> array = new Array<>();
      this.drawingTools.forEach(drawingTool -> array.push(drawingTool.toJSON()));

      $Object json = new $Object();
      json.$set("drawingTools", array);

      save.$apply(json, fileName);
    });
  }
}
