/**
 * The boundary behavior of a filler
 *
 * @author gianpiero.diblasi
 */
class Z4BoundaryBehavior {

  /**
   * The filler does nothing outside the boundary
   */
  static STOP_AT_BOUNDARY = 'STOP_AT_BOUNDARY';
  /**
   * The filler uses the last color outside the boundary
   */
  static FILL_AT_BOUNDARY = 'FILL_AT_BOUNDARY';
  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  static SYMMETRIC_AT_BOUNDARY = 'SYMMETRIC_AT_BOUNDARY';
  /**
   * The filler restarts the color outside the boundary
   */
  static REPEAT_AT_BOUNDARY = 'REPEAT_AT_BOUNDARY';
}
