package pizzapazza.math.geometricshape;

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
   * @param x The x location of the frame
   * @param y The y location of the frame
   * @param w The width of the frame
   * @param h The height of the frame
   * @param angle The rotation of the frame
   * @param sx The x shear of the frame
   * @param sy The y shear of the frame
   */
  public Z4GeometricFrame(double x, double y, double w, double h, double angle, double sx, double sy) {
    super();

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = angle;
    this.sx = sx;
    this.sy = sy;
  }
}
