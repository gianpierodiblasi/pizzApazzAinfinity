/**
 * The panel to edit a Z4PatternPainter
 *
 * @author gianpiero.diblasi
 */
class Z4PatternPainterPanel extends Z4PainterPanel {

   panel = new JSPanel();

   checkBoxs = new Array();

   open = new JSButton();

   delete = new JSButton();

   randomSequence = new JSCheckBox();

   multiSize = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4patternpainterpanel");
    Z4UI.addLabel(this, Z4Translations.PATTERNS, new GBC(0, 0).w(2).a(GBC.WEST));
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "300px";
    div.getStyle().maxWidth = "300px";
    div.getStyle().height = "300px";
    div.getStyle().border = "2px solid var(--main-action-bgcolor)";
    div.getStyle().borderRadius = "var(--roundness)";
    div.getStyle().overflow = "scroll";
    this.panel.setLayout(new BoxLayout(this.panel, BoxLayout.Y_AXIS));
    div.appendChild(this.panel);
    this.add(div, new GBC(0, 1).w(2).wx(1).f(GBC.HORIZONTAL));
    this.open.setText(Z4Translations.OPEN);
    this.open.addActionListener(event => this.selectPattern());
    this.add(this.open, new GBC(0, 2).i(1, 0, 0, 1).a(GBC.EAST).wx(1));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_PATTERNS_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.onpatternDelete();
      }
    }));
    this.add(this.delete, new GBC(1, 2));
    this.randomSequence.setText("RANDOM_SEQUENCE");
    this.randomSequence.addActionListener(event => this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.randomSequence, new GBC(0, 3).w(2).a(GBC.WEST));
    this.multiSize.setText("MULTI_SIZE");
    this.multiSize.addActionListener(event => this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.multiSize, new GBC(0, 4).w(2).a(GBC.WEST));
    this.setValue(new Z4PatternPainter(new Array(), false, false));
  }

   selectPattern() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = true;
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
      let checkBox = new JSCheckBox();
      checkBox.setIcon(new DefaultHTMLImageProducer("", fileReader.result));
      checkBox.getStyle().borderBottom = "1px";
      checkBox.addActionListener(event2 => this.delete.setEnabled(!!(this.checkBoxs.filter(checkbox => checkbox.isSelected()).length)));
      this.checkBoxs.push(checkBox);
      this.panel.add(checkBox, null);
      let image = new Image();
      image.onload = event2 => {
        this.onpatternAdd(image);
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

   onpatternAdd(pattern) {
    let patterns = this.value.getPatterns().slice();
    patterns.push(pattern);
    this.onpatternchange(false, patterns);
  }

   onpatternDelete() {
    this.delete.setEnabled(false);
    let patterns = this.value.getPatterns().filter((pattern, index, array) => this.checkBoxs[index].isSelected());
    this.checkBoxs = this.checkBoxs.filter(checkbox => !checkbox.isSelected());
    this.panel.clearContent();
    this.checkBoxs.forEach(checkbox => this.panel.add(checkbox, null));
    this.onpatternchange(false, patterns);
  }

   onpatternchange(b, patterns) {
    this.valueIsAdjusting = b;
    this.value = new Z4PatternPainter(patterns, this.randomSequence.isSelected(), this.multiSize.isSelected());
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    this.panel.clearContent();
    this.checkBoxs.length = 0;
    this.value.getPatterns().forEach(image => {
      let checkBox = new JSCheckBox();
      checkBox.setIcon(new DefaultHTMLImageProducer("", image.src));
      checkBox.getStyle().borderBottom = "1px";
      checkBox.addActionListener(event2 => this.delete.setEnabled(!!(this.checkBoxs.filter(checkbox => checkbox.isSelected()).length)));
      this.checkBoxs.push(checkBox);
      this.panel.add(checkBox, null);
    });
    this.delete.setEnabled(false);
    this.randomSequence.setSelected(this.value.isRandomSequence());
    this.multiSize.setSelected(this.value.isMultiSize());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.checkBoxs.forEach(checkbox => checkbox.setEnabled(b));
    this.open.setEnabled(b);
    this.delete.setEnabled(b && this.checkBoxs.filter(checkbox => checkbox.isSelected()).length);
    this.randomSequence.setEnabled(b);
    this.multiSize.setEnabled(b);
  }
}
