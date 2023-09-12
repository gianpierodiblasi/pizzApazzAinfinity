/**
 * The gradient color (a gradient between two colors)
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColor {

   start = new Z4Color(255, 255, 255, 255);

   stop = new Z4Color(255, 0, 0, 0);

   ripple = 0.0;

   mirrored = false;

  /**
   * Sets the start color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4GradientColor
   */
   setStartColor(color) {
    this.start.set(color);
    return this;
  }

  /**
   * Returns the start color
   *
   * @return The start color
   */
   getStartColor() {
    return this.start;
  }

  /**
   * Sets the stop color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4GradientColor
   */
   setStopColor(color) {
    this.stop.set(color);
    return this;
  }

  /**
   * Returns the stop color
   *
   * @return The stop color
   */
   getStopColor() {
    return this.stop;
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   * @return This Z4GradientColor
   */
   setRipple(ripple) {
    this.ripple = ripple;
    return this;
  }

  /**
   * Returns the ripple
   *
   * @return The ripple (in the range [0,1])
   */
   getRipple() {
    return this.ripple;
  }

  /**
   * Sets the mirrored
   *
   * @param mirrored true if the color is mirrored, false otherwise
   * @return This Z4GradientColor
   */
   setMirrored(mirrored) {
    this.mirrored = mirrored;
    return this;
  }

  /**
   * Returns if the color is mirrored
   *
   * @return true if the color is mirrored, false otherwise
   */
   isMirrored() {
    return this.mirrored;
  }

  /**
   * In place converts this Z4GradientColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4GradientColor
   */
   negative() {
    this.start.negative();
    this.stop.negative();
    return this;
  }

  /**
   * In place inverts this Z4GradientColor
   *
   * @return This inverted Z4GradientColor
   */
   inverted() {
    let argbStart = this.start.getARGB();
    this.start.set(this.stop.getARGB());
    this.stop.set(argbStart);
    return this;
  }

  /**
   * Returns a Z4Color in a position
   *
   * @param position The color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4Color
   */
   getZ4ColorAt(position, useRipple, useMirrored) {
    if (useMirrored && this.mirrored) {
      position = 2 * (position < 0.5 ? position : 1 - position);
    }
    if (useRipple && this.ripple !== 0) {
      position = Z4Math.ripple(position, 0, 1, this.ripple);
    }
    return Z4Color.fromZ4Colors(this.start, this.stop, position);
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
   getLinearGradient(context, x1, y1, x2, y2) {
    let gradient = context.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
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
   getRadialGradient(context, x1, y1, r1, x2, y2, r2) {
    let gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
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
   getConicGradient(context, x, y, angle) {
    let gradient = context.createConicGradient(angle, x, y);
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
  }
  /**
   * Creates a Z4GradientColor from two Z4GradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4GradientColor
   */
  static  fromZ4GradientColors(before, after, div) {
    return new Z4GradientColor().setStartColor(Z4Color.fromZ4Colors(before.getStartColor(), after.getStartColor(), div).getARGB()).setStopColor(Z4Color.fromZ4Colors(before.getStopColor(), after.getStopColor(), div).getARGB()).setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }

  /**
   * Creates a Z4GradientColor from two Z4GradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between start and stop in the before and after
   * colors (in the range [0,1], 0=start, 1=stop)
   * @return The Z4GradientColor
   */
  static  fromStartStopZ4GradientColors(before, after, div) {
    return new Z4GradientColor().setStartColor(before.getZ4ColorAt(div, false, false).getARGB()).setStopColor(after.getZ4ColorAt(div, false, false).getARGB()).setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }
}
