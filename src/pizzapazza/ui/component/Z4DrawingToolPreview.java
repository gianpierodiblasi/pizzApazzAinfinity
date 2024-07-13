package pizzapazza.ui.component;

import static def.dom.Globals.document;
import def.js.JSON;
import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDown;
import javascript.swing.JSFilePicker;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSTextField;
import javascript.swing.event.ChangeEvent;
import javascript.util.fsa.FilePickerOptions;
import pizzapazza.ui.panel.Z4DrawingToolPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonDrawingToolPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.setTimeout;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The drawing tool preview
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingToolPreview extends JSDropDown {

  private final JSPanel summary = new JSPanel();
  private final JSLabel name = new JSLabel();
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");

  private final Z4DrawingToolPanel editor = new Z4DrawingToolPanel();

  private Z4RibbonDrawingToolPanel ribbonDrawingToolPanel;
  private Z4Canvas canvas;
  private Z4DrawingTool drawingTool;
  private Z4DrawingTool oldDrawingTool;
  private boolean changed;

  /**
   * The text content for the selected button
   */
  public final static String SELECTED_DRAWING_TOOL_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  public final static String UNSELECTED_DRAWING_TOOL_CONTENT = "-";

  private final static int PREVIEW_SIZE = 48;

  @SuppressWarnings("StringEquality")
  public Z4DrawingToolPreview() {
    super(".z4drawingtoolpreview-editor");
    this.cssAddClass("z4drawingtoolpreview");

    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
        this.changed = false;
        this.oldDrawingTool = this.drawingTool;
      } else if (this.changed) {
        this.canvas.setChanged(true);
        this.canvas.replaceDrawingTool(this.oldDrawingTool, this.drawingTool);

        if (JSON.stringify(this.oldDrawingTool.getSpatioTemporalColor().toJSON()) != JSON.stringify(this.drawingTool.getSpatioTemporalColor().toJSON())) {
          Z4Constants.pushHistory(this.drawingTool.getSpatioTemporalColor());
        }
      }
    });

    this.name.getStyle().width = (Z4DrawingToolPreview.PREVIEW_SIZE + 15) + "px";

    this.preview.setAttribute("width", "" + Z4DrawingToolPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4DrawingToolPreview.PREVIEW_SIZE);

    this.summary.setLayout(new GridBagLayout());

    this.summary.add(this.name, new GBC(0, 0).w(2));
    this.summary.add(this.preview, new GBC(0, 1));

    JSButton selector = new JSButton();
    selector.setText(Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4drawingtoolpreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event -> {
      document.querySelectorAll(".z4drawingtoolpreview .z4drawingtoolpreview-selector").forEach(element -> element.textContent = Z4DrawingToolPreview.UNSELECTED_DRAWING_TOOL_CONTENT);
      selector.setText(Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT);
      this.canvas.setSelectedDrawingTool(this.drawingTool);
    });
    this.summary.add(selector, new GBC(1, 1).a(GBC.NORTH).i(0, 2, 0, 0));

    this.appendChildInTree("summary", this.summary);

    this.editor.cssAddClass("z4drawingtoolpreview-editor");
    this.editor.addChangeListener(event -> {
      this.changed = true;
      this.drawingTool = this.editor.getValue();
      this.name.setText(this.drawingTool.getName());
      this.setChildAttributeByQuery("summary", "title", this.drawingTool.getName());

      this.computePopupPosition();
      this.drawDemo();
    });
    this.appendChild(this.editor);

    this.editor.addAction(Z4Translations.DUPLICATE, new GBC(0, 0).a(GBC.NORTH).i(0, 1, 0, 0), event -> {
      $Object json = this.drawingTool.toJSON();
      json.$set("name", this.canvas.findDrawingToolName());
      this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(json));

      this.removeAttribute("open");
      setTimeout(() -> document.querySelector(".z4drawingtoolpreview:nth-last-child(1)").setAttribute("open", "open"), 0);
    });

    this.editor.addAction(Z4Translations.SAVE_DRAWING_TOOL_AS, new GBC(1, 0).a(GBC.NORTH).i(0, 1, 0, 0), event -> this.save());

    this.editor.addAction(Z4Translations.DELETE, new GBC(2, 0).a(GBC.NORTHEAST).wxy(1, 1), event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_DRAWING_TOOL_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.changed = true;
        int index = this.canvas.deleteDrawingTool(this.drawingTool);
        document.querySelector(".z4drawingtoolpreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
  }

  /**
   * Sets the riboon drawing tool panel
   *
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   */
  public void setRibbonDrawingToolPanel(Z4RibbonDrawingToolPanel ribbonDrawingToolPanel) {
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
  }

  /**
   * Sets the drawing tool
   *
   * @param canvas The canvas
   * @param drawingTool The drawing tool
   */
  public void setDrawingTool(Z4Canvas canvas, Z4DrawingTool drawingTool) {
    this.canvas = canvas;
    this.drawingTool = drawingTool;

    this.name.setText(this.drawingTool.getName());
    this.editor.setValue(this.drawingTool);

    this.setChildAttributeByQuery("summary", "title", this.drawingTool.getName());

    this.drawDemo();
  }

  private void drawDemo() {
    if ($exists(this.drawingTool)) {
      this.ctx.clearRect(0, 0, Z4DrawingToolPreview.PREVIEW_SIZE, Z4DrawingToolPreview.PREVIEW_SIZE);

      this.ctx.save();
      this.ctx.scale(0.1, 0.1);
      this.drawingTool.getPointIterator().drawDemo(this.ctx, this.drawingTool.getPainter(), this.drawingTool.getSpatioTemporalColor(), this.drawingTool.getProgression(), Z4DrawingToolPreview.PREVIEW_SIZE * 10, Z4DrawingToolPreview.PREVIEW_SIZE * 10, false);
      this.ctx.restore();
    }
  }

  private void save() {
    if ($typeof(window.$get("showSaveFilePicker"), "function")) {
      this.saveToolsToHandle();
    } else {
      this.saveToolsToFile();
    }
  }

  private void saveToolsToFile() {
    JSPanel panel = new JSPanel();
    panel.setLayout(new BorderLayout(0, 0));

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.FILENAME);
    panel.add(label, BorderLayout.NORTH);

    JSTextField fileName = new JSTextField();
    fileName.setText(this.drawingTool.getName());
    panel.add(fileName, BorderLayout.CENTER);

    JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener -> fileName.addActionListener(event -> listener.$apply(new ChangeEvent())), () -> $exists(fileName.getText()), response -> {
      if (response == JSOptionPane.OK_OPTION) {
        this.canvas.saveDrawingToolToFile(fileName.getText(), this.drawingTool);
      }
    });
  }

  private void saveToolsToHandle() {
    FilePickerOptions options = new FilePickerOptions();
    options.excludeAcceptAllOption = true;
    options.id = Z4Constants.TOOL_FILE_ID;
    options.multiple = false;
    options.suggestedName = this.drawingTool.getName();
    options.types = Z4Constants.PIZZAPAZZA_SAVE_TOOL_FILE_TYPE;

    JSFilePicker.showSaveFilePicker(options, handle -> this.canvas.saveDrawingToolToHandle(handle, this.drawingTool));
  }
}
