package pizzapazza.util;

import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4Nextable;
import pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The tool to perform a drawing
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingTool implements Z4Nextable<Z4DrawingPoint> {

  private Z4PointIterator pointIterator;
  private Z4Painter painter;
  private Z4SpatioTemporalColor spatioTemporalColor;

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    return this.pointIterator.drawAction(action, x, y);
  }

  @Override
  public Z4DrawingPoint next() {
    return this.pointIterator.next();
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint) {
    this.painter.draw(context, drawingPoint, this.spatioTemporalColor);
  }

  /**
   * Checks if this Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if this Z4PointIterator is an infinite point generator, false
   * otherwise
   */
  public boolean isInfinitePointGenerator() {
    return this.pointIterator.isInfinitePointGenerator();
  }

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
  public int getInfinitePointGeneratorSleep() {
    return this.pointIterator.getInfinitePointGeneratorSleep();
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("pointIterator", this.pointIterator);
    json.$set("painter", this.painter);
    json.$set("spatioTemporalColor", this.spatioTemporalColor);
    return json;
  }
}
