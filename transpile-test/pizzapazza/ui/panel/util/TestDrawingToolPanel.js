/**
 * @author gianpiero.diblasi
 */
class TestDrawingToolPanel extends JSFrame {

  constructor() {
    super();
    let panel = new Z4DrawingToolPanel();
    panel.addChangeListener(event => console.log(panel.getValue().toJSON()));
    panel.getStyle().minWidth = "56rem";
    panel.getStyle().minHeight = "41rem";
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
