package pizzapazza.math;

import pizzapazza.color.Z4Lighting;

/**
 * The point where to perform a drawing
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingPoint {

  public final Z4Vector z4Vector;
  public final double intensity;
  public final Z4Lighting lighting;
  public final double colorPosition;
  public final boolean drawBounds;
  public final Z4Sign side;
  public final boolean useVectorModuleAsSize;

  /**
   * Creates the object
   *
   * @param z4Vector The vector providing position and direction of the drawing
   * @param intensity The intensity of the drawing (in the range [0,1])
   * @param lighting The lighting to apply to the current color
   * @param colorPosition The color position to use in the color object (in the
   * range [0,1]), -1 if this point has no color position
   * @param drawBounds true if this point has to be used to draw bounds, false
   * otherwise (this point has to be used to draw real objects)
   * @param side The side
   * @param useVectorModuleAsSize true if the vector module of this point has to
   * be used has size, false otherwise
   */
  public Z4DrawingPoint(Z4Vector z4Vector, double intensity, Z4Lighting lighting, double colorPosition, boolean drawBounds, Z4Sign side, boolean useVectorModuleAsSize) {
    this.z4Vector = z4Vector;
    this.intensity = intensity;
    this.lighting = lighting;
    this.colorPosition = colorPosition;
    this.drawBounds = drawBounds;
    this.side = side;
    this.useVectorModuleAsSize = useVectorModuleAsSize;
  }
}
