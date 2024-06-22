/**
 * The point where to perform a drawing
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingPoint {

   z4Vector = null;

   intensity = 0.0;

   temporalPosition = 0.0;

   intent = null;

   side = null;

   useVectorModuleAsSize = false;

  /**
   * Creates the object
   *
   * @param z4Vector The vector providing position and direction of the drawing
   * @param intensity The intensity of the drawing (in the range [0,1])
   * @param temporalPosition The temporal position to use in the color object
   * (in the range [0,1]), -1 if this point has no temporal position
   * @param intent the intent of this point
   * @param side The side
   * @param useVectorModuleAsSize true if the vector module of this point has to
   * be used has size, false otherwise
   */
  constructor(z4Vector, intensity, temporalPosition, intent, side, useVectorModuleAsSize) {
    this.z4Vector = z4Vector;
    this.intensity = intensity;
    this.temporalPosition = temporalPosition;
    this.intent = intent;
    this.side = side;
    this.useVectorModuleAsSize = useVectorModuleAsSize;
  }
}
