package pizzapazza.math;

/**
 * The intent of a Z4DrawingPoint
 *
 * @author gianpiero.diblasi
 */
public enum Z4DrawingPointIntent {
  /**
   * The point has to be used to draw bounds
   */
  DRAW_BOUNDS,
  /**
   * The point has to be used to replace previous bounds and draw new bounds
   */
  REPLACE_PREVIOUS_BOUNDS,
  /**
   * The point has to be used to draw objects
   */
  DRAW_OBJECTS;
}
