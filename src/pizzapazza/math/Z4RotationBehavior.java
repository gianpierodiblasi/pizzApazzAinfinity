package pizzapazza.math;

/**
 * The behavior of a rotation
 *
 * @author gianpiero.diblasi
 */
public enum Z4RotationBehavior {
  /**
   * The rotation is computed on a fixed value
   */
  FIXED,
  /**
   * The rotation is computed by cumulating previous rotation
   */
  CUMULATIVE,
  /**
   * The rotation is computed relative to a path
   */
  RELATIVE_TO_PATH;
}
