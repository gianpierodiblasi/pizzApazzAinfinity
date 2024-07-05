package pizzapazza.ui.panel;

import def.dom.CanvasGradient;
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
    CanvasGradient gradient = context.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(1, "blue");
    context.fillStyle = Z4Constants.$getStyle(gradient);
    context.fillRect(0, 0, 400, 300);

    Z4ResizeImagePanel resizeImagePanel = new Z4ResizeImagePanel();
    resizeImagePanel.setCanvasToResize(canvasToResize, 400, 300);

    JSPanel p = new JSPanel();
    p.add(resizeImagePanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
