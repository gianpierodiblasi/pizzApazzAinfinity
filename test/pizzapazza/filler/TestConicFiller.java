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
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestConicFiller extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestConicFiller() {
    super();

    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";

    JSPanel buttons = new JSPanel();

    JSButton button = new JSButton();
    button.setText("NO SYMMETRIC");
    button.addActionListener(event -> this.fill(false));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("SYMMETRIC");
    button.addActionListener(event -> this.fill(true));
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void fill(boolean b) {
    double cx = 0.4;
    double cy = 0.5;
    double angle = Math.PI / 3;

    ImageData imageData = this.ctx.createImageData(500, 500);
    new Z4ConicFiller(new Z4GradientColor(), cx, cy, angle, b).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);

    cx *= 500;
    cy *= 500;
    
    double px = cx + 50 * Math.cos(angle);
    double py = cy + 50 * Math.sin(angle);

    
    this.ctx.strokeStyle = this.$getFillStyle("red");
    this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
    this.ctx.fillRect(px - 2, py - 2, 4, 4);
    
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(px, py);
    this.ctx.stroke();
  }

  private String getFillStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getFillStyle(String style) {
    return null;
  }
}
