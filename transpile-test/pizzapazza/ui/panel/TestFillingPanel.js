/**
 * @author gianpiero.diblasi
 */
class TestFillingPanel extends JSFrame {

  constructor() {
    super();
    let fillingPanel = new Z4FillingPanel();
    fillingPanel.setSize(500, 300);
    let p = new JSPanel();
    p.add(fillingPanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
