package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.js.$Object;

/**
 * Common abstract object for geometric frames. A <i>Z4GeometricFrame</i> is a
 * geometric shape representing a frame curve
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4GeometricFrame extends Z4GeometricCurve {

  private final double x;
  private final double y;
  private final double w;
  private final double h;
  private final double angle;
  private final double sx;
  private final double sy;

  /**
   * Creates the object
   *
   * @param type The type
   * @param x The x location of the frame
   * @param y The y location of the frame
   * @param w The width of the frame
   * @param h The height of the frame
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
    return new Array<>(
            new Z4Point(this.x + this.w / 2, this.y + this.h / 2),
            new Z4Point(this.x + this.w / 2 + Math.cos(this.angle), this.y + this.h / 2 + Math.sin(angle)),
            new Z4Point(this.x + this.w / 2 + Math.cos(this.angle - Z4Math.HALF_PI), this.y + this.h / 2 + Math.sin(angle - Z4Math.HALF_PI))
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
