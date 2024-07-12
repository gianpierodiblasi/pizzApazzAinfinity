package pizzapazza.ui.panel.ribbon;

import def.js.Array;
import def.js.Set;
import javascript.awt.GridBagLayout;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;

/**
 * The ribbon panel containing the settings to draw text
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonTextPanel extends Z4AbstractRibbonPanel {

  private Z4Canvas canvas;
  private boolean fontsChecked;
  private final Array<String> fonts = new Array<>();

  /**
   * Creates the object
   */
  public Z4RibbonTextPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbontextpanel");
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Checks the available fonts
   */
  public void checkFonts() {
    if (this.fontsChecked) {
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
    } else {
      this.checkStandardFonts();
    }
  }

  private void checkStandardFonts() {
    Set<String> fontsToCheck = new Set<>(new Array<>(
            "Arial", "Arial Black", "Bahnschrift", "Calibri", "Cambria", "Cambria Math", "Candara", "Comic Sans MS", "Consolas", "Constantia", "Corbel", "Courier New", "Ebrima", "Franklin Gothic Medium", "Gabriola", "Gadugi", "Georgia", "HoloLens MDL2 Assets", "Impact", "Ink Free", "Javanese Text", "Leelawadee UI", "Lucida Console", "Lucida Sans Unicode", "Malgun Gothic", "Marlett", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU-ExtB", "Mongolian Baiti", "MS Gothic", "MV Boli", "Myanmar Text", "Nirmala UI", "Palatino Linotype", "Segoe MDL2 Assets", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Historic", "Segoe UI Emoji", "Segoe UI Symbol", "SimSun", "Sitka", "Sylfaen", "Symbol", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings", "Wingdings", "Yu Gothic",
            "American Typewriter", "Andale Mono", "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Avenir", "Avenir Next", "Avenir Next Condensed", "Baskerville", "Big Caslon", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bradley Hand", "Brush Script MT", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charter", "Cochin", "Comic Sans MS", "Copperplate", "Courier", "Courier New", "Didot", "DIN Alternate", "DIN Condensed", "Futura", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Helvetica Neue", "Herculanum", "Hoefler Text", "Impact", "Lucida Grande", "Luminari", "Marker Felt", "Menlo", "Microsoft Sans Serif", "Monaco", "Noteworthy", "Optima", "Palatino", "Papyrus", "Phosphate", "Rockwell", "Savoye LET", "SignPainter", "Skia", "Snell Roundhand", "Tahoma", "Times", "Times New Roman", "Trattatello", "Trebuchet MS", "Verdana", "Zapfino"
    ));

    Set<String> foundFonts = new Set<>();
    document.fonts.ready.then(() -> {
      fontsToCheck.forEach((value, key, set) -> {
        if (document.fonts.check("12px '" + value + "'")) {
          foundFonts.add(value);
        }
      });

      this.checkLocalFonts(foundFonts);
      return null;
    });
  }

  private void checkLocalFonts(Set<String> foundFonts) {
    if ($typeof(window.$get("queryLocalFonts"), "function")) {
      window.queryLocalFonts().then(localFonts -> {
        localFonts.forEach(localFont -> foundFonts.add(localFont.family));
        this.setFontsChecked(foundFonts);
        return null;
      });
    } else {
      this.setFontsChecked(foundFonts);
    }
  }

  private void setFontsChecked(Set<String> foundFonts) {
    foundFonts.forEach((value, key, set) -> this.fonts.push(value));
    this.fonts.sort();

    this.fontsChecked = true;
    this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
  }
}
