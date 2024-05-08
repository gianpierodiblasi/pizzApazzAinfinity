/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
class Z4Layer {

   offscreen = null;

   offscreenCtx = null;

   offsetX = 0;

   offsetY = 0;

  /**
   * Creates the object
   *
   * @param width The layer width
   * @param height The layer height
   */
  constructor(width, height) {
    this.offscreen = new OffscreenCanvas(width, height);
    this.offscreenCtx = this.offscreen.getContext("2d");
  }

  /**
   * Shifts the layer
   *
   * @param offsetX The X offset from the upper left corner of the container
   * paper
   * @param offsetY The Y offset from the upper left corner of the container
   * paper
   */
   shiftLayer(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   */
   drawLayer(ctx) {
    ctx.drawImage(this.offscreen, this.offsetX, this.offsetY);
  }
}
