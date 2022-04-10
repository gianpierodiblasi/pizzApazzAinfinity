/**
 * The gradient color (a sequence of Z4StopColor)
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColor {

   z4StopColors = new Array();

   ripple = 0.0;

   mirrored = false;

  /**
   * Creates a Z4GradientColor
   */
  constructor() {
    this.z4StopColors.push(new Z4StopColor(255, 255, 255, 255, 0));
    this.z4StopColors.push(new Z4StopColor(255, 0, 0, 0, 1));
  }

  /**
   * Adds or updates a color
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param color An ARGB integer color
   * @return This Z4GradientColor
   */
   addOrUpdateColor(position, color) {
    let found = this.z4StopColors.find((z4StopColor, index, array) => z4StopColor.getPosition() === position);
    if (found !== null) {
      found.set(color);
    } else {
      this.z4StopColors.push(Z4StopColor.fromARGB(color, position));
    }
    return this;
  }

  /**
   * Generates a color in a position computed as the linear interpolation of the
   * colors before and after the position
   *
   * @param position The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @return This Z4GradientColor
   */
   generateColor(position) {
    return this.addOrUpdateColor(position, this.getZ4ColorAt(position, false, false).getARGB());
  }

  /**
   * Removes a color
   *
   * @param position The position in the sequence (in the range [0,1])
   * @return This Z4GradientColor
   */
   removeColor(position) {
    this.z4StopColors = this.z4StopColors.filter((z4StopColor, index, array) => z4StopColor.getPosition() !== position);
    return this;
  }

  /**
   * Moves the position of a color
   *
   * @param from The old color position (in the range [0,1])
   * @param to The new color position (in the range [0,1])
   * @return This Z4GradientColor
   */
   move(from, to) {
    let found = this.z4StopColors.find((z4StopColor, index, array) => z4StopColor.getPosition() === from);
    if (found !== null && from !== 0 && from !== 1 && to !== 0 && to !== 1) {
      found.setPosition(to);
    }
    return this;
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
   * In place converts this Z4GradientColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4GradientColor
   */
   negative() {
    this.z4StopColors.forEach(z4StopColor => z4StopColor.negative());
    return this;
  }

  /**
   * In place inverts this Z4GradientColor
   *
   * @return This inverted Z4GradientColor
   */
   inverted() {
    this.z4StopColors.forEach(z4StopColor => z4StopColor.setPosition(1 - z4StopColor.getPosition()));
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
    let pos = position;
    let before = this.z4StopColors.filter((z4StopColor, index, array) => pos === 1 ? z4StopColor.getPosition() < pos : z4StopColor.getPosition() <= pos).reduce((found, current, index, array) => found === null ? current : found.getPosition() > current.getPosition() ? found : current);
    let after = this.z4StopColors.filter((z4StopColor, index, array) => pos === 0 ? z4StopColor.getPosition() > pos : z4StopColor.getPosition() >= pos).reduce((found, current, index, array) => found === null ? current : found.getPosition() < current.getPosition() ? found : current);
    let div = (position - before.getPosition()) / (after.getPosition() - before.getPosition());
    return Z4Color.fromZ4AbstractColors(before, after, div);
  }
}
