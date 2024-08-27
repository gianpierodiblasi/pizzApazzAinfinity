/**
 * The common parent of all painters
 *
 * @author gianpiero.diblasi
 */
class Z4Painter extends Z4JSONable {

  /**
   * Returns the painter type
   *
   * @return The painter type
   */
   getType() {
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   * @param spatioTemporalColor The color to use to perform the drawing
   * @param progression The color progression to use to perform the drawing
   * @param kaleidoscope The kaleidoscope to use to perform the drawing
   */
   draw(context, drawingPoint, spatioTemporalColor, progression, kaleidoscope) {
  }

   toJSON() {
    let json = new Object();
    json["type"] = this.getType();
    return json;
  }
}
