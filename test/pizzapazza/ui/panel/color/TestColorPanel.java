package pizzapazza.ui.panel.color;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestColorPanel extends JSFrame {

  public TestColorPanel(JSPanel panel) {
    super();

    JSPanel p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
