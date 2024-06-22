/**
 * The intent of a Z4DrawingPoint
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingPointIntent {

  /**
   * The point has to be used to draw bounds
   */
  static DRAW_BOUNDS = 'DRAW_BOUNDS';
  /**
   * The point has to be used to replace previous bounds and draw new bounds
   */
  static REPLACE_PREVIOUS_BOUNDS = 'REPLACE_PREVIOUS_BOUNDS';
  /**
   * The point has to be used to draw objects
   */
  static DRAW_OBJECTS = 'DRAW_OBJECTS';
}
