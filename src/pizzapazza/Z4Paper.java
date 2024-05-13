package pizzapazza;

import def.js.Array;
import javascript.awt.Color;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;

/**
 * The object representing a paper
 *
 * @author gianpiero.diblasi
 */
public class Z4Paper {

  private final Array<Z4Layer> layers = new Array<>();

  /**
   * Returns the layers count
   *
   * @return The layers count
   */
  public int getLayersCount() {
    return this.layers.length;
  }

  /**
   * Returns a layer
   *
   * @param index The index layer
   * @return The layer
   */
  public Z4Layer getLayerAt(int index) {
    return this.layers.$get(index);
  }

  /**
   * Adds a layer
   *
   * @param name The layer name
   * @param width The layer width
   * @param height The layer height
   * @param color The filling color
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  public void addLayer(String name, int width, int height, Color color, int containerWidth, int containerHeight) {
    this.layers.push(new Z4Layer(name, width, height, color, containerWidth, containerHeight));
  }

  /**
   * Adds a layer from an image
   *
   * @param name The layer name
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  public void addLayerFromImage(String name, $Image image, int containerWidth, int containerHeight) {
    this.layers.push(Z4Layer.fromImage(name, image, containerWidth, containerHeight));
  }

  /**
   * Resets the paper
   */
  public void reset() {
    this.layers.length = 0;
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   * @param noOffset true to not use the offset, false otherwise
   */
  public void draw($CanvasRenderingContext2D ctx, boolean noOffset) {
    this.layers.forEach(layer -> layer.draw(ctx, noOffset));
  }
}
