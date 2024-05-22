package pizzapazza.ui.panel.color;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestGradientColorPanel extends JSFrame {

  public TestGradientColorPanel() {
    super();

    JSPanel p = new JSPanel();
    p.add(new Z4GradientColorPanel(), null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
