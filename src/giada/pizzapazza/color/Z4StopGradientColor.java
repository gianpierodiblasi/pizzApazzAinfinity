package giada.pizzapazza.color;

/**
 * The stop gradient color in a sequence
 *
 * @author gianpiero.di.blasi
 */
public class Z4StopGradientColor extends Z4AbstractGradientColor<Z4StopGradientColor> {

  private double position;

  /**
   * Creates a Z4StopGradientColor
   *
   * @param position The position in a sequence (in the range [0,1])
   */
  public Z4StopGradientColor(double position) {
    super();

    this.position = position;
  }

  /**
   * Returns the position
   *
   * @return The position in a sequence (in the range [0,1])
   */
  public double getPosition() {
    return position;
  }

  /**
   * Sets the position
   *
   * @param position The position in a sequence (in the range [0,1])
   * @return This Z4StopGradientColor
   */
  public Z4StopGradientColor setPosition(double position) {
    this.position = position;
    return this;
  }
}
