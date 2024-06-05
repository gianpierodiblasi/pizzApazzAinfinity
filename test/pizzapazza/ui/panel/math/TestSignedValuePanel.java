package pizzapazza.ui.panel.math;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedValue;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestSignedValuePanel extends JSFrame {

  public TestSignedValuePanel() {
    super();

    JSPanel p = new JSPanel();
    p.add(new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL), null);

    Z4SignedValuePanel labelled = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, null);

    Z4SignedValuePanel disabled = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, null);

    Z4SignedValuePanel valued = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
    valued.setLabel("Valore");
    valued.cssAddClass("z4abstractvaluepanel-titled");
    valued.setRange(20, 80);
    valued.setValue(Z4SignedValue.fromJSON(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 30).toJSON()));
    valued.addChangeListener(event -> {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    p.add(valued, null);

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
