package pizzapazza.ui.panel;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestFillingPanel extends JSFrame {
  
  public TestFillingPanel() {
    super();
    
    Z4FillingPanel fillingPanel = new Z4FillingPanel();
    fillingPanel.setSize(500, 300);
    
    JSPanel p = new JSPanel();
    p.add(fillingPanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
