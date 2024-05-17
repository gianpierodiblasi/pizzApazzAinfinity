/**
 * @author gianpiero.diblasi
 */
class TestFillerPanel extends JSFrame {

  constructor(panel) {
    super();
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
    panel.setSize(500, 300);
  }
}
