/**
 * The panel to edit a Z4PatternPainter
 *
 * @author gianpiero.diblasi
 */
class Z4PatternPainterPanel extends Z4PainterPanel {

   panel = new JSComponent(document.createElement("div"));

   checkBoxs = new Array();

   open = new JSButton();

   delete = new JSButton();

   randomSequence = new JSCheckBox();

   multiSize = new JSCheckBox();

   checkBoxDnD = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4patternpainterpanel");
    Z4UI.addLabel(this, Z4Translations.PATTERNS, new GBC(0, 0).w(3).a(GBC.WEST));
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "400px";
    div.getStyle().height = "200px";
    div.getStyle().border = "2px solid var(--main-action-bgcolor)";
    div.getStyle().borderRadius = "var(--roundness)";
    div.getStyle().overflowY = "auto";
    this.panel.getStyle().display = "flex";
    this.panel.getStyle().flexFlow = "row wrap";
    this.panel.getStyle().setProperty("gap", "10px");
    this.panel.addEventListener("dragenter", event => event.preventDefault());
    this.panel.addEventListener("dragover", event => {
      event.preventDefault();
      let evt = event;
      let index = this.checkBoxs.findIndex(checkBox => {
        let rect = checkBox.invoke("getBoundingClientRect()");
        return evt.clientX < rect.left + rect.width && evt.clientY < rect.top + rect.height;
      });
      this.checkBoxs.forEach((checkBox, idx, array) => {
        checkBox.getStyle().backgroundColor = index === idx ? "var(--main-action-bgcolor)" : "transparent";
        checkBox.getStyle().borderRadius = "var(--roundness)";
      });
    });
    this.panel.addEventListener("dragleave", event => {
      event.preventDefault();
      this.checkBoxs.forEach((checkBox, idx, array) => {
        checkBox.getStyle().removeProperty("backgroundColor");
        checkBox.getStyle().removeProperty("borderRadius");
      });
    });
    this.panel.addEventListener("drop", event => {
      event.preventDefault();
      this.checkBoxs.forEach((checkBox, idx, array) => {
        checkBox.getStyle().removeProperty("backgroundColor");
        checkBox.getStyle().removeProperty("borderRadius");
      });
      let evt = event;
      let index = this.checkBoxs.findIndex(checkBox => {
        let rect = checkBox.invoke("getBoundingClientRect()");
        return evt.clientX < rect.left + rect.width && evt.clientY < rect.top + rect.height;
      });
      this.moveCheckBox(index);
    });
    div.appendChild(this.panel);
    this.add(div, new GBC(0, 1).w(3));
    this.open.setText(Z4Translations.OPEN);
    this.open.addActionListener(event => this.selectPattern());
    this.add(this.open, new GBC(1, 2).h(2).a(GBC.NORTH).i(1, 0, 0, 1));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_PATTERNS_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.onpatternDelete();
      }
    }));
    this.add(this.delete, new GBC(2, 2).h(2).a(GBC.NORTH).i(1, 0, 0, 0));
    this.randomSequence.setText(Z4Translations.RANDOM_SEQUENCE);
    this.randomSequence.addActionListener(event => this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.randomSequence, new GBC(0, 2).wx(1).a(GBC.WEST));
    this.multiSize.setText(Z4Translations.MULTI_DIMENSION);
    this.multiSize.addActionListener(event => this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.multiSize, new GBC(0, 3).a(GBC.WEST));
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
      let checkBox = this.createCheckBox(fileReader.result);
      this.checkBoxs.push(checkBox);
      this.panel.appendChild(checkBox);
      let image = new Image();
      image.onload = event2 => {
        checkBox.setTooltip(image.width + "x" + image.height);
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
    let patterns = this.value.getPatterns().filter((pattern, index, array) => !this.checkBoxs[index].isSelected());
    this.checkBoxs = this.checkBoxs.filter(checkBox => !checkBox.isSelected());
    this.panel.clearContent();
    this.checkBoxs.forEach(checkBox => this.panel.appendChild(checkBox));
    this.onpatternchange(false, patterns);
  }

   onpatternchange(b, patterns) {
    this.valueIsAdjusting = b;
    this.value = new Z4PatternPainter(patterns, this.randomSequence.isSelected(), this.multiSize.isSelected());
    this.onchange();
  }

   moveCheckBox(index) {
    let newPosition = Math.min(this.checkBoxs.length, index);
    let currentPosition = this.checkBoxs.indexOf(this.checkBoxDnD);
    if (newPosition < currentPosition) {
      let patterns = this.value.getPatterns().slice();
      patterns.splice(newPosition, 0, patterns.splice(currentPosition, 1)[0]);
      this.onpatternchange(false, patterns);
      this.setValue(this.value);
    } else if (newPosition > currentPosition) {
      let patterns = this.value.getPatterns().slice();
      patterns.splice(newPosition, 0, patterns[currentPosition]);
      patterns.splice(currentPosition, 1);
      this.onpatternchange(false, patterns);
      this.setValue(this.value);
    }
  }

   setValue(value) {
    this.value = value;
    this.panel.clearContent();
    this.checkBoxs.length = 0;
    this.value.getPatterns().forEach(image => {
      let checkBox = this.createCheckBox(image.src);
      checkBox.setTooltip(image.width + "x" + image.height);
      this.checkBoxs.push(checkBox);
      this.panel.appendChild(checkBox);
    });
    this.delete.setEnabled(false);
    this.randomSequence.setSelected(this.value.isRandomSequence());
    this.multiSize.setSelected(this.value.isMultiSize());
  }

   createCheckBox(src) {
    let checkBox = new JSCheckBox();
    checkBox.setIcon(new DefaultHTMLImageProducer("", src));
    checkBox.getStyle().flexDirection = "row-reverse";
    checkBox.getStyle().marginLeft = "5px";
    checkBox.getChilStyleByQuery("img").width = "30px";
    checkBox.addActionListener(event2 => this.delete.setEnabled(!!(this.checkBoxs.filter(cb => cb.isSelected()).length)));
    checkBox.setAttribute("draggable", "true");
    checkBox.addEventListener("dragstart", event => {
      (event).dataTransfer.effectAllowed = "move";
      this.checkBoxDnD = checkBox;
    });
    return checkBox;
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.checkBoxs.forEach(checkBox => checkBox.setEnabled(b));
    this.open.setEnabled(b);
    this.delete.setEnabled(b && this.checkBoxs.filter(checkBox => checkBox.isSelected()).length);
    this.randomSequence.setEnabled(b);
    this.multiSize.setEnabled(b);
  }
}
