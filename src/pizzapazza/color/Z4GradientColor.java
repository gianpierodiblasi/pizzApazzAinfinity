package pizzapazza.color;

import javascript.awt.Color;
import pizzapazza.math.Z4Math;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The gradient color (a gradient between two or more colors)
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColor extends Z4AbstractGradientColor<Color>{

  private double ripple;

  /**
   * Creates the object
   */
  public Z4GradientColor() {
    super();
    this.addColor(new Color(255, 255, 255, 255), 0);
    this.addColor(new Color(0, 0, 0, 255), 1);
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

  @Override
  public Color getColorAt(double position, boolean useRipple) {
    if (useRipple && $exists(this.ripple)) {
      position = Z4Math.ripple(position, 0, 1, this.ripple);
    }

    double finalPos = position;
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

  @Override
  public $Object toJSON() {
    $Object json = new $Object();

    json.$set("ripple", this.ripple);

    json.$set("colorsAndPositions", this.colors.map((color, index, array) -> {
      $Object jsonColor = new $Object();
      jsonColor.$set("red", color.red);
      jsonColor.$set("green", color.green);
      jsonColor.$set("blue", color.blue);
      jsonColor.$set("alpha", color.alpha);
      jsonColor.$set("position", this.colorPositions.$get(index));
      return jsonColor;
    }));

    return json;
  }

  /**
   * Creates a Z4GradientColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  @SuppressWarnings("unchecked")
  public static Z4GradientColor fromJSON($Object json) {
    Z4GradientColor gradientColor = new Z4GradientColor();
    gradientColor.setRipple(json.$get("ripple"));
    ((Iterable<$Object>) json.$get("colorsAndPositions")).forEach(colorAndPosition -> gradientColor.addColor(new Color(colorAndPosition.$get("red"), colorAndPosition.$get("green"), colorAndPosition.$get("blue"), colorAndPosition.$get("alpha")), colorAndPosition.$get("position")));
    return gradientColor;
  }
}
