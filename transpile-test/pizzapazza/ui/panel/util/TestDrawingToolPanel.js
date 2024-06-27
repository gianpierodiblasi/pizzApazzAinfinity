/**
 * @author gianpiero.diblasi
 */
class TestDrawingToolPanel extends JSFrame {

  constructor() {
    super();
    Z4Constants.configureAcceptedImageFileTypeArrays();
    let panel = new Z4DrawingToolPanel();
    panel.addChangeListener(event => {
      if (!panel.getValueIsAdjusting()) {
        console.log(panel.getValue().toJSON());
      }
    });
    panel.getStyle().minWidth = "70rem";
    panel.getStyle().minHeight = "58rem";
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
