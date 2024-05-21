package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.FileReader;
import def.dom.ImageData;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.Point;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSFileChooser;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4TextureFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.document;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a texture filler
 *
 * @author gianpiero.diblasi
 */
public class Z4TextureFillerPanel extends Z4AbstractFillerPanel {

  private final Z4ColorPreview colorPreview = new Z4ColorPreview();
  private final JSRadioButton free = new JSRadioButton();
  private final JSRadioButton lockRatio = new JSRadioButton();
  private final JSRadioButton lock = new JSRadioButton();
  private final ButtonGroup group = new ButtonGroup();

  private ImageData imageData = new ImageData(Z4TextureFillerPanel.DEFAULT_SIZE, Z4TextureFillerPanel.DEFAULT_SIZE);
  private Color backgroundColor = new Color(0, 0, 0, 0);
  private boolean newImage = true;

  private final static int DEFAULT_SIZE = 50;

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4TextureFillerPanel() {
    super(2, new Array<>(false, true));

    this.addLabel(Z4Translations.DIMENSION, 0, 7, 4, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    JSPanel panel = new JSPanel();
    this.addComponent(panel, 0, 8, 4, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);

    this.free.setText(Z4Translations.FREE);
    this.free.setSelected(true);
    this.group.add(this.free);
    panel.add(this.free, null);
    this.lockRatio.setText(Z4Translations.LOCK_RATIO);
    this.group.add(this.lockRatio);
    panel.add(this.lockRatio, null);
    this.lock.setText(Z4Translations.LOCK);
    this.group.add(this.lock);
    panel.add(this.lock, null);

    this.addLabel(Z4Translations.BACKGROUND_COLOR, 0, 9, 4, 1, GridBagConstraints.EAST, GridBagConstraints.NONE);

    panel = new JSPanel();
    panel.setLayout(new BorderLayout(5, 0));
    this.addComponent(panel, 0, 10, 4, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);

    this.colorPreview.getStyle().alignSelf = "center";
    this.colorPreview.setColor(this.backgroundColor);
    panel.add(this.colorPreview, BorderLayout.CENTER);

    JSButton button = new JSButton();
    button.setText(Z4Translations.PATTERN);
    button.getStyle().marginRight = "4rem";
    button.addActionListener(event -> this.selectPattern());
    panel.add(button, BorderLayout.WEST);

    button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event -> this.selectColor());
    panel.add(button, BorderLayout.EAST);

    $Uint8Array data = ($Uint8Array) this.imageData.data;
    for (int y = 0; y < Z4TextureFillerPanel.DEFAULT_SIZE; y++) {
      for (int x = 0; x < Z4TextureFillerPanel.DEFAULT_SIZE; x++) {
        int index = (y * Z4TextureFillerPanel.DEFAULT_SIZE + x) * 4;

        if (Z4Math.distance(x, y, Z4TextureFillerPanel.DEFAULT_SIZE / 2, Z4TextureFillerPanel.DEFAULT_SIZE / 2) > Z4TextureFillerPanel.DEFAULT_SIZE / 2) {
        } else if (y < Z4TextureFillerPanel.DEFAULT_SIZE / 2) {
          data.$set(index, 255);
          data.$set(index + 1, 255);
          data.$set(index + 2, 255);
          data.$set(index + 3, 255);
        } else {
          data.$set(index, 0);
          data.$set(index + 1, 0);
          data.$set(index + 2, 0);
          data.$set(index + 3, 255);
        }
      }
    }

    this.cssAddClass("z4texturefillerpanel");
    this.drawPreview(false);
  }

  private void selectPattern() {
    JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> {
      FileReader fileReader = new FileReader();
      fileReader.onload = event -> {
        $Image image = ($Image) document.createElement("img");

        image.onload = event2 -> {
          $OffscreenCanvas offscreen = new $OffscreenCanvas(image.width, image.height);
          $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
          offscreenCtx.drawImage(image, 0, 0);
          this.imageData = offscreenCtx.getImageData(0, 0, image.width, image.height);

          this.newImage = true;
          this.requestSetPointPosition();
          this.drawPreview(false);
          return null;
        };

        image.src = (String) fileReader.result;
        return null;
      };
      fileReader.readAsDataURL(file);
    }));
  }

  private void selectColor() {
    JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.backgroundColor, true, null, c -> {
      this.backgroundColor = c;
      this.colorPreview.setColor(c);
      this.drawPreview(false);
    });
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    if (this.newImage) {
      points.$set(0, new Point(0, 0));
      points.$set(1, new Point(Math.min(width, this.imageData.width), Math.min(height, this.imageData.height)));
    } else if (this.free.isSelected()) {
      points.$set(selectedIndex, new Point(x, y));
    } else if (this.lockRatio.isSelected()) {
      double distance = Z4Math.distance(points.$get(1 - selectedIndex).x, points.$get(1 - selectedIndex).y, x, y);
      double angle = Z4Math.atan(points.$get(1 - selectedIndex).x, points.$get(1 - selectedIndex).y, points.$get(selectedIndex).x, points.$get(selectedIndex).y);

      points.$set(selectedIndex, new Point(
              (int) Math.round(points.$get(1 - selectedIndex).x + distance * Math.cos(angle)),
              (int) Math.round(points.$get(1 - selectedIndex).y + distance * Math.sin(angle)))
      );
    } else if (this.lock.isSelected()) {
      int offsetX = points.$get(selectedIndex).x - x;
      int offsetY = points.$get(selectedIndex).y - y;
      int newX = points.$get(1 - selectedIndex).x - offsetX;
      int newY = points.$get(1 - selectedIndex).y - offsetY;

      if (0 <= newX && newX < width && 0 <= newY && newY < height) {
        points.$set(selectedIndex, new Point(x, y));
        points.$set(1 - selectedIndex, new Point(newX, newY));
      }
    }
    this.newImage = false;
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(0, 0));
    points.push(new Point(Math.min(width, Z4TextureFillerPanel.DEFAULT_SIZE), Math.min(height, Z4TextureFillerPanel.DEFAULT_SIZE)));
  }

  @Override
  protected boolean needsRescale(Object option) {
    return false;
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    return new Z4TextureFiller(this.imageData, points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y, this.backgroundColor, (boolean) option);
  }

  @Override
  protected boolean isPointEnabled(int index) {
    return true;
  }

  @Override
  protected void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints) {
    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.strokeStyle = this.$getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.strokeStyle = this.$getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
