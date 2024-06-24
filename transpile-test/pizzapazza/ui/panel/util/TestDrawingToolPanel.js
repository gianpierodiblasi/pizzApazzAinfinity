/**
 * @author gianpiero.diblasi
 */
class TestDrawingToolPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4DrawingToolPanel(), null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
