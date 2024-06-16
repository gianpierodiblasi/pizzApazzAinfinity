/**
 * @author gianpiero.diblasi
 */
class TestColorProgressingPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    let label = new JSLabel();
    label.setText("HORIZONTALLY COMPACT");
    p.add(label, new GBC(0, 0));
    label = new JSLabel();
    label.setText("VERTICALLY COMPACT");
    p.add(label, new GBC(1, 0));
    p.add(new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT), new GBC(0, 1).wx(1).i(5, 5, 5, 5));
    p.add(new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT), new GBC(1, 1).wx(1).i(5, 5, 5, 5));
    let disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 2).wx(1).i(5, 5, 5, 5));
    disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 2).wx(1).i(5, 5, 5, 5));
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
