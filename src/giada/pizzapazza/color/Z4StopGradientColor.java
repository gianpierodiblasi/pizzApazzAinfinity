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
    return this.position;
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

  /**
   * Creates a Z4StopGradientColor from a Z4AbstractGradientColor
   *
   * @param color The Z4AbstractGradientColor
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopGradientColor
   */
  public static Z4StopGradientColor fromZ4AbstractGradientColor(Z4AbstractGradientColor<?> color, double position) {
    Z4StopGradientColor z4StopGradientColor = new Z4StopGradientColor(position);
    color.getComponents().forEach(z4StopColor -> z4StopGradientColor.addOrUpdateColor(z4StopColor.getPosition(), z4StopColor.getARGB()));
    return z4StopGradientColor.setRipple(color.getRipple()).setMirrored(color.isMirrored());
  }
}
