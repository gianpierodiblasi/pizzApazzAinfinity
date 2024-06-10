/**
 * The common parent of all point iterators
 *
 * @author gianpiero.diblasi
 */
class Z4PointIterator extends Z4JSONable {

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   draw(action, x, y) {
  }
}
