package pizzapazza.ui.panel.color;

import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestColorProgressingPanel extends JSFrame {

  public TestColorProgressingPanel() {
    super();

    JSPanel p = new JSPanel();
    p.setLayout(new GridBagLayout());

    JSLabel label = new JSLabel();
    label.setText("HORIZONTALLY COMPACT");
    p.add(label, new GBC(0, 0));

    label = new JSLabel();
    label.setText("VERTICALLY COMPACT");
    p.add(label, new GBC(1, 0));

    p.add(new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT), new GBC(0, 1).wx(1).i(5, 5, 5, 5));
    p.add(new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT), new GBC(1, 1).wx(1).i(5, 5, 5, 5));

    Z4ColorProgressionPanel disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 2).wx(1).i(5, 5, 5, 5));

    disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 2).wx(1).i(5, 5, 5, 5));

    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
