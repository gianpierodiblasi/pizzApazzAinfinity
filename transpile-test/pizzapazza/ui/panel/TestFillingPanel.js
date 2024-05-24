/**
 * @author gianpiero.diblasi
 */
class TestFillingPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4FillingPanel(), null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
