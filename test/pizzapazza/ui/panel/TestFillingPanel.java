package pizzapazza.ui.panel;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.ui.panel.filler.Z4AbstractFillerPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestFillingPanel extends JSFrame {

  public TestFillingPanel() {
    super();

    JSPanel p = new JSPanel();
    p.add(new Z4FillingPanel(), null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
