package pizzapazza.ui.panel.filler;

import def.dom.File;
import def.dom.FileReader;
import def.dom.ImageData;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.Point;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSFileChooser;
import javascript.swing.JSFilePicker;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.util.fsa.FilePickerOptions;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4TextureFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a texture filler
 *
 * @author gianpiero.diblasi
 */
public class Z4TextureFillerPanel extends Z4AbstractFillerPanel {

  private final Z4ColorPanel colorPanel = new Z4ColorPanel();
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

    Z4UI.addLabel(this, Z4Translations.DIMENSION, new GBC(0, 7).w(4).a(GBC.WEST));

    JSPanel panel = new JSPanel();
    this.add(panel, new GBC(0, 8).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));

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

    this.colorPanel.setLabel(Z4Translations.BACKGROUND_COLOR);
    this.colorPanel.setValue(this.backgroundColor);
    this.colorPanel.addChangeListener(event -> {
      this.backgroundColor = this.colorPanel.getValue();
      this.drawPreview(false);
    });
    this.add(this.colorPanel, new GBC(0, 9).w(2).f(GBC.HORIZONTAL).i(0, 0, 0, 5));

    JSButton button = new JSButton();
    button.setText(Z4Translations.PATTERN);
    button.addActionListener(event -> this.selectPattern());
    this.add(button, new GBC(2, 9).w(2).a(GBC.SOUTHEAST));

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
    if ($typeof(window.$get("showOpenFilePicker"), "function")) {
      FilePickerOptions options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;

      JSFilePicker.showOpenFilePicker(options, 0, handles -> handles.forEach(handle -> handle.getFile().then(file -> {
        this.openTexture(file);
      })));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> this.openTexture(file)));
    }
  }

  private void openTexture(File file) {
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
    ctx.strokeStyle = Z4Constants.$getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
