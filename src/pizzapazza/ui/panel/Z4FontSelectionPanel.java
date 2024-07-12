package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
import javascript.swing.JSLabel;
import javascript.swing.JSRadioButton;
import pizzapazza.util.Z4Font;

/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
public class Z4FontSelectionPanel extends Z4AbstractValuePanel<Z4Font> {

  private final JSCheckBox bold = new JSCheckBox();
  private final JSCheckBox italic = new JSCheckBox();
  private final JSLabel sample = new JSLabel();
  private final Array<JSRadioButton> radios = new Array<>();

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

  @Override
  public void setValue(Z4Font value) {
    this.value = value;
  }
}
