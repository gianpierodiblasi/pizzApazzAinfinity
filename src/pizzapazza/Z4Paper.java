package pizzapazza;

import def.js.Array;
import javascript.awt.Color;
import javascript.awt.Dimension;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import static simulation.js.$Globals.$exists;

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
   * @param width The layer width
   * @param height The layer height
   * @param color The filling color
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  public void addLayer(int width, int height, Color color, int containerWidth, int containerHeight) {
    this.layers.push(new Z4Layer(width, height, color, containerWidth, containerHeight));
  }

  /**
   * Adds a layer from an image
   *
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  public void addLayerFromImage($Image image, int containerWidth, int containerHeight) {
    this.layers.push(Z4Layer.fromImage(image, containerWidth, containerHeight));
  }

  /**
   * Resets the paper
   */
  public void reset() {
    this.layers.length = 0;
  }

  /**
   * Shifts all the layers
   *
   * @param shiftX The X shift
   * @param shiftY The Y shift
   */
  public void shift(int shiftX, int shiftY) {
    this.layers.forEach(layer -> layer.shift(shiftX, shiftY));
  }

  /**
   * Returns the paper size, given by the max width and max height of the layers
   *
   * @return The paper size
   */
  public Dimension getSize() {
    return this.layers.map(layer -> layer.getSize()).reduce((accumulator, currentValue, index, array) -> $exists(accumulator) ? new Dimension(Math.max(accumulator.width, currentValue.width), Math.max(accumulator.height, currentValue.height)) : currentValue);
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   */
  public void draw($CanvasRenderingContext2D ctx) {
    this.layers.forEach(layer -> layer.draw(ctx));
  }
}
