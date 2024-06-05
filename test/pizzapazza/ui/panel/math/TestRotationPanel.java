package pizzapazza.ui.panel.math;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestRotationPanel extends JSFrame {
  
  public TestRotationPanel() {
    super();
    
    JSPanel p = new JSPanel();
    p.setLayout(new GridBagLayout());
    
    p.add(new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL), new GBC(0, 0).wx(1).i(5, 5, 5, 5));
    
    Z4RotationPanel labelled = new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(1, 0).wx(1).i(5, 5, 5, 5));
    
    Z4RotationPanel disabled = new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(2, 0).wx(1).i(5, 5, 5, 5));
    
    p.add(new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL), new GBC(0, 1).w(3).i(5, 5, 5, 5));
    
    labelled = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(0, 2).w(3).i(5, 5, 5, 5));
    
    disabled = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).w(3).i(5, 5, 5, 5));
    
    Z4RotationPanel valued = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    valued.setLabel("Valore");
    valued.cssAddClass("z4abstractvaluepanel-titled");
    
    valued.setValue(Z4Rotation.fromJSON(new Z4Rotation(
            0,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            Z4RotationBehavior.FIXED, false).toJSON()));
    
    p.add(valued, new GBC(0, 4).w(3).i(5, 5, 5, 5));
    
    valued.addChangeListener(event -> {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
