package pizzapazza.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.Event;
import def.dom.File;
import def.dom.FileReader;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.URL;
import javascript.swing.JSComponent;
import jsweet.util.union.Union4;
import pizzapazza.Z4Paper;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Object;
import simulation.js.$ResizeObserver;

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
  private final Z4Paper paper = new Z4Paper();

  private final static int WIDTH = 500;
  private final static int HEIGHT = 500;

  /**
   * Creates the object
   */
  public Z4Canvas() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");

    this.resizeObserver.observe(this.canvas);

    this.canvas.width = Z4Canvas.WIDTH;
    this.canvas.height = Z4Canvas.HEIGHT;
    this.appendNodeChild(this.canvas);

    this.addLayer(Z4Canvas.WIDTH, Z4Canvas.HEIGHT);

    $Image image = ($Image) document.createElement("img");
    image.onload = event -> {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawCanvas();
      return null;
    };
    image.src = "image/chessboard.png";
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
  public void createFromFile(File file) {
    FileReader fileReader = new FileReader();
    fileReader.onload = event -> {

      $Image image = ($Image) document.createElement("img");

      image.onload = event2 -> {
        this.projectName = file.name.substring(0, file.name.lastIndexOf('.'));

        this.canvas.width = image.width;
        this.canvas.height = image.height;

        this.paper.reset();
        this.paper.addLayerFromImage(image);
        this.drawCanvas();
        return null;
      };

      image.src = (String) fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

  /**
   * Exports this project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
  @SuppressWarnings({"StringEquality", "unchecked"})
  public void exportToFile(String filename, String ext, double quality) {
    $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.width, this.canvas.height);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    this.paper.drawPaper(offscreenCtx);

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
   */
  public void addLayer(int width, int height) {
    this.paper.addLayer(width, height);
    this.drawCanvas();
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
  public String getProjectName() {
    return this.projectName;
  }

  private void drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.paper.drawPaper(this.ctx);
  }
}
