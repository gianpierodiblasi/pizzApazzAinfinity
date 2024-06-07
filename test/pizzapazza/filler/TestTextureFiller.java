package pizzapazza.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.FileReader;
import static def.dom.Globals.document;
import def.dom.ImageData;
import java.awt.BorderLayout;
import javascript.awt.Color;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSFileChooser;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestTextureFiller extends JSFrame {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private final $Canvas canvas = ($Canvas) document.createElement("canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  public TestTextureFiller() {
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
    button.setText("NO SYMMETRIC");
    button.addActionListener(event -> this.open(false, checkBox.isSelected()));
    buttons.add(button, null);

    button = new JSButton();
    button.setText("SYMMETRIC");
    button.addActionListener(event -> this.open(true, checkBox.isSelected()));
    buttons.add(button, null);

    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

  private void open(boolean b, boolean showLines) {
    JSFileChooser.showOpenDialog(".png", JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> {
      FileReader fileReader = new FileReader();
      fileReader.onload = event -> {
        $Image image = ($Image) document.createElement("img");

        image.onload = event2 -> {
          $OffscreenCanvas offscreen = new $OffscreenCanvas(image.width, image.height);
          $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
          offscreenCtx.drawImage(image, 0, 0);
          this.fill(offscreenCtx.getImageData(0, 0, image.width, image.height), b, showLines);
          return null;
        };

        image.src = (String) fileReader.result;
        return null;
      };
      fileReader.readAsDataURL(file);
    }));
  }

  private void fill(ImageData texture, boolean b, boolean showLines) {
    int cx = 0;
    int cy = 0;
    int px = cx + 500;
    int py = cy + 500;

    ImageData imageData = this.ctx.createImageData(500, 500);
    new Z4TextureFiller(texture, cx, cy, px, py, new Color(255, 255, 255, 255), b).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);

    if (showLines) {
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(px - 2, py - 2, 4, 4);

      this.ctx.strokeStyle = this.$getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(px, py);
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
