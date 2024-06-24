/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPanel extends Z4AbstractValuePanel {

  constructor() {
    super();
    this.cssAddClass("z4drawingtoolpanel");
    let pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, null);
    let panel = new JSPanel();
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

   setValue(value) {
  }
}
