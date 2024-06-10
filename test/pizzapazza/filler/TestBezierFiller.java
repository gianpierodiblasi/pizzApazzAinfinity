package pizzapazza.filler;

import static def.dom.Globals.console;
import static def.dom.Globals.document;
import def.dom.ImageData;
import def.js.Date;
import java.awt.BorderLayout;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Constants;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestBezierFiller extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestBezierFiller() {
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
    int x1 = 100;
    int y1 = 250;
    int ctrlx1 = 150;
    int ctrly1 = 100;
    int ctrlx2 = 230;
    int ctrly2 = 310;
    int x2 = 300;
    int y2 = 350;
    int radius = 50;

    ImageData imageData = this.ctx.createImageData(500, 500);
    Date start = new Date();
    new Z4BezierFiller(new Z4GradientColor(), x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2, radius, bb).fill(imageData);
    Date stop = new Date();
    console.log(stop.getTime() - start.getTime());
    this.ctx.putImageData(imageData, 0, 0);

    if (showLines) {
      this.ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
      this.ctx.fillRect(ctrlx1 - 2, ctrly1 - 2, 4, 4);
      this.ctx.fillRect(ctrlx2 - 2, ctrly2 - 2, 4, 4);
      this.ctx.fillRect(x2 - 2, y2 - 2, 4, 4);

      this.ctx.strokeStyle = Z4Constants.$getStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.bezierCurveTo(ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2);
      this.ctx.stroke();
    }
  }
}
