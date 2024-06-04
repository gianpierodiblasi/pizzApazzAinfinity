package pizzapazza.ui.panel.math;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestSignPanel extends JSFrame {

  public TestSignPanel() {
    super();

    JSPanel p = new JSPanel();
    p.add(new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL), null);
    p.add(new Z4SignPanel(Z4SignPanelOrientation.VERTICAL), null);
    p.add(new Z4SignPanel(Z4SignPanelOrientation.SQUARED), null);

    Z4SignPanel disabled = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, null);

    Z4SignPanel positive = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
    positive.setValue(Z4Sign.fromJSON(new Z4Sign(Z4SignBehavior.POSITIVE).toJSON()));
    positive.addChangeListener(event -> console.log(positive.getValue().toJSON()));
    p.add(positive, null);

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
