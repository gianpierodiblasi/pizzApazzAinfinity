/**
 * @author gianpiero.diblasi
 */
class TestResizeImagePanel extends JSFrame {

  constructor() {
    super();
    let canvasToResize = new OffscreenCanvas(400, 300);
    let context = canvasToResize.getContext("2d");
    context.fillStyle = Z4Constants.getStyle("red");
    context.fillRect(0, 0, 400, 300);
    let resizeImagePanel = new Z4ResizeImagePanel();
    resizeImagePanel.setCanvasToResize(canvasToResize, 400, 300);
    let p = new JSPanel();
    p.add(resizeImagePanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
