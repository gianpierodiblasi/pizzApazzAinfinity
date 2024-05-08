package pizzapazza.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.File;
import def.dom.FileReader;
import static def.dom.Globals.document;
import javascript.swing.JSComponent;
import jsweet.util.union.Union4;
import pizzapazza.Z4Constants;
import pizzapazza.Z4Paper;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
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

  private String filename;
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
   * Opens an image
   *
   * @param file The file
   */
  public void openFromDevice(File file) {
    this.filename = file.name;

    FileReader fileReader = new FileReader();
    fileReader.onload = event -> {
      if (Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.indexOf(file.name.toLowerCase().substring(file.name.lastIndexOf('.'))) != -1) {
        $Image image = ($Image) document.createElement("img");

        image.onload = event2 -> {
          this.canvas.width = image.width;
          this.canvas.height = image.height;

          this.paper.reset();
          this.paper.addLayerFromImage(image);
          this.drawCanvas();
          return null;
        };

        image.src = (String) fileReader.result;
      } else {
        //Z4 IMAGE!!!
      }

      return null;
    };
    fileReader.readAsDataURL(file);
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

  private void drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.paper.drawPaper(this.ctx);
  }
}
