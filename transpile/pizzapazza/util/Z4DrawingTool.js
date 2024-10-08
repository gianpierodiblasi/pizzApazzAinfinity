/**
 * The tool to perform a drawing
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingTool extends Z4Nextable {

   name = null;

   pointIterator = null;

   painter = null;

   spatioTemporalColor = null;

   progression = null;

  /**
   * Creates the object
   *
   * @param name The name
   * @param pointIterator The point iterator
   * @param painter The painter
   * @param spatioTemporalColor The spatio-temporal color
   * @param progression The color progression
   */
  constructor(name, pointIterator, painter, spatioTemporalColor, progression) {
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
   getName() {
    return this.name;
  }

  /**
   * Returns the point iterator
   *
   * @return the point iterator
   */
   getPointIterator() {
    return this.pointIterator;
  }

  /**
   * Returns the painter
   *
   * @return The painter
   */
   getPainter() {
    return this.painter;
  }

  /**
   * Returns the spatio-temporal color
   *
   * @return The spatio-temporal color
   */
   getSpatioTemporalColor() {
    return this.spatioTemporalColor;
  }

  /**
   * Returns the color progression
   *
   * @return The color progression
   */
   getProgression() {
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
   drawAction(action, x, y) {
    return this.pointIterator.drawAction(action, this.progression, x, y);
  }

   next() {
    return this.pointIterator.next(this.spatioTemporalColor, this.progression);
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
   draw(context, drawingPoint) {
    this.painter.draw(context, drawingPoint, this.spatioTemporalColor, this.progression);
  }

  /**
   * Returns the count of next points to draw on STOP action
   *
   * @return The count of next points to draw on STOP action
   */
   getNextCountOnSTOP() {
    return this.pointIterator.getNextCountOnSTOP();
  }

  /**
   * Checks if the Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if the Z4PointIterator is an infinite point generator, false
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

  /**
   * Checks if the Z4PointIterator has to draw bounds while moving (for example
   * a Z4Tracer with drawing mode property equals to RULER)
   *
   * @return true if the Z4PointIterator has to draw bounds while moving, false
   * otherwise
   */
   isDrawBoundsWhileMoving() {
    return this.pointIterator.isDrawBoundsWhileMoving();
  }

  /**
   * Checks if the Z4PointIterator uses the shapes &amp; paths (for example a
   * Z4Tracer with drawing mode property equals to SHAPES_AND_PATHS)
   *
   * @return true if the Z4PointIterator uses the shapes &amp; paths, false
   * otherwise
   */
   useShapesAndPaths() {
    return this.pointIterator.useShapesAndPaths();
  }

   toJSON() {
    let json = new Object();
    json["name"] = this.name;
    json["pointIterator"] = this.pointIterator.toJSON();
    json["painter"] = this.painter.toJSON();
    json["spatioTemporalColor"] = this.spatioTemporalColor.toJSON();
    json["progression"] = this.progression.toJSON();
    return json;
  }

  /**
   * Creates a Z4DrawingTool from a JSON object
   *
   * @param json The JSON object
   * @return the drawing tool
   */
  static  fromJSON(json) {
    let pointIterator = null;
    let painter = null;
    let pointIteratorJSON = json["pointIterator"];
    switch("" + pointIteratorJSON["type"]) {
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
    let painterJSON = json["painter"];
    switch("" + painterJSON["type"]) {
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
    return new Z4DrawingTool(json["name"], pointIterator, painter, Z4SpatioTemporalColor.fromJSON(json["spatioTemporalColor"]), Z4ColorProgression.fromJSON(json["progression"]));
  }
}
