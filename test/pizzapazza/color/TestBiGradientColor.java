package pizzapazza.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.console;
import static def.dom.Globals.document;
import def.dom.ImageData;
import java.awt.BorderLayout;
import javascript.awt.Color;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;
import simulation.js.$Uint8Array;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestBiGradientColor extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestBiGradientColor() {
    super();

    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.backgroundImage = "url(../../../image/chessboard.png)";

    JSPanel buttons = new JSPanel();

    JSButton button = new JSButton();
    button.setText("WHITE->BLACK");
    button.addActionListener(event -> this.fill(0));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK RIPPLE");
    button.addActionListener(event -> this.fill(1));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("RED-TRANS -> YELLOW");
    button.addActionListener(event -> this.fill(2));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("COLORFUL");
    button.addActionListener(event -> this.fill(3));
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void fill(int bb) {
    Z4BiGradientColor biGradientColor = new Z4BiGradientColor();
    switch (bb) {
      case 0:
        break;
      case 1:
//        gradientColor.setRipple(0.3);
        break;
      case 2:
//        gradientColor.addColor(new Color(255, 0, 0, 0), 0);
//        gradientColor.addColor(new Color(255, 255, 0, 255), 1);
        break;
      case 3:
//        gradientColor.addColor(new Color(255, 0, 0, 255), 0);
//        gradientColor.addColor(new Color(255, 0, 255, 255), 0.3);
//        gradientColor.addColor(new Color(0, 145, 255, 255), 0.7);
//        gradientColor.addColor(new Color(255, 255, 0, 255), 1);
        break;
    }

    $Object json = biGradientColor.toJSON();
    console.log(json);
    biGradientColor = Z4BiGradientColor.fromJSON(json);

    ImageData imageData = this.ctx.createImageData(500, 500);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < 500; y++) {
      Z4GradientColor gradientColor = biGradientColor.getColorAt(y / 500, true);
      for (int x = 0; x < 500; x++) {
        int index = (y * 500 + x) * 4;
        Color color = gradientColor.getColorAt(x / 500, true);

        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private String getFillStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getFillStyle(String style) {
    return null;
  }
}
