package pizzapazza.color;

import static def.dom.Globals.console;
import static def.dom.Globals.document;
import def.dom.ImageData;
import java.awt.BorderLayout;
import javascript.awt.Color;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
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
    this.canvas.style.backgroundImage = "url(../../../image/util/chessboard.png)";

    JSPanel buttons = new JSPanel();

    JSButton button = new JSButton();
    button.setText("WHITE->BLACK");
    button.addActionListener(event -> this.fill(new Z4BiGradientColor()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK SPACE RIPPLE");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();
      biGradientColor.setGradientRipple(0.3);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/WHITE->RED");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor whiteRed = new Z4GradientColor();
      whiteRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(whiteRed, 1);

      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/WHITE->RED TEMPORAL RIPPLE");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor whiteRed = new Z4GradientColor();
      whiteRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(whiteRed, 1);

      biGradientColor.setRipple(0.3);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);

    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED TEMPORAL MIRROR");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      biGradientColor.mirror();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED TEMPORAL REVERSE");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      biGradientColor.reverse();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED SPACE MIRROR");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      biGradientColor.gradientMirror();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED SPACE REVERSE");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      biGradientColor.gradientReverse();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED TEMPORAL RIPPLE");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      biGradientColor.setRipple(0.3);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED SPACE/TEMPORAL RIPPLE");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      biGradientColor.setRipple(0.3);
      biGradientColor.setGradientRipple(0.1);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("WHITE->BLACK/WHITE->BLUE->BLACK/GREEN->RED");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor whiteBlueBlack = new Z4GradientColor();
      whiteBlueBlack.addColor(new Color(0, 0, 255, 255), 0.5);
      biGradientColor.addColor(whiteBlueBlack, 0.5);

      Z4GradientColor greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);

      this.fill(biGradientColor);
    });
    buttons.add(button, null);

    button = new JSButton();
    button.setText("COLORFUL");
    button.addActionListener(event -> {
      Z4BiGradientColor biGradientColor = new Z4BiGradientColor();

      Z4GradientColor gc = new Z4GradientColor();
      gc.addColor(new Color(0, 0, 255, 255), 0.5);
      biGradientColor.addColor(gc, 0.5);

      gc = new Z4GradientColor();
      gc.addColor(new Color(0, 255, 0, 255), 0);
      gc.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(gc, 1);

      gc = new Z4GradientColor();
      gc.addColor(new Color(0, 255, 255, 255), 0.7);
      biGradientColor.addColor(gc, 0.3);

      gc = new Z4GradientColor();
      gc.addColor(new Color(45, 55, 100, 255), 0.2);
      biGradientColor.addColor(gc, 0.7);

      this.fill(biGradientColor);
    });
    buttons.add(button, null);
  }

  private void fill(Z4BiGradientColor biGradientColor) {
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
}
