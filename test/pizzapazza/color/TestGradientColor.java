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
public class TestGradientColor extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestGradientColor() {
    super();

    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "100");
    this.canvas.style.backgroundImage = "url(../../../image/chessboard.png)";

    JSPanel buttons = new JSPanel();

    JSButton button = new JSButton();
    button.setText("WHITE->BLACK");
    button.addActionListener(event -> this.fill(new Z4GradientColor()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK RIPPLE");
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = new Z4GradientColor();
      gradientColor.setRipple(0.3);
      this.fill(gradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("RED-TRANS -> YELLOW");
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 0), 0);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      this.fill(gradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("COLORFUL");
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 255), 0);
      gradientColor.addColor(new Color(255, 0, 255, 255), 0.3);
      gradientColor.addColor(new Color(0, 145, 255, 255), 0.7);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      this.fill(gradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("COLORFUL MIRROR");
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 255), 0);
      gradientColor.addColor(new Color(255, 0, 255, 255), 0.3);
      gradientColor.addColor(new Color(0, 145, 255, 255), 0.7);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      gradientColor.mirror();
      this.fill(gradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("COLORFUL REVERSE");
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 255), 0);
      gradientColor.addColor(new Color(255, 0, 255, 255), 0.3);
      gradientColor.addColor(new Color(0, 145, 255, 255), 0.7);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      gradientColor.reverse();
      this.fill(gradientColor);
    });
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void fill(Z4GradientColor gradientColor) {
    $Object json = gradientColor.toJSON();
    console.log(json);
    gradientColor = Z4GradientColor.fromJSON(json);

    ImageData imageData = this.ctx.createImageData(500, 100);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int x = 0; x < 500; x++) {
      Color color = gradientColor.getColorAt(x / 500, true);
      for (int y = 0; y < 100; y++) {
        int index = (y * 500 + x) * 4;
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
