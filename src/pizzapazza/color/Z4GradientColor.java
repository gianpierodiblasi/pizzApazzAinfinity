package pizzapazza.color;

import def.dom.CanvasGradient;
import javascript.awt.Color;
import pizzapazza.math.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;
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
  protected $Object mapColor(Color color, int index) {
    $Object jsonColor = new $Object();
    jsonColor.$set("red", color.red);
    jsonColor.$set("green", color.green);
    jsonColor.$set("blue", color.blue);
    jsonColor.$set("alpha", color.alpha);
    jsonColor.$set("position", this.colorPositions.$get(index));
    return jsonColor;
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
   * Creates a linear gradient
   *
   * @param context The context to use to create the linear gradient
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x1 The x-axis coordinate of the end point
   * @param y1 The y-axis coordinate of the end point
   * @return The linear gradient
   */
  public CanvasGradient createLinearGradient($CanvasRenderingContext2D context, double x0, double y0, double x1, double y1) {
    CanvasGradient linearGradient = context.createLinearGradient(x0, y0, x1, y1);
    this.colors.forEach((color, index, array) -> linearGradient.addColorStop(this.colorPositions.$get(index), color.getRGBA_HEX()));
    return linearGradient;
  }

  /**
   * Lights up this Z4GradientColor, the transparency is not changed
   *
   * @param inOut true for an in-out lighting, false for an out-in lighting
   * @return This lighted Z4GradientColor
   */
  @SuppressWarnings("null")
  public Z4GradientColor lighted(boolean inOut) {
    Z4GradientColor lighted = new Z4GradientColor();
    this.colors.forEach((color, index, array) -> lighted.addColor(color.lighted(inOut ? this.colorPositions.$get(index) : 1 - this.colorPositions.$get(index)), this.colorPositions.$get(index)));
    return lighted;
  }

  /**
   * Darkens this Z4GradientColor, the transparency is not changed
   *
   * @param inOut true for an in-out lighting, false for an out-in lighting
   * @return This darkened Z4GradientColor
   */
  @SuppressWarnings("null")
  public Z4GradientColor darkened(boolean inOut) {
    Z4GradientColor darkened = new Z4GradientColor();
    this.colors.forEach((color, index, array) -> darkened.addColor(color.darkened(inOut ? this.colorPositions.$get(index) : 1 - this.colorPositions.$get(index)), this.colorPositions.$get(index)));
    return darkened;
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
