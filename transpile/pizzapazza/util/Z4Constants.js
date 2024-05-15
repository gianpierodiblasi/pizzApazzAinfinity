/**
 * Constants of the applications
 *
 * @author gianpiero.diblasi
 */
class Z4Constants {

  /**
   * The array of accepted image file formats
   */
  static  ACCEPTED_IMAGE_FILE_FORMAT = new Array(".gif", ".png", ".apng", ".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp", ".bmp", ".svg", ".webp", ".avif");

  /**
   * The zoom levels
   */
  static  ZOOM_LEVEL = new Array(0.25, 0.33, 0.5, 0.66, 1.0, 1.5, 2.0, 3.0, 4.0);

  /**
   * The available composite operations
   */

  static  COMPOSITE_OPERATION = new Array(new Array("source-over", "source-in", "source-out", "source-atop"), new Array("destination-over", "destination-in", "destination-out", "destination-atop"), new Array("lighter"), new Array("copy"), new Array("xor"), new Array("multiply", "screen", "overlay"), new Array("darken", "lighten"), new Array("color-dodge", "color-burn"), new Array("hard-light", "soft-light"), new Array("difference", "exclusion"), new Array("hue", "saturation", "color", "luminosity"));

  /**
   * The default image size
   */
  static  DEFAULT_IMAGE_SIZE = 500;

  /**
   * The maximum image size
   */
  static  MAX_IMAGE_SIZE = 3000;

  /**
   * The default DPI
   */
  static  DEFAULT_DPI = 150;

  /**
   * The max DPI
   */
  static  MAX_DPI = 1500;

  constructor() {
  }
}
