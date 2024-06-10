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
   * @param name The layer name
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
   addLayer(name, width, height, filling, containerWidth, containerHeight) {
    this.layers.push(new Z4Layer(name, width, height, filling, containerWidth, containerHeight));
  }

  /**
   * Adds a layer from an image
   *
   * @param name The layer name
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
   addLayerFromImage(name, image, containerWidth, containerHeight) {
    this.layers.push(Z4Layer.fromImage(name, image, containerWidth, containerHeight));
  }

  /**
   * Deletes a layer
   *
   * @param layer The layer
   * @return The layer index
   */
   deleteLayer(layer) {
    let index = this.layers.indexOf(layer);
    this.layers.splice(index, 1);
    return index;
  }

  /**
   * Moves a layer to a position
   *
   * @param layer The layer
   * @param position The new position
   * @return true if the move has been performed, false otherwise
   */
   moveLayer(layer, position) {
    let newPosition = Math.min(this.layers.length, position);
    let currentPosition = this.layers.indexOf(layer);
    if (newPosition < currentPosition) {
      this.layers.splice(newPosition, 0, this.layers.splice(currentPosition, 1)[0]);
      return true;
    } else if (newPosition > currentPosition) {
      this.layers.splice(newPosition, 0, this.layers[currentPosition]);
      this.layers.splice(currentPosition, 1);
      return true;
    } else {
      return false;
    }
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
   * @param noOffset true to not use the offset, false otherwise
   * @param noHidden true to not use the hidden property, false otherwise
   */
   draw(ctx, noOffset, noHidden) {
    this.layers.forEach(layer => layer.draw(ctx, noOffset, noHidden));
  }
}
