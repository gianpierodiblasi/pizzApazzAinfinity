package pizzapazza.util;

import def.js.Array;

/**
 * Constants of the applications
 *
 * @author gianpiero.diblasi
 */
public class Z4Constants {

  /**
   * The array of accepted image file formats
   */
  public static final Array<String> ACCEPTED_IMAGE_FILE_FORMAT = new Array<>(
          ".gif",
          ".png", ".apng",
          ".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp",
          ".bmp",
          ".svg",
          ".webp",
          ".avif"
  );

  /**
   * The zoom levels
   */
  public static final Array<Double> ZOOM_LEVEL = new Array<>(0.25, 0.33, 0.5, 0.66, 1.0, 1.5, 2.0, 3.0, 4.0);

  /**
   * The available composite operations
   */
  @SuppressWarnings("unchecked")
  public static final Array<Array<String>> COMPOSITE_OPERATION = new Array<>(
          new Array<>("source-over", "source-in", "source-out", "source-atop"),
          new Array<>("destination-over", "destination-in", "destination-out", "destination-atop"),
          new Array<>("lighter"),
          new Array<>("copy"),
          new Array<>("xor"),
          new Array<>("multiply", "screen", "overlay"),
          new Array<>("darken", "lighten"),
          new Array<>("color-dodge", "color-burn"),
          new Array<>("hard-light", "soft-light"),
          new Array<>("difference", "exclusion"),
          new Array<>("hue", "saturation", "color", "luminosity")
  );

  /**
   * The default image size
   */
  public final static int DEFAULT_IMAGE_SIZE = 500;

  /**
   * The maximum image size
   */
  public final static int MAX_IMAGE_SIZE = 3000;

  /**
   * The default DPI
   */
  public final static int DEFAULT_DPI = 150;

  /**
   * The max DPI
   */
  public final static int MAX_DPI = 1500;

  /**
   * The minimum saving interval (min)
   */
  public final static int MIN_SAVING_INTERVAL = 1;

  /**
   * The maximum saving interval (min)
   */
  public final static int MAX_SAVING_INTERVAL = 10;

  /**
   * The minimum saving delay (ms)
   */
  public final static int MIN_SAVING_DELAY = 50;

  /**
   * The maximum saving delay (ms)
   */
  public final static int MAX_SAVING_DELAY = 1000;

  private Z4Constants() {
  }
}
