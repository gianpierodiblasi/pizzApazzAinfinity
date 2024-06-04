package pizzapazza.ui.panel.math;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestRandomValuePanel extends JSFrame {

  public TestRandomValuePanel() {
    super();

    JSPanel p = new JSPanel();
    p.setLayout(new GridBagLayout());

    JSLabel label = new JSLabel();
    label.setText("UNSIGNED");
    p.add(label, new GBC(0, 0));

    label = new JSLabel();
    label.setText("SIGNED");
    p.add(label, new GBC(1, 0));
    
    p.add(new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL), new GBC(0, 1).wx(1).i(5, 5, 5, 5));
    p.add(new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL), new GBC(1, 1).wx(1).i(5, 5, 5, 5));

    Z4AbstractRandomValuePanel<?> labelled = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(0, 2).wx(1).i(5, 5, 5, 5));

    labelled = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(1, 2).wx(1).i(5, 5, 5, 5));

    Z4AbstractRandomValuePanel<?> disabled = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).wx(1).i(5, 5, 5, 5));

    disabled = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 3).wx(1).i(5, 5, 5, 5));

    Z4RandomValuePanel valued = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    valued.setLabel("Valore");
    valued.setRange(20, 80);
    valued.setLengthRange(50, 100);
    valued.setValue(Z4RandomValue.fromJSON(new Z4RandomValue(30, Z4RandomValueBehavior.POLYLINE, 60).toJSON()));
    p.add(valued, new GBC(0, 4).wx(1).i(5, 5, 5, 5));

    Z4SignedRandomValuePanel signedValue = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    signedValue.setLabel("Valore");
    signedValue.setRange(20, 80);
    signedValue.setLengthRange(50, 100);
    signedValue.setValue(Z4SignedRandomValue.fromJSON(new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(30, Z4RandomValueBehavior.POLYLINE, 60)).toJSON()));
    p.add(signedValue, new GBC(1, 4).wx(1).i(5, 5, 5, 5));

    valued.addChangeListener(event -> {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });

    signedValue.addChangeListener(event -> {
      if (!signedValue.getValueIsAdjusting()) {
        console.log(signedValue.getValue().toJSON());
      }
    });

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
