package pizzapazza.util;

import static def.dom.Globals.navigator;
import javascript.util.KeyValue;

/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
@SuppressWarnings("StaticNonFinalUsedInInitialization")
public class Z4Translations {

  public static KeyValue<String, String> CURRENT_LANGUAGE;

  private final static String DEPENDENCIES
          = "<a href='https://repository.jsweet.org/artifactory/libs-release-local/org/jsweet/jsweet-core' target='_blank'>jsweet-core</a>, "
          + "<a href='https://github.com/gianpierodiblasi/swing.js' target='_blank'>swing.js</a>, "
          + "<a href='https://pomax.github.io/bezierjs' target='_blank'>Bezier.js</a>, "
          + "<a href='https://stuk.github.io/jszip' target='_blank'>JSZip</a>, "
          + "<a href='https://github.com/eligrey/FileSaver.js' target='_blank'>FileSaver.js</a>.";

  // Ribbon Project
  public static String PROJECT = "";
  public static String NEW_PROJECT = "";
  public static String CREATE = "";
  public static String FROM_CLIPBOARD = "";
  public static String FROM_FILE = "";
  public static String OPEN = "";
  public static String OPEN_PROJECT = "";
  public static String SAVE = "";
  public static String SAVE_PROJECT = "";
  public static String SAVE_PROJECT_AS = "";
  public static String EXPORT = "";
  public static String PROJECT_NOT_SAVED_MESSAGE = "";
  public static String IMAGE_FILE = "";
  public static String PIZZAPAZZA_PROJECT = "";

  // Ribbon Layer
  public static String LAYER = "";
  public static String LAYER_NAME = "";
  public static String NEW_LAYER = "";
  public static String BACKGROUND_LAYER = "";
  public static String DELETE_LAYER_MESSAGE = "";
  public static String MERGE_VISIBLE_LAYERS = "";
  public static String MERGE_ALL_LAYERS = "";
  public static String SHOW_LAYER_BOUNDS = "";

  // Ribbon Drawing Tool
  public static String NEW_DRAWING_TOOL = "";
  public static String DRAWING_TOOL = "";
  public static String DRAWING_TOOL_NAME = "";
  public static String SAVE_DRAWING_TOOL_AS = "";
  public static String SAVE_DRAWING_TOOLS_AS = "";
  public static String PIZZAPAZZA_DRAWING_TOOL = "";
  public static String PIZZAPAZZA_DRAWING_TOOLS = "";
  public static String DELETE_DRAWING_TOOL_MESSAGE = "";
  public static String FROM_LIBRARY = "";

  // Ribbon Text
  public static String TEXT = "";
  public static String FONT_SELECTION = "";
  public static String REFLEX = "";

  // Ribbon History
  public static String HISTORY = "";
  public static String UNDO = "";
  public static String REDO = "";
  public static String CONSOLIDATE = "";
  public static String CONSOLIDATE_MESSAGE = "";

  // Ribbon Settings
  public static String SETTINGS = "";
  public static String LANGUAGE = "";
  public static String LANGUAGE_ENGLISH_NATIVE = "";
  public static String LANGUAGE_ITALIAN_NATIVE = "";
  public static String THEME = "";
  public static String THEME_AUTO = "";
  public static String THEME_LIGHT = "";
  public static String THEME_DARK = "";
  public static String THEME_COLOR = "";
  public static String HISTORY_MANAGEMENT = "";
  public static String STANDARD_POLICY = "";
  public static String STANDARD_POLICY_DESCRIPTION = "";
  public static String TIMER_POLICY = "";
  public static String TIMER_POLICY_DESCRIPTION = "";
  public static String MANUAL_POLICY = "";
  public static String MANUAL_POLICY_DESCRIPTION = "";
  public static String TOOL_POLICY = "";
  public static String TOOL_POLICY_DESCRIPTION = "";
  public static String SAVING_INTERVAL = "";
  public static String SAVING_DELAY = "";

  public static String REFRESH_PAGE_MESSAGE = "";

  // Ribbon Help
  public static String HELP = "";
  public static String ABOUT = "";
  public static String BASED_ON = "";
  public static String INSTALL = "";
  public static String CHECK_UPDATE = "";

  // Other
  public static String PROJECT_NAME = "";
  public static String FILENAME = "";
  public static String QUALITY = "";
  public static String RESET = "";
  public static String RESET_MESSAGE = "";
  public static String WIDTH = "";
  public static String HEIGHT = "";
  public static String RESOLUTION = "";
  public static String PATTERN = "";
  public static String PATTERNS = "";
  public static String EDIT = "";
  public static String FIT = "";
  public static String OFFSET = "";
  public static String OFFSET_X = "";
  public static String OFFSET_Y = "";
  public static String BASIC = "";
  public static String ADVANCED = "";
  public static String STAR = "";
  public static String VERTICES = "";
  public static String REGULAR = "";
  public static String DIMENSION = "";
  public static String FREE = "";
  public static String LOCK_ASPECT_RATIO = "";
  public static String LOCK = "";
  public static String RIPPLE = "";
  public static String DELETE = "";
  public static String DUPLICATE = "";
  public static String TRANSFORM = "";
  public static String FLIP_HORIZONTAL = "";
  public static String FLIP_VERTICAL = "";
  public static String ROTATE_PLUS_90 = "";
  public static String ROTATE_MINUS_90 = "";
  public static String ROTATE_180 = "";
  public static String SPACE = "";
  public static String TIME = "";
  public static String FILLING = "";
  public static String MERGE = "";
  public static String NONE_HIM = "";
  public static String NONE_HER = "";
  public static String BORDER = "";
  public static String SHADOW = "";
  public static String DELTA_X = "";
  public static String DELTA_Y = "";
  public static String VISIBLE = "";
  public static String SELECTED = "";
  public static String MOVE_UP = "";
  public static String MOVE_DOWN = "";
  public static String MOVE_BOTTOM = "";
  public static String MOVE_TOP = "";
  public static String TRY_ME = "";
  public static String ACTIONS = "";
  public static String DRAWING_DIRECTION = "";
  public static String SHOW_GRID = "";
  public static String MAGNETIC_GRID = "";
  public static String DOTTED_GRID = "";
  public static String PLOT_WIDTH = "";
  public static String RESET_ON_START_MOVING = "";
  public static String RESIZE = "";
  public static String CONTAINER = "";
  public static String CONTENT = "";
  public static String RESIZE_CONTAINER_AND_CONTENT = "";
  public static String RESIZE_CONTAINER_AND_ADAPT_CONTENT = "";
  public static String RESIZE_CONTAINER = "";
  public static String RESIZE_CONTENT = "";
  public static String IMAGE_TOO_BIG_MESSAGE = "";
  public static String IMAGE_OPEN_ERROR_MESSAGE = "";
  public static String DRAWING_TOOL_OPEN_ERROR_MESSAGE = "";
  public static String DO_NOT_SHOW_AGAIN_MESSAGE = "";
  public static String FILTER = "";
  public static String EMPTY_HIS = "";
  public static String EMPTY_HER = "";
  public static String SHEARING = "";
  public static String HORIZONTAL = "";
  public static String VERTICAL = "";
  public static String APPLY = "";

  // Text
  public static String BOLD = "";
  public static String ITALIC = "";
  public static String STRING_EXAMPLE = "";

  // Color
  public static String COLOR = "";
  public static String FILLING_COLOR = "";
  public static String BACKGROUND_COLOR = "";
  public static String MIRRORED = "";
  public static String INVERTED = "";
  public static String DELETE_COLOR_MESSAGE = "";
  public static String LIGHTED = "";
  public static String DARKENED = "";
  public static String SPATIAL = "";
  public static String TEMPORAL = "";
  public static String LIGHTING = "";
  public static String PICK_COLOR = "";
  public static String COLOR_STORED_IN_HISTORY = "";

  // Point Iterator
  public static String MULTIPLICITY = "";
  public static String PUSH = "";
  public static String ROTATION = "";
  public static String ATTACK = "";
  public static String SUSTAIN = "";
  public static String RELEASE = "";
  public static String ENDLESS = "";
  public static String RADIUS = "";
  public static String SPEED = "";
  public static String DRAW_WHILE_MOVING = "";
  public static String SCATTERING = "";
  public static String ASSISTED_DRAWING = "";

  // Painter
  public static String TENSION = "";
  public static String HOLE = "";
  public static String COVER = "";
  public static String WHIRLPOOL = "";
  public static String POINTS = "";
  public static String INTERNAL_BASE_POINT = "";
  public static String EXTERNAL_BASE_POINT = "";
  public static String INTERNAL_TERMINAL_POINT = "";
  public static String EXTERNAL_TERMINAL_POINT = "";
  public static String INDENTATION = "";
  public static String EXTERNAL_FORCE = "";
  public static String INTENSITY = "";
  public static String GAUSSIAN_CORRECTION = "";
  public static String THICKNESS = "";
  public static String DELETE_PATTERN_MESSAGE = "";
  public static String DELETE_PATTERNS_MESSAGE = "";
  public static String RANDOM_SEQUENCE = "";
  public static String MULTI_DIMENSION = "";

  // Math
  public static String POSITIVE = "";
  public static String NEGATIVE = "";
  public static String ALTERNATE = "";
  public static String CONSTANT = "";
  public static String RANDOM = "";
  public static String CLASSIC = "";
  public static String STEPPED = "";
  public static String POLYLINE = "";
  public static String BEZIER = "";
  public static String LENGTH = "";
  public static String UNIFORM_SIGN = "";
  public static String FIXED = "";
  public static String VARIABLE = "";
  public static String CUMULATIVE = "";
  public static String RELATIVE_TO_PATH = "";
  public static String DELAYED = "";
  public static String STEP = "";
  public static String SHAPE = "";
  public static String ANGLE = "";
  public static String FORWARD = "";
  public static String BACKWARD = "";
  public static String DISTANCE = "";
  public static String CENTER_VERB = "";

  // Composite Operation
  public static String COMPOSITE_OPERATION = "";
  public static String COMPOSITE_OPERATION_SOURCE_OVER = "";
  public static String COMPOSITE_OPERATION_SOURCE_IN = "";
  public static String COMPOSITE_OPERATION_SOURCE_OUT = "";
  public static String COMPOSITE_OPERATION_SOURCE_ATOP = "";
  public static String COMPOSITE_OPERATION_DESTINATION_OVER = "";
  public static String COMPOSITE_OPERATION_DESTINATION_IN = "";
  public static String COMPOSITE_OPERATION_DESTINATION_OUT = "";
  public static String COMPOSITE_OPERATION_DESTINATION_ATOP = "";
  public static String COMPOSITE_OPERATION_LIGHTER = "";
  public static String COMPOSITE_OPERATION_COPY = "";
  public static String COMPOSITE_OPERATION_XOR = "";
  public static String COMPOSITE_OPERATION_MULTIPLY = "";
  public static String COMPOSITE_OPERATION_SCREEN = "";
  public static String COMPOSITE_OPERATION_OVERLAY = "";
  public static String COMPOSITE_OPERATION_DARKEN = "";
  public static String COMPOSITE_OPERATION_LIGHTEN = "";
  public static String COMPOSITE_OPERATION_COLOR_DODGE = "";
  public static String COMPOSITE_OPERATION_COLOR_BURN = "";
  public static String COMPOSITE_OPERATION_HARD_LIGHT = "";
  public static String COMPOSITE_OPERATION_SOFT_LIGHT = "";
  public static String COMPOSITE_OPERATION_DIFFERENCE = "";
  public static String COMPOSITE_OPERATION_EXCLUSION = "";
  public static String COMPOSITE_OPERATION_HUE = "";
  public static String COMPOSITE_OPERATION_SATURATION = "";
  public static String COMPOSITE_OPERATION_COLOR = "";
  public static String COMPOSITE_OPERATION_LUMINOSITY = "";

  static {
    switch (navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  private Z4Translations() {
  }

  public static String $get(String key) {
    return "";
  }

  /**
   * Sets the English language
   */
  public static void setEnglish() {
    // Ribbon Project
    Z4Translations.PROJECT = "Project";
    Z4Translations.NEW_PROJECT = "New Project";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.SAVE_PROJECT_AS = "Save Project As";
    Z4Translations.EXPORT = "Export";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Project not saved, do you want to save your changes?";
    Z4Translations.IMAGE_FILE = "Image File";
    Z4Translations.PIZZAPAZZA_PROJECT = "pizzApazzA Project";

    // Ribbon Layer
    Z4Translations.LAYER = "Layer";
    Z4Translations.LAYER_NAME = "Layer Name";
    Z4Translations.NEW_LAYER = "New Layer";
    Z4Translations.BACKGROUND_LAYER = "Bkgrd";
    Z4Translations.DELETE_LAYER_MESSAGE = "Do you really want to delete the layer?";
    Z4Translations.MERGE_VISIBLE_LAYERS = "Merge Visible Layers";
    Z4Translations.MERGE_ALL_LAYERS = "Merge All Layers";
    Z4Translations.SHOW_LAYER_BOUNDS = "Show Layer Bounds";

    // Ribbon Drawing Tool
    Z4Translations.NEW_DRAWING_TOOL = "New Drawing Tool";
    Z4Translations.DRAWING_TOOL = "Drawing Tool";
    Z4Translations.DRAWING_TOOL_NAME = "Drawing Tool Name";
    Z4Translations.SAVE_DRAWING_TOOL_AS = "Save As";
    Z4Translations.SAVE_DRAWING_TOOLS_AS = "Save All As";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOL = "pizzApazzA Drawing Tool";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOLS = "pizzApazzA Drawing Tools";
    Z4Translations.DELETE_DRAWING_TOOL_MESSAGE = "Do you really want to delete the drawing tool?";
    Z4Translations.FROM_LIBRARY = "From Library";

    // Ribbon Text
    Z4Translations.TEXT = "Text";
    Z4Translations.FONT_SELECTION = "Font Selection";
    Z4Translations.REFLEX = "Reflex";

    // Ribbon History
    Z4Translations.HISTORY = "History";
    Z4Translations.UNDO = "Undo";
    Z4Translations.REDO = "Redo";
    Z4Translations.CONSOLIDATE = "Consolidate";
    Z4Translations.CONSOLIDATE_MESSAGE = "Consolidation will remove all history, do you want to proceed?";

    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.THEME_COLOR = "Color";
    Z4Translations.HISTORY_MANAGEMENT = "History Management";
    Z4Translations.STANDARD_POLICY = "Standard";
    Z4Translations.STANDARD_POLICY_DESCRIPTION = "The history is updated at each conclusion of a drawing operation and at each \"global\" operation on the drawing";
    Z4Translations.TIMER_POLICY = "Time Based";
    Z4Translations.TIMER_POLICY_DESCRIPTION = "The history is updated at regular intervals (only if the drawing has been modified)";
    Z4Translations.MANUAL_POLICY = "Manual";
    Z4Translations.MANUAL_POLICY_DESCRIPTION = "The history is manually updated (only if the drawing has been modified)";
    Z4Translations.TOOL_POLICY = "On Drawing Tool Change";
    Z4Translations.TOOL_POLICY_DESCRIPTION = "The history is updated when the drawing tool is changed (only if the drawing has been modified) and at each \"global\" operation on the drawing";
    Z4Translations.SAVING_INTERVAL = "Saving Interval";
    Z4Translations.SAVING_DELAY = "Saving Delay";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";

    // Ribbon Help
    Z4Translations.HELP = "Help";
    Z4Translations.ABOUT = "About";
    Z4Translations.BASED_ON
            = "<p>pizzApazzA<sup>&#8734;</sup> Version $version$ is based on pizzApazzA VB6 by Ettore Luzio and is licensed under <a href='https://unlicense.org/'>Unlicense license</a>.</p>"
            + "<p>Developed in Java by Gianpiero Di Blasi, transpilled in JavaScript by means of <a href='https://github.com/gianpierodiblasi/josetta' target='_blank'>josetta</a> (<a href='https://github.com/gianpierodiblasi/pizzApazzAinfinity' target='_blank'>github repository</a>).</p>"
            + "<p>Ettore Luzio and Gianpiero Di Blasi are the founders of <a href='https://sites.google.com/view/gruppoz4/home'>GruppoZ4</a>.</p>"
            + "<p>Dependencies: " + Z4Translations.DEPENDENCIES + "</p>";
    Z4Translations.INSTALL = "<span>Install pizzApazzA<sup>&#8734;</sup></span>";
    Z4Translations.CHECK_UPDATE = "Check for Updates";

    // Other
    Z4Translations.PROJECT_NAME = "Project Name";
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";
    Z4Translations.RESET = "Reset";
    Z4Translations.RESET_MESSAGE = "Do you really want to restore the initial parameters?";
    Z4Translations.WIDTH = "Width";
    Z4Translations.HEIGHT = "Height";
    Z4Translations.RESOLUTION = "Resolution";
    Z4Translations.PATTERN = "Pattern";
    Z4Translations.PATTERNS = "Patterns";
    Z4Translations.EDIT = "Edit";
    Z4Translations.FIT = "Fit";
    Z4Translations.OFFSET = "Offset";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Basic";
    Z4Translations.ADVANCED = "Advanced";
    Z4Translations.STAR = "Star";
    Z4Translations.VERTICES = "Vertices";
    Z4Translations.REGULAR = "Regular";
    Z4Translations.DIMENSION = "Dimension";
    Z4Translations.FREE = "Free";
    Z4Translations.LOCK_ASPECT_RATIO = "Lock Aspect Ratio";
    Z4Translations.LOCK = "Lock";
    Z4Translations.RIPPLE = "Ripple";
    Z4Translations.DELETE = "Delete";
    Z4Translations.DUPLICATE = "Duplicate";
    Z4Translations.TRANSFORM = "Transform";
    Z4Translations.FLIP_HORIZONTAL = "Flip Horizontal";
    Z4Translations.FLIP_VERTICAL = "Flip Vertical";
    Z4Translations.ROTATE_PLUS_90 = "Rotate +90\u00B0";
    Z4Translations.ROTATE_MINUS_90 = "Rotate -90\u00B0";
    Z4Translations.ROTATE_180 = "Rotate 180\u00B0";
    Z4Translations.SPACE = "Space \u2192";
    Z4Translations.TIME = "\u2190 Time";
    Z4Translations.FILLING = "Filling";
    Z4Translations.MERGE = "Merge";
    Z4Translations.NONE_HIM = "None";
    Z4Translations.NONE_HER = "None";
    Z4Translations.BORDER = "Border";
    Z4Translations.SHADOW = "Shadow";
    Z4Translations.DELTA_X = "Delta X";
    Z4Translations.DELTA_Y = "Delta Y";
    Z4Translations.VISIBLE = "Visible";
    Z4Translations.SELECTED = "Selected";
    Z4Translations.MOVE_UP = "Move Up";
    Z4Translations.MOVE_DOWN = "Move Down";
    Z4Translations.MOVE_BOTTOM = "Move to Bottom";
    Z4Translations.MOVE_TOP = "Move to Top";
    Z4Translations.TRY_ME = "Try Me";
    Z4Translations.ACTIONS = "Actions";
    Z4Translations.DRAWING_DIRECTION = "Drawing Direction";
    Z4Translations.SHOW_GRID = "Show Grid";
    Z4Translations.MAGNETIC_GRID = "Magnetic Grid";
    Z4Translations.DOTTED_GRID = "Dotted Grid";
    Z4Translations.PLOT_WIDTH = "Plot Width";
    Z4Translations.RESET_ON_START_MOVING = "Reset on Start Moving";
    Z4Translations.RESIZE = "Resize";
    Z4Translations.CONTAINER = "Container";
    Z4Translations.CONTENT = "Content";
    Z4Translations.RESIZE_CONTAINER_AND_CONTENT = "Resize Container and Content";
    Z4Translations.RESIZE_CONTAINER_AND_ADAPT_CONTENT = "Resize Container and Adapt Content";
    Z4Translations.RESIZE_CONTAINER = "Resize Container";
    Z4Translations.RESIZE_CONTENT = "Resize Content";
    Z4Translations.IMAGE_TOO_BIG_MESSAGE = "The image is too big to be loaded; image size = $image_size$, max image size = $max_image_size$";
    Z4Translations.IMAGE_OPEN_ERROR_MESSAGE = "It is not possible to open the image";
    Z4Translations.DRAWING_TOOL_OPEN_ERROR_MESSAGE = "It is not possible to open the drawing tool";
    Z4Translations.DO_NOT_SHOW_AGAIN_MESSAGE = "Do not show this message again";
    Z4Translations.FILTER = "Filter";
    Z4Translations.EMPTY_HIS = "Empty";
    Z4Translations.EMPTY_HER = "Empty";
    Z4Translations.SHEARING = "Shearing";
    Z4Translations.HORIZONTAL = "Horizontal";
    Z4Translations.VERTICAL = "Vertical";
    Z4Translations.APPLY = "Apply";

    // Text
    Z4Translations.BOLD = "Bold";
    Z4Translations.ITALIC = "Italic";
    Z4Translations.STRING_EXAMPLE = "Sample string of the selected font";

    // Color
    Z4Translations.COLOR = "Color";
    Z4Translations.FILLING_COLOR = "Filling Color";
    Z4Translations.BACKGROUND_COLOR = "Background Color";
    Z4Translations.MIRRORED = "Mirrored";
    Z4Translations.INVERTED = "Inverted";
    Z4Translations.DELETE_COLOR_MESSAGE = "Do you really want to delete the color?";
    Z4Translations.LIGHTED = "Lighted";
    Z4Translations.DARKENED = "Darkened";
    Z4Translations.SPATIAL = "Spatial";
    Z4Translations.TEMPORAL = "Temporal";
    Z4Translations.LIGHTING = "Lighting";
    Z4Translations.PICK_COLOR = "Pick Color";
    Z4Translations.COLOR_STORED_IN_HISTORY = "The color has been stored in the color history";

    // Point Iterator
    Z4Translations.MULTIPLICITY = "Multiplicity";
    Z4Translations.PUSH = "Push";
    Z4Translations.ROTATION = "Rotation";
    Z4Translations.ATTACK = "Attack";
    Z4Translations.SUSTAIN = "Sustain";
    Z4Translations.RELEASE = "Release";
    Z4Translations.ENDLESS = "Endless";
    Z4Translations.RADIUS = "Radius";
    Z4Translations.SPEED = "Speed";
    Z4Translations.DRAW_WHILE_MOVING = "Draw While Moving";
    Z4Translations.SCATTERING = "Scattering";
    Z4Translations.ASSISTED_DRAWING = "Assisted Drawing";

    // Painter
    Z4Translations.TENSION = "Tension";
    Z4Translations.HOLE = "Hole";
    Z4Translations.COVER = "Cover";
    Z4Translations.WHIRLPOOL = "Whirlpool";
    Z4Translations.POINTS = "Points";
    Z4Translations.INTERNAL_BASE_POINT = "Internal Base Point";
    Z4Translations.EXTERNAL_BASE_POINT = "External Base Point";
    Z4Translations.INTERNAL_TERMINAL_POINT = "Internal Terminal Point";
    Z4Translations.EXTERNAL_TERMINAL_POINT = "External Terminal Point";
    Z4Translations.INDENTATION = "Indentation";
    Z4Translations.EXTERNAL_FORCE = "External Force";
    Z4Translations.INTENSITY = "Intensity";
    Z4Translations.GAUSSIAN_CORRECTION = "Gaussian Correction";
    Z4Translations.THICKNESS = "Thickness";
    Z4Translations.DELETE_PATTERN_MESSAGE = "Do you really want to delete the pattern?";
    Z4Translations.DELETE_PATTERNS_MESSAGE = "Do you really want to delete the selected patterns?";
    Z4Translations.RANDOM_SEQUENCE = "Random Sequence";
    Z4Translations.MULTI_DIMENSION = "Multi Dimension";

    // Math
    Z4Translations.POSITIVE = "Positive";
    Z4Translations.NEGATIVE = "Negative";
    Z4Translations.ALTERNATE = "Alternate";
    Z4Translations.CONSTANT = "Constant";
    Z4Translations.RANDOM = "Random";
    Z4Translations.CLASSIC = "Classic";
    Z4Translations.STEPPED = "Stepped";
    Z4Translations.POLYLINE = "Polyline";
    Z4Translations.BEZIER = "Bezier";
    Z4Translations.LENGTH = "Length";
    Z4Translations.UNIFORM_SIGN = "Uniform Sign";
    Z4Translations.FIXED = "Fixed";
    Z4Translations.VARIABLE = "Variable";
    Z4Translations.CUMULATIVE = "Cumulative";
    Z4Translations.RELATIVE_TO_PATH = "Relative to Path";
    Z4Translations.DELAYED = "Delayed";
    Z4Translations.STEP = "Step";
    Z4Translations.SHAPE = "Shape";
    Z4Translations.ANGLE = "Angle";
    Z4Translations.FORWARD = "Forward";
    Z4Translations.BACKWARD = "Backward";
    Z4Translations.DISTANCE = "Distance";
    Z4Translations.CENTER_VERB = "Center";

    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Composite Operation";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "This is the default setting and draws the layer on top of the existing content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "The layer is drawn only where both the layer and the destination content overlap; everything else is made transparent";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "The layer is drawn where it doesn't overlap the existing content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "The layer is only drawn where it overlaps the existing content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "The layer is drawn behind the existing content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "The existing content is kept where both the layer and existing content overlap; everything else is made transparent";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "The existing content is kept where it doesn't overlap the layer";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "The existing content is only kept where it overlaps the layer; the layer is drawn behind the content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "Where both layer and existing content overlap the color is determined by adding color values";
    Z4Translations.COMPOSITE_OPERATION_COPY = "Only the layer is shown";
    Z4Translations.COMPOSITE_OPERATION_XOR = "Layer and existing content are made transparent where both overlap and drawn normal everywhere else";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "The pixels of the layer are multiplied with the corresponding pixel of the existing content; a darker picture is the result";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "The pixels are inverted, multiplied, and inverted again; a lighter picture is the result (opposite of 'multiply')";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "A combination of 'multiply' and 'screen'; dark parts on the existing content become darker, and light parts become lighter";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "Retains the darkest pixels of both layer and existing content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "Retains the lightest pixels of both layer and existing content";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "Divides the existing content by the inverted layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "Divides the inverted existing content by the layer, and then inverts the result";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "A combination of 'multiply' and 'screen' like 'overlay', but with layer and existing content swapped";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "A softer version of 'hard-light'; pure black or white does not result in pure black or white";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "Subtracts the existing content from the layer or the other way round to always get a positive value";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "Like 'difference', but with lower contrast";
    Z4Translations.COMPOSITE_OPERATION_HUE = "Preserves the luma and chroma of the existing content, while adopting the hue of the layer";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "Preserves the luma and hue of the existing content, while adopting the chroma of the layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "Preserves the luma of the existing content, while adopting the hue and chroma of the layer";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "Preserves the hue and chroma of the existing content, while adopting the luma of the layer";

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  public static void setItalian() {
    // Ribbon Project
    Z4Translations.PROJECT = "Progetto";
    Z4Translations.NEW_PROJECT = "Nuovo Progetto";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.SAVE_PROJECT_AS = "Salva Progetto con Nome";
    Z4Translations.EXPORT = "Esporta";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Progetto non salvato, vuoi salvare le modifiche?";
    Z4Translations.IMAGE_FILE = "File Immagine";
    Z4Translations.PIZZAPAZZA_PROJECT = "Progetto pizzApazzA";

    // Ribbon Layer
    Z4Translations.LAYER = "Livello";
    Z4Translations.LAYER_NAME = "Nome Livello";
    Z4Translations.NEW_LAYER = "Nuovo Livello";
    Z4Translations.BACKGROUND_LAYER = "Sfondo";
    Z4Translations.DELETE_LAYER_MESSAGE = "Vuoi davvero eliminare il livello?";
    Z4Translations.MERGE_VISIBLE_LAYERS = "Fondi Livelli Visibili";
    Z4Translations.MERGE_ALL_LAYERS = "Fondi Tutti i Livelli";
    Z4Translations.SHOW_LAYER_BOUNDS = "Mostra Bordi Livello";

    // Ribbon Drawing Tool
    Z4Translations.NEW_DRAWING_TOOL = "Nuovo Strumento di Disegno";
    Z4Translations.DRAWING_TOOL = "Strumento di Disegno";
    Z4Translations.DRAWING_TOOL_NAME = "Nome Strumento di Disegno";
    Z4Translations.SAVE_DRAWING_TOOL_AS = "Salva con Nome";
    Z4Translations.SAVE_DRAWING_TOOLS_AS = "Salva Tutti con Nome";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOL = "Strumento di Disegno pizzApazzA";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOLS = "Strumenti di Disegno pizzApazzA";
    Z4Translations.DELETE_DRAWING_TOOL_MESSAGE = "Vuoi davvero eliminare lo strumento di disegno?";
    Z4Translations.FROM_LIBRARY = "Da Libreria";

    // Ribbon Text
    Z4Translations.TEXT = "Testo";
    Z4Translations.FONT_SELECTION = "Selezione Font";
    Z4Translations.REFLEX = "Riflessa";

    // Ribbon History
    Z4Translations.HISTORY = "Cronologia";
    Z4Translations.UNDO = "Annulla";
    Z4Translations.REDO = "Ripeti";
    Z4Translations.CONSOLIDATE = "Consolida";
    Z4Translations.CONSOLIDATE_MESSAGE = "La consolidazione rimuover\u00E0 tutta la cronologia, vuoi proseguire?";

    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.THEME_COLOR = "Colore";
    Z4Translations.HISTORY_MANAGEMENT = "Gestione Cronologia";
    Z4Translations.STANDARD_POLICY = "Standard";
    Z4Translations.STANDARD_POLICY_DESCRIPTION = "La cronologia viene aggiornata ad ogni conclusione di un'operazione di disegno ed ad ogni operazione \"globale\" sul disegno";
    Z4Translations.TIMER_POLICY = "A Tempo";
    Z4Translations.TIMER_POLICY_DESCRIPTION = "La cronologia viene aggiornata ad intervalli regolari (solo se il disegno \u00E8 stato modificato)";
    Z4Translations.MANUAL_POLICY = "Manuale";
    Z4Translations.MANUAL_POLICY_DESCRIPTION = "La cronologia viene aggiornata manualmente (solo se il disegno \u00E8 stato modificato)";
    Z4Translations.TOOL_POLICY = "Su Cambio Strumento di Disegno";
    Z4Translations.TOOL_POLICY_DESCRIPTION = "La cronologia viene aggiornata quando viene cambiato lo strumento di disegno (solo se il disegno \u00E8 stato modificato) ed ad ogni operazione \"globale\" sul disegno";
    Z4Translations.SAVING_INTERVAL = "Intervallo di Salvataggio";
    Z4Translations.SAVING_DELAY = "Ritardo di Salvataggio";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";

    // Ribbon Help
    Z4Translations.HELP = "Aiuto";
    Z4Translations.ABOUT = "Informazioni su";
    Z4Translations.BASED_ON
            = "<p>pizzApazzA<sup>&#8734;</sup> Versione $version$ \u00E8 basato su pizzApazzA VB6 di Ettore Luzio ed \u00E8 distribuito con <a href='https://unlicense.org/' target='_blank'>licenza Unlicense</a>.</p>"
            + "<p>Sviluppato in Java da Gianpiero Di Blasi, tradotto in JavaScript tramite <a href='https://github.com/gianpierodiblasi/josetta' target='_blank'>josetta</a> (<a href='https://github.com/gianpierodiblasi/pizzApazzAinfinity' target='_blank'>repository github</a>).</p>"
            + "<p>Ettore Luzio e Gianpiero Di Blasi sono i fondatori del <a href='https://sites.google.com/view/gruppoz4/home'>GruppoZ4</a>.</p>"
            + "<p>Dipendenze: " + Z4Translations.DEPENDENCIES + "</p>";
    Z4Translations.INSTALL = "<span>Installa pizzApazzA<sup>&#8734;</sup></span>";
    Z4Translations.CHECK_UPDATE = "Controlla gli Aggiornamenti";

    // Other
    Z4Translations.PROJECT_NAME = "Nome Progetto";
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";
    Z4Translations.RESET = "Ripristina";
    Z4Translations.RESET_MESSAGE = "Vuoi davvero ripristinare i parametri iniziali?";
    Z4Translations.WIDTH = "Larghezza";
    Z4Translations.HEIGHT = "Altezza";
    Z4Translations.RESOLUTION = "Risoluzione";
    Z4Translations.PATTERN = "Trama";
    Z4Translations.PATTERNS = "Trame";
    Z4Translations.EDIT = "Modifica";
    Z4Translations.FIT = "Adatta";
    Z4Translations.OFFSET = "Offset";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Base";
    Z4Translations.ADVANCED = "Avanzato";
    Z4Translations.STAR = "Stella";
    Z4Translations.VERTICES = "Vertici";
    Z4Translations.REGULAR = "Regolare";
    Z4Translations.DIMENSION = "Dimensione";
    Z4Translations.FREE = "Libero";
    Z4Translations.LOCK_ASPECT_RATIO = "Blocca Proporzioni";
    Z4Translations.LOCK = "Blocca";
    Z4Translations.RIPPLE = "Caoticit\u00E0";
    Z4Translations.DELETE = "Elimina";
    Z4Translations.DUPLICATE = "Duplica";
    Z4Translations.TRANSFORM = "Trasforma";
    Z4Translations.FLIP_HORIZONTAL = "Rifletti Orizzontale";
    Z4Translations.FLIP_VERTICAL = "Rifletti Verticale";
    Z4Translations.ROTATE_PLUS_90 = "Ruota +90\u00B0";
    Z4Translations.ROTATE_MINUS_90 = "Ruota -90\u00B0";
    Z4Translations.ROTATE_180 = "Ruota 180\u00B0";
    Z4Translations.SPACE = "Spazio \u2192";
    Z4Translations.TIME = "\u2190 Tempo";
    Z4Translations.FILLING = "Riempimento";
    Z4Translations.MERGE = "Fondi";
    Z4Translations.NONE_HIM = "Nessuno";
    Z4Translations.NONE_HER = "Nessuna";
    Z4Translations.BORDER = "Bordo";
    Z4Translations.SHADOW = "Ombra";
    Z4Translations.DELTA_X = "Delta X";
    Z4Translations.DELTA_Y = "Delta Y";
    Z4Translations.VISIBLE = "Visibile";
    Z4Translations.SELECTED = "Selezionato";
    Z4Translations.MOVE_UP = "Muovi Su";
    Z4Translations.MOVE_DOWN = "Muovi Gi\u00F9";
    Z4Translations.MOVE_BOTTOM = "Muovi in Fondo";
    Z4Translations.MOVE_TOP = "Muovi in Cima";
    Z4Translations.TRY_ME = "Provami";
    Z4Translations.ACTIONS = "Azioni";
    Z4Translations.DRAWING_DIRECTION = "Direzione di Disegno";
    Z4Translations.SHOW_GRID = "Mostra Griglia";
    Z4Translations.MAGNETIC_GRID = "Griglia Magnetica";
    Z4Translations.DOTTED_GRID = "Griglia Punteggiata";
    Z4Translations.PLOT_WIDTH = "Larghezza Trama";
    Z4Translations.RESET_ON_START_MOVING = "Riavvia su Inizio del Movimento";
    Z4Translations.RESIZE = "Ridimensiona";
    Z4Translations.CONTAINER = "Contenitore";
    Z4Translations.CONTENT = "Contenuto";
    Z4Translations.RESIZE_CONTAINER_AND_CONTENT = "Ridimensiona Contenitore e Contenuto";
    Z4Translations.RESIZE_CONTAINER_AND_ADAPT_CONTENT = "Ridimensiona Contenitore ed Adatta Contenuto";
    Z4Translations.RESIZE_CONTAINER = "Ridimensiona Contenitore";
    Z4Translations.RESIZE_CONTENT = "Ridimensiona Contenuto";
    Z4Translations.IMAGE_TOO_BIG_MESSAGE = "L'immagine \u00E8 troppo grande per essere caricata; dimensione immagine = $image_size$, dimensione massima immagine = $max_image_size$";
    Z4Translations.IMAGE_OPEN_ERROR_MESSAGE = "Non \u00E8 possibile aprire l'immagine";
    Z4Translations.DRAWING_TOOL_OPEN_ERROR_MESSAGE = "Non \u00E8 possibile aprire lo strumento di disegno";
    Z4Translations.DO_NOT_SHOW_AGAIN_MESSAGE = "Non mostrare pi\u00F9 questo messaggio";
    Z4Translations.FILTER = "Filtra";
    Z4Translations.EMPTY_HIS = "Vuoto";
    Z4Translations.EMPTY_HER = "Vuota";
    Z4Translations.SHEARING = "Inclinazione";
    Z4Translations.HORIZONTAL = "Orizzontale";
    Z4Translations.VERTICAL = "Verticale";
    Z4Translations.APPLY = "Applica";

    // Text
    Z4Translations.BOLD = "Grassetto";
    Z4Translations.ITALIC = "Corsivo";
    Z4Translations.STRING_EXAMPLE = "Stringa di esempio del font selezionato";

    // Color
    Z4Translations.COLOR = "Colore";
    Z4Translations.FILLING_COLOR = "Colore di Riempimento";
    Z4Translations.BACKGROUND_COLOR = "Colore di Sfondo";
    Z4Translations.MIRRORED = "Riflesso";
    Z4Translations.INVERTED = "Invertito";
    Z4Translations.DELETE_COLOR_MESSAGE = "Vuoi davvero eliminare il colore?";
    Z4Translations.LIGHTED = "Illuminato";
    Z4Translations.DARKENED = "Incupito";
    Z4Translations.SPATIAL = "Spaziale";
    Z4Translations.TEMPORAL = "Temporale";
    Z4Translations.LIGHTING = "Illuminazione";
    Z4Translations.PICK_COLOR = "Preleva Colore";
    Z4Translations.COLOR_STORED_IN_HISTORY = "Il colore \u00E8 stato conservato nella cronologia dei colori";

    // Point Iterator
    Z4Translations.MULTIPLICITY = "Molteplicit\u00E0";
    Z4Translations.PUSH = "Spinta";
    Z4Translations.ROTATION = "Rotazione";
    Z4Translations.ATTACK = "Attacco";
    Z4Translations.SUSTAIN = "Sostegno";
    Z4Translations.RELEASE = "Rilascio";
    Z4Translations.ENDLESS = "Infinito";
    Z4Translations.RADIUS = "Raggio";
    Z4Translations.SPEED = "Velocit\u00E0";
    Z4Translations.DRAW_WHILE_MOVING = "Disegna Durante il Movimento";
    Z4Translations.SCATTERING = "Dispersione";
    Z4Translations.ASSISTED_DRAWING = "Disegno Assistito";

    // Painter
    Z4Translations.TENSION = "Tensione";
    Z4Translations.HOLE = "Buco";
    Z4Translations.COVER = "Copertura";
    Z4Translations.WHIRLPOOL = "Vortice";
    Z4Translations.POINTS = "Punti";
    Z4Translations.INTERNAL_BASE_POINT = "Punto Base Interno";
    Z4Translations.EXTERNAL_BASE_POINT = "Punto Base Esterno";
    Z4Translations.INTERNAL_TERMINAL_POINT = "Punto Terminale Interno";
    Z4Translations.EXTERNAL_TERMINAL_POINT = "Punto Terminale Esterno";
    Z4Translations.INDENTATION = "Frastagliatura";
    Z4Translations.EXTERNAL_FORCE = "Forza Esterna";
    Z4Translations.INTENSITY = "Intensit\u00E0";
    Z4Translations.GAUSSIAN_CORRECTION = "Correzione Gaussiana";
    Z4Translations.THICKNESS = "Spessore";
    Z4Translations.DELETE_PATTERN_MESSAGE = "Vuoi davvero eliminare la trama?";
    Z4Translations.DELETE_PATTERNS_MESSAGE = "Vuoi davvero eliminare le trame selezionate?";
    Z4Translations.RANDOM_SEQUENCE = "Sequenza Casuale";
    Z4Translations.MULTI_DIMENSION = "Multi Dimensione";

    // Math
    Z4Translations.POSITIVE = "Positivo";
    Z4Translations.NEGATIVE = "Negativo";
    Z4Translations.ALTERNATE = "Alternato";
    Z4Translations.CONSTANT = "Costante";
    Z4Translations.RANDOM = "Random";
    Z4Translations.CLASSIC = "Classico";
    Z4Translations.STEPPED = "A Gradino";
    Z4Translations.POLYLINE = "Polilinea";
    Z4Translations.BEZIER = "Bezier";
    Z4Translations.LENGTH = "Lunghezza";
    Z4Translations.UNIFORM_SIGN = "Segno Uniforme";
    Z4Translations.FIXED = "Fisso";
    Z4Translations.VARIABLE = "Variabile";
    Z4Translations.CUMULATIVE = "Cumulativo";
    Z4Translations.RELATIVE_TO_PATH = "Relativo al Percorso";
    Z4Translations.DELAYED = "Ritardato";
    Z4Translations.STEP = "Passo";
    Z4Translations.SHAPE = "Forma";
    Z4Translations.ANGLE = "Angolo";
    Z4Translations.FORWARD = "In Avanti";
    Z4Translations.BACKWARD = "Indietro";
    Z4Translations.DISTANCE = "Distanza";
    Z4Translations.CENTER_VERB = "Centra";

    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Operazione Composita";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "Questa \u00E8 l'impostazione predefinita e disegna il livello sopra il contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "Il livello viene disegnato solo dove si sovrappongono sia il livello che il contenuto di destinazione; tutto il resto \u00E8 reso trasparente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "Il livello viene disegnato dove non si sovrappone al contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "Il livello viene disegnato solo dove si sovrappone al contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "Il livello viene disegnato dietro il contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "Il contenuto esistente viene mantenuto dove sia il livello che il contenuto esistente si sovrappongono; tutto il resto \u00E8 reso trasparente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "Il contenuto esistente viene mantenuto dove non si sovrappone al livello";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "Il contenuto esistente viene mantenuto solo dove si sovrappone al livello; il livello viene disegnato dietro il contenuto";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "Laddove sia il livello che il contenuto esistente si sovrappongono, il colore viene determinato sommando i colori";
    Z4Translations.COMPOSITE_OPERATION_COPY = "Viene mostrato solo il livello";
    Z4Translations.COMPOSITE_OPERATION_XOR = "Il livello e il contenuto esistente vengono resi trasparenti laddove entrambi si sovrappongono e vengono disegnati normali altrove";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "I pixel del layer vengono moltiplicati per il pixel corrispondente del contenuto esistente; il risultato \u00E8 un'immagine pi\u00F9 scura";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "I pixel vengono invertiti, moltiplicati e nuovamente invertiti; il risultato \u00E8 un'immagine pi\u00F9 chiara (opposto di 'multiply')";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "Una combinazione di 'multiply' e 'screen'; le parti scure del contenuto esistente diventano pi\u00F9 scure e le parti chiare diventano pi\u00F9 chiare";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "Mantiene i pixel pi\u00F9 scuri sia del livello che del contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "Mantiene i pixel pi\u00F9 chiari sia del livello che del contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "Divide il contenuto esistente per il livello invertito";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "Divide il contenuto esistente invertito per il livello, quindi inverte il risultato";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "Una combinazione di 'multiply' e 'screen' come 'overlay', ma con il livello e il contenuto esistente scambiati";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "Una versione pi\u00F9 morbida della 'hard-light'; il nero o il bianco puro non risultano in bianco o nero puro";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "Sottrae il contenuto esistente dal livello o viceversa per ottenere sempre un valore positivo";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "Come 'difference', ma con contrasto inferiore";
    Z4Translations.COMPOSITE_OPERATION_HUE = "Preserva la luminanza e la crominanza del contenuto esistente, adottando la tonalit\u00E0 del livello";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "Preserva la luminanza e la tonalit\u00E0 del contenuto esistente, adottando la crominanza del livello";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "Preserva la luminanza del contenuto esistente, adottando la tonalit\u00E0 e la saturazione del livello";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "Preserva la tonalit\u00E0 e il croma del contenuto esistente, adottando la luminanza del livello";

    Z4Translations.CURRENT_LANGUAGE = new KeyValue<>("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
