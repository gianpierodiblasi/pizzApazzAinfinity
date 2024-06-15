package pizzapazza.color;

/**
 * The behavior of a progression of a color (flat, gradient, bigradient)
 *
 * @author gianpiero.diblasi
 */
public enum Z4ColorProgressionBehavior {

  /**
   * The color is used spatially
   */
  SPATIAL,
  /**
   * The color is used temporally
   */
  TEMPORAL,
  /**
   * The color is used temporally relative to the length of a path
   */
  RELATIVE_TO_PATH,
  /**
   * The color is randomly selected
   */
  RANDOM;
}
