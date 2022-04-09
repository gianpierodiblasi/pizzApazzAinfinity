package giada.pizzapazza.color;

/**
 * The progression of a color
 *
 * @author gianpiero.di.blasi
 */
public class Z4Progression {

  /**
   * The spatial progression
   */
  public final static Z4Progression SPATIAL = new Z4Progression();
  /**
   * The temporal progression
   */
  public final static Z4Progression TEMPORAL = new Z4Progression();
  /**
   * The progression relative to a path
   */
  public final static Z4Progression RELATIVE_TO_PATH = new Z4Progression();
  /**
   * The random progression
   */
  public final static Z4Progression RANDOM = new Z4Progression();

  private Z4Progression() {
  }
}
