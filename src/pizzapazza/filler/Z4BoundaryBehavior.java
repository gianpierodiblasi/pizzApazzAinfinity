package pizzapazza.filler;

/**
 * The boundary behavior of a filler
 *
 * @author gianpiero.diblasi
 */
public enum Z4BoundaryBehavior {

  /**
   * The filler does nothing outside the boundary
   */
  STOP_AT_BOUNDARY,
  /**
   * The filler uses the last color outside the boundary
   */
  FILL_AT_BOUNDARY,
  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  SYMMETRIC_AT_BOUNDARY,
  /**
   * The filler restarts the color outside the boundary
   */
  REPEAT_AT_BOUNDARY;
}
