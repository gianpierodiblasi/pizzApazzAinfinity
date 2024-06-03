package pizzapazza.math;

/**
 * The behavior of a random value
 *
 * @author gianpiero.diblasi
 */
public enum Z4RandomValueBehavior {
  /**
   * The random value generates "classic "random values
   */
  CLASSIC,
  /**
   * The random value generates random values on a bezier curve
   */
  BEZIER,
  /**
   * The random value generates random values on a polyline
   */
  POLYLINE,
  /**
   * The random value generates random values on a stepped line
   */
  STEPPED;
}
