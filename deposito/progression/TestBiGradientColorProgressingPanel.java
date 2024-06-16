package pizzapazza.ui.panel.color;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.color.Z4BiGradientColorProgression;
import pizzapazza.color.Z4BiGradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestBiGradientColorProgressingPanel extends JSFrame {

  public TestBiGradientColorProgressingPanel() {
    Z4BiGradientColorProgressionPanel lighted = new Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    lighted.setValue(Z4BiGradientColorProgression.fromJSON(new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED).toJSON()));
    lighted.addChangeListener(event -> {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, new GBC(0, 3).wx(1).i(5, 5, 5, 5));
  }
}
