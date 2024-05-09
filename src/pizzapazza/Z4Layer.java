package pizzapazza;

import javascript.awt.Dimension;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
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
  private final int width;
  private final int height;

  /**
   * Creates the object
   *
   * @param width The layer width
   * @param height The layer height
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  public Z4Layer(int width, int height, int containerWidth, int containerHeight) {
    this.offscreen = new $OffscreenCanvas(width, height);
    this.offscreenCtx = this.offscreen.getContext("2d");

    this.offsetX = (containerWidth - width) / 2;
    this.offsetY = (containerHeight - height) / 2;
    this.width = width;
    this.height = height;
  }

  /**
   * Creates a Z4Layer from an image
   *
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   * @return The layer
   */
  public static Z4Layer fromImage($Image image, int containerWidth, int containerHeight) {
    Z4Layer layer = new Z4Layer((int) image.width, (int) image.height, containerWidth, containerHeight);
    layer.offscreenCtx.drawImage(image, 0, 0);
    return layer;
  }

  /**
   * Shifts the layer
   *
   * @param shiftX The X shift
   * @param shiftY The Y shift
   */
  public void shift(int shiftX, int shiftY) {
    this.offsetX += shiftX;
    this.offsetY += shiftY;
  }

  /**
   * Moves a layer
   *
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
  public void move(int offsetX, int offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Returns the layer size
   *
   * @return The layer size
   */
  public Dimension getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   */
  public void draw($CanvasRenderingContext2D ctx) {
    ctx.drawImage(this.offscreen, this.offsetX, this.offsetY);
  }
}
