package pizzapazza.ui.panel.color;

import javascript.awt.BorderLayout;
import javascript.awt.Color;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import static simulation.js.$Globals.parseInt;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestColorPanel extends JSFrame {

  public TestColorPanel(JSPanel panel) {
    super();
    for (int index = 0; index < 100; index++) {
      Z4GradientColor color = new Z4GradientColor();
      color.addColor(new Color(parseInt(255 * Math.random()), parseInt(255 * Math.random()), parseInt(255 * Math.random()), 255), 1);
      Z4GradientColor.pushHistory(color);
    }

    for (int index = 0; index < 100; index++) {
      Z4GradientColor color = new Z4GradientColor();
      color.addColor(new Color(parseInt(255 * Math.random()), parseInt(255 * Math.random()), parseInt(255 * Math.random()), 255), 1);

      Z4BiGradientColor bicolor = new Z4BiGradientColor();
      bicolor.addColor(color, 1);
      Z4BiGradientColor.pushHistory(bicolor);
    }

    JSPanel p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
