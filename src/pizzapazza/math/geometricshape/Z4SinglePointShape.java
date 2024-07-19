package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.js.$Object;

/**
 * A geometric shape described by a single point
 *
 * @author gianpiero.diblasi
 */
public class Z4SinglePointShape extends Z4GeometricShape {

  private final double x;
  private final double y;

  /**
   * Creates the object
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   */
  public Z4SinglePointShape(double x, double y) {
    super(Z4GeometricShapeType.POINT);

    this.x = x;
    this.y = y;
  }

  @Override
  public Z4Polyline getPolyline() {
    return new Z4Polyline(new Array<>(new Z4Point(x, y), new Z4Point(x, y)));
  }

  @Override
  public double distance(double x, double y) {
    return Z4Math.distance(this.x, this.y, x, y);
  }

  @Override
  public double getLength() {
    return 0;
  }

  @Override
  public Z4Point getPointAt(double position) {
    return new Z4Point(this.x, this.y);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    return Z4Vector.fromVector(this.x, this.y, 0, 0);
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return new Array<>(new Z4Point(this.x, this.y));
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfiguration() {
    return new Array<>();
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x", this.x);
    json.$set("y", this.y);
    return json;
  }

  /**
   * Creates a Z4SinglePointShape from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4SinglePointShape fromJSON($Object json) {
    return new Z4SinglePointShape(json.$get("x"), json.$get("y"));
  }

  /**
   * Creates a Z4SinglePointShape contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4SinglePointShape fromSize(int width, int height) {
    return new Z4SinglePointShape(width / 2, height / 2);
  }
}
