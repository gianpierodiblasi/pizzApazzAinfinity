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
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
   addLayer(width, height, containerWidth, containerHeight) {
    this.layers.push(new Z4Layer(width, height, containerWidth, containerHeight));
  }

  /**
   * Adds a layer from an aimeg
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
   * Shifts all the layers
   *
   * @param shiftX The X shift
   * @param shiftY The Y shift
   */
   shift(shiftX, shiftY) {
    this.layers.forEach(layer => layer.shift(shiftX, shiftY));
  }

  /**
   * Returns the paper size, given by the max width and max height of the layers
   *
   * @return The paper size
   */
   getSize() {
    return this.layers.map(layer => layer.getSize()).reduce((accumulator, currentValue, index, array) => accumulator ? new Dimension(Math.max(accumulator.width, currentValue.width), Math.max(accumulator.height, currentValue.height)) : currentValue);
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
