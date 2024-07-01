/**
 * @author gianpiero.diblasi
 */
class TestPainterPanel extends JSFrame {

  constructor(panel) {
    super();
    Z4Constants.configureAcceptedFileTypeArrays();
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
    panel.addChangeListener(event => {
      if (!panel.getValueIsAdjusting()) {
        console.log(panel.getValue().toJSON());
      }
    });
  }
}
