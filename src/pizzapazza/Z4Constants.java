package pizzapazza;

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

  public static final Array<Double> ZOOM_LEVEL = new Array<>(0.25, 0.33, 0.5, 0.66, 1.0, 1.5, 2.0, 3.0, 4.0);
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

  private Z4Constants() {
  }
}
