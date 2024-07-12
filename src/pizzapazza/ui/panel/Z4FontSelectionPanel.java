package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.GridBagLayout;
import javascript.swing.JSPanel;

/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
public class Z4FontSelectionPanel extends JSPanel {

  /**
   * Creates the object
   *
   * @param fonts The available fonts
   */
  public Z4FontSelectionPanel(Array<String> fonts) {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fontselectionpanel");
  }

}
