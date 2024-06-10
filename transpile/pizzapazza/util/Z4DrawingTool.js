/**
 * The tool to perform a drawing
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingTool extends Z4Nextable {

   pointIterator = null;

   painter = null;

   spatioTemporalColor = null;

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   drawAction(action, x, y) {
    return this.pointIterator.drawAction(action, x, y);
  }

   next() {
    return this.pointIterator.next();
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
   draw(context, drawingPoint) {
    this.painter.draw(context, drawingPoint, this.spatioTemporalColor);
  }

  /**
   * Checks if this Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if this Z4PointIterator is an infinite point generator, false
   * otherwise
   */
   isInfinitePointGenerator() {
    return this.pointIterator.isInfinitePointGenerator();
  }

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
   getInfinitePointGeneratorSleep() {
    return this.pointIterator.getInfinitePointGeneratorSleep();
  }

   toJSON() {
    let json = new Object();
    json["pointIterator"] = this.pointIterator;
    json["painter"] = this.painter;
    json["spatioTemporalColor"] = this.spatioTemporalColor;
    return json;
  }
}
