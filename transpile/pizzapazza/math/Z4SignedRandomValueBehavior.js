/**
 * The behavior of a signed random value
 *
 * @author gianpiero.diblasi
 */
class Z4SignedRandomValueBehavior {

  /**
   * The signed random value generates "classic "random values
   */
  static CLASSIC = 'CLASSIC';
  /**
   * The signed random value generates random values on a bezier curve
   */
  static BEZIER = 'BEZIER';
  /**
   * The signed random value generates random values on a polyline
   */
  static POLYLINE = 'POLYLINE';
  /**
   * The signed random value generates random values on a stepped line
   */
  static STEPPED = 'STEPPED';
}
