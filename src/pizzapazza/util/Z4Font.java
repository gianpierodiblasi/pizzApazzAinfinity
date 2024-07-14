package pizzapazza.util;

import def.js.Array;
import def.js.Set;
import def.js.Uint8Array;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.window;

/**
 * The font object
 *
 * @author gianpiero.diblasi
 */
public class Z4Font {

  public final String family;
  public final int size;
  public final boolean bold;
  public final boolean italic;

  private final static Array<String> FONTS_TO_CHECK = new Array<>(
          "Arial", "Arial Black", "Bahnschrift", "Calibri", "Cambria", "Cambria Math", "Candara", "Comic Sans MS", "Consolas", "Constantia", "Corbel", "Courier New", "Ebrima", "Franklin Gothic Medium", "Gabriola", "Gadugi", "Georgia", "HoloLens MDL2 Assets", "Impact", "Ink Free", "Javanese Text", "Leelawadee UI", "Lucida Console", "Lucida Sans Unicode", "Malgun Gothic", "Marlett", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU-ExtB", "Mongolian Baiti", "MS Gothic", "MV Boli", "Myanmar Text", "Nirmala UI", "Palatino Linotype", "Segoe MDL2 Assets", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Historic", "Segoe UI Emoji", "Segoe UI Symbol", "SimSun", "Sitka", "Sylfaen", "Symbol", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings", "Wingdings", "Yu Gothic",
          "American Typewriter", "Andale Mono", "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Avenir", "Avenir Next", "Avenir Next Condensed", "Baskerville", "Big Caslon", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bradley Hand", "Brush Script MT", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charter", "Cochin", "Comic Sans MS", "Copperplate", "Courier", "Courier New", "Didot", "DIN Alternate", "DIN Condensed", "Futura", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Helvetica Neue", "Herculanum", "Hoefler Text", "Impact", "Lucida Grande", "Luminari", "Marker Felt", "Menlo", "Microsoft Sans Serif", "Monaco", "Noteworthy", "Optima", "Palatino", "Papyrus", "Phosphate", "Rockwell", "Savoye LET", "SignPainter", "Skia", "Snell Roundhand", "Tahoma", "Times", "Times New Roman", "Trattatello", "Trebuchet MS", "Verdana", "Zapfino"
  );
  private final static $CanvasRenderingContext2D CTX = new $OffscreenCanvas(100, 100).getContext("2d");
  @SuppressWarnings("FieldMayBeFinal")
  private static Uint8Array DATA_ARIAL;

  static {
    Z4Font.CTX.textAlign = "center";
    Z4Font.CTX.fillStyle = Z4Constants.$getStyle("black");
    Z4Font.CTX.textBaseline = "middle";

    Z4Font.DATA_ARIAL = Z4Font.getFontDataUint8Array("Arial");
  }

  /**
   * Creates the object
   *
   * @param family The font family
   * @param size The font size (in pixel)
   * @param bold true for a bold font, false otherwise
   * @param italic true for an italic font, false otherwise
   */
  public Z4Font(String family, int size, boolean bold, boolean italic) {
    this.family = family;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
  }

  /**
   * Returns the available font families
   *
   * @param queryLocalFonts true to query local fonts, false otherwise
   * @param apply The function to apply
   */
  public static void getAvailableFontFamilies(boolean queryLocalFonts, $Apply_1_Void<Set<String>> apply) {
    Set<String> available = new Set<>();
    Z4Font.FONTS_TO_CHECK.forEach(font -> {
      if (Z4Font.checkFont(font)) {
        available.add(font);
      }
    });

    if (queryLocalFonts && $typeof(window.$get("queryLocalFonts"), "function")) {
      window.queryLocalFonts().then(localFonts -> {
        localFonts.forEach(localFont -> {
          if (Z4Font.checkFont(localFont.family)) {
            available.add(localFont.family);
          }
        });
        apply.$apply(available);
      });
    } else {
      apply.$apply(available);
    }
  }

  @SuppressWarnings("StringEquality")
  private static boolean checkFont(String fontFamily) {
    if (fontFamily == "Arial") {
      return true;
    } else {
      Uint8Array data = Z4Font.getFontDataUint8Array(fontFamily);
      return data.some((value, index, array) -> value != Z4Font.DATA_ARIAL.$get(index));
    }
  }

  private static Uint8Array getFontDataUint8Array(String fontFamily) {
    Z4Font.CTX.clearRect(0, 0, 100, 100);
    Z4Font.CTX.font = "100px " + fontFamily + ", Arial";
    Z4Font.CTX.fillText("a", 50, 50);

    return Z4Font.CTX.getImageData(0, 0, 100, 100).data;
  }
}
