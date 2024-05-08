/**
 * The object representing a paper
 *
 * @author gianpiero.diblasi
 */
class Z4Paper {

   layers = new Array();

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   */
   addLayer(width, height) {
    this.layers.push(new Z4Layer(width, height));
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   */
   drawPaper(ctx) {
    this.layers.forEach(layer => layer.drawLayer(ctx));
  }
}
