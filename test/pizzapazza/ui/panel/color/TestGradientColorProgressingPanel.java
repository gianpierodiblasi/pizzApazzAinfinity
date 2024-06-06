package pizzapazza.ui.panel.color;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
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
    super();

    JSPanel p = new JSPanel();
    p.add(new Z4GradientColorProgressionPanel(), null);

    Z4GradientColorProgressionPanel disabled = new Z4GradientColorProgressionPanel();
    disabled.setEnabled(false);
    p.add(disabled, null);

    Z4GradientColorProgressionPanel lighted = new Z4GradientColorProgressionPanel();
    lighted.setValue(Z4GradientColorProgression.fromJSON(new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED).toJSON()));
    lighted.addChangeListener(event -> {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, null);

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
