package pizzapazza.ui.panel.painter;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Constants;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestPainterPanel extends JSFrame {

  public TestPainterPanel(Z4PainterPanel<?> panel) {
    super();
    
    Z4Constants.configureAcceptedFileTypeArrays();
    
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
