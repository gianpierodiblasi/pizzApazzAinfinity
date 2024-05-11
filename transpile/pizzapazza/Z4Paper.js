/**
 * The object representing a paper
 *
 * @author gianpiero.diblasi
 */
class Z4Paper {

   layers = new Array();

  /**
   * Returns the layers count
   *
   * @return The layers count
   */
   getLayersCount() {
    return this.layers.length;
  }

  /**
   * Returns a layer
   *
   * @param index The index layer
   * @return The layer
   */
   getLayerAt(index) {
    return this.layers[index];
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
   addLayer(width, height, color, containerWidth, containerHeight) {
    this.layers.push(new Z4Layer(width, height, color, containerWidth, containerHeight));
  }

  /**
   * Adds a layer from an image
   *
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
   addLayerFromImage(image, containerWidth, containerHeight) {
    this.layers.push(Z4Layer.fromImage(image, containerWidth, containerHeight));
  }

  /**
   * Resets the paper
   */
   reset() {
    this.layers.length = 0;
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   */
   draw(ctx) {
    this.layers.forEach(layer => layer.draw(ctx));
  }
}
