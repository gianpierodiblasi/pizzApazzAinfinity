package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.ImageData;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.Point;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4TextureFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a texture filler
 *
 * @author gianpiero.diblasi
 */
public class Z4TextureFillerPanel extends Z4AbstractFillerPanel {

  private final Z4ColorPreview colorPreview = new Z4ColorPreview();

  private final ImageData imageData = new ImageData(Z4TextureFillerPanel.DEFAULT_SIZE, Z4TextureFillerPanel.DEFAULT_SIZE);
  private Color backgroundColor = new Color(0, 0, 0, 0);

  private final static int DEFAULT_SIZE = 50;

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4TextureFillerPanel() {
    super(2, new Array<>(false, true));

    this.addLabel(Z4Translations.BACKGROUND_COLOR, 0, 7, 4, 1, GridBagConstraints.EAST, GridBagConstraints.NONE);

    JSPanel panel = new JSPanel();
    panel.setLayout(new BorderLayout(5, 0));
    this.addComponent(panel, 0, 8, 4, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);

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
    button.addActionListener(event -> {
      JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.backgroundColor, true, null, c -> {
        this.backgroundColor = c;
        this.colorPreview.setColor(c);
        this.drawPreview(false);
      });
    });
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
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    points.$set(selectedIndex, new Point(x, y));
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
  }

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
