/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasIOManager {

   canvas = null;

   paper = null;

   size = null;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   */
  constructor(canvas, paper) {
    this.canvas = canvas;
    this.paper = paper;
  }

   exportTo(ext, quality, apply) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () => {
      let offscreen = new OffscreenCanvas(this.size.width, this.size.height);
      let offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false, false);
      let options = new Object();
      options["type"] = ext === ".png" ? "image/png" : "image/jpeg";
      options["quality"] = quality;
      offscreen.convertToBlob(options).then(blob => {
        apply(blob);
      });
    });
  }
}
