package giada.pizzapazza.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.setting.Z4Setting;
import jsweet.util.union.Union4;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;

/**
 * The abstract gradient color (a sequence of Z4StopColor)
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public abstract class Z4AbstractGradientColor<T extends Z4AbstractGradientColor<T>> {

  private Array<Z4StopColor> z4StopColors = new Array<>();
  private double ripple;
  private boolean mirrored;

  /**
   * Creates a Z4AbstractGradientColor
   */
  public Z4AbstractGradientColor() {
    this.z4StopColors.push(new Z4StopColor(255, 255, 255, 255, 0));
    this.z4StopColors.push(new Z4StopColor(255, 0, 0, 0, 1));
  }

  /**
   * Returns the components of this Z4AbstractGradientColor
   *
   * @return The components of this Z4AbstractGradientColor
   */
  public Array<Z4StopColor> getComponents() {
    return this.z4StopColors;
  }

  /**
   * Adds or updates a color
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param color An ARGB integer color
   * @return This Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T addOrUpdateColor(double position, int color) {
    Z4StopColor found = this.z4StopColors.find((z4StopColor, index, array) -> z4StopColor.getPosition() == position);
    if ($exists(found)) {
      found.set(color);
    } else {
      this.z4StopColors.push(Z4StopColor.fromARGB(color, position));
    }

    return (T) this;
  }

  /**
   * Generates a color in a position computed as the linear interpolation of the
   * colors before and after the position
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @return This Z4AbstractGradientColor
   */
  public T generateColor(double position) {
    return this.addOrUpdateColor(position, this.getZ4ColorAt(position, false, false).getARGB());
  }

  /**
   * Removes a color
   *
   * @param position The position in the sequence (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T removeColor(double position) {
    this.z4StopColors = this.z4StopColors.filter((z4StopColor, index, array) -> z4StopColor.getPosition() != position);
    return (T) this;
  }

  /**
   * Moves the position of a color
   *
   * @param from The old color position (in the range [0,1])
   * @param to The new color position (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T move(double from, double to) {
    Z4StopColor found = this.z4StopColors.find((z4StopColor, index, array) -> z4StopColor.getPosition() == from);
    if ($exists(found) && from != 0 && from != 1 && to != 0 && to != 1) {
      found.setPosition(to);
    }
    return (T) this;
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T setRipple(double ripple) {
    this.ripple = ripple;
    return (T) this;
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
   * Sets the mirrored
   *
   * @param mirrored true if the color is mirrored, false otherwise
   * @return This Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T setMirrored(boolean mirrored) {
    this.mirrored = mirrored;
    return (T) this;
  }

  /**
   * Returns if the color is mirrored
   *
   * @return true if the color is mirrored, false otherwise
   */
  public boolean isMirrored() {
    return this.mirrored;
  }

  /**
   * In place converts this Z4AbstractGradientColor to negative, the
   * transparency is not changed
   *
   * @return This negativized Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T negative() {
    this.z4StopColors.forEach(z4StopColor -> z4StopColor.negative());
    return (T) this;
  }

  /**
   * In place inverts this Z4AbstractGradientColor
   *
   * @return This inverted Z4AbstractGradientColor
   */
  @SuppressWarnings("unchecked")
  public T inverted() {
    this.z4StopColors.forEach(z4StopColor -> z4StopColor.setPosition(1 - z4StopColor.getPosition()));
    return (T) this;
  }

  /**
   * Returns a Z4AbstractColor in a position
   *
   * @param position The color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4AbstractColor
   */
  public Z4AbstractColor<?> getZ4ColorAt(double position, boolean useRipple, boolean useMirrored) {
    if (Z4Setting.isLiteMode()) {
      return this.z4StopColors.find((z4StopColor, index, array) -> z4StopColor.getPosition() == 1);
    } else if (Z4Setting.isStandardMode() || Z4Setting.isProMode()) {
      if (useMirrored && this.mirrored) {
        position = 2 * (position < 0.5 ? position : 1 - position);
      }
      if (useRipple && this.ripple != 0) {
        position = Z4Math.ripple(position, 0, 1, this.ripple);
      }

      double pos = position;
      Z4StopColor before = this.z4StopColors.
              filter((z4StopColor, index, array) -> pos == 1 ? z4StopColor.getPosition() < pos : z4StopColor.getPosition() <= pos).
              reduce((found, current, index, array) -> !$exists(found) ? current : found.getPosition() > current.getPosition() ? found : current);

      Z4StopColor after = this.z4StopColors.
              filter((z4StopColor, index, array) -> pos == 0 ? z4StopColor.getPosition() > pos : z4StopColor.getPosition() >= pos).
              reduce((found, current, index, array) -> !$exists(found) ? current : found.getPosition() < current.getPosition() ? found : current);

      if (before == after) {
        return before;
      } else {
        double div = (position - before.getPosition()) / (after.getPosition() - before.getPosition());
        return Z4Color.fromZ4AbstractColors(before, after, div);
      }
    } else {
      return null;
    }
  }

  /**
   * Returns a linear gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @return The linear gradient
   */
  public CanvasGradient getLinearGradient($CanvasRenderingContext2D context, double x1, double y1, double x2, double y2) {
    CanvasGradient gradient = context.createLinearGradient(x1, y1, x2, y2);
    this.z4StopColors.forEach((z4StopColor, index, array) -> gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
    return gradient;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getLinearGradient($CanvasRenderingContext2D context, double x1, double y1, double x2, double y2) {
    return new Union4<String, CanvasGradient, CanvasPattern, Object>() {
    };
  }

  /**
   * Returns a radial gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start circle
   * @param y1 The y-axis coordinate of the start circle
   * @param r1 The radius of the start circle
   * @param x2 The x-axis coordinate of the end circle
   * @param y2 The y-axis coordinate of the end circle
   * @param r2 The radius of the end circle
   * @return The radial gradient
   */
  public CanvasGradient getRadialGradient($CanvasRenderingContext2D context, double x1, double y1, double r1, double x2, double y2, double r2) {
    CanvasGradient gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.z4StopColors.forEach((z4StopColor, index, array) -> gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
    return gradient;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start circle
   * @param y1 The y-axis coordinate of the start circle
   * @param r1 The radius of the start circle
   * @param x2 The x-axis coordinate of the end circle
   * @param y2 The y-axis coordinate of the end circle
   * @param r2 The radius of the end circle
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getRadialGradient($CanvasRenderingContext2D context, double x1, double y1, double r1, double x2, double y2, double r2) {
    return new Union4<String, CanvasGradient, CanvasPattern, Object>() {
    };
  }

  /**
   * Returns a conic gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x The x-axis coordinate of the centre of the gradient
   * @param y The y-axis coordinate of the centre of the gradient
   * @param angle The angle at which to begin the gradient, in radians
   * @return The conic gradient
   */
  public CanvasGradient getConicGradient($CanvasRenderingContext2D context, double x, double y, double angle) {
    CanvasGradient gradient = context.createConicGradient(angle, x, y);
    this.z4StopColors.forEach((z4StopColor, index, array) -> gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
    return gradient;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param context The context to create the gradient
   * @param x The x-axis coordinate of the centre of the gradient
   * @param y The y-axis coordinate of the centre of the gradient
   * @param angle The angle at which to begin the gradient, in radians
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getConicGradient($CanvasRenderingContext2D context, double x, double y, double angle) {
    return new Union4<String, CanvasGradient, CanvasPattern, Object>() {
    };
  }
}
