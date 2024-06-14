/**
 * The behavior of a progression of a color (flat, gradient, bigradient)
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgressionBehavior {

  /**
   * The color is used spatially
   */
  static SPATIAL = 'SPATIAL';
  /**
   * The color is used temporally
   */
  static TEMPORAL = 'TEMPORAL';
  /**
   * The color is used temporally relative to the length of a path
   */
  static RELATIVE_TO_PATH = 'RELATIVE_TO_PATH';
  /**
   * The color is randomly selected
   */
  static RANDOM = 'RANDOM';
  /**
   * The color is used spatially relative to the length of a radius
   */
  static RADIAL = 'RADIAL';
}
