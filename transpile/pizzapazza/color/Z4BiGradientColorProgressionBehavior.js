/**
 * The behavior of a progression of a bigradient color
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorProgressionBehavior {

  /**
   * The bigradient color is used temporally (the bigradient color returns a
   * gradient color every time)
   */
  static TEMPORAL = 'TEMPORAL';
  /**
   * The bigradient color is used temporally relative to a length of a path (the
   * bigradient color returns a gradient color every time)
   */
  static RELATIVE_TO_PATH = 'RELATIVE_TO_PATH';
  /**
   * The bigradient color returns a random gradient color every time
   */
  static RANDOM = 'RANDOM';
}
