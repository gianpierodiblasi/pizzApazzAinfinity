/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = null;

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   paper = new Z4Paper();

  static  WIDTH = 500;

  static  HEIGHT = 500;

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.resizeObserver.observe(this.canvas);
    this.canvas.width = Z4Canvas.WIDTH;
    this.canvas.height = Z4Canvas.HEIGHT;
    this.appendNodeChild(this.canvas);
    this.addLayer(Z4Canvas.WIDTH, Z4Canvas.HEIGHT);
    let image = document.createElement("img");
    image.onload = event => {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawCanvas();
      return null;
    };
    image.src = "image/chessboard.png";
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   */
   addLayer(width, height) {
    this.paper.addLayer(width, height);
    this.drawCanvas();
  }

   drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.paper.drawPaper(this.ctx);
  }
}
