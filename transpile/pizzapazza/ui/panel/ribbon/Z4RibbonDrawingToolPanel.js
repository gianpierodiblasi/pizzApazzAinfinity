/**
 * The ribbon panel containing the drawing tool menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonDrawingToolPanel extends Z4AbstractRibbonPanel {

   drawingToolsPreview = new JSPanel();

   statusPanel = null;

   canvas = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbondrawingtoolpanel");
    this.addButton(Z4Translations.CREATE, true, 0, 0, "left", 5, event => this.create());
    this.addButton(Z4Translations.OPEN, true, 1, 0, "both", 5, event => this.open());
    this.addButton(Z4Translations.SAVE_DRAWING_TOOLS_AS, true, 2, 0, "right", 5, event => this.save());
    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.drawingToolsPreview.setLayout(new BoxLayout(this.drawingToolsPreview, BoxLayout.X_AXIS));
    this.drawingToolsPreview.getStyle().overflowX = "scroll";
    this.add(this.drawingToolsPreview, new GBC(4, 0).h(2).wx(1).f(GBC.BOTH));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

   create() {
    this.canvas.addDrawingTool(new Z4DrawingTool(this.canvas.findDrawingToolName(), new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, -1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE)));
  }

   open() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TOOL_FILE_ID;
      options.multiple = true;
      options.types = Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.addDrawingToolFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog(".z4t,.z4ts", JSFileChooser.MULTIPLE_SELECTION, 0, files => files.forEach(file => this.canvas.addDrawingToolFromFile(file)));
    }
  }

   save() {
    if (typeof window["showSaveFilePicker"] === "function") {
      this.saveToolsToHandle();
    } else {
      this.saveToolsToFile();
    }
  }

   saveToolsToFile() {
    let panel = new JSPanel();
    panel.setLayout(new BorderLayout(0, 0));
    let label = new JSLabel();
    label.setText(Z4Translations.FILENAME);
    panel.add(label, BorderLayout.NORTH);
    let fileName = new JSTextField();
    fileName.setText(this.canvas.getProjectName());
    panel.add(fileName, BorderLayout.CENTER);
    JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener => fileName.addActionListener(event => listener(new ChangeEvent())), () => !!(fileName.getText()), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.canvas.saveDrawingToolsToFile(fileName.getText());
      }
    });
  }

   saveToolsToHandle() {
    let options = new FilePickerOptions();
    options.excludeAcceptAllOption = true;
    options.id = Z4Constants.TOOL_FILE_ID;
    options.multiple = false;
    options.suggestedName = this.canvas.getProjectName();
    options.types = Z4Constants.PIZZAPAZZA_SAVE_TOOLS_FILE_TYPE;
    JSFilePicker.showSaveFilePicker(options, handle => this.canvas.saveDrawingToolsToHandle(handle));
  }

  /**
   * Resets the drawing tools preview
   */
   reset() {
    this.drawingToolsPreview.setProperty("innerHTML", "");
  }

  /**
   * Adds a new drawing tool preview
   *
   * @param drawingTool The drawing tool
   */
   addDrawingToolPreview(drawingTool) {
    let preview = new Z4DrawingToolPreview();
    preview.setRibbonDrawingToolPanel(this);
    preview.setDrawingTool(this.canvas, drawingTool);
    document.querySelectorAll(".z4drawingtoolpreview .z4drawingtoolpreview-selector").forEach(element => element.textContent = Z4DrawingToolPreview.UNSELECTED_DRAWING_TOOL_CONTENT);
    this.drawingToolsPreview.add(preview, null);
    preview.invoke("scrollIntoView()");
  }
}
