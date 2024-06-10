/**
 * Constants of the applications
 *
 * @author gianpiero.diblasi
 */
class Z4Constants {

  /**
   * The ID of the image file folder
   */
  static  IMAGE_FILE_ID = "IMAGE_FILE_FOLDER_ID";

  /**
   * The ID of the texture file folder
   */
  static  TEXTURE_FILE_ID = "TEXTURE_FILE_FOLDER_ID";

  /**
   * The array of accepted image file formats for open
   */
  static  ACCEPTED_OPEN_IMAGE_FILE_FORMAT = new Array(".gif", ".png", ".apng", ".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp", ".bmp", ".svg", ".webp", ".avif");

  /**
   * The array of accepted image file types for open
   */
  static  ACCEPTED_OPEN_IMAGE_FILE_TYPE = new Array();

  /**
   * The array of accepted image file types for save
   */
  static  ACCEPTED_SAVE_IMAGE_FILE_TYPE = new Array();

  /**
   * The array of the pizzApazzA project file type
   */
  static  PIZZAPAZZA_PROJECT_IMAGE_FILE_TYPE = new Array();

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

  /**
   * Configures the arrays of accepted file types
   */
  static  configureAcceptedImageFileTypeArrays() {
    let all = new FilePickerOptionsType();
    all.description = Z4Translations.IMAGE_FILE;
    all.pushAccept("image/z4i", Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT);
    Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE.push(all);
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/gif", new Array(".gif"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/png", new Array(".png", ".apng"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/jpg", new Array(".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/bmp", new Array(".bmp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/svg+xml", new Array(".svg"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/webp", new Array(".webp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/avif", new Array(".avif"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE, "image/png", new Array(".png"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE, "image/jpg", new Array(".jpeg", ".jpg"));
    let z4i = new FilePickerOptionsType();
    z4i.description = Z4Translations.PIZZAPAZZA_PROJECT;
    z4i.pushAccept("application/z4i", new Array(".z4i"));
    Z4Constants.PIZZAPAZZA_PROJECT_IMAGE_FILE_TYPE.push(z4i);
  }

  static  pushACCEPTED_IMAGE_FILE_TYPE(array, mime, extensions) {
    let filePickerOptionsType = new FilePickerOptionsType();
    let start = mime.indexOf('/') + 1;
    let end = mime.indexOf('+');
    filePickerOptionsType.description = end !== -1 ? mime.substring(start, end).toUpperCase() : mime.substring(start).toUpperCase();
    filePickerOptionsType.pushAccept(mime, extensions);
    array.push(filePickerOptionsType);
  }

   getStyle(style) {
    return style;
  }
}
