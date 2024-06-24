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

    JSPanel p = new JSPanel();
    p.add(new Z4DrawingToolPanel(), null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
