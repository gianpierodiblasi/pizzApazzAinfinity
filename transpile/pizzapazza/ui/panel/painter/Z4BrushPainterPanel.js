/**
 * The panel to edit a Z4BrushPainter
 *
 * @author gianpiero.diblasi
 */
class Z4BrushPainterPanel extends Z4PainterPanel {

   width = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   thickness = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   pattern = new JSComponent(document.createElement("img"));

   open = new JSButton();

   delete = new JSButton();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4brushpainterpanel");
    this.width.setSignsVisible(false);
    this.width.setConstantRange(1, 150);
    this.width.setLabel(Z4Translations.WIDTH);
    this.width.cssAddClass("z4abstractvaluepanel-titled");
    this.width.addChangeListener(event => this.onbrushchange(this.width.getValueIsAdjusting(), this.value.getPattern()));
    this.add(this.width, new GBC(0, 0).h(3).i(1, 0, 0, 1));
    this.thickness.setSignsVisible(false);
    this.thickness.setConstantRange(1, 15);
    this.thickness.setLabel(Z4Translations.THICKNESS);
    this.thickness.cssAddClass("z4abstractvaluepanel-titled");
    this.thickness.addChangeListener(event => this.onbrushchange(this.thickness.getValueIsAdjusting(), this.value.getPattern()));
    this.add(this.thickness, new GBC(1, 0).h(3).i(0, 0, 0, 1));
    Z4UI.addLabel(this, Z4Translations.PATTERN, new GBC(2, 0).w(2).a(GBC.WEST));
    this.pattern.setAttribute("width", "150");
    this.pattern.setAttribute("height", "150");
    this.pattern.getStyle().border = "1px solid var(--main-action-bgcolor)";
    this.pattern.getStyle().borderRadius = "var(--roundness)";
    this.add(this.pattern, new GBC(2, 1).wxy(1, 1).w(2));
    this.open.setText(Z4Translations.OPEN);
    this.open.addActionListener(event => this.selectPattern());
    this.add(this.open, new GBC(2, 2).i(0, 0, 0, 1).a(GBC.EAST).wx(1));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_PATTERN_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.onbrushchange(false, null);
      }
    }));
    this.add(this.delete, new GBC(3, 2));
    this.setValue(new Z4BrushPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 2), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), null));
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
      let image = new Image();
      image.src = fileReader.result;
      this.onbrushchange(false, image);
      return null;
    };
    fileReader.readAsDataURL(file);
  }

   onbrushchange(b, pattern) {
    this.valueIsAdjusting = b;
    this.value = new Z4BrushPainter(this.width.getValue(), this.thickness.getValue(), pattern);
    if (this.value.getPattern()) {
      this.pattern.setAttribute("src", this.value.getPattern().src);
      this.pattern.setAttribute("width", "" + this.value.getPattern().width);
      this.pattern.removeAttribute("height");
      this.delete.setEnabled(this.enabled);
    } else {
      this.pattern.removeAttribute("src");
      this.pattern.setAttribute("width", "150");
      this.pattern.setAttribute("height", "150");
      this.delete.setEnabled(false);
    }
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    this.width.setValue(this.value.getWidth());
    this.thickness.setValue(this.value.getThickness());
    if (this.value.getPattern()) {
      this.pattern.setAttribute("src", this.value.getPattern().src);
      this.pattern.setAttribute("width", "" + this.value.getPattern().width);
      this.pattern.removeAttribute("height");
      this.delete.setEnabled(this.enabled);
    } else {
      this.pattern.removeAttribute("src");
      this.pattern.setAttribute("width", "150");
      this.pattern.setAttribute("height", "150");
      this.delete.setEnabled(false);
    }
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.width.setEnabled(b);
    this.thickness.setEnabled(b);
    this.open.setEnabled(b);
    this.delete.setEnabled(b && this.value.getPattern());
  }
}
