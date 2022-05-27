package giada.pizzapazza.iterator;

/**
 * The drawing action of a Z4PointIterator
 *
 * @author gianpiero.di.blasi
 */
public class Z4Action {

  /**
   * The start
   */
  public final static Z4Action START = new Z4Action();
  /**
   * The continue
   */
  public final static Z4Action CONTINUE = new Z4Action();
  /**
   * The stop
   */
  public final static Z4Action STOP = new Z4Action();

  private Z4Action() {
  }
}
