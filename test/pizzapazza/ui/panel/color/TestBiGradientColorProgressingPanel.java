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
    super();

    JSPanel p = new JSPanel();
    p.setLayout(new GridBagLayout());

    JSLabel label = new JSLabel();
    label.setText("HORIZONTALLY COMPACT");
    p.add(label, new GBC(0, 0));

    label = new JSLabel();
    label.setText("VERTICALLY COMPACT");
    p.add(label, new GBC(1, 0));

    p.add(new Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT), new GBC(0, 1).wx(1).i(5, 5, 5, 5));
    p.add(new Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT), new GBC(1, 1).wx(1).i(5, 5, 5, 5));

    Z4BiGradientColorProgressionPanel disabled = new Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 2).wx(1).i(5, 5, 5, 5));

    disabled = new Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 2).wx(1).i(5, 5, 5, 5));

    Z4BiGradientColorProgressionPanel lighted = new Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    lighted.setValue(Z4BiGradientColorProgression.fromJSON(new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED).toJSON()));
    lighted.addChangeListener(event -> {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, new GBC(0, 3).wx(1).i(5, 5, 5, 5));

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
