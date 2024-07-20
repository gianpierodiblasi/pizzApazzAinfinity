package pizzapazza.ui.panel.math.geometricshape;

import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.document;

/**
 * The panel to manage shapes and paths
 *
 * @author gianpiero.diblasi
 */
public class Z4ShapesAndPathsPanel extends JSPanel {

  /**
   * Creates the object
   */
  public Z4ShapesAndPathsPanel() {
    super();
    this.cssAddClass("z4shapesandpathspanel");
    this.setLayout(new GridBagLayout());

    JSComponent fieldset = new JSComponent(document.createElement("fieldset"));
    this.add(fieldset, new GBC(0, 0).f(GBC.BOTH).wxy(1, 1));

    JSComponent legend = new JSComponent(document.createElement("legend"));
    legend.setContent(Z4Translations.SHAPES_AND_PATHS);
    fieldset.appendChild(legend);

    JSPanel panel = new JSPanel();
    panel.cssAddClass("z4shapesandpathspanel-container");
    panel.setLayout(new GridBagLayout());
    fieldset.appendChild(panel);
  }

}
