/**
 * The rotation of a Z4PointIterator
 *
 * @author gianpiero.di.blasi
 */
class Z4Rotation {

  /**
   * Next rotation is computed on a fixed value
   */
  static  FIXED = new Z4Rotation();

  /**
   * Next rotation is computed by cumulating previous rotation
   */
  static  CUMULATIVE = new Z4Rotation();

  /**
   * Next rotation is computed relative to a path
   */
  static  RELATIVE_TO_PATH = new Z4Rotation();

  constructor() {
  }
}
