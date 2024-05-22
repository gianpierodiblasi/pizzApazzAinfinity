package pizzapazza.color;

import def.js.Array;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * The abstract gradient color
 *
 * @author gianpiero.diblasi
 * @param <T> The type of color
 */
public abstract class Z4AbstractGradientColor<T> {

  /**
   * The array of colors
   */
  protected final Array<T> colors = new Array<>();

  /**
   * The array of positions
   */
  protected final Array<Double> colorPositions = new Array<>();

  private double ripple;

  /**
   * Adds a color in a position, if the position is already occupied then
   * replaces the color
   *
   * @param color The color
   * @param position The position (in the range [0,1])
   */
  @SuppressWarnings("unchecked")
  public void addColor(T color, double position) {
    int index = this.colorPositions.findIndex(pos -> pos == position);

    if (index != -1) {
      this.colors.$set(index, color);
    } else {
      index = this.colorPositions.findIndex(pos -> pos > position);

      if (index != -1) {
        this.colors.splice(index, 0, color);
        this.colorPositions.splice(index, 0, position);
      } else {
        this.colors.push(color);
        this.colorPositions.push(position);
      }
    }
  }

  /**
   * Removes a color by position, if the position is not occupied then no color
   * is removed
   *
   * @param position The position (in the range [0,1])
   */
  @SuppressWarnings("unchecked")
  public void removeColor(double position) {
    int index = this.colorPositions.findIndex(pos -> pos == position);

    if (index != -1) {
      this.colors.splice(index, 1);
      this.colorPositions.splice(index, 1);
    }
  }

  /**
   * Checks if a position is occupied
   *
   * @param position The position (in the range [0,1])
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   * @return true if the position is occupied, false otherwise
   */
  public boolean isPositionOccupied(double position, double tolerance) {
    return $exists(this.colorPositions.filter(pos -> Math.abs(pos - position) <= tolerance).length);
  }

  /**
   * Returns a position based on another position and a tolerance
   *
   * @param position The position (in the range [0,1])
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   * @return The position, -1 if there is no valid position
   */
  @SuppressWarnings("null")
  public double getPosition(double position, double tolerance) {
    Array<Double> positions = this.colorPositions.filter(pos -> Math.abs(pos - position) <= tolerance);
    return $exists(positions.length) ? positions.$get(0) : -1;
  }

  /**
   * Mirrors this color
   */
  @SuppressWarnings("unchecked")
  public void mirror() {
    this.colors.slice().splice(0, this.colors.length - 1).reverse().forEach(color -> this.colors.push(this.cloneColor(color)));

    for (int index = 0; index < this.colorPositions.length; index++) {
      this.colorPositions.$set(index, this.colorPositions.$get(index) / 2);
    }

    this.colorPositions.slice().splice(0, this.colorPositions.length - 1).reverse().forEach(position -> this.colorPositions.push(1 - position));
  }

  /**
   * Clones a color
   *
   * @param color The color
   * @return The cloned color
   */
  protected abstract T cloneColor(T color);

  /**
   * Reverses this color
   *
   */
  public void reverse() {
    this.colors.reverse();
    this.colorPositions.reverse().forEach((position, index, array) -> this.colorPositions.$set(index, 1 - position));
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   */
  public void setRipple(double ripple) {
    this.ripple = ripple;
  }

  /**
   * Returns the ripple
   *
   * @return The ripple (in the range [0,1])
   */
  public double getRipple() {
    return this.ripple;
  }

  /**
   * Returns a Color in a position
   *
   * @param position The color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @return The Color
   */
  public abstract T getColorAt(double position, boolean useRipple);

  /**
   * Returns this color as a JSON object
   *
   * @return This color as a JSON object
   */
  public abstract $Object toJSON();
}
