package pizzapazza.math;

/**
 * The behavior of a sign
 *
 * @author gianpiero.diblasi
 */
public enum Z4SignBehavior {
  /**
   * The positive sign
   */
  POSITIVE,
  /**
   * The negative sign
   */
  NEGATIVE,
  /**
   * The random sign
   */
  RANDOM,
  /**
   * A sign providing the following sequence +1, -1, +1, -1, ...
   */
  ALTERNATE;
}
