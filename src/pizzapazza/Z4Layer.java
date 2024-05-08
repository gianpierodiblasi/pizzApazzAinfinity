package pizzapazza;

import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;

/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
public class Z4Layer {

  private final $OffscreenCanvas offscreen;
  private final $CanvasRenderingContext2D offscreenCtx;

  private int offsetX = 0;
  private int offsetY = 0;

  /**
   * Creates the object
   *
   * @param width The layer width
   * @param height The layer height
   */
  public Z4Layer(int width, int height) {
    this.offscreen = new $OffscreenCanvas(width, height);
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
  public void shiftLayer(int offsetX, int offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   */
  public void drawLayer($CanvasRenderingContext2D ctx) {
    ctx.drawImage(this.offscreen, this.offsetX, this.offsetY);
  }
}
