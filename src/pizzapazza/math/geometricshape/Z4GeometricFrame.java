package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.util.Z4Translations;
import simulation.js.$Object;

/**
 * Common abstract object for geometric frames. A <i>Z4GeometricFrame</i> is a
 * geometric shape representing a frame curve
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4GeometricFrame extends Z4GeometricCurve {

  /**
   * The x center location of the frame
   */
  protected final double x;

  /**
   * The y center location of the frame
   */
  protected final double y;

  /**
   * The half width of the frame
   */
  protected final double w;

  /**
   * The half height of the frame
   */
  protected final double h;

  /**
   * The rotation of the frame
   */
  protected final double angle;

  /**
   * The x shear of the frame
   */
  protected final double sx;

  /**
   * The y shear of the frame
   */
  protected final double sy;

  /**
   * The shearing coefficient
   */
  protected final static double SHEARING_COEFFICIENT = 50;

  /**
   * Creates the object
   *
   * @param type The type
   * @param x The x center location of the frame
   * @param y The y center location of the frame
   * @param w The half width of the frame
   * @param h The half height of the frame
   * @param angle The rotation of the frame
   * @param sx The x shear of the frame
   * @param sy The y shear of the frame
   */
  public Z4GeometricFrame(Z4GeometricShapeType type, double x, double y, double w, double h, double angle, double sx, double sy) {
    super(type);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = angle;
    this.sx = sx;
    this.sy = sy;
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    Z4AffineTransform tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);

    return new Array<>(
            tx.transform(0, 0),
            tx.transform(this.w, 0),
            tx.transform(0, this.h)
    );
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    return new Array<>(0, 1, 0, 2);
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations() {
    return new Array<>(
            new Z4GeometricShapeSpinnerConfiguration(Z4Translations.SHEARING, Z4Translations.HORIZONTAL, 0, -200, 200),
            new Z4GeometricShapeSpinnerConfiguration(Z4Translations.SHEARING, Z4Translations.VERTICAL, 0, -200, 200)
    );
  }

  /**
   * Returns a new geometric frame from given parameters
   *
   * @param x The x center location of the frame
   * @param y The y center location of the frame
   * @param w The half width of the frame
   * @param h The half height of the frame
   * @param angle The rotation of the frame
   * @param sx The x shear of the frame
   * @param sy The y shear of the frame
   * @return The new geometric frame
   */
  protected abstract Z4GeometricFrame fromParameters(double x, double y, double w, double h, double angle, double sx, double sy);

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    if (pointIndex == 0) {
      Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      Z4AffineTransform txInverse = tx.inverse();

      Z4Point point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      point1 = txInverse.transform(point1.x, point1.y);
      Z4Point point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      point2 = txInverse.transform(point2.x, point2.y);

      return this.fromParameters(x, y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), this.angle, this.sx, this.sy);
    } else if (pointIndex == 1) {
      double angle1 = Z4Math.atan(this.x, this.y, x, y);
      Z4AffineTransform tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle1).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      Z4AffineTransform txInverse = tx.inverse();

      Z4Point point1 = txInverse.transform(x, y);
      Z4Point point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      point2 = txInverse.transform(point2.x, point2.y);

      return this.fromParameters(this.x, this.y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), angle1, this.sx, this.sy);
    } else if (pointIndex == 2) {
      double angle2 = Z4Math.atan(this.x, this.y, x, y) - Z4Math.HALF_PI;
      Z4AffineTransform tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle2).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      Z4AffineTransform txInverse = tx.inverse();

      Z4Point point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      point1 = txInverse.transform(point1.x, point1.y);
      Z4Point point2 = txInverse.transform(x, y);

      return this.fromParameters(this.x, this.y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), angle2, this.sx, this.sy);
    } else if (spinnerIndex == 0) {
      return this.fromParameters(this.x, this.y, this.w, this.h, this.angle, spinnerValue, this.sy);
    } else if (spinnerIndex == 1) {
      return this.fromParameters(this.x, this.y, this.w, this.h, this.angle, this.sx, spinnerValue);
    } else {
      return this;
    }
  }

  private Z4Point getPoint(Z4AffineTransform tx, Z4Point point, double w, double h, int width, int height) {
    while ((point.x < 0 || point.x > width || point.y < 0 || point.y > height) && (w > 0 || h > 0)) {
      if (w > 0) {
        w = Math.max(0, w - 0.05);
      }
      if (h > 0) {
        h = Math.max(0, h - 0.05);
      }
      point = tx.transform(w, h);
    }

    return point;
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x", this.x);
    json.$set("y", this.y);
    json.$set("w", this.w);
    json.$set("h", this.h);
    json.$set("angle", this.angle);
    json.$set("sx", this.sx);
    json.$set("sy", this.sy);
    return json;
  }
}
