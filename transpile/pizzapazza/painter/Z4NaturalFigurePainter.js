/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainter extends Z4Painter {

  /**
   * Creates the object
   */
  constructor() {
    super();
  }

   getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
  }

   toJSON() {
    let json = super.toJSON();
    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  static  fromJSON(json) {
    return new Z4NaturalFigurePainter();
  }
}
