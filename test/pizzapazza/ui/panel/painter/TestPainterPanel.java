package pizzapazza.ui.panel.painter;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestPainterPanel extends JSFrame {

  public TestPainterPanel(Z4PainterPanel<?> panel) {
    super();

    JSPanel p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);

    panel.addChangeListener(event -> {
      if (!panel.getValueIsAdjusting()) {
        console.log(panel.getValue().toJSON());
      }
    });
  }
}
