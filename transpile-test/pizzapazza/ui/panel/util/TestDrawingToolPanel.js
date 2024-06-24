/**
 * @author gianpiero.diblasi
 */
class TestDrawingToolPanel extends JSFrame {

  constructor() {
    super();
    let panel = new Z4DrawingToolPanel();
    panel.addChangeListener(event => console.log(panel.getValue().toJSON()));
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
