package pizzapazza.ui.panel.ribbon;

import def.js.Array;
import def.js.Set;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSOptionPane;
import javascript.swing.JSTextField;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import pizzapazza.ui.panel.Z4FontSelectionPanel;
import pizzapazza.util.Z4Font;
import pizzapazza.util.Z4TextInfo;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;

/**
 * The ribbon panel containing the settings to draw text
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonTextPanel extends Z4AbstractRibbonPanel {

  private final JSButton fontSelection = new JSButton();
  private final JSTextField textText = new JSTextField();
  private final JSTextField shadowText = new JSTextField();
  private final JSCheckBox textEmpty = new JSCheckBox();
  private final JSCheckBox shadowEmpty = new JSCheckBox();

  private final JSButton apply = new JSButton();
  private final JSButton reset = new JSButton();

  private Z4Canvas canvas;
  private boolean fontsChecked;
  private final Array<String> fonts = new Array<>();
  private final Z4TextInfo textInfo = new Z4TextInfo();

  /**
   * Creates the object
   */
  public Z4RibbonTextPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbontextpanel");

    this.textInfo.font = new Z4Font("Arial", 15, true, true);

    this.fontSelection.setContentAreaFilled(false);
    this.fontSelection.setText(Z4Translations.FONT_SELECTION);
    this.fontSelection.addActionListener(event -> {
      Z4FontSelectionPanel fontSelectionPanel = new Z4FontSelectionPanel(this.fonts);
      fontSelectionPanel.setValue(this.textInfo.font);

      JSOptionPane.showInputDialog(fontSelectionPanel, Z4Translations.FONT_SELECTION, listener -> fontSelectionPanel.addChangeListener(listener), () -> $exists(fontSelectionPanel.getValue()), response -> {
        if (response == JSOptionPane.OK_OPTION) {
          this.textInfo.font = fontSelectionPanel.getValue();
          this.onTextInfoChange();
        }
      });
    });
    this.add(this.fontSelection, new GBC(0, 1));
    Z4UI.addVLine(this, new GBC(1, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    Z4UI.addLabel(this, Z4Translations.TEXT, new GBC(2, 0).a(GBC.WEST).i(5, 5, 2, 0));

    this.textText.addActionListener(event -> this.onTextInfoChange());
    this.add(this.textText, new GBC(2, 1).a(GBC.WEST));

    this.textEmpty.setText(Z4Translations.EMPTY);
    this.textEmpty.addActionListener(event -> this.onTextInfoChange());
    this.add(this.textEmpty, new GBC(2, 2).a(GBC.WEST));

    Z4UI.addVLine(this, new GBC(11, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    Z4UI.addLabel(this, Z4Translations.SHADOW, new GBC(12, 0).a(GBC.WEST).i(5, 5, 2, 0));

    this.shadowText.addActionListener(event -> this.onTextInfoChange());
    this.add(this.shadowText, new GBC(12, 1).a(GBC.WEST));

    this.shadowEmpty.setText(Z4Translations.EMPTY);
    this.shadowEmpty.addActionListener(event -> this.onTextInfoChange());
    this.add(this.shadowEmpty, new GBC(12, 2).a(GBC.WEST));

    Z4UI.addVLine(this, new GBC(21, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.apply.setContentAreaFilled(false);
    this.apply.setText("APPLY");
    this.apply.addActionListener(event -> {
    });
    this.add(this.apply, new GBC(22, 1));

    this.reset.setContentAreaFilled(false);
    this.reset.setText(Z4Translations.RESET);
    this.reset.addActionListener(event -> this.onReset());
    this.add(this.reset, new GBC(23, 1).i(0, 5, 0, 0));
  }

  private void onTextInfoChange() {
    this.textInfo.textText = this.textText.getText();
    this.textInfo.textEmpty = this.textEmpty.isSelected();

    this.textInfo.shadowText = this.shadowText.getText();
    this.textInfo.shadowEmpty = this.shadowEmpty.isSelected();
  }

  private void onReset() {
    this.textText.setText("");
    this.textEmpty.setSelected(false);
    this.shadowText.setText("");
    this.shadowEmpty.setSelected(false);

    this.onTextInfoChange();
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
    });
  }

  private void checkLocalFonts(Set<String> foundFonts) {
//    if ($typeof(window.$get("queryLocalFonts"), "function")) {
//      window.queryLocalFonts().then(localFonts -> {
//        localFonts.forEach(localFont -> foundFonts.add(localFont.family));
//        this.setFontsChecked(foundFonts);
//      });
//    } else {
    this.setFontsChecked(foundFonts);
//    }
  }

  private void setFontsChecked(Set<String> foundFonts) {
    foundFonts.forEach((value, key, set) -> this.fonts.push(value));
    this.fonts.sort();

    this.fontsChecked = true;
    this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
  }
}
