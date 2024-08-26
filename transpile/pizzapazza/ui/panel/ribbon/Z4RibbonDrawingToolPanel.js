/**
 * The ribbon panel containing the drawing tool menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonDrawingToolPanel extends Z4AbstractRibbonPanel {

   multiplicitySlider = new JSSlider();

   multiplicitySpinner = new JSSpinner();

   offsetXSlider = new JSSlider();

   offsetXSpinner = new JSSpinner();

   offsetYSlider = new JSSlider();

   offsetYSpinner = new JSSpinner();

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
    Z4UI.addLabel(this, Z4Translations.NEW_DRAWING_TOOL, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event => this.create());
    this.addButton(Z4Translations.FROM_FILE, true, 1, 1, "both", 0, event => this.open());
    this.addButton(Z4Translations.FROM_LIBRARY, true, 2, 1, "right", 0, event => this.openFromLibrary());
    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.addButton(Z4Translations.SAVE_DRAWING_TOOLS_AS, true, 4, 1, "", 0, event => this.save());
    Z4UI.addVLine(this, new GBC(5, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.addKaleidoscope();
    Z4UI.addVLine(this, new GBC(7, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.drawingToolsPreview.setLayout(new BoxLayout(this.drawingToolsPreview, BoxLayout.X_AXIS));
    this.drawingToolsPreview.getStyle().overflowX = "scroll";
    this.add(this.drawingToolsPreview, new GBC(8, 0).h(2).wx(1).f(GBC.BOTH));
  }

   addKaleidoscope() {
    let dropDown = new Z4DropDown(".z4kaleidoscopepanel");
    dropDown.cssAddClass("z4kaleidoscopedropdown");
    this.add(dropDown, new GBC(6, 1).a(GBC.NORTH).i(0, 5, 0, 5));
    let label = new JSLabel();
    label.setText(Z4Translations.KALEIDOSCOPE);
    dropDown.appendChildInTree("summary", label);
    let panel = new JSPanel();
    panel.cssAddClass("z4kaleidoscopepanel");
    panel.setLayout(new GridBagLayout());
    dropDown.appendChild(panel);
    Z4UI.addLabel(panel, Z4Translations.MULTIPLICITY, new GBC(0, 0).a(GBC.WEST));
    this.multiplicitySlider.addChangeListener(event => this.onchange(false, this.multiplicitySpinner, this.multiplicitySlider, this.multiplicitySlider.getValueIsAdjusting()));
    panel.add(this.multiplicitySlider, new GBC(0, 1).w(2).f(GBC.HORIZONTAL));
    this.multiplicitySpinner.cssAddClass("jsspinner_w_4rem");
    this.multiplicitySpinner.addChangeListener(event => this.onchange(true, this.multiplicitySpinner, this.multiplicitySlider, this.multiplicitySpinner.getValueIsAdjusting()));
    panel.add(this.multiplicitySpinner, new GBC(1, 0).a(GBC.EAST));
    Z4UI.addLabel(panel, Z4Translations.OFFSET_X, new GBC(0, 2).a(GBC.WEST));
    this.offsetXSlider.getStyle().minWidth = "20rem";
    this.offsetXSlider.addChangeListener(event => this.onchange(false, this.offsetXSpinner, this.offsetXSlider, this.offsetXSlider.getValueIsAdjusting()));
    panel.add(this.offsetXSlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));
    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event => this.onchange(true, this.offsetXSpinner, this.offsetXSlider, this.offsetXSpinner.getValueIsAdjusting()));
    panel.add(this.offsetXSpinner, new GBC(1, 2).a(GBC.EAST));
    Z4UI.addVLine(panel, new GBC(2, 0).h(5).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(panel, Z4Translations.OFFSET_Y, new GBC(3, 3).h(2).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event => this.onchange(true, this.offsetYSpinner, this.offsetYSlider, this.offsetYSpinner.getValueIsAdjusting()));
    panel.add(this.offsetYSpinner, new GBC(3, 0).h(3).a(GBC.NORTH));
    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.getStyle().minHeight = "20rem";
    this.offsetYSlider.addChangeListener(event => this.onchange(false, this.offsetYSpinner, this.offsetYSlider, this.offsetYSlider.getValueIsAdjusting()));
    panel.add(this.offsetYSlider, new GBC(4, 0).h(5).wy(1).a(GBC.NORTH).f(GBC.VERTICAL));
  }

   onchange(spTosl, spinner, slider, adjusting) {
    if (adjusting) {
      document.querySelector(".z4kaleidoscopedropdown").setAttribute("transparent", "true");
    } else {
      document.querySelector(".z4kaleidoscopedropdown").removeAttribute("transparent");
    }
    if (spinner && spTosl) {
      slider.setValue(spinner.getValue());
    } else if (spinner) {
      spinner.setValue(slider.getValue());
    }
    this.offsetXSpinner.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetXSlider.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetYSpinner.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetYSlider.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.canvas.setKaleidoscope(new Z4Kaleidoscope(this.multiplicitySlider.getValue(), this.offsetXSlider.getValue(), this.offsetYSlider.getValue()));
  }

  /**
   * Refreshes the canvas size
   *
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
   refreshCanvasSize(resetOnlySize) {
    let size = this.canvas.getSize();
    if (!resetOnlySize) {
      this.multiplicitySpinner.setModel(new SpinnerNumberModel(1, 1, 12, 1));
      this.multiplicitySlider.setMinimum(1);
      this.multiplicitySlider.setMaximum(12);
      this.multiplicitySlider.setValue(1);
    }
    this.offsetXSpinner.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(parseInt(size.width / 2), 0, size.width, 1));
    this.offsetXSlider.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetXSlider.setMaximum(size.width);
    this.offsetXSlider.setValue(parseInt(size.width / 2));
    this.offsetYSpinner.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(parseInt(size.height / 2), 0, size.height, 1));
    this.offsetYSlider.setEnabled(this.multiplicitySlider.getValue() > 1);
    this.offsetYSlider.setMaximum(size.height);
    this.offsetYSlider.setValue(parseInt(size.height / 2));
    this.canvas.setKaleidoscope(new Z4Kaleidoscope(this.multiplicitySlider.getValue(), this.offsetXSlider.getValue(), this.offsetYSlider.getValue()));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
    this.refreshCanvasSize(false);
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
    this.canvas.addDrawingTool(new Z4DrawingTool(this.canvas.findDrawingToolName(), new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, -1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE)));
    setTimeout(() => document.querySelector(".z4drawingtoolpreview:nth-last-child(1)").setAttribute("open", "open"), 0);
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

   openFromLibrary() {
    let panel = new Z4OpenDrawingToolsFromLibraryPanel();
    JSOptionPane.showInputDialog(panel, Z4Translations.FROM_LIBRARY, listener => panel.addChangeListener(listener), () => !!(panel.getSelectedDrawingTools().length), response => {
      if (response === JSOptionPane.OK_OPTION) {
        panel.getSelectedDrawingTools().forEach(drawingTool => this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
      }
    });
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
    setTimeout(() => preview.invoke("scrollIntoView()"), 0);
  }
}
