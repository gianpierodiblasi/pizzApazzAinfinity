/**
 * The stop gradient color in a sequence
 *
 * @author gianpiero.di.blasi
 */
class Z4StopGradientColor extends Z4AbstractGradientColor {

   position = 0.0;

  /**
   * Creates a Z4StopGradientColor
   *
   * @param position The position in a sequence (in the range [0,1])
   */
  constructor(position) {
    super();
    this.position = position;
  }

  /**
   * Returns the position
   *
   * @return The position in a sequence (in the range [0,1])
   */
   getPosition() {
    return position;
  }

  /**
   * Sets the position
   *
   * @param position The position in a sequence (in the range [0,1])
   * @return This Z4StopGradientColor
   */
   setPosition(position) {
    this.position = position;
    return this;
  }
}
