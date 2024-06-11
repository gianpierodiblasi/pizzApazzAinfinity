package pizzapazza.color;

/**
 * The behavior of a progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
public enum Z4GradientColorProgressionBehavior {

  /**
   * The gradient color is used spatially (the gradient color returns a gradient
   * at all times)
   */
  SPATIAL,
  /**
   * The gradient color is used temporally (the gradient color returns a flat
   * color every time)
   */
  TEMPORAL,
  /**
   * The gradient color is used temporally relative to a length of a path (the
   * gradient color returns a flat color every time)
   */
  RELATIVE_TO_PATH,
  /**
   * The gradient color returns a random flat color every time
   */
  RANDOM;
}
