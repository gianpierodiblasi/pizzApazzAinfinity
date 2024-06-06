/**
 * The behavior of a progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorProgressionBehavior {

  /**
   * The gradient color is used spatially (the gradient color returns a gradient
   * at all times)
   */
  static SPATIAL = 'SPATIAL';
  /**
   * The gradient color is used temporally (the gradient color returns a flat
   * color every time)
   */
  static TEMPORAL = 'TEMPORAL';
  /**
   * The gradient color is used temporally relative to a length of a path (the
   * gradient color returns a flat color every time)
   */
  static RELATIVE_TO_PATH = 'RELATIVE_TO_PATH';
  /**
   * The gradient color returns a random flat color every time
   */
  static RANDOM = 'RANDOM';
}
