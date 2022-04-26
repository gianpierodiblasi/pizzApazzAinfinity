package giada.pizzapazza.iterator;

/**
 * The rotation of a Z4PointIterator
 *
 * @author gianpiero.di.blasi
 */
public class Z4Rotation {

  /**
   * Next rotation is computed on a fixed value
   */
  public static final Z4Rotation FIXED = new Z4Rotation();
  /**
   * Next rotation is computed by cumulating previous rotation
   */
  public static final Z4Rotation CUMULATIVE = new Z4Rotation();
  /**
   * Next rotation is computed relative to a path
   */
  public static final Z4Rotation RELATIVE_TO_PATH = new Z4Rotation();

  private Z4Rotation() {
  }
}
