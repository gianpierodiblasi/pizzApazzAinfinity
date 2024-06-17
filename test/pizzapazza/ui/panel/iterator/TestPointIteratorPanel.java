package pizzapazza.ui.panel.iterator;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestPointIteratorPanel extends JSFrame {

  public TestPointIteratorPanel(Z4PointIteratorPanel<?> panel) {
    super();

    JSPanel p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
