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
import pizzapazza.painter.Z4BrushPainter;
import pizzapazza.painter.Z4CenteredFigurePainter;
import pizzapazza.painter.Z4DropPainter;
import pizzapazza.painter.Z4NaturalFigurePainter;
import pizzapazza.painter.Z4Painter;
import pizzapazza.painter.Z4PatternPainter;
import pizzapazza.painter.Z4Shape2DPainter;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The tool to perform a drawing
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingTool implements Z4Nextable<Z4DrawingPoint> {

  private final String name;
  private final Z4PointIterator pointIterator;
  private final Z4Painter painter;
  private final Z4SpatioTemporalColor spatioTemporalColor;
  private final Z4ColorProgression progression;

  /**
   * Creates the object
   *
   * @param name The name
   * @param pointIterator The point iterator
   * @param painter The painter
   * @param spatioTemporalColor The spatio-temporal color
   * @param progression The color progression
   */
  public Z4DrawingTool(String name, Z4PointIterator pointIterator, Z4Painter painter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    super();

    this.name = name;
    this.pointIterator = pointIterator;
    this.painter = painter;
    this.spatioTemporalColor = spatioTemporalColor;
    this.progression = progression;
  }

  /**
   * Returns the name
   *
   * @return The name
   */
  public String getName() {
    return this.name;
  }

  /**
   * Returns the point iterator
   *
   * @return the point iterator
   */
  public Z4PointIterator getPointIterator() {
    return this.pointIterator;
  }

  /**
   * Returns the painter
   *
   * @return The painter
   */
  public Z4Painter getPainter() {
    return this.painter;
  }

  /**
   * Returns the spatio-temporal color
   *
   * @return The spatio-temporal color
   */
  public Z4SpatioTemporalColor getSpatioTemporalColor() {
    return this.spatioTemporalColor;
  }

  /**
   * Returns the color progression
   *
   * @return The color progression
   */
  public Z4ColorProgression getProgression() {
    return this.progression;
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
    return this.pointIterator.drawAction(action, this.progression, x, y);
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
   * Returns the count of next points to draw on STOP action
   *
   * @return The count of next points to draw on STOP action
   */
  public int getNextCountOnSTOP() {
    return this.pointIterator.getNextCountOnSTOP();
  }

  /**
   * Checks if the Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if the Z4PointIterator is an infinite point generator, false
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

  /**
   * Checks if the Z4PointIterator has to draw bounds while moving (for example
   * a Z4Tracer with drawing mode property equals to RULER)
   *
   * @return true if the Z4PointIterator has to draw bounds while moving, false
   * otherwise
   */
  public boolean isDrawBoundsWhileMoving() {
    return this.pointIterator.isDrawBoundsWhileMoving();
  }

  /**
   * Checks if the Z4PointIterator uses the shapes &amp; paths (for example a
   * Z4Tracer with drawing mode property equals to SHAPES_AND_PATHS)
   *
   * @return true if the Z4PointIterator uses the shapes &amp; paths, false
   * otherwise
   */
  public boolean useShapesAndPaths() {
    return this.pointIterator.useShapesAndPaths();
  }

  @Override

  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("name", this.name);
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
      case "DROP":
        painter = Z4DropPainter.fromJSON(painterJSON);
        break;
      case "BRUSH":
        painter = Z4BrushPainter.fromJSON(painterJSON);
        break;
      case "PATTERN":
        painter = Z4PatternPainter.fromJSON(painterJSON);
        break;
      case "CENTERED_FIGURE":
        painter = Z4CenteredFigurePainter.fromJSON(painterJSON);
        break;
      case "NATURAL_FIGURE":
        painter = Z4NaturalFigurePainter.fromJSON(painterJSON);
        break;
    }

    return new Z4DrawingTool(
            json.$get("name"),
            pointIterator,
            painter,
            Z4SpatioTemporalColor.fromJSON(json.$get("spatioTemporalColor")),
            Z4ColorProgression.fromJSON(json.$get("progression"))
    );
  }
}
