package pizzapazza.ui.panel.ribbon;

import javascript.awt.BoxLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;

/**
 * The ribbon panel containing the drawing tool menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonDrawingToolPanel extends Z4AbstractRibbonPanel {

  private final JSPanel drawingToolsPreview = new JSPanel();

  /**
   * Creates the object
   */
  public Z4RibbonDrawingToolPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbondrawingtoolpanel");

    this.addButton(Z4Translations.CREATE, true, 0, 0, "left", 5, event -> {
    });

    this.addButton(Z4Translations.OPEN, true, 1, 0, "both", 5, event -> {
    });

    this.addButton(Z4Translations.SAVE_DRAWING_TOOLS_AS, true, 2, 0, "right", 5, event -> {
    });

    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.drawingToolsPreview.setLayout(new BoxLayout(this.drawingToolsPreview, BoxLayout.X_AXIS));
    this.drawingToolsPreview.getStyle().overflowX = "scroll";
    this.add(this.drawingToolsPreview, new GBC(4, 0).h(2).wx(1).f(GBC.BOTH));
  }

}
