package giada.pizzapazza.color;

/**
 * The lighting of a color
 *
 * @author gianpiero.di.blasi
 */
public class Z4Lighting {

  /**
   * No lighting
   */
  public static final Z4Lighting NONE = new Z4Lighting();
  /**
   * lighting
   */
  public static final Z4Lighting LIGTHED = new Z4Lighting();
  /**
   * darkening
   */
  public static final Z4Lighting DARKENED = new Z4Lighting();

  private Z4Lighting() {
  }
}
