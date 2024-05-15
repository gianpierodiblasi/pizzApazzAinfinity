package pizzapazza.color;

import def.js.Array;
import javascript.awt.Color;
import pizzapazza.util.Z4Math;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The gradient color (a gradient between two or more colors)
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColor {

  private final Array<Color> colors = new Array<>();
  private final Array<Double> colorPositions = new Array<>();

  private double ripple;

  /**
   * Creates the object
   */
  public Z4GradientColor() {
    this.addColor(new Color(255, 255, 255, 255), 0);
    this.addColor(new Color(0, 0, 0, 255), 1);
  }

  /**
   * Adds a color in a position, if the position is already occupied then
   * replaces the color
   *
   * @param color The color
   * @param position The position (in the range [0,1])
   */
  public void addColor(Color color, double position) {
    int index = this.colorPositions.indexOf(position);

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
  public void removeColor(double position) {
    int index = this.colorPositions.indexOf(position);

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
   * Mirrors this Z4GradientColor
   */
  public void mirror() {
    this.colors.slice().splice(this.colors.length - 1, 1).reverse().forEach(color -> this.colors.push(color));

    for (int index = 0; index < this.colorPositions.length; index++) {
      this.colorPositions.$set(index, this.colorPositions.$get(index) / 2);
    }
    this.colorPositions.slice().splice(this.colorPositions.length - 1, 1).reverse().map(position -> 1 - position).forEach(position -> this.colorPositions.push(position));
  }

  /**
   * Reverses this Z4GradientColor
   *
   */
  public void reverse() {
    this.colors.reverse();

    for (int index = 1; index < this.colorPositions.length - 1; index++) {
      this.colorPositions.$set(index, 1 - this.colorPositions.$get(index));
    }
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
  public Color getColorAt(double position, boolean useRipple) {
    if (useRipple && $exists(this.ripple)) {
      position = Z4Math.ripple(position, 0, 1, this.ripple);
    }

    final double finalPos = position;
    int index = this.colorPositions.findIndex(pos -> pos >= finalPos, null);

    if (this.colorPositions.$get(index) == position) {
      return this.colors.$get(index);
    } else if (this.colorPositions.$get(index - 1) == position) {
      return this.colors.$get(index - 1);
    } else {
      double div = (position - this.colorPositions.$get(index - 1)) / (this.colorPositions.$get(index) - this.colorPositions.$get(index - 1));

      return new Color(
              parseInt((this.colors.$get(index).red - this.colors.$get(index - 1).red) * div + this.colors.$get(index - 1).red),
              parseInt((this.colors.$get(index).green - this.colors.$get(index - 1).green) * div + this.colors.$get(index - 1).green),
              parseInt((this.colors.$get(index).blue - this.colors.$get(index - 1).blue) * div + this.colors.$get(index - 1).blue),
              parseInt((this.colors.$get(index).alpha - this.colors.$get(index - 1).alpha) * div + this.colors.$get(index - 1).alpha)
      );
    }
  }
}
