package pizzapazza;

import def.js.Array;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The object representing a paper
 *
 * @author gianpiero.diblasi
 */
public class Z4Paper {

  private final Array<Z4Layer> layers = new Array<>();

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   */
  public void addLayer(int width, int height) {
    this.layers.push(new Z4Layer(width, height));
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   */
  public void drawPaper($CanvasRenderingContext2D ctx) {
    this.layers.forEach(layer -> layer.drawLayer(ctx));
  }
}
