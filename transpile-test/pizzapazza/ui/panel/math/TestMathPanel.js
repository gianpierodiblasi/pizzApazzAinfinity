/**
 * @author gianpiero.diblasi
 */
class TestMathPanel extends JSFrame {

  constructor(panel) {
    super();
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
