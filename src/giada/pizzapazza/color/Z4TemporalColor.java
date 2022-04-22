package giada.pizzapazza.color;

import def.js.Array;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.setting.Z4Setting;
import static simulation.js.$Globals.$exists;

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
   * Returns the components of this Z4TemporalColor
   *
   * @return The components of this Z4TemporalColor
   */
  public Array<Z4StopGradientColor> getComponents() {
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
  public Z4TemporalColor addOrUpdateColor(double temporal, double spatial, int color) {
    Z4StopGradientColor found = this.z4StopGradientColors.find((z4StopGradientColor, index, array) -> z4StopGradientColor.getPosition() == temporal);
    if (!$exists(found)) {
      Z4AbstractGradientColor<?> z4StopGradientColor = this.getZ4GradientColorAt(temporal, false, false);
      this.z4StopGradientColors.push(Z4StopGradientColor.fromZ4AbstractGradientColor(z4StopGradientColor, temporal));
    }

    this.z4StopGradientColors.forEach(z4StopGradientColor -> {
      if (z4StopGradientColor.getPosition() != temporal) {
        Z4StopColor found2 = z4StopGradientColor.getComponents().find((z4StopColor, index, array) -> z4StopColor.getPosition() == spatial);
        if (!$exists(found2)) {
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
  public Z4TemporalColor generateColor(double temporal, double spatial) {
    if (temporal != -1) {
      return this.addOrUpdateColor(temporal, spatial, this.getZ4ColorAt(temporal, spatial, false, false).getARGB());
    }
    if (spatial != -1) {
      this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.generateColor(spatial));
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
  public Z4TemporalColor removeColor(double temporal, double spatial) {
    this.z4StopGradientColors = this.z4StopGradientColors.filter((z4StopGradientColor, index, array) -> z4StopGradientColor.getPosition() != temporal);
    this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.removeColor(spatial));
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
  public Z4TemporalColor move(double fromT, double toT, double fromS, double toS) {
    Z4StopGradientColor found = this.z4StopGradientColors.find((z4StopGradientColor, index, array) -> z4StopGradientColor.getPosition() == fromT);
    if ($exists(found) && fromT != 0 && fromT != 1 && toT != 0 && toT != 1) {
      found.setPosition(toT);
    }
    this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.move(fromS, toS));
    return this;
  }

  /**
   * Sets the ripple
   *
   * @param temporal The temporal ripple (in the range [0,1])
   * @param spatial The spatial ripple (in the range [0,1])
   * @return This Z4TemporalColor
   */
  public Z4TemporalColor setRipple(double temporal, double spatial) {
    this.ripple = temporal;
    this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.setRipple(spatial));
    return this;
  }

  /**
   * Sets the mirrored
   *
   * @param temporal true if the color is temporaly mirrored, false otherwise
   * @param spatial true if the color is spatialy mirrored, false otherwise
   * @return This Z4TemporalColor
   */
  public Z4TemporalColor setMirrored(boolean temporal, boolean spatial) {
    this.mirrored = temporal;
    this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.setMirrored(spatial));
    return this;
  }

  /**
   * Returns if the color is temporaly mirrored
   *
   * @return true if the color is temporaly mirrored, false otherwise
   */
  public boolean isTemporalyMirrored() {
    return this.mirrored;
  }

  /**
   * Returns if the color is spatialy mirrored
   *
   * @return true if the color is spatialy mirrored, false otherwise
   */
  public boolean isSpatialyMirrored() {
    return this.z4StopGradientColors.$get(0).isMirrored();
  }

  /**
   * In place converts this Z4TemporalColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4TemporalColor
   */
  public Z4TemporalColor negative() {
    this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.negative());
    return this;
  }

  /**
   * In place inverts this Z4TemporalColor
   *
   * @param temporal true for temporal inversion, false otherwise
   * @param spatial true for spatial inversion, false otherwise
   * @return This inverted Z4TemporalColor
   */
  public Z4TemporalColor inverted(boolean temporal, boolean spatial) {
    if (temporal) {
      this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.setPosition(1 - z4StopGradientColor.getPosition()));
    }
    if (spatial) {
      this.z4StopGradientColors.forEach(z4StopGradientColor -> z4StopGradientColor.inverted());
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
  public Z4AbstractGradientColor<?> getZ4GradientColorAt(double position, boolean useRipple, boolean useMirrored) {
    if (Z4Setting.isLiteMode() || Z4Setting.isStandardMode()) {
      return this.z4StopGradientColors.find((z4StopGradienColor, index, array) -> z4StopGradienColor.getPosition() == 0);
    } else if (Z4Setting.isProMode()) {
      if (useMirrored && this.mirrored) {
        position = 2 * (position < 0.5 ? position : 1 - position);
      }
      if (useRipple && this.ripple != 0) {
        position = Z4Math.ripple(position, 0, 1, this.ripple);
      }

      double pos = position;
      Z4StopGradientColor before = this.z4StopGradientColors.
              filter((z4StopGradientColor, index, array) -> pos == 1 ? z4StopGradientColor.getPosition() < pos : z4StopGradientColor.getPosition() <= pos).
              reduce((found, current, index, array) -> !$exists(found) ? current : found.getPosition() > current.getPosition() ? found : current);

      Z4StopGradientColor after = this.z4StopGradientColors.
              filter((z4StopGradientColor, index, array) -> pos == 0 ? z4StopGradientColor.getPosition() > pos : z4StopGradientColor.getPosition() >= pos).
              reduce((found, current, index, array) -> !$exists(found) ? current : found.getPosition() < current.getPosition() ? found : current);

      if (before == after) {
        return before;
      } else {
        double div = (pos - before.getPosition()) / (after.getPosition() - before.getPosition());
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
  public Z4AbstractColor<?> getZ4ColorAt(double temporal, double spatial, boolean useRipple, boolean useMirrored) {
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
