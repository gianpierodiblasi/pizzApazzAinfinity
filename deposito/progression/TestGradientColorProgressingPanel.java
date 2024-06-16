package pizzapazza.ui.panel.color;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.color.Z4GradientColorProgression;
import pizzapazza.color.Z4GradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestGradientColorProgressingPanel extends JSFrame {

  public TestGradientColorProgressingPanel() {
    Z4GradientColorProgressionPanel lighted = new Z4GradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    lighted.setValue(Z4GradientColorProgression.fromJSON(new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED).toJSON()));
    lighted.addChangeListener(event -> {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, new GBC(0, 3).wx(1).i(5, 5, 5, 5));

    
  }
}
