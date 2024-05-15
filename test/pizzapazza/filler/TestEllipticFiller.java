package pizzapazza.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import def.dom.ImageData;
import java.awt.BorderLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestEllipticFiller extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestEllipticFiller() {
    super();

    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";

    JSPanel buttons = new JSPanel();

    JSButton button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.STOP_AT_BOUNDARY));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.FILL_AT_BOUNDARY));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4EllipticFiller.REPEAT_AT_BOUNDARY));
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void fill(int bb) {
    double cx = 0.4;
    double cy = 0.5;
    double rx = 0.1;
    double ry = 0.2;
    double angle = Math.PI / 3;

    ImageData imageData = this.ctx.createImageData(500, 500);
    new Z4EllipticFiller(new Z4GradientColor(), cx, cy, rx, ry, angle, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);

    cx *= 500;
    cy *= 500;
    rx *= 500;
    ry *= 500;

    double p1x = cx + rx * Math.cos(angle);
    double p1y = cy + rx * Math.sin(angle);

    double p2x = cx + ry * Math.cos(angle + Z4Math.HALF_PI);
    double p2y = cy + ry * Math.sin(angle + Z4Math.HALF_PI);

    this.ctx.strokeStyle = this.$getFillStyle("red");
    this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
    this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
    this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(p1x, p1y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(p2x, p2y);
    this.ctx.stroke();
  }

  private String getFillStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getFillStyle(String style) {
    return null;
  }
}
