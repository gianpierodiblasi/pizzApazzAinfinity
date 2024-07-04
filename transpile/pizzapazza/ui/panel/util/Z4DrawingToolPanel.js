/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPanel extends Z4AbstractValuePanel {

   name = new JSTextField();

   selectedPointInterator = new JSButton();

   selectedPainter = new JSButton();

   selectedSpatioTemporalColor = new JSButton();

   selectedColorProgression = new JSButton();

   pane = new JSTabbedPane();

   transparent1 = new JSButton();

   swatchesPanel1 = new JSColorMiniSwatchesPanel();

   preview1 = new JSComponent(document.createElement("canvas"));

   ctx1 = this.preview1.invoke("getContext('2d')");

   transparent2 = new JSButton();

   swatchesPanel2 = new JSColorMiniSwatchesPanel();

   preview2 = new JSComponent(document.createElement("canvas"));

   ctx2 = this.preview2.invoke("getContext('2d')");

   transparentTryMe = new JSButton();

   swatchesPanelTryMe = new JSColorMiniSwatchesPanel();

   previewTryMe = new JSComponent(document.createElement("canvas"));

   ctxTryMe = this.previewTryMe.invoke("getContext('2d')");

   radios = new Array();

   cardPanel = new JSPanel();

   cardLayout = new CardLayout(0, 0);

   cardPanels = new Array();

   actions = new JSPanel();

   selectedPointInteratorCard = null;

   selectedPainterCard = null;

   selectedSpatioTemporalColorCard = null;

   valueIsAdjusting = false;

   previewColor = null;

   widthTryMe = 700;

   heightTryMe = 600;

   offscreenObjects = new OffscreenCanvas(this.widthTryMe, this.heightTryMe);

   offscreenCtxObjects = this.offscreenObjects.getContext("2d");

   offscreenBounds = new OffscreenCanvas(this.widthTryMe, this.heightTryMe);

   offscreenCtxBounds = this.offscreenBounds.getContext("2d");

   pressedTryMe = false;

   tabbedPaneID = "z4drawingtoolpanel_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());

   currentTimeoutID = 0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");
    Z4UI.addLabel(this, Z4Translations.DRAWING_TOOL_NAME, new GBC(0, 0).w(2).a(GBC.WEST));
    this.name.addActionListener(event => {
      this.createValue();
      this.onchange();
    });
    this.add(this.name, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL).i(0, 0, 5, 0));
    let selected = new JSPanel();
    selected.setLayout(new BoxLayout(selected, BoxLayout.X_AXIS));
    this.setSelectedButton(this.selectedPointInterator);
    this.selectedPointInterator.addActionListener(event => this.selectCard(this.selectedPointInteratorCard));
    selected.add(this.selectedPointInterator, null);
    this.setSelectedButton(this.selectedPainter);
    this.selectedPainter.addActionListener(event => this.selectCard(this.selectedPainterCard));
    selected.add(this.selectedPainter, null);
    this.setSelectedButton(this.selectedSpatioTemporalColor);
    selected.add(this.selectedSpatioTemporalColor, null);
    this.selectedSpatioTemporalColor.addActionListener(event => this.selectCard(this.selectedSpatioTemporalColorCard));
    this.setSelectedButton(this.selectedColorProgression);
    selected.add(this.selectedColorProgression, null);
    this.selectedColorProgression.addActionListener(event => this.selectCard("COLOR-PROGRESSION"));
    this.add(selected, new GBC(1, 0).h(2).a(GBC.SOUTH).i(0, 0, 5, 0));
    this.pane.setID(this.tabbedPaneID);
    this.pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(this.pane, new GBC(0, 2).w(2).wxy(1, 1).f(GBC.BOTH));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.SETTINGS, panel);
    let panelRadioContainer = new JSPanel();
    panelRadioContainer.setLayout(new GridBagLayout());
    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(0, 0).a(GBC.NORTH).h(2).wxy(1, 1));
    let buttonGroup = new ButtonGroup();
    let panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panelRadioContainer.add(panelRadio, new GBC(0, 0).a(GBC.NORTH).i(150, 0, 0, 15));
    this.addRadioButton(panelRadio, buttonGroup, "STAMPER");
    this.addRadioButton(panelRadio, buttonGroup, "TRACER");
    this.addRadioButton(panelRadio, buttonGroup, "AIRBRUSH");
    this.addRadioButton(panelRadio, buttonGroup, "SPIROGRAPH");
    this.addRadioButton(panelRadio, buttonGroup, "SCATTERER");
    panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panelRadioContainer.add(panelRadio, new GBC(1, 0).a(GBC.NORTH).i(150, 0, 0, 15));
    this.addRadioButton(panelRadio, buttonGroup, "SHAPE2D");
    this.addRadioButton(panelRadio, buttonGroup, "DROP");
    this.addRadioButton(panelRadio, buttonGroup, "BRUSH");
    this.addRadioButton(panelRadio, buttonGroup, "PATTERN");
    this.addRadioButton(panelRadio, buttonGroup, "CENTERED-FIGURE");
    this.addRadioButton(panelRadio, buttonGroup, "NATURAL-FIGURE");
    panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panelRadioContainer.add(panelRadio, new GBC(2, 0).a(GBC.NORTH).i(150, 0, 0, 5));
    this.addRadioButton(panelRadio, buttonGroup, "COLOR");
    this.addRadioButton(panelRadio, buttonGroup, "GRADIENT-COLOR");
    this.addRadioButton(panelRadio, buttonGroup, "BIGRADIENT-COLOR");
    panelRadio.add(this.getHLine(), null);
    this.addRadioButton(panelRadio, buttonGroup, "COLOR-PROGRESSION");
    this.addPreview(panel, 0, 2, this.transparent1, this.swatchesPanel1, this.preview1, 500, 300, new GBC(0, 3), false);
    this.addPreview(panel, 1, 0, this.transparent2, this.swatchesPanel2, this.preview2, 300, 500, new GBC(1, 1).a(GBC.NORTH).i(0, 5, 0, 0), true);
    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.TRY_ME, panel);
    this.addTryMe(panel);
    this.actions.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.ACTIONS, this.actions);
    this.pane.appendChildInTree(".west ul", panelRadioContainer);
    this.setValue(new Z4DrawingTool(Z4Translations.DRAWING_TOOL, new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, -1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE)));
  }

   setSelectedButton(button) {
    button.setContentAreaFilled(false);
    button.getStyle().minHeight = "43px";
    button.getStyle().marginLeft = "1px";
    button.cssAddClass("z4drawingtoolpanel-selected");
    button.setIcon(new Z4EmptyImageProducer(""));
  }

   addRadioButton(panelRadio, buttonGroup, card) {
    let radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = "1px";
    radio.getStyle().minHeight = "25px";
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.cssAddClass("z4drawingtoolpanel-selector-" + card.toLowerCase());
    radio.setIcon(new Z4EmptyImageProducer(card));
    radio.addActionListener(event => this.selectCard(card));
    this.radios[card] = radio;
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
  }

   selectCard(card) {
    (document.querySelector("#" + this.tabbedPaneID + " > .west > ul > li:nth-child(2) input")).click();
    switch(card) {
      case "STAMPER":
      case "TRACER":
      case "AIRBRUSH":
      case "SPIROGRAPH":
      case "SCATTERER":
        new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected", "z4drawingtoolpanel-scatterer-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
        this.selectedPointInteratorCard = this.check(this.selectedPointInterator, card, card.toLowerCase(), null, true);
        break;
      case "SHAPE2D":
      case "DROP":
      case "BRUSH":
      case "PATTERN":
      case "CENTERED-FIGURE":
      case "NATURAL-FIGURE":
        new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-drop-selected", "z4drawingtoolpanel-brush-selected", "z4drawingtoolpanel-pattern-selected", "z4drawingtoolpanel-centered-figure-selected", "z4drawingtoolpanel-natural-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
        this.selectedPainterCard = this.check(this.selectedPainter, card, card.toLowerCase(), null, true);
        break;
      case "COLOR":
      case "GRADIENT-COLOR":
      case "BIGRADIENT-COLOR":
        new Array("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css => this.selectedSpatioTemporalColor.cssRemoveClass(css));
        this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, card, card.toLowerCase(), null, true);
        break;
      case "COLOR-PROGRESSION":
        this.check(this.selectedColorProgression, "COLOR-PROGRESSION", null, null, true);
        break;
    }
    this.transparent1.getStyle().display = card === "BIGRADIENT-COLOR" ? "none" : "flex";
    this.swatchesPanel1.getStyle().display = card === "BIGRADIENT-COLOR" ? "none" : "flex";
    this.preview1.getStyle().display = card === "BIGRADIENT-COLOR" ? "none" : "flex";
    this.transparent2.getStyle().display = card === "BIGRADIENT-COLOR" ? "flex" : "none";
    this.swatchesPanel2.getStyle().display = card === "BIGRADIENT-COLOR" ? "flex" : "none";
    this.preview2.getStyle().display = card === "BIGRADIENT-COLOR" ? "flex" : "none";
    this.valueIsAdjusting = false;
    this.createValue();
    this.drawPreview();
    this.onchange();
  }

   getHLine() {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().width = "100%";
    div.getStyle().margin = "21px 1px 22px 1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    return div;
  }

   addPreview(panel, x, y, transparent, swatchesPanel, preview, width, height, gbc, hide) {
    let colors = new JSPanel();
    panel.add(colors, new GBC(x, y));
    transparent.addActionListener(event => {
      this.previewColor = null;
      this.drawPreview();
    });
    transparent.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(transparent, null);
    swatchesPanel.addActionListener(event => {
      this.previewColor = swatchesPanel.getSelectedColor();
      this.drawPreview();
    });
    colors.add(swatchesPanel, null);
    preview.setProperty("width", "" + width);
    preview.setProperty("height", "" + height);
    preview.cssAddClass("z4drawingtoolpanel-preview");
    panel.add(preview, gbc);
    if (hide) {
      transparent.getStyle().display = "none";
      swatchesPanel.getStyle().display = "none";
      preview.getStyle().display = "none";
    }
  }

   addTryMe(panel) {
    let colors = new JSPanel();
    panel.add(colors, new GBC(0, 0));
    this.transparentTryMe.addActionListener(event => {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    this.transparentTryMe.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(this.transparentTryMe, null);
    this.swatchesPanelTryMe.addActionListener(event => {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.ctxTryMe.fillStyle = Z4Constants.getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.ctxTryMe.fillRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.fillStyle = Z4Constants.getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.offscreenCtxObjects.fillRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    colors.add(this.swatchesPanelTryMe, null);
    this.previewTryMe.setProperty("width", "" + this.widthTryMe);
    this.previewTryMe.setProperty("height", "" + this.heightTryMe);
    this.previewTryMe.cssAddClass("z4drawingtoolpanel-preview");
    this.previewTryMe.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.previewTryMe.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.previewTryMe.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.previewTryMe.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.previewTryMe.addEventListener("mouseup", event => this.onMouse(event, "up"));
    panel.add(this.previewTryMe, new GBC(0, 1).wxy(1, 1).a(GBC.NORTH));
  }

   onMouse(event, type) {
    let x = Math.min(this.widthTryMe, Math.max(0, event.offsetX));
    let y = Math.min(this.heightTryMe, Math.max(0, event.offsetY));
    switch(type) {
      case "enter":
        this.pressedTryMe = event.buttons === 1;
        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        break;
      case "down":
        this.pressedTryMe = true;
        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        break;
      case "move":
        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        break;
      case "up":
        this.onStop(x, y);
        break;
      case "leave":
        if (this.pressedTryMe) {
          this.onStop(x, y);
        }
        break;
    }
  }

   onAction(action, x, y) {
    if (this.pressedTryMe && this.value.drawAction(action, x, y)) {
      this.iteratePoints(action);
    }
  }

   onStop(x, y) {
    this.pressedTryMe = false;
    if (this.value.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    }
  }

   iteratePoints(action) {
    if (action !== Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint()) ;
      if (this.value.isInfinitePointGenerator() && this.pressedTryMe) {
        setTimeout(() => this.iteratePoints(action), this.value.getInfinitePointGeneratorSleep());
      }
    } else if (this.value.getNextCountOnSTOP()) {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      Z4UI.pleaseWait(this.previewTryMe, true, true, false, true, "", () => this.iteratePoint(0));
    }
  }

   iteratePoint(value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.value.getNextCountOnSTOP());
    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() => this.iteratePoint(value + 1));
    } else {
      Z4UI.pleaseWaitCompleted();
    }
  }

   drawNextPoint() {
    let next = this.value.next();
    if (!next) {
      return false;
    } else if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS) {
      this.offscreenCtxObjects.save();
      this.offscreenCtxObjects.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.offscreenCtxObjects.rotate(next.z4Vector.phase);
      this.value.draw(this.offscreenCtxObjects, next);
      this.offscreenCtxObjects.restore();
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      return true;
    } else {
      if (next.intent === Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
        this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      }
      this.offscreenCtxBounds.save();
      this.offscreenCtxBounds.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.offscreenCtxBounds.rotate(next.z4Vector.phase);
      this.value.draw(this.offscreenCtxBounds, next);
      this.offscreenCtxBounds.restore();
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      this.ctxTryMe.drawImage(this.offscreenBounds, 0, 0);
      return true;
    }
  }

  /**
   * Adds an action
   *
   * @param text The text
   * @param gbc The constraints
   * @param listener The listener
   */
   addAction(text, gbc, listener) {
    let button = new JSButton();
    button.setText(text);
    button.addActionListener(listener);
    this.actions.add(button, gbc);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.name.setText(value.getName());
    this.setPointInterator();
    this.setPainter();
    this.setSpatioTemporalColor();
    this.setColorProgression();
    this.setColorProgressionSettings();
    this.drawPreview();
  }

   setPointInterator() {
    new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected", "z4drawingtoolpanel-scatterer-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
    if (this.value.getPointIterator().getType() === Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "stamper", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "tracer", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "airbrush", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "spirograph", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.SCATTERER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SCATTERER", "scatterer", this.value.getPointIterator(), true);
    }
  }

   setPainter() {
    new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-drop-selected", "z4drawingtoolpanel-brush-selected", "z4drawingtoolpanel-pattern-selected", "z4drawingtoolpanel-centered-figure-selected", "z4drawingtoolpanel-natural-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
    if (this.value.getPainter().getType() === Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "shape2d", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.DROP) {
      this.selectedPainterCard = this.check(this.selectedPainter, "DROP", "drop", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.BRUSH) {
      this.selectedPainterCard = this.check(this.selectedPainter, "BRUSH", "brush", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.PATTERN) {
      this.selectedPainterCard = this.check(this.selectedPainter, "PATTERN", "pattern", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "centered-figure", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.NATURAL_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "NATURAL-FIGURE", "natural-figure", this.value.getPainter(), false);
    }
  }

   setSpatioTemporalColor() {
    new Array("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css => this.selectedSpatioTemporalColor.cssRemoveClass(css));
    if (this.value.getSpatioTemporalColor().isColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "COLOR", "color", this.value.getSpatioTemporalColor().getColor(), false);
    } else if (this.value.getSpatioTemporalColor().isGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "gradient-color", this.value.getSpatioTemporalColor().getGradientColor(), false);
    } else if (this.value.getSpatioTemporalColor().isBiGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "bigradient-color", this.value.getSpatioTemporalColor().getBiGradientColor(), false);
    }
  }

   setColorProgression() {
    new Array("z4drawingtoolpanel-spatial-selected", "z4drawingtoolpanel-temporal-selected", "z4drawingtoolpanel-relativetopath-selected", "z4drawingtoolpanel-random-selected", "z4drawingtoolpanel-airbrush-spatial-selected", "z4drawingtoolpanel-airbrush-temporal-selected", "z4drawingtoolpanel-airbrush-relativetopath-selected", "z4drawingtoolpanel-airbrush-random-selected").forEach(css => this.selectedColorProgression.cssRemoveClass(css));
    let css = (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH ? "airbrush-" : "") + ("" + this.value.getProgression().getColorProgressionBehavior()).toLowerCase().replaceAll("_", "");
    this.check(this.selectedColorProgression, "COLOR-PROGRESSION", css, this.value.getProgression(), false);
  }

   check(selected, card, css, value, show) {
    if (css) {
      selected.cssAddClass("z4drawingtoolpanel-" + css + "-selected");
    }
    if (!this.cardPanels[card]) {
      switch(card) {
        case "STAMPER":
          this.cardPanels[card] = new Z4StamperPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "TRACER":
          this.cardPanels[card] = new Z4TracerPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "AIRBRUSH":
          this.cardPanels[card] = new Z4AirbrushPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "SPIROGRAPH":
          this.cardPanels[card] = new Z4SpirographPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "SCATTERER":
          this.cardPanels[card] = new Z4ScattererPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "SHAPE2D":
          this.cardPanels[card] = new Z4Shape2DPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "DROP":
          this.cardPanels[card] = new Z4DropPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "BRUSH":
          this.cardPanels[card] = new Z4BrushPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "PATTERN":
          this.cardPanels[card] = new Z4PatternPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "CENTERED-FIGURE":
          this.cardPanels[card] = new Z4CenteredFigurePainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "NATURAL-FIGURE":
          this.cardPanels[card] = new Z4NaturalFigurePainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "COLOR":
          this.cardPanels[card] = new Z4ColorPanel();
          (this.cardPanels[card]).getStyle().minWidth = "15rem";
          break;
        case "GRADIENT-COLOR":
          this.cardPanels[card] = new Z4GradientColorPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "BIGRADIENT-COLOR":
          this.cardPanels[card] = new Z4BiGradientColorPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "COLOR-PROGRESSION":
          this.cardPanels[card] = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
      }
      (this.cardPanels[card]).addChangeListener(event => {
        this.createValue();
        this.drawPreview();
        this.onchange();
      });
      this.cardPanel.add(this.cardPanels[card], card);
    }
    if (value) {
      (this.cardPanels[card]).setValue(value);
    }
    if (show) {
      (this.radios[card]).setSelected(true);
      this.cardLayout.show(this.cardPanel, card);
    }
    return card;
  }

   createValue() {
    let pointIterator = (this.cardPanels[this.selectedPointInteratorCard]).getValue();
    let options = new Object();
    if (pointIterator.getType() === Z4PointIteratorType.SPIROGRAPH) {
      options["drawWhileMoving"] = (pointIterator).isDrawWhileMoving();
    }
    let painter = (this.cardPanels[this.selectedPainterCard]).getValue();
    let spatioTemporalColor = null;
    let colorProgressionPanel = this.cardPanels["COLOR-PROGRESSION"];
    switch(this.selectedSpatioTemporalColorCard) {
      case "COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, true, false, false);
        break;
      case "GRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromGradientColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, false, true, false);
        break;
      case "BIGRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromBiGradientColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, false, false, true);
        break;
    }
    let progression = colorProgressionPanel.getValue();
    let currentName = this.name.getText();
    this.value = new Z4DrawingTool(currentName ? currentName : Z4Translations.DRAWING_TOOL, pointIterator, painter, spatioTemporalColor, progression);
    this.setColorProgression();
  }

   setColorProgressionSettings() {
    let options = new Object();
    if (this.value.getPointIterator().getType() === Z4PointIteratorType.SPIROGRAPH) {
      options["drawWhileMoving"] = (this.value.getPointIterator()).isDrawWhileMoving();
    }
    (this.cardPanels["COLOR-PROGRESSION"]).setProgressionSettings(this.value.getPointIterator().getType(), options, this.value.getSpatioTemporalColor().isColor(), this.value.getSpatioTemporalColor().isGradientColor(), this.value.getSpatioTemporalColor().isBiGradientColor());
  }

   drawPreview() {
    clearTimeout(this.currentTimeoutID);
    this.currentTimeoutID = setTimeout(() => {
      if (this.preview1.getStyle().display !== "none") {
        this.ctx1.clearRect(0, 0, 500, 300);
        if (this.previewColor) {
          this.ctx1.fillStyle = Z4Constants.getStyle(this.previewColor.getRGBA_HEX());
          this.ctx1.fillRect(0, 0, 500, 300);
        }
        this.value.getPointIterator().drawDemo(this.ctx1, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 500, 300, this.valueIsAdjusting);
      } else {
        this.ctx2.clearRect(0, 0, 300, 500);
        if (this.previewColor) {
          this.ctx2.fillStyle = Z4Constants.getStyle(this.previewColor.getRGBA_HEX());
          this.ctx2.fillRect(0, 0, 300, 500);
        }
        this.value.getPointIterator().drawDemo(this.ctx2, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 300, 500, this.valueIsAdjusting);
      }
    }, 0);
  }
}
