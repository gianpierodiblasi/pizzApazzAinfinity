/**
 * @author gianpiero.diblasi
 */
class TestColorPanel extends JSFrame {

  constructor(panel) {
    super();
    for (let index = 0; index < 100; index++) {
      let color = new Z4GradientColor();
      color.addColor(new Color(parseInt(255 * Math.random()), parseInt(255 * Math.random()), parseInt(255 * Math.random()), 255), 1);
      Z4GradientColor.pushHistory(color);
    }
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
