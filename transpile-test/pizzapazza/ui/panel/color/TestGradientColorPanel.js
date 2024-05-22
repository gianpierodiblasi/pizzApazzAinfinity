/**
 * @author gianpiero.diblasi
 */
class TestGradientColorPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4GradientColorPanel(), null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
