package pizzapazza.ui.panel.util;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestDrawingToolPanel extends JSFrame {
  
  public TestDrawingToolPanel() {
    super();
    
    Z4DrawingToolPanel fillingPanel = new Z4DrawingToolPanel();
    
    JSPanel p = new JSPanel();
    p.add(fillingPanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
