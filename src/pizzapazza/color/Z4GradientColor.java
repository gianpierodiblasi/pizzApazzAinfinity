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
public class Z4GradientColor extends Z4AbstractGradientColor<Color> {

  /**
   * Creates the object
   */
  public Z4GradientColor() {
    super();
    this.addColor(new Color(255, 255, 255, 255), 0);
    this.addColor(new Color(0, 0, 0, 255), 1);
  }

  @Override
  protected Color cloneColor(Color color) {
    return new Color(color.red, color.green, color.blue, color.alpha);
  }

  @Override
  public Color getColorAt(double position, boolean useRipple) {
    if (useRipple && $exists(this.getRipple())) {
      position = Z4Math.ripple(position, 0, 1, this.getRipple());
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
    $Object json = super.toJSON();

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
   * Merges overlapping colors based on a tolerance
   *
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   */
  public void mergeOverlapping(double tolerance) {
    for (int index = this.colorPositions.length - 1; index > 0; index--) {
      double beforePosition = this.colorPositions.$get(index - 1);
      double afterPosition = this.colorPositions.$get(index);

      if (Math.abs(afterPosition - beforePosition) <= tolerance) {
        double position = (beforePosition + afterPosition) / 2;
        Color color = this.getColorAt(position, false);

        this.removeColor(beforePosition);
        this.removeColor(afterPosition);
        this.addColor(color, position);
      }
    }
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
