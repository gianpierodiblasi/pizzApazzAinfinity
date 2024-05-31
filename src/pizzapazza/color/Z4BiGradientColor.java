package pizzapazza.color;

import javascript.awt.Color;
import pizzapazza.math.Z4Math;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The bidimensional gradient color (a bidimensional gradient between four or
 * more colors)
 *
 * @author gianpiero.diblasi
 */
public class Z4BiGradientColor extends Z4AbstractGradientColor<Z4GradientColor> {

  /**
   * Creates the object
   */
  public Z4BiGradientColor() {
    super();
    this.addColor(new Z4GradientColor(), 0);
    this.addColor(new Z4GradientColor(), 1);
  }

  @Override
  protected Z4GradientColor cloneColor(Z4GradientColor color) {
    return Z4GradientColor.fromJSON(color.toJSON());
  }

  /**
   * Mirrors each gradient color
   */
  @SuppressWarnings("unchecked")
  public void gradientMirror() {
    this.colors.forEach(gradientColor -> gradientColor.mirror());
  }

  /**
   * Reverses each gradient color
   */
  public void gradientReverse() {
    this.colors.forEach(gradientColor -> gradientColor.reverse());
  }

  /**
   * Sets the ripple of each gradient color
   *
   * @param rippleGradient The ripple of each gradient color (in the range
   * [0,1])
   */
  public void setGradientRipple(double rippleGradient) {
    this.colors.forEach(gradientColor -> gradientColor.setRipple(rippleGradient));
  }

  /**
   * Returns the ripple of each gradient color
   *
   * @return The ripple of each gradient color (in the range [0,1])
   */
  public double getGradientRipple() {
    return this.colors.$get(0).getRipple();
  }

  @Override
  public Z4GradientColor getColorAt(double position, boolean useRipple) {
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

      Z4GradientColor before = this.colors.$get(index - 1);
      Z4GradientColor after = this.colors.$get(index);

      Z4GradientColor gradientColor = new Z4GradientColor();
      gradientColor.setRipple(this.getGradientRipple());

      before.colors.forEach((beforeColor, idx, array) -> {
        double beforePosition = before.colorPositions.$get(idx);
        Color afterColor = after.getColorAt(beforePosition, false);
        this.addInGradientColor(gradientColor, beforeColor, afterColor, div, beforePosition);
      });

      after.colors.forEach((afterColor, idx, array) -> {
        double afterPosition = after.colorPositions.$get(idx);

        if (gradientColor.colorPositions.findIndex(pos -> pos == afterPosition) == -1) {
          Color beforeColor = before.getColorAt(afterPosition, false);
          this.addInGradientColor(gradientColor, beforeColor, afterColor, div, afterPosition);
        }
      });

      return gradientColor;
    }
  }

  private void addInGradientColor(Z4GradientColor gradientColor, Color beforeColor, Color afterColor, double div, double position) {
    gradientColor.addColor(new Color(
            parseInt((afterColor.red - beforeColor.red) * div + beforeColor.red),
            parseInt((afterColor.green - beforeColor.green) * div + beforeColor.green),
            parseInt((afterColor.blue - beforeColor.blue) * div + beforeColor.blue),
            parseInt((afterColor.alpha - beforeColor.alpha) * div + beforeColor.alpha)), position);
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();

    json.$set("ripple", this.getRipple());

    json.$set("colorsAndPositions", this.colors.map((color, index, array) -> {
      $Object jsonColor = new $Object();
      jsonColor.$set("gradientColor", color.toJSON());
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
  public static Z4BiGradientColor fromJSON($Object json) {
    Z4BiGradientColor gradientColor = new Z4BiGradientColor();
    gradientColor.setRipple(json.$get("ripple"));
    ((Iterable<$Object>) json.$get("colorsAndPositions")).forEach(colorAndPosition -> gradientColor.addColor(Z4GradientColor.fromJSON(colorAndPosition.$get("gradientColor")), colorAndPosition.$get("position")));
    return gradientColor;
  }
}
