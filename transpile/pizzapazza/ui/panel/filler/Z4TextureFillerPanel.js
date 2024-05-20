/**
 * The panel to manage a texture filler
 *
 * @author gianpiero.diblasi
 */
class Z4TextureFillerPanel extends Z4AbstractFillerPanel {

   colorPreview = new Z4ColorPreview();

   imageData = new ImageData(Z4TextureFillerPanel.DEFAULT_SIZE, Z4TextureFillerPanel.DEFAULT_SIZE);

   backgroundColor = new Color(0, 0, 0, 0);

  static  DEFAULT_SIZE = 50;

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(false, true));
    this.addLabel(Z4Translations.BACKGROUND_COLOR, 0, 7, 4, 1, GridBagConstraints.EAST, GridBagConstraints.NONE);
    let panel = new JSPanel();
    panel.setLayout(new BorderLayout(5, 0));
    this.addComponent(panel, 0, 8, 4, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    this.colorPreview.getStyle().alignSelf = "center";
    this.colorPreview.setColor(this.backgroundColor);
    panel.add(this.colorPreview, BorderLayout.CENTER);
    let button = new JSButton();
    button.setText(Z4Translations.PATTERN);
    button.getStyle().marginRight = "4rem";
    button.addActionListener(event => this.selectPattern());
    panel.add(button, BorderLayout.WEST);
    button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event => {
      JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.backgroundColor, true, null, c => {
        this.backgroundColor = c;
        this.colorPreview.setColor(c);
        this.drawPreview(false);
      });
    });
    panel.add(button, BorderLayout.EAST);
    let data = this.imageData.data;
    for (let y = 0; y < Z4TextureFillerPanel.DEFAULT_SIZE; y++) {
      for (let x = 0; x < Z4TextureFillerPanel.DEFAULT_SIZE; x++) {
        let index = (y * Z4TextureFillerPanel.DEFAULT_SIZE + x) * 4;
        if (Z4Math.distance(x, y, Z4TextureFillerPanel.DEFAULT_SIZE / 2, Z4TextureFillerPanel.DEFAULT_SIZE / 2) > Z4TextureFillerPanel.DEFAULT_SIZE / 2) {
        } else if (y < Z4TextureFillerPanel.DEFAULT_SIZE / 2) {
          data[index] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
          data[index + 3] = 255;
        } else {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 255;
        }
      }
    }
    this.cssAddClass("z4texturefillerpanel");
    this.drawPreview(false);
  }

   selectPattern() {
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(0, 0));
    points.push(new Point(Math.min(width, Z4TextureFillerPanel.DEFAULT_SIZE), Math.min(height, Z4TextureFillerPanel.DEFAULT_SIZE)));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4TextureFiller(this.imageData, points[0].x, points[0].y, points[1].x, points[1].y, this.backgroundColor, option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
  }

   getStrokeStyle(style) {
    return style;
  }
}
