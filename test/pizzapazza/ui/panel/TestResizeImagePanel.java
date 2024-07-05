package pizzapazza.ui.panel;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestResizeImagePanel extends JSFrame {

  public TestResizeImagePanel() {
    super();

    $OffscreenCanvas canvasToResize = new $OffscreenCanvas(400, 300);
    $CanvasRenderingContext2D context = canvasToResize.getContext("2d");
    context.fillStyle = Z4Constants.$getStyle("red");
    context.fillRect(0, 0, 400, 300);

    Z4ResizeImagePanel resizeImagePanel = new Z4ResizeImagePanel();
    resizeImagePanel.setCanvasToResize(canvasToResize, 400, 300);

    JSPanel p = new JSPanel();
    p.add(resizeImagePanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
