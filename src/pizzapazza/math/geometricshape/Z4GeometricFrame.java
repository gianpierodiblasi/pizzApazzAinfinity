package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
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
