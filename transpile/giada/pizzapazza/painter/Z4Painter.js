/**
 * The common parent of all painters
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4Painter {

  /**
   * Performs a drawing
   *
   * @param context The context to perform the drawing
   * @param point The point where to perform the drawing
   * @param gradientColor The color to use to perform the drawing
   * @return This Z4Painter
   */
   draw(context, point, gradientColor) {
  }

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
   getColor(color) {
    return color;
  }
}
