package pizzapazza.filler;

import static def.dom.Globals.document;
import def.dom.ImageData;
import java.awt.BorderLayout;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.util.Z4Constants;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestLinearFiller extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestLinearFiller() {
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
    button.addActionListener(event -> this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event -> this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void fill(Z4BoundaryBehavior bb, boolean showLines) {
    int p1x = 210;
    int p1y = 250;
    int p2x = 250;
    int p2y = 300;

    ImageData imageData = this.ctx.createImageData(500, 500);
    new Z4LinearFiller(new Z4GradientColor(), p1x, p1y, p2x, p2y, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);

    if (showLines) {
      this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
      this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);

      this.ctx.strokeStyle = Z4Constants.$getStyle("black");
      this.ctx.beginPath();
      this.ctx.moveTo(p1x, p1y);
      this.ctx.lineTo(p2x, p2y);
      this.ctx.stroke();

      double angle = Z4Math.atan(p1x, p1y, p2x, p2y) + Z4Math.HALF_PI;

      double line1x = (p1x + p2x) / 2;
      double line1y = (p1y + p2y) / 2;
      double line2x = line1x + 500 * Math.cos(angle);
      double line2y = line1y + 500 * Math.sin(angle);

      this.ctx.strokeStyle = Z4Constants.$getStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(line1x, line1y);
      this.ctx.lineTo(line2x, line2y);
      this.ctx.stroke();
    }
  }
}
