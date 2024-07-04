package pizzapazza.ui.panel.color;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.color.Z4Lighting;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestLightingPanel extends JSFrame {

  public TestLightingPanel() {
    super();

    JSPanel p = new JSPanel();
    p.add(new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL), null);
    p.add(new Z4LightingPanel(Z4LightingPanelOrientation.VERTICAL), null);

    Z4LightingPanel disabled = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, null);

    Z4LightingPanel lighted = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
    lighted.setValue(Z4Lighting.LIGHTED_IN_OUT);
    lighted.addChangeListener(event -> console.log(lighted.getValue()));
    p.add(lighted, null);

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
