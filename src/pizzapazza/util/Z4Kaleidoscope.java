package pizzapazza.util;

import pizzapazza.math.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$DOMMatrix;
import simulation.js.$Apply_0_Void;

/**
 * A kaleidoscope
 *
 * @author gianpiero.diblasi
 */
public class Z4Kaleidoscope {

  private final int multiplicity;
  private final int offsetX;
  private final int offsetY;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
  public Z4Kaleidoscope(int multiplicity, int offsetX, int offsetY) {
    this.multiplicity = multiplicity;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
  public int getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the X offset
   *
   * @return The X offset
   */
  public int getOffsetX() {
    return this.offsetX;
  }

  /**
   * Returns the Y offset
   *
   * @return The Y offset
   */
  public int getOffsetY() {
    return this.offsetY;
  }

  /**
   * Iterate a drawing
   *
   * @param context The context to use to perform the drawing
   * @param draw The action used to perform the drawing
   */
  public void iterate($CanvasRenderingContext2D context, $Apply_0_Void draw) {
    draw.$apply();

    double incAngle = Z4Math.TWO_PI / this.multiplicity;
    $DOMMatrix matrix = context.getTransform();

    for (int index = 1; index < this.multiplicity; index++) {
      double angle = index * incAngle;

      context.save();
      context.resetTransform();
      context.translate(this.offsetX, this.offsetY);
      context.rotate(angle);
      context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

      draw.$apply();

      context.restore();
    }
  }
}
