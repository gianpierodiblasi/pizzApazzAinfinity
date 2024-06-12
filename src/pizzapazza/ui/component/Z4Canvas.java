package pizzapazza.ui.component;

import def.dom.Blob;
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
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.swing.JSComponent;
import javascript.util.fsa.FileSystemFileHandle;
import javascript.util.fsa.FileSystemWritableFileStreamCreateOptions;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4Airbrush;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.iterator.Z4Scatterer;
import pizzapazza.iterator.Z4Spirograph;
import pizzapazza.iterator.Z4Stamper;
import pizzapazza.iterator.Z4Tracer;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4ArrowPainter;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonFilePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Paper;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import static simulation.filesaver.$FileSaver.saveAs;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import simulation.js.$Apply_2_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;
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
  private boolean pressed = false;

  private final Z4Paper paper = new Z4Paper();
  private Z4Layer selectedLayer;

//  private Z4DrawingTool drawingTool = new Z4DrawingTool(
//          new Z4Stamper(
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 5),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(5, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(10, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4Rotation(0, new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 45),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(30, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false), Z4RotationBehavior.FIXED, false)),
//          new Z4ArrowPainter(),
//          Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255))
//  );
//  private Z4DrawingTool drawingTool = new Z4DrawingTool(
//          new Z4Tracer(
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  true,
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  new Z4Rotation(0, new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false), Z4RotationBehavior.RELATIVE_TO_PATH, false)),
//          new Z4ArrowPainter(),
//          Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255))
//  );
//  private Z4DrawingTool drawingTool = new Z4DrawingTool(
//          new Z4Airbrush(
//                  new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false),
//                  100,
//                  5,
//                  new Z4Rotation(0, new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 5),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false), Z4RotationBehavior.RELATIVE_TO_PATH, false)),
//          new Z4ArrowPainter(),
//          Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255))
//  );
//  private Z4DrawingTool drawingTool = new Z4DrawingTool(
//          new Z4Spirograph(
//                  new Z4Rotation(0, new Z4FancifulValue(
//                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 5),
//                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(10, Z4RandomValueBehavior.CLASSIC, 0)),
//                          false), Z4RotationBehavior.RELATIVE_TO_PATH, false)),
//          new Z4ArrowPainter(),
//          Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255))
//  );
  private Z4DrawingTool drawingTool = new Z4DrawingTool(
          new Z4Scatterer(
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(10, Z4RandomValueBehavior.CLASSIC, 0)),
                          false),
                  new Z4Rotation(0, new Z4FancifulValue(
                          new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                          new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(30, Z4RandomValueBehavior.CLASSIC, 0)),
                          false), Z4RotationBehavior.RELATIVE_TO_PATH, false)),
          new Z4ArrowPainter(),
          Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255))
  );

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4Canvas() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);

    this.canvas.addEventListener("mouseenter", event -> this.onMouse((MouseEvent) event, "enter"));
    this.canvas.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
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

    this.selectedLayer = this.paper.getLayerAt(this.getLayersCount() - 1);

    this.ribbonLayerPanel.reset();
    this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);

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
    handle.getFile().then(file -> {
      this.createFromFile(file);
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

      this.selectedLayer = this.paper.getLayerAt(this.getLayersCount() - 1);

      this.ribbonLayerPanel.reset();
      this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);

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

    handle.getFile().then(file -> {
      this.openProjectFromFile(file);
    });
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
  public void openProjectFromFile(File file) {
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
        this.selectedLayer = this.paper.getLayerAt(index);
        this.selectedLayer.setOpacity(layers.$get(index).$get("opacity"));
        this.selectedLayer.setCompositeOperation(layers.$get(index).$get("compositeOperation"));
        this.selectedLayer.setHidden(layers.$get(index).$get("hidden"));
        this.selectedLayer.move(layers.$get(index).$get("offsetX"), layers.$get(index).$get("offsetY"));
        this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);

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
   * Opens an history
   *
   * @param json The history
   */
  public void openFromHistory($Object json) {
    this.paper.reset();
    this.ribbonLayerPanel.reset();

    this.width = json.$get("width");
    this.height = json.$get("height");

    this.openLayerFromHistory(json, json.$get("layers"), 0);
  }

  private void openLayerFromHistory($Object json, Array<$Object> layers, int index) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.addLayerFromImage(layers.$get(index).$get("name"), image, (int) image.width, (int) image.height);
      this.selectedLayer = this.paper.getLayerAt(index);
      this.selectedLayer.setOpacity(layers.$get(index).$get("opacity"));
      this.selectedLayer.setCompositeOperation(layers.$get(index).$get("compositeOperation"));
      this.selectedLayer.setHidden(layers.$get(index).$get("hidden"));
      this.selectedLayer.move(layers.$get(index).$get("offsetX"), layers.$get(index).$get("offsetY"));
      this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);

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

    this.saveProject(handle.name.substring(0, handle.name.lastIndexOf('.')), (zipped, name) -> handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable -> {
      writable.write(zipped);
      writable.close();
    }), apply);
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
  public void saveProjectToFile(String projectName, $Apply_0_Void apply) {
    this.saveProject(projectName, (zipped, name) -> saveAs(zipped, name), apply);
  }

  private void saveProject(String projectName, $Apply_2_Void<Object, String> save, $Apply_0_Void apply) {
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
            save.$apply(zipped, this.projectName + ".z4i");
            this.setSaved(true);

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
   * Exports this project to an image file
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
    Z4UI.pleaseWait(this, false, false, false, false, "", () -> {
      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.width, this.height);
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
    handle.getFile().then(file -> {
      this.addLayerFromFile(file);
    });
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
      for (int index = 0; index < this.getLayersCount(); index++) {
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

    this.selectedLayer = this.paper.getLayerAt(this.getLayersCount() - 1);

    this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);
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

        this.selectedLayer = this.paper.getLayerAt(this.getLayersCount() - 1);
        this.selectedLayer.setOpacity(layer.getOpacity());
        this.selectedLayer.setCompositeOperation(layer.getCompositeOperation());
        this.selectedLayer.setHidden(layer.isHidden());
        this.selectedLayer.move(offset.x, offset.y);
        this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);

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
      this.selectedLayer = this.paper.getLayerAt(count - 1);

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
    $OffscreenCanvas offscreen = new $OffscreenCanvas(this.width, this.height);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    layers.forEach(layer -> layer.draw(offscreenCtx, false, false));

    $Object options = new $Object();
    options.$set("type", "image/png");
    offscreen.convertToBlob(options).then(converted -> {
      this.addLayerFromURL(this.findLayerName(), URL.createObjectURL(converted));
    });
  }

  /**
   * Sets the selected layer
   *
   * @param selectedLayer The selected layer
   */
  public void setSelectedLayer(Z4Layer selectedLayer) {
    this.selectedLayer = selectedLayer;
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
    double x = Math.min(this.width, Math.max(0, event.offsetX / this.zoom));
    double y = Math.min(this.height, Math.max(0, event.offsetY / this.zoom));

    switch (type) {
      case "enter":
        this.pressed = event.buttons == 1;
        if (this.pressed && this.drawingTool.drawAction(Z4PointIteratorDrawingAction.START, x, y)) {
          this.ribbonHistoryPanel.stopStandard();
          this.iteratePoint();
        }
        if (this.pressed && this.drawingTool.drawAction(Z4PointIteratorDrawingAction.CONTINUE, x, y)) {
          this.ribbonHistoryPanel.stopStandard();
          this.iteratePoint();
        }
        break;
      case "down":
        this.pressed = true;
        if (this.drawingTool.drawAction(Z4PointIteratorDrawingAction.START, x, y)) {
          this.ribbonHistoryPanel.stopStandard();
          this.iteratePoint();
        }
        break;
      case "move":
        this.statusPanel.setMousePosition(parseInt(x), parseInt(y));

        if (this.pressed && this.drawingTool.drawAction(Z4PointIteratorDrawingAction.CONTINUE, x, y)) {
          this.ribbonHistoryPanel.stopStandard();
          this.iteratePoint();
        }
        break;
      case "up":
        this.pressed = false;
        if (this.drawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
          this.iteratePoint();
        }

        this.changed = true;
        this.setSaved(false);
        this.ribbonHistoryPanel.startStandard();
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          if (this.drawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
            this.iteratePoint();
          }

          this.changed = true;
          this.setSaved(false);
          this.ribbonHistoryPanel.startStandard();
        }
        break;
    }
  }

  private void iteratePoint() {
    Z4DrawingPoint next;
    while ((next = this.drawingTool.next()) != null) {
      if (next.drawBounds) {
        this.ctx.save();
        this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
        this.ctx.rotate(next.z4Vector.phase);
        this.drawingTool.draw(this.ctx, next);
        this.ctx.restore();
      } else {
        this.selectedLayer.drawTool(this.drawingTool, next);
        this.selectedLayer.getLayerPreview().drawLayer();
        this.drawCanvas();
      }
    }

    if (this.drawingTool.isInfinitePointGenerator() && this.pressed) {
      setTimeout(() -> this.iteratePoint(), this.drawingTool.getInfinitePointGeneratorSleep());
    }
  }
}
