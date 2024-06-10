package pizzapazza.color;

/**
 * The behavior of a progression of a bigradient color
 *
 * @author gianpiero.diblasi
 */
public enum Z4BiGradientColorProgressionBehavior {

  /**
   * The bigradient color is used temporally (the bigradient color returns a
   * gradient color every time)
   */
  TEMPORAL,
  /**
   * The bigradient color is used temporally relative to a length of a path (the
   * bigradient color returns a gradient color every time)
   */
  RELATIVE_TO_PATH,
  /**
   * The bigradient color returns a random gradient color every time
   */
  RANDOM;
}
