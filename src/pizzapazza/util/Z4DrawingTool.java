package pizzapazza.util;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4Airbrush;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.iterator.Z4Scatterer;
import pizzapazza.iterator.Z4Spirograph;
import pizzapazza.iterator.Z4Stamper;
import pizzapazza.iterator.Z4Tracer;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4Nextable;
import pizzapazza.painter.Z4ArrowPainter;
import pizzapazza.painter.Z4Painter;
import pizzapazza.painter.Z4Shape2DPainter;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The tool to perform a drawing
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingTool implements Z4Nextable<Z4DrawingPoint> {

  private final Z4PointIterator pointIterator;
  private final Z4Painter painter;
  private final Z4SpatioTemporalColor spatioTemporalColor;
  private final Z4ColorProgression progression;

  /**
   * Creates the object
   *
   * @param pointIterator The point iterator
   * @param painter The painter
   * @param spatioTemporalColor The spatio-temporal color
   * @param progression The color progression
   */
  public Z4DrawingTool(Z4PointIterator pointIterator, Z4Painter painter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    super();

    this.pointIterator = pointIterator;
    this.painter = painter;
    this.spatioTemporalColor = spatioTemporalColor;
    this.progression = progression;
  }

  /**
   * Returns the point iterator
   *
   * @return the point iterator
   */
  public Z4PointIterator getPointIterator() {
    return pointIterator;
  }

  /**
   * Returns the painter
   *
   * @return The painter
   */
  public Z4Painter getPainter() {
    return painter;
  }

  /**
   * Returns the spatio-temporal color
   *
   * @return The spatio-temporal color
   */
  public Z4SpatioTemporalColor getSpatioTemporalColor() {
    return spatioTemporalColor;
  }

  /**
   * Returns the color progression
   *
   * @return The color progression
   */
  public Z4ColorProgression getProgression() {
    return progression;
  }

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
    return this.pointIterator.next(this.spatioTemporalColor, this.progression);
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint) {
    this.painter.draw(context, drawingPoint, this.spatioTemporalColor, this.progression);
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
    json.$set("pointIterator", this.pointIterator.toJSON());
    json.$set("painter", this.painter.toJSON());
    json.$set("spatioTemporalColor", this.spatioTemporalColor.toJSON());
    json.$set("progression", this.progression.toJSON());
    return json;
  }

  /**
   * Creates a Z4DrawingTool from a JSON object
   *
   * @param json The JSON object
   * @return the drawing tool
   */
  public static Z4DrawingTool fromJSON($Object json) {
    Z4PointIterator pointIterator = null;
    Z4Painter painter = null;

    $Object pointIteratorJSON = json.$get("pointIterator");
    switch ("" + pointIteratorJSON.$get("type")) {
      case "STAMPER":
        pointIterator = Z4Stamper.fromJSON(pointIteratorJSON);
        break;
      case "TRACER":
        pointIterator = Z4Tracer.fromJSON(pointIteratorJSON);
        break;
      case "AIRBRUSH":
        pointIterator = Z4Airbrush.fromJSON(pointIteratorJSON);
        break;
      case "SPIROGRAPH":
        pointIterator = Z4Spirograph.fromJSON(pointIteratorJSON);
        break;
      case "SCATTERER":
        pointIterator = Z4Scatterer.fromJSON(pointIteratorJSON);
        break;
    }

    $Object painterJSON = json.$get("painter");
    switch ("" + painterJSON.$get("type")) {
      case "ARROW":
        painter = new Z4ArrowPainter();
        break;
      case "SHAPE_2D":
        painter = Z4Shape2DPainter.fromJSON(painterJSON);
        break;
    }

    return new Z4DrawingTool(
            pointIterator,
            painter,
            Z4SpatioTemporalColor.fromJSON(json.$get("spatioTemporalColor")),
            Z4ColorProgression.fromJSON(json.$get("progression"))
    );
  }
}
