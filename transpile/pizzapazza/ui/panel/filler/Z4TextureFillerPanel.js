/**
 * The panel to manage a texture filler
 *
 * @author gianpiero.diblasi
 */
class Z4TextureFillerPanel extends Z4AbstractFillerPanel {

   colorPanel = new Z4ColorPanel();

   free = new JSRadioButton();

   lockRatio = new JSRadioButton();

   lock = new JSRadioButton();

   group = new ButtonGroup();

   imageData = new ImageData(Z4TextureFillerPanel.DEFAULT_SIZE, Z4TextureFillerPanel.DEFAULT_SIZE);

   backgroundColor = new Color(0, 0, 0, 0);

   newImage = true;

  static  DEFAULT_SIZE = 50;

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(false, true));
    Z4UI.addLabel(this, Z4Translations.DIMENSION, new GBC(0, 7).w(4).a(GBC.WEST));
    let panel = new JSPanel();
    this.add(panel, new GBC(0, 8).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.free.setText(Z4Translations.FREE);
    this.free.setSelected(true);
    this.group.add(this.free);
    panel.add(this.free, null);
    this.lockRatio.setText(Z4Translations.LOCK_ASPECT_RATIO);
    this.group.add(this.lockRatio);
    panel.add(this.lockRatio, null);
    this.lock.setText(Z4Translations.LOCK);
    this.group.add(this.lock);
    panel.add(this.lock, null);
    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.add(panel, new GBC(0, 9).w(4).wx(1).f(GBC.HORIZONTAL));
    let button = new JSButton();
    button.setText(Z4Translations.PATTERN);
    button.addActionListener(event => this.selectPattern());
    panel.add(button, new GBC(0, 0).a(GBC.SOUTHWEST).i(0, 0, 0, 25));
    this.colorPanel.setLabel(Z4Translations.BACKGROUND_COLOR);
    this.colorPanel.setValue(this.backgroundColor);
    this.colorPanel.addChangeListener(event => {
      this.backgroundColor = this.colorPanel.getValue();
      this.drawPreview(false);
    });
    panel.add(this.colorPanel, new GBC(1, 0).wx(1).f(GBC.HORIZONTAL));
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
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => handle.getFile().then(file => {
        this.openTexture(file);
      })));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.openTexture(file)));
    }
  }

   openTexture(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let image = document.createElement("img");
      image.onload = event2 => {
        let offscreen = new OffscreenCanvas(image.width, image.height);
        let offscreenCtx = offscreen.getContext("2d");
        offscreenCtx.drawImage(image, 0, 0);
        this.imageData = offscreenCtx.getImageData(0, 0, image.width, image.height);
        this.newImage = true;
        this.requestSetPointPosition();
        this.drawPreview(false);
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    if (this.newImage) {
      points[0] = new Point(0, 0);
      points[1] = new Point(Math.min(width, this.imageData.width), Math.min(height, this.imageData.height));
    } else if (this.free.isSelected()) {
      points[selectedIndex] = new Point(x, y);
    } else if (this.lockRatio.isSelected()) {
      let distance = Z4Math.distance(points[1 - selectedIndex].x, points[1 - selectedIndex].y, x, y);
      let angle = Z4Math.atan(points[1 - selectedIndex].x, points[1 - selectedIndex].y, points[selectedIndex].x, points[selectedIndex].y);
      points[selectedIndex] = new Point(Math.round(points[1 - selectedIndex].x + distance * Math.cos(angle)), Math.round(points[1 - selectedIndex].y + distance * Math.sin(angle)));
    } else if (this.lock.isSelected()) {
      let offsetX = points[selectedIndex].x - x;
      let offsetY = points[selectedIndex].y - y;
      let newX = points[1 - selectedIndex].x - offsetX;
      let newY = points[1 - selectedIndex].y - offsetY;
      if (0 <= newX && newX < width && 0 <= newY && newY < height) {
        points[selectedIndex] = new Point(x, y);
        points[1 - selectedIndex] = new Point(newX, newY);
      }
    }
    this.newImage = false;
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
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
