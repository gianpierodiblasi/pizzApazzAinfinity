package pizzapazza.ui.panel.util;

import static def.dom.Globals.console;
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

    Z4DrawingToolPanel panel = new Z4DrawingToolPanel();
    panel.addChangeListener(event -> {
      if (!panel.getValueIsAdjusting()) {
        console.log(panel.getValue().toJSON());
      }
    });
    panel.getStyle().minWidth = "70rem";
    panel.getStyle().minHeight = "56rem";

    JSPanel p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
