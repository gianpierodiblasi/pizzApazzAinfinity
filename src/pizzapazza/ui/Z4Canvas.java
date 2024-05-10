package pizzapazza.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.Event;
import def.dom.File;
import def.dom.FileReader;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.URL;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.swing.JSComponent;
import jsweet.util.union.Union4;
import pizzapazza.Z4Constants;
import pizzapazza.Z4Layer;
import pizzapazza.Z4Paper;
import pizzapazza.ui.panel.Z4StatusPanel;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import static simulation.filesaver.$FileSaver.saveAs;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.navigator;
import simulation.js.$Object;
import simulation.js.$ResizeObserver;
import simulation.jszip.$JSZip;

/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4Canvas extends JSComponent {

  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private Union4<String, CanvasGradient, CanvasPattern, Object> chessboard;

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());

  private String projectName;
  private boolean saved = true;
  private int savingCounter = 0;

  private final Z4Paper paper = new Z4Paper();

  /**
   * Creates the object
   */
  public Z4Canvas() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");

    this.resizeObserver.observe(this.canvas);

    this.canvas.width = Z4Constants.DEFAULT_IMAGE_SIZE;
    this.canvas.height = Z4Constants.DEFAULT_IMAGE_SIZE;
    this.appendNodeChild(this.canvas);

    this.addLayer(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, new Color(0, 0, 0, 0));
    this.saved = true;

    $Image image = ($Image) document.createElement("img");
    image.onload = event -> {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawCanvas();
      return null;
    };
    image.src = "image/chessboard.png";
  }

  /**
   * Creates a new project
   *
   * @param width The image width
   * @param height The image height
   * @param color The filling color
   * @param statusPanel The status panel to show the progress
   */
  public void create(int width, int height, Color color, Z4StatusPanel statusPanel) {
    this.paper.reset();
    this.paper.addLayer(width, height, color, width, height);
    this.afterCreate("", width, height, statusPanel);
    this.drawCanvas();
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   * @param statusPanel The status panel to show the progress
   */
  public void createFromFile(File file, Z4StatusPanel statusPanel) {
    FileReader fileReader = new FileReader();
    fileReader.onload = event -> this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), (String) fileReader.result, statusPanel);
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   *
   * @param statusPanel The status panel to show the progress
   */
  public void createFromClipboard(Z4StatusPanel statusPanel) {
    navigator.clipboard.read().then(items -> {
      items.forEach(item -> {
        String imageType = item.types.find((type, index, array) -> type.startsWith("image/"));

        item.getType(imageType).then(blob -> {
          this.createFromURL("", URL.createObjectURL(blob), statusPanel);
        });
      });
    });
  }

  private Object createFromURL(String projectName, String url, Z4StatusPanel statusPanel) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.reset();
      this.paper.addLayerFromImage(image, (int) image.width, (int) image.height);
      this.afterCreate(projectName, image.width, image.height, statusPanel);
      this.drawCanvas();
      return null;
    };

    image.src = url;
    return null;
  }

  private void afterCreate(String projectName, double width, double height, Z4StatusPanel statusPanel) {
    this.projectName = projectName;
    statusPanel.setProjectName(projectName);
    this.saved = true;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param statusPanel The status panel to show the progress
   * @param apply The function to call after saving
   */
  public void saveProject(String projectName, Z4StatusPanel statusPanel, $Apply_0_Void apply) {
    $JSZip zip = new $JSZip();

    this.projectName = projectName;
    statusPanel.setProjectName(projectName);
    this.savingCounter = 0;

    final Array<String> layers = new Array<>();
    for (int index = 0; index < this.paper.getLayersCount(); index++) {
      final int idx = index;
      final Z4Layer layer = this.paper.getLayerAt(idx);

      layer.convertToBlob(blob -> {
        Point offset = layer.getOffset();
        layers.push(
                "{"
                + "\"offsetX\": " + offset.x + ","
                + "\"offsetY\": " + offset.y
                + "}"
        );

        zip.file("layers/layer" + idx + ".png", blob, null);
        this.savingCounter++;

        if (this.savingCounter == this.paper.getLayersCount()) {
          String manifest
                  = "{"
                  + "\"projectName\": \"" + this.projectName + "\",\n"
                  + "\"layers\": [" + layers.join(",") + "]"
                  + "}";
          zip.file("manifest.json", manifest, null);

          $Object options = new $Object();
          options.$set("type", "blob");
          options.$set("compression", "DEFLATE");
          options.$set("streamFiles", true);

          $Object compressionOptions = new $Object();
          compressionOptions.$set("level", 9);
          options.$set("compressionOptions", compressionOptions);

          zip.generateAsync(options, metadata -> statusPanel.setProgressBarValue(metadata.$get("percent"))).then(zipped -> {
            saveAs(zipped, this.projectName + ".z4i");
            statusPanel.setProgressBarValue(0);
            this.saved = true;

            if ($exists(apply)) {
              apply.$apply();
            }
          });
        }
      });
    }
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
    $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.width, this.canvas.height);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    this.paper.draw(offscreenCtx);

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
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   * @param color The filling color
   */
  public void addLayer(int width, int height, Color color) {
    this.paper.addLayer(width, height, color, (int) this.canvas.width, (int) this.canvas.height);
    this.afterAddLayer();
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
  public void addLayerFromFile(File file) {
    FileReader fileReader = new FileReader();
    fileReader.onload = event -> this.addLayerFromURL((String) fileReader.result);
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
          this.addLayerFromURL(URL.createObjectURL(blob));
        });
      });
    });
  }

  private Object addLayerFromURL(String url) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.addLayerFromImage(image, (int) this.canvas.width, (int) this.canvas.height);
      this.afterAddLayer();
      this.drawCanvas();
      return null;
    };

    image.src = url;
    return null;
  }

  private void afterAddLayer() {
    Dimension dimension = this.paper.getSize();
    int shiftX = (int) (dimension.width - this.canvas.width) / 2;
    int shiftY = (int) (dimension.height - this.canvas.height) / 2;
    this.paper.shift(shiftX, shiftY);

    this.saved = false;

    this.canvas.width = dimension.width;
    this.canvas.height = dimension.height;
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
  public String getProjectName() {
    return this.projectName;
  }

//  /**
//   * Sets this canvas as saved
//   */
//  public void setSaved() {
//    this.saved = true;
//  }
  /**
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
  public boolean isSaved() {
    return this.saved;
  }

  private void drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.paper.draw(this.ctx);
  }
}
