package pizzapazza.filler;

import def.dom.ImageData;
import javascript.awt.Color;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import static simulation.js.$Globals.$exists;
import simulation.js.$Uint8Array;

/**
 * A (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
public class Z4LinearFiller extends Z4AbstractFiller {

  private final double p1x;
  private final double p1y;
  private final double p2x;
  private final double p2y;
  private final int boundaryBehavior;

  /**
   * The filler does nothing outside the boundary
   */
  public final static int STOP_AT_BOUNDARY = 0;

  /**
   * The filler uses the last color outside the boundary
   */
  public final static int FILL_AT_BOUNDARY = 1;

  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  public final static int SYMMETRIC_AT_BOUNDARY = 2;

  /**
   * The filler restarts the color outside the boundary
   */
  public final static int REPEAT_AT_BOUNDARY = 3;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the line in relative
   * size (in the range [0,1])
   * @param y1 The y-axis coordinate of the start point of the line in relative
   * size (in the range [0,1])
   * @param x2 The x-axis coordinate of the end point of the line in relative
   * size (in the range [0,1])
   * @param y2 The y-axis coordinate of the end point of the line in relative
   * size (in the range [0,1])
   * @param boundaryBehavior The boundary behavior
   */
  public Z4LinearFiller(Z4GradientColor gradientColor, double x1, double y1, double x2, double y2, int boundaryBehavior) {
    super(gradientColor);

    this.p1x = x1;
    this.p1y = y1;
    this.p2x = x2;
    this.p2y = y2;
    this.boundaryBehavior = boundaryBehavior;
  }

  @Override
  public void fill(ImageData imageData) {

    double angle = Z4Math.atan(this.p1x, this.p1y, this.p2x, this.p2y) + Z4Math.HALF_PI;
    double distance = Z4Math.distance(this.p1x, this.p1y, this.p2x, this.p2y);

    double line1x = this.p1x + Math.cos(angle);
    double line1y = this.p1y + Math.sin(angle);
    double line2x = this.p2x + Math.cos(angle);
    double line2y = this.p2y + Math.sin(angle);

    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < imageData.height; y++) {
      double yy = y / imageData.height;

      for (int x = 0; x < imageData.width; x++) {
        int pos = (y * imageData.width + x) * 4;

        double xx = x / imageData.width;
        double d1 = Z4Math.ptLineDist(this.p1x, this.p1y, line1x, line1y, xx, yy) / distance;
        double d2 = Z4Math.ptLineDist(this.p2x, this.p2y, line2x, line2y, xx, yy) / distance;

        if (d1 <= 1 && d2 <= 1) {
          this.setData(data, d1, pos);
        } else if (this.boundaryBehavior == Z4LinearFiller.STOP_AT_BOUNDARY) {
        } else if (this.boundaryBehavior == Z4LinearFiller.FILL_AT_BOUNDARY) {
          this.setData(data, d1 < d2 ? 0 : 1, pos);
        } else if (this.boundaryBehavior == Z4LinearFiller.SYMMETRIC_AT_BOUNDARY) {
          double d = d1 < d2 ? d1 : d2;
          int step = (int) Math.floor(d);
          d -= step;

          if (d1 < d2) {
            if ($exists((step % 2))) {
              d = 1 - d;
            }
          } else {
            if (!$exists((step % 2))) {
              d = 1 - d;
            }
          }

          this.setData(data, d, pos);
        } else if (this.boundaryBehavior == Z4LinearFiller.REPEAT_AT_BOUNDARY) {
          double d = d1 < d2 ? d1 : d2;
          int step = (int) Math.floor(d);
          d -= step;

          if (d1 < d2) {
            d = 1 - d;
          }

          this.setData(data, d, pos);
        }
      }
    }
  }

  private void setData($Uint8Array data, double d, int pos) {
    Color color = this.gradientColor.getColorAt(d, true);

    data.$set(pos, color.red);
    data.$set(pos + 1, color.green);
    data.$set(pos + 2, color.blue);
    data.$set(pos + 3, color.alpha);
  }
}
