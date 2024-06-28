package pizzapazza.ui.panel.painter;

import def.dom.DragEvent;
import def.dom.File;
import def.dom.FileReader;
import def.js.Array;
import javascript.awt.GBC;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSFileChooser;
import javascript.swing.JSFilePicker;
import javascript.swing.JSOptionPane;
import javascript.util.DefaultHTMLImageProducer;
import javascript.util.fsa.FilePickerOptions;
import pizzapazza.painter.Z4PatternPainter;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$DOMRect;
import simulation.dom.$Image;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;

/**
 * The panel to edit a Z4PatternPainter
 *
 * @author gianpiero.diblasi
 */
public class Z4PatternPainterPanel extends Z4PainterPanel<Z4PatternPainter> {

  private final JSComponent panel = new JSComponent(document.createElement("div"));
  private Array<JSCheckBox> checkBoxs = new Array<>();
  private final JSButton open = new JSButton();
  private final JSButton delete = new JSButton();

  private final JSCheckBox randomSequence = new JSCheckBox();
  private final JSCheckBox multiSize = new JSCheckBox();

  private JSCheckBox checkBoxDnD;

  /**
   * Creates the object
   */
  public Z4PatternPainterPanel() {
    super();
    this.cssAddClass("z4patternpainterpanel");

    Z4UI.addLabel(this, Z4Translations.PATTERNS, new GBC(0, 0).w(3).a(GBC.WEST));

    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "25rem";
    div.getStyle().height = "20rem";
    div.getStyle().border = "2px solid var(--main-action-bgcolor)";
    div.getStyle().borderRadius = "var(--roundness)";
    div.getStyle().overflowY = "auto";

    this.panel.getStyle().display = "flex";
    this.panel.getStyle().flexFlow = "row wrap";
    this.panel.getStyle().setProperty("gap", "10px");
    this.panel.addEventListener("dragenter", event -> event.preventDefault());
    this.panel.addEventListener("dragover", event -> {
      event.preventDefault();

      DragEvent evt = (DragEvent) event;

      int index = this.checkBoxs.findIndex(checkBox -> {
        $DOMRect rect = checkBox.invoke("getBoundingClientRect()");
        return evt.clientX < rect.left + rect.width && evt.clientY < rect.top + rect.height;
      });
      this.checkBoxs.forEach((checkBox, idx, array) -> {
        checkBox.getStyle().backgroundColor = index == idx ? "var(--main-action-bgcolor)" : "transparent";
        checkBox.getStyle().borderRadius = "var(--roundness)";
      });
    });
    this.panel.addEventListener("dragleave", event -> {
      event.preventDefault();
      this.checkBoxs.forEach((checkBox, idx, array) -> {
        checkBox.getStyle().removeProperty("backgroundColor");
        checkBox.getStyle().removeProperty("borderRadius");
      });
    });
    this.panel.addEventListener("drop", event -> {
      event.preventDefault();
      this.checkBoxs.forEach((checkBox, idx, array) -> {
        checkBox.getStyle().removeProperty("backgroundColor");
        checkBox.getStyle().removeProperty("borderRadius");
      });

      DragEvent evt = (DragEvent) event;

      int index = this.checkBoxs.findIndex(checkBox -> {
        $DOMRect rect = checkBox.invoke("getBoundingClientRect()");
        return evt.clientX < rect.left + rect.width && evt.clientY < rect.top + rect.height;
      });
      this.moveCheckBox(index);
    });

    div.appendChild(this.panel);
    this.add(div, new GBC(0, 1).w(3));

    this.open.setText(Z4Translations.OPEN);
    this.open.addActionListener(event -> this.selectPattern());
    this.add(this.open, new GBC(1, 2).h(2).a(GBC.NORTH).i(1, 0, 0, 1));

    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_PATTERNS_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.onpatternDelete();
      }
    }));
    this.add(this.delete, new GBC(2, 2).h(2).a(GBC.NORTH).i(1, 0, 0, 0));

    this.randomSequence.setText(Z4Translations.RANDOM_SEQUENCE);
    this.randomSequence.addActionListener(event -> this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.randomSequence, new GBC(0, 2).wx(1).a(GBC.WEST));

    this.multiSize.setText(Z4Translations.MULTI_DIMENSION);
    this.multiSize.addActionListener(event -> this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.multiSize, new GBC(0, 3).a(GBC.WEST));

    this.setValue(new Z4PatternPainter(new Array<>(), false, false));
  }

  private void selectPattern() {
    if ($typeof(window.$get("showOpenFilePicker"), "function")) {
      FilePickerOptions options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = true;
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
      JSCheckBox checkBox = this.createCheckBox((String) fileReader.result);
      this.checkBoxs.push(checkBox);
      this.panel.appendChild(checkBox);

      $Image image = new $Image();
      image.onload = event2 -> {
        checkBox.setTooltip(image.width + "x" + image.height);
        this.onpatternAdd(image);
        return null;
      };
      image.src = (String) fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

  private void onpatternAdd($Image pattern) {
    Array<$Image> patterns = this.value.getPatterns().slice();
    patterns.push(pattern);
    this.onpatternchange(false, patterns);
  }

  private void onpatternDelete() {
    this.delete.setEnabled(false);

    Array<$Image> patterns = this.value.getPatterns().filter((pattern, index, array) -> !this.checkBoxs.$get(index).isSelected());
    this.checkBoxs = this.checkBoxs.filter(checkBox -> !checkBox.isSelected());

    this.panel.clearContent();
    this.checkBoxs.forEach(checkBox -> this.panel.appendChild(checkBox));

    this.onpatternchange(false, patterns);
  }

  private void onpatternchange(boolean b, Array<$Image> patterns) {
    this.valueIsAdjusting = b;
    this.value = new Z4PatternPainter(patterns, this.randomSequence.isSelected(), this.multiSize.isSelected());
    this.onchange();
  }

  private void moveCheckBox(int index) {
    int newPosition = Math.min(this.checkBoxs.length, index);
    int currentPosition = this.checkBoxs.indexOf(this.checkBoxDnD);

    if (newPosition < currentPosition) {
      Array<$Image> patterns = this.value.getPatterns().slice();
      patterns.splice(newPosition, 0, patterns.splice(currentPosition, 1).$get(0));

      this.onpatternchange(false, patterns);
      this.setValue(this.value);
    } else if (newPosition > currentPosition) {
      Array<$Image> patterns = this.value.getPatterns().slice();
      patterns.splice(newPosition, 0, patterns.$get(currentPosition));
      patterns.splice(currentPosition, 1);

      this.onpatternchange(false, patterns);
      this.setValue(this.value);
    }
  }

  @Override
  public void setValue(Z4PatternPainter value) {
    this.value = value;

    this.panel.clearContent();
    this.checkBoxs.length = 0;

    this.value.getPatterns().forEach(image -> {
      JSCheckBox checkBox = this.createCheckBox(image.src);
      checkBox.setTooltip(image.width + "x" + image.height);
      this.checkBoxs.push(checkBox);
      this.panel.appendChild(checkBox);
    });

    this.delete.setEnabled(false);
    this.randomSequence.setSelected(this.value.isRandomSequence());
    this.multiSize.setSelected(this.value.isMultiSize());
  }

  private JSCheckBox createCheckBox(String src) {
    JSCheckBox checkBox = new JSCheckBox();
    checkBox.setIcon(new DefaultHTMLImageProducer<>("", src));
    checkBox.getStyle().flexDirection = "row-reverse";
    checkBox.getStyle().marginLeft = "5px";
    checkBox.getChilStyleByQuery("img").width = "30px";
    checkBox.addActionListener(event2 -> this.delete.setEnabled($exists(this.checkBoxs.filter(cb -> cb.isSelected()).length)));

    checkBox.setAttribute("draggable", "true");
    checkBox.addEventListener("dragstart", event -> {
      ((DragEvent) event).dataTransfer.effectAllowed = "move";
      this.checkBoxDnD = checkBox;
    });
    return checkBox;
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    this.checkBoxs.forEach(checkBox -> checkBox.setEnabled(b));

    this.open.setEnabled(b);
    this.delete.setEnabled(b && $exists(this.checkBoxs.filter(checkBox -> checkBox.isSelected()).length));
    this.randomSequence.setEnabled(b);
    this.multiSize.setEnabled(b);
  }
}
