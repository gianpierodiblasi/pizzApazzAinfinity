/**
 * The behavior of a rotation
 *
 * @author gianpiero.diblasi
 */
class Z4RotationBehavior {

  /**
   * The rotation is computed on a fixed value
   */
  static FIXED = 'FIXED';
  /**
   * The rotation is computed by cumulating previous rotation
   */
  static CUMULATIVE = 'CUMULATIVE';
  /**
   * The rotation is computed relative to a path
   */
  static RELATIVE_TO_PATH = 'RELATIVE_TO_PATH';
}
