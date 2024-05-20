package pizzapazza.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import def.dom.ImageData;
import java.awt.BorderLayout;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestSinusoidalFiller extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestSinusoidalFiller() {
    super();

    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";

    JSPanel buttons = new JSPanel();

    JSCheckBox checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);

    JSButton button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void fill(int bb, boolean showLines) {
    int x = 200;
    int y = 250;

    double angle = Math.PI / 3;
    double waveLength = 100;
    double period = 200;
    double amplitude = 70;

    ImageData imageData = this.ctx.createImageData(500, 500);
    new Z4SinusoidalFiller(new Z4GradientColor(), x, y, waveLength, period, amplitude, angle, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);

    if (showLines) {
      double px = x + period * Math.cos(angle);
      double py = y + period * Math.sin(angle);
      double ampx = x + amplitude * Math.cos(angle + Z4Math.HALF_PI);
      double ampy = y + amplitude * Math.sin(angle + Z4Math.HALF_PI);

      this.ctx.fillRect(x - 2, y - 2, 4, 4);
      this.ctx.fillRect(px - 2, py - 2, 4, 4);
      this.ctx.fillRect(ampx - 2, ampy - 2, 4, 4);

      this.ctx.strokeStyle = this.$getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(ampx, ampy);
      this.ctx.stroke();
    }
  }

  private String getFillStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getFillStyle(String style) {
    return null;
  }
}
