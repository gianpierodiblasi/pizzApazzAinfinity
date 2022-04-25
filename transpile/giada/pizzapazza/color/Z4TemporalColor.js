/**
 * The temporal color (a sequence of Z4StopGradientColor)
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColor {

   z4StopGradientColors = new Array();

   ripple = 0.0;

   mirrored = false;

  /**
   * Creates a Z4AbstractGradientColor
   */
  constructor() {
    this.z4StopGradientColors.push(new Z4StopGradientColor(0));
    this.z4StopGradientColors.push(new Z4StopGradientColor(1));
  }

  /**
   * Returns the components of this Z4TemporalColor
   *
   * @return The components of this Z4TemporalColor
   */
   getComponents() {
    return this.z4StopGradientColors;
  }

  /**
   * Adds or updates a color
   *
   * @param temporal The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param spatial The position in the sequence (in the range [0,1]), if there
   * is no color in this position then it is added otherwise it is updated
   * @param color An ARGB integer color
   * @return This Z4TemporalColor
   */
   addOrUpdateColor(temporal, spatial, color) {
    let found = this.z4StopGradientColors.find((z4StopGradientColor, index, array) => z4StopGradientColor.getPosition() === temporal);
    if (!found) {
      let z4StopGradientColor = this.getZ4GradientColorAt(temporal, false, false);
      this.z4StopGradientColors.push(Z4StopGradientColor.fromZ4AbstractGradientColor(z4StopGradientColor, temporal));
    }
    this.z4StopGradientColors.forEach(z4StopGradientColor => {
      if (z4StopGradientColor.getPosition() !== temporal) {
        let found2 = z4StopGradientColor.getComponents().find((z4StopColor, index, array) => z4StopColor.getPosition() === spatial);
        if (!found2) {
          z4StopGradientColor.generateColor(spatial);
        }
      } else {
        z4StopGradientColor.addOrUpdateColor(spatial, color);
      }
    });
    return this;
  }

  /**
   * Generates a color in a position computed as the linear interpolation of the
   * colors before and after the position
   *
   * @param temporal The temporal position in the sequence (in the range [0,1]),
   * if there is no color in this position then it is added otherwise it is
   * updated, -1 to not generate anything
   * @param spatial The spatial position in the sequence (in the range [0,1]),
   * if there is no color in this position then it is added otherwise it is
   * updated, -1 to not generate anything
   * @return This Z4TemporalColor
   */
   generateColor(temporal, spatial) {
    if (temporal !== -1) {
      return this.addOrUpdateColor(temporal, spatial, this.getZ4ColorAt(temporal, spatial, false, false).getARGB());
    }
    if (spatial !== -1) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.generateColor(spatial));
    }
    return this;
  }

  /**
   * Removes a color
   *
   * @param temporal The temporal position in the sequence (in the range [0,1]),
   * -1 to not remove anything
   * @param spatial The spatial position in the sequence (in the range [0,1]),
   * -1 to not remove anything
   * @return This Z4TemporalColor
   */
   removeColor(temporal, spatial) {
    if (temporal !== 0 && temporal !== 1) {
      this.z4StopGradientColors = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) => z4StopGradientColor.getPosition() !== temporal);
    }
    if (spatial !== 0 && spatial !== 1) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.removeColor(spatial));
    }
    return this;
  }

  /**
   * Moves the position of a color
   *
   * @param fromT The old temporal color position (in the range [0,1]), -1 to
   * not move anything
   * @param toT The new temporal color position (in the range [0,1])
   * @param fromS The old spatial color position (in the range [0,1]), -1 to not
   * remove anything
   * @param toS The new spatial color position (in the range [0,1])
   * @return This Z4TemporalColor
   */
   move(fromT, toT, fromS, toS) {
    let found = this.z4StopGradientColors.find((z4StopGradientColor, index, array) => z4StopGradientColor.getPosition() === fromT);
    if (found && fromT !== 0 && fromT !== 1 && toT !== 0 && toT !== 1) {
      found.setPosition(toT);
    }
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.move(fromS, toS));
    return this;
  }

  /**
   * Sets the ripple
   *
   * @param temporal The temporal ripple (in the range [0,1])
   * @param spatial The spatial ripple (in the range [0,1])
   * @return This Z4TemporalColor
   */
   setRipple(temporal, spatial) {
    this.ripple = temporal;
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.setRipple(spatial));
    return this;
  }

  /**
   * Returns the temporal ripple
   *
   * @return The temporal ripple (in the range [0,1])
   */
   getTemporalRipple() {
    return this.ripple;
  }

  /**
   * Returns the spatial ripple
   *
   * @return The spatial ripple (in the range [0,1])
   */
   getSpatialRipple() {
    return this.z4StopGradientColors[0].getRipple();
  }

  /**
   * Sets the mirrored
   *
   * @param temporal true if the color is temporaly mirrored, false otherwise
   * @param spatial true if the color is spatialy mirrored, false otherwise
   * @return This Z4TemporalColor
   */
   setMirrored(temporal, spatial) {
    this.mirrored = temporal;
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.setMirrored(spatial));
    return this;
  }

  /**
   * Returns if the color is temporaly mirrored
   *
   * @return true if the color is temporaly mirrored, false otherwise
   */
   isTemporalyMirrored() {
    return this.mirrored;
  }

  /**
   * Returns if the color is spatialy mirrored
   *
   * @return true if the color is spatialy mirrored, false otherwise
   */
   isSpatialyMirrored() {
    return this.z4StopGradientColors[0].isMirrored();
  }

  /**
   * In place converts this Z4TemporalColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4TemporalColor
   */
   negative() {
    this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.negative());
    return this;
  }

  /**
   * In place inverts this Z4TemporalColor
   *
   * @param temporal true for temporal inversion, false otherwise
   * @param spatial true for spatial inversion, false otherwise
   * @return This inverted Z4TemporalColor
   */
   inverted(temporal, spatial) {
    if (temporal) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.setPosition(1 - z4StopGradientColor.getPosition()));
    }
    if (spatial) {
      this.z4StopGradientColors.forEach(z4StopGradientColor => z4StopGradientColor.inverted());
    }
    return this;
  }

  /**
   * Returns a Z4AbstractGradientColor in a position
   *
   * @param position The temporal color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4AbstractGradientColor
   */
   getZ4GradientColorAt(position, useRipple, useMirrored) {
    if (Z4Setting.isLiteMode() || Z4Setting.isStandardMode()) {
      return this.z4StopGradientColors.find((z4StopGradienColor, index, array) => z4StopGradienColor.getPosition() === 0);
    } else if (Z4Setting.isProMode()) {
      if (useMirrored && this.mirrored) {
        position = 2 * (position < 0.5 ? position : 1 - position);
      }
      if (useRipple && this.ripple !== 0) {
        position = Z4Math.ripple(position, 0, 1, this.ripple);
      }
      let pos = position;
      let before = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) => pos === 1 ? z4StopGradientColor.getPosition() < pos : z4StopGradientColor.getPosition() <= pos).reduce((found, current, index, array) => !found ? current : found.getPosition() > current.getPosition() ? found : current);
      let after = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) => pos === 0 ? z4StopGradientColor.getPosition() > pos : z4StopGradientColor.getPosition() >= pos).reduce((found, current, index, array) => !found ? current : found.getPosition() < current.getPosition() ? found : current);
      if (before === after) {
        return before;
      } else {
        let div = (pos - before.getPosition()) / (after.getPosition() - before.getPosition());
        return Z4GradientColor.fromZ4AbstractGradientColors(before, after, div);
      }
    } else {
      return null;
    }
  }

  /**
   * Returns a Z4AbstractColor in a position
   *
   * @param temporal The temporal color position (in the range [0,1])
   * @param spatial The spatial color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @param useMirrored true to use mirrored, false otherwise
   * @return The Z4AbstractColor
   */
   getZ4ColorAt(temporal, spatial, useRipple, useMirrored) {
    if (Z4Setting.isLiteMode()) {
      return this.getZ4GradientColorAt(0, false, false).getZ4ColorAt(1, false, false);
    } else if (Z4Setting.isStandardMode()) {
      return this.getZ4GradientColorAt(0, false, false).getZ4ColorAt(spatial, useRipple, useMirrored);
    } else if (Z4Setting.isProMode()) {
      return this.getZ4GradientColorAt(temporal, useRipple, useMirrored).getZ4ColorAt(spatial, useRipple, useMirrored);
    } else {
      return null;
    }
  }
}
