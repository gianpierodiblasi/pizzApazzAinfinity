/**
 * @author gianpiero.diblasi
 */
class TestDrawingToolPanel extends JSFrame {

  constructor() {
    super();
    let fillingPanel = new Z4DrawingToolPanel();
    let p = new JSPanel();
    p.add(fillingPanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
