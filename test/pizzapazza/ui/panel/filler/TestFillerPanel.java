package pizzapazza.ui.panel.filler;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestFillerPanel extends JSFrame {

  public TestFillerPanel(Z4AbstractFillerPanel panel) {
    super();

    JSPanel p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
    
    panel.setSize(500, 300);
  }
}
