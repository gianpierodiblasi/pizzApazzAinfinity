package pizzapazza.ui.panel.math;

import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestRandomValuePanel extends JSFrame {

  public TestRandomValuePanel() {
    super();

    JSPanel p = new JSPanel();
    p.setLayout(new GridBagLayout());
    p.add(new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL), new GBC(0, 0).a(GBC.WEST).wx(1).i(5, 5, 5, 5));
    p.add(new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL), new GBC(1, 0).a(GBC.EAST).wx(1).i(5, 5, 5, 5));

    Z4AbstractRandomValuePanel<?> labelled = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(0, 1).a(GBC.WEST).wx(1).i(5, 5, 5, 5));

    labelled = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(1, 1).a(GBC.EAST).wx(1).i(5, 5, 5, 5));

    Z4AbstractRandomValuePanel<?> disabled = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 2).a(GBC.WEST).wx(1).i(5, 5, 5, 5));
    
    disabled = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 2).a(GBC.EAST).wx(1).i(5, 5, 5, 5));
//
//    Z4RandomValuePanel valued = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
//    valued.setLabel("Valore");
//    valued.setRange(20, 80);
//    valued.setValue(Z4RandomValue.fromJSON(new Z4RandomValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 30).toJSON()));
//    valued.addChangeListener(event -> {
//      if (!valued.getValueIsAdjusting()) {
//        console.log(valued.getValue().toJSON());
//      }
//    });
//    p.add(valued, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
