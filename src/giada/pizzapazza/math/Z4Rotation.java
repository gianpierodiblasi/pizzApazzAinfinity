package giada.pizzapazza.math;

import giada.pizzapazza.math.Z4AbstractFancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4Vector;
import static simulation.js.$Globals.$exists;

/**
 * The rotation (angles parameters are computed in degrees,
 * rotations are computed in radians)
 *
 * @author gianpiero.di.blasi
 */
public class Z4Rotation extends Z4AbstractFancifulValue<Z4Rotation> {

  private final int type;
  private double startAngle;
  private boolean delayed;
  private double rotationNext;

  private Z4Rotation(int type) {
    this.type = type;
  }

  /**
   * Returns if the next rotation is computed on a fixed value
   *
   * @return true if the next rotation is computed on a fixed value, false
   * otherwise
   */
  public boolean isFixed() {
    return this.type == 0;
  }

  /**
   * Returns if next rotation is computed by cumulating previous rotation
   *
   * @return true if next rotation is computed by cumulating previous rotation,
   * false otherwise
   */
  public boolean isCumulative() {
    return this.type == 1;
  }

  /**
   * Checks if next rotation is computed relative to a path
   *
   * @return true if next rotation is computed relative to a path, false
   * otherwise
   */
  public boolean isRelativeToPath() {
    return this.type == 2;
  }

  /**
   * Returns the initial angle of rotation (in degrees)
   *
   * @return The initial angle of rotation (in degrees)
   */
  public double getStartAngle() {
    return this.startAngle;
  }

  /**
   * Sets the initial angle of rotation (in degrees)
   *
   * @param startAngle The initial angle of rotation (in degrees)
   * @return This Z4Rotation
   */
  public Z4Rotation setStartAngle(double startAngle) {
    this.startAngle = startAngle;
    return this;
  }

  /**
   * Returns if the rotation has to be delayed (rotated by a PI angle)
   *
   * @return true if the returned rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   */
  public boolean isDelayed() {
    return this.delayed;
  }

  /**
   * Sets if the rotation has to be delayed (rotated by a PI angle)
   *
   * @param delayed true if the rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   * @return This Z4Rotation
   */
  public Z4Rotation setDelayed(boolean delayed) {
    this.delayed = delayed;
    return this;
  }

  /**
   * Returns the next rotation
   *
   * @param tangentAngle The tangent angle (in radians)
   * @return The next rotation (in radians)
   */
  @Override
  public double next(double tangentAngle) {
    double angle = Z4Math.deg2rad(this.startAngle + super.next(0));

    switch (this.type) {
      case 0:
        return angle + (this.delayed ? Math.PI : 0);
      case 1:
        this.rotationNext += angle;
        return this.rotationNext + (this.delayed ? Math.PI : 0);
      case 2:
        return angle + tangentAngle + (this.delayed ? Math.PI : 0);
      default:
        return 0;
    }
  }

  /**
   * Computes the next side
   *
   * @param z4Point The current point
   * @param vector The tangent vector
   */
  public void nextSide(Z4Point z4Point, Z4Vector vector) {
    switch (this.type) {
      case 0:
      case 1:
        z4Point.setSide(Z4Sign.POSITIVE);
        break;
      case 2:
        z4Point.setSide($exists(vector) ? vector.direction(z4Point.getZ4Vector()) : Z4Sign.RANDOM);
        break;
    }
  }

  /**
   * Returns a Z4Rotation with next rotation computed on a fixed value
   *
   * @return The Z4Rotation
   */
  public static Z4Rotation fixed() {
    return new Z4Rotation(0);
  }

  /**
   * Returns a Z4Rotation with next rotation computed by cumulating previous
   * rotation
   *
   * @return The Z4Rotation
   */
  public static Z4Rotation cumulative() {
    return new Z4Rotation(1);
  }

  /**
   * Returns a Z4Rotation with next rotation computed relative to a path
   *
   * @return The Z4Rotation
   */
  public static Z4Rotation relativeToPath() {
    return new Z4Rotation(2);
  }
}
