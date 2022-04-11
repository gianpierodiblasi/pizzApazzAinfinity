package giada.pizzapazza.color;

import def.dom.CanvasGradient;
import def.js.Array;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.setting.Z4Setting;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The temporal color (a sequence of Z4StopGradientColor)
 *
 * @author gianpiero.di.blasi
 */
public class Z4TemporalColor {

  private Array<Z4StopGradientColor> z4StopGradientColors = new Array<>();
  private double ripple;
  private boolean mirrored;

  /**
   * Creates a Z4AbstractGradientColor
   */
  public Z4TemporalColor() {
    this.z4StopGradientColors.push(new Z4StopGradientColor(0));
    this.z4StopGradientColors.push(new Z4StopGradientColor(1));
  }

  /**
   * Adds or updates a color
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param color An ARGB integer color
   * @return This Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> addOrUpdateColor(double position, int color) {
//    Z4StopColor found = this.z4StopColors.find((z4StopColor, index, array) -> z4StopColor.getPosition() == position);
//    if (found != null) {
//      found.set(color);
//    } else {
//      this.z4StopColors.push(Z4StopColor.fromARGB(color, position));
//    }
//
//    return this;
//  }
  /**
   * Generates a color in a position computed as the linear interpolation of the
   * colors before and after the position
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @return This Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> generateColor(double position) {
//    return this.addOrUpdateColor(position, this.getZ4ColorAt(position, false, false).getARGB());
//  }
  /**
   * Removes a color
   *
   * @param position The position in the sequence (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> removeColor(double position) {
//    this.z4StopColors = this.z4StopColors.filter((z4StopColor, index, array) -> z4StopColor.getPosition() != position);
//    return this;
//  }
  /**
   * Moves the position of a color
   *
   * @param from The old color position (in the range [0,1])
   * @param to The new color position (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> move(double from, double to) {
//    Z4StopColor found = this.z4StopColors.find((z4StopColor, index, array) -> z4StopColor.getPosition() == from);
//    if (found != null && from != 0 && from != 1 && to != 0 && to != 1) {
//      found.setPosition(to);
//    }
//    return this;
//  }
  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   * @return This Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> setRipple(double ripple) {
//    this.ripple = ripple;
//    return this;
//  }
  /**
   * Sets the mirrored
   *
   * @param mirrored true if the color is mirrored, false otherwise
   * @return This Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> setMirrored(boolean mirrored) {
//    this.mirrored = mirrored;
//    return this;
//  }
  /**
   * In place converts this Z4AbstractGradientColor to negative, the
   * transparency is not changed
   *
   * @return This negativized Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> negative() {
//    this.z4StopColors.forEach(z4StopColor -> z4StopColor.negative());
//    return this;
//  }
  /**
   * In place inverts this Z4AbstractGradientColor
   *
   * @return This inverted Z4AbstractGradientColor
   */
//  public Z4TemporalColor<T> inverted() {
//    this.z4StopColors.forEach(z4StopColor -> z4StopColor.setPosition(1 - z4StopColor.getPosition()));
//    return this;
//  }
  /**
   * Returns a Z4Color in a position
   *
   * @param temporal The temporal color position (in the range [0,1])
   * @param spatial The spatial color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4Color
   */
  public Z4Color getZ4ColorAt(double temporal, double spatial, boolean useRipple, boolean useMirrored) {
    if (Z4Setting.isLiteMode()) {
      return this.z4StopGradientColors.$get(0).getZ4ColorAt(1, false, false);
    } else if (Z4Setting.isStandardMode()) {
      return this.z4StopGradientColors.$get(0).getZ4ColorAt(spatial, useRipple, useMirrored);
    } else if (Z4Setting.isLiteMode()) {
      if (useMirrored && this.mirrored) {
        temporal = 2 * (temporal < 0.5 ? temporal : 1 - temporal);
      }
      if (useRipple && this.ripple != 0) {
        temporal = Z4Math.ripple(temporal, 0, 1, this.ripple);
      }

      double temp = temporal;
//    Z4StopColor before = this.z4StopColors.
//            filter((z4StopColor, index, array) -> pos == 1 ? z4StopColor.getPosition() < pos : z4StopColor.getPosition() <= pos).
//            reduce((found, current, index, array) -> found == null ? current : found.getPosition() > current.getPosition() ? found : current);
//
//    Z4StopColor after = this.z4StopColors.
//            filter((z4StopColor, index, array) -> pos == 0 ? z4StopColor.getPosition() > pos : z4StopColor.getPosition() >= pos).
//            reduce((found, current, index, array) -> found == null ? current : found.getPosition() < current.getPosition() ? found : current);
//
//    double div = (position - before.getPosition()) / (after.getPosition() - before.getPosition());
//    return Z4Color.fromZ4AbstractColors(before, after, div);
      return null;
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
//  public CanvasGradient getLinearGradient($CanvasRenderingContext2D context, double x1, double y1, double x2, double y2) {
//    CanvasGradient gradient = context.createLinearGradient(x1, y1, x2, y2);
//    this.z4StopColors.forEach((z4StopColor, index, array) -> gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
//    return gradient;
//  }
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
//  public CanvasGradient getRadialGradient($CanvasRenderingContext2D context, double x1, double y1, double r1, double x2, double y2, double r2) {
//    CanvasGradient gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
//    this.z4StopColors.forEach((z4StopColor, index, array) -> gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
//    return gradient;
//  }
  /**
   * Returns a conic gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x The x-axis coordinate of the centre of the gradient
   * @param y The y-axis coordinate of the centre of the gradient
   * @param angle The angle at which to begin the gradient, in radians
   * @return The conic gradient
   */
//  public CanvasGradient getConicGradient($CanvasRenderingContext2D context, double x, double y, double angle) {
//    CanvasGradient gradient = context.createConicGradient(angle, x, y);
//    this.z4StopColors.forEach((z4StopColor, index, array) -> gradient.addColorStop(z4StopColor.getPosition(), z4StopColor.getHEX()));
//    return gradient;
//  }
}
