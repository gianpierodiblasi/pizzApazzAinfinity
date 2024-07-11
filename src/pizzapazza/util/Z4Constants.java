package pizzapazza.util;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.util.fsa.FilePickerOptionsType;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.filler.Z4AbstractFiller;

/**
 * Constants of the applications
 *
 * @author gianpiero.diblasi
 */
public class Z4Constants {

  /**
   * The ID of the image file folder
   */
  public final static String IMAGE_FILE_ID = "IMAGE_FILE_FOLDER_ID";

  /**
   * The ID of the tool file folder
   */
  public final static String TOOL_FILE_ID = "TOOL_FILE_FOLDER_ID";

  /**
   * The ID of the texture file folder
   */
  public final static String TEXTURE_FILE_ID = "TEXTURE_FILE_FOLDER_ID";

  /**
   * The array of accepted image file formats for open
   */
  public static final Array<String> ACCEPTED_OPEN_IMAGE_FILE_FORMAT = new Array<>(
          ".gif",
          ".png", ".apng",
          ".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp",
          ".bmp",
          ".svg",
          ".webp",
          ".avif"
  );

  /**
   * The array of accepted image file types for open
   */
  public static final Array<FilePickerOptionsType> ACCEPTED_OPEN_IMAGE_FILE_TYPE = new Array<>();

  /**
   * The array of accepted image file types for save
   */
  public static final Array<FilePickerOptionsType> ACCEPTED_SAVE_IMAGE_FILE_TYPE = new Array<>();

  /**
   * The array of the pizzApazzA project file type
   */
  public static final Array<FilePickerOptionsType> PIZZAPAZZA_PROJECT_FILE_TYPE = new Array<>();

  /**
   * The array of the pizzApazzA tools file type for open
   */
  public static final Array<FilePickerOptionsType> PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE = new Array<>();

  /**
   * The array of the pizzApazzA tool file type for save
   */
  public static final Array<FilePickerOptionsType> PIZZAPAZZA_SAVE_TOOL_FILE_TYPE = new Array<>();

  /**
   * The array of the pizzApazzA tools file type for save
   */
  public static final Array<FilePickerOptionsType> PIZZAPAZZA_SAVE_TOOLS_FILE_TYPE = new Array<>();

  /**
   * The zoom levels
   */
  public static final Array<Double> ZOOM_LEVEL = new Array<>(0.25, 0.33, 0.5, 0.66, 1.0, 1.5, 2.0, 3.0, 4.0);

  /**
   * The magnetism percentage of the grid
   */
  public static final double MAGNETISM_PERCENTAGE = 0.25;

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
   * The standard image sizes
   */
  public final static Array<Dimension> STANDARD_IMAGE_SIZE = new Array<>(
          new Dimension(640, 480),
          new Dimension(800, 600),
          new Dimension(1024, 768),
          new Dimension(1080, 720),
          new Dimension(1080, 1080),
          new Dimension(1152, 864),
          new Dimension(1280, 720),
          new Dimension(1280, 1024),
          new Dimension(1800, 1200),
          new Dimension(1920, 1080),
          new Dimension(2100, 1500),
          new Dimension(3000, 2400)
  );

  private Z4Constants() {
  }

  /**
   * Configures the arrays of accepted file types
   */
  public static void configureAcceptedFileTypeArrays() {
    FilePickerOptionsType all = new FilePickerOptionsType();
    all.description = Z4Translations.IMAGE_FILE;
    all.pushAccept("image/z4i", Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT);
    Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE.push(all);

    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/gif", new Array<>(".gif"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/png", new Array<>(".png", ".apng"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/jpg", new Array<>(".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/bmp", new Array<>(".bmp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/svg+xml", new Array<>(".svg"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/webp", new Array<>(".webp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/avif", new Array<>(".avif"));

    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE, "image/png", new Array<>(".png"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE, "image/jpg", new Array<>(".jpeg", ".jpg"));

    FilePickerOptionsType z4i = new FilePickerOptionsType();
    z4i.description = Z4Translations.PIZZAPAZZA_PROJECT;
    z4i.pushAccept("application/z4i", new Array<>(".z4i"));
    Z4Constants.PIZZAPAZZA_PROJECT_FILE_TYPE.push(z4i);

    FilePickerOptionsType z4t = new FilePickerOptionsType();
    z4t.description = Z4Translations.PIZZAPAZZA_DRAWING_TOOL;
    z4t.pushAccept("application/z4t", new Array<>(".z4t"));
    Z4Constants.PIZZAPAZZA_SAVE_TOOL_FILE_TYPE.push(z4t);

    FilePickerOptionsType z4ts = new FilePickerOptionsType();
    z4ts.description = Z4Translations.PIZZAPAZZA_DRAWING_TOOLS;
    z4ts.pushAccept("application/z4ts", new Array<>(".z4ts"));
    Z4Constants.PIZZAPAZZA_SAVE_TOOLS_FILE_TYPE.push(z4ts);

    all = new FilePickerOptionsType();
    all.description = Z4Translations.PIZZAPAZZA_DRAWING_TOOLS;
    all.pushAccept("application/z4tx", new Array<>(".z4t", ".z4ts"));
    Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE.push(all);
    Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE.push(z4t);
    Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE.push(z4ts);
  }

  private static void pushACCEPTED_IMAGE_FILE_TYPE(Array<FilePickerOptionsType> array, String mime, Array<String> extensions) {
    FilePickerOptionsType filePickerOptionsType = new FilePickerOptionsType();

    int start = mime.indexOf('/') + 1;
    int end = mime.indexOf('+');
    filePickerOptionsType.description = end != -1 ? mime.substring(start, end).toUpperCase() : mime.substring(start).toUpperCase();

    filePickerOptionsType.pushAccept(mime, extensions);
    array.push(filePickerOptionsType);
  }

  private static Object getStyle(Object style) {
    return style;
  }

  /**
   * Dummy method to get a style
   *
   * @param style The style
   * @return The style
   */
  public static Union4<String, CanvasGradient, CanvasPattern, Object> $getStyle(Object style) {
    return null;
  }

  /**
   * Pushes an object in its object history (if the history exists and if not
   * already present)
   *
   * @param object The object
   */
  public static void pushHistory(Object object) {
    if (object instanceof Z4AbstractFiller) {
      Z4Constants.pushHistory(((Z4AbstractFiller) object).getFillingColor());
    } else if (object instanceof Color) {
      Color.pushHistory((Color) object);
    } else if (object instanceof Z4GradientColor) {
      Z4GradientColor.pushHistory((Z4GradientColor) object);
    } else if (object instanceof Z4BiGradientColor) {
      Z4BiGradientColor.pushHistory((Z4BiGradientColor) object);
    } else if (!(object instanceof Z4SpatioTemporalColor)) {
    } else if (((Z4SpatioTemporalColor) object).isColor()) {
      Color.pushHistory(((Z4SpatioTemporalColor) object).getColor());
    } else if (((Z4SpatioTemporalColor) object).isGradientColor()) {
      Z4GradientColor.pushHistory(((Z4SpatioTemporalColor) object).getGradientColor());
    } else if (((Z4SpatioTemporalColor) object).isBiGradientColor()) {
      Z4BiGradientColor.pushHistory(((Z4SpatioTemporalColor) object).getBiGradientColor());
    }
  }
}
