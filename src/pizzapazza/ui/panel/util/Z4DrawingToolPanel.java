package pizzapazza.ui.panel.util;

import javascript.awt.GridBagLayout;
import javascript.swing.JSPanel;
import javascript.swing.JSTabbedPane;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4DrawingTool;

/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingToolPanel extends Z4AbstractValuePanel<Z4DrawingTool> {

  public Z4DrawingToolPanel() {
    super();
    this.cssAddClass("z4drawingtoolpanel");

    JSTabbedPane pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, null);
    
    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab("POINT ITERATOR", panel);

    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab("PAINTER", panel);

    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab("SPATIO-TEMPORAL COLOR", panel);

    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab("TRY ME", panel);
  }

  @Override
  public void setValue(Z4DrawingTool value) {
  }
}
