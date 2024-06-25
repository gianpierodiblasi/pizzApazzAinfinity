/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPanel extends Z4AbstractValuePanel {

   selectedPointInterator = new JSComponent(document.createElement("img"));

   selectedPainter = new JSComponent(document.createElement("img"));

   selectedSpatioTemporalColor = new JSComponent(document.createElement("img"));

   selectedColorProgression = new JSComponent(document.createElement("img"));

   transparent = new JSButton();

   swatchesPanel = new JSColorMiniSwatchesPanel();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   radios = new Array();

   cardPanel = new JSPanel();

   cardLayout = new CardLayout(0, 0);

   cardPanels = new Array();

   selectedPointInteratorCard = null;

   selectedPainterCard = null;

   selectedSpatioTemporalColorCard = null;

   valueIsAdjusting = false;

   previewColor = null;

  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");
    let selected = new JSPanel();
    this.selectedPointInterator.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedPointInterator, null);
    this.selectedPainter.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedPainter, null);
    this.selectedSpatioTemporalColor.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedSpatioTemporalColor, null);
    this.selectedColorProgression.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedColorProgression, null);
    this.add(selected, new GBC(0, 0).i(0, 0, 5, 0));
    let pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, new GBC(0, 1).wxy(1, 1).f(GBC.BOTH));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab(Z4Translations.SETTINGS, panel);
    let panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panel.add(panelRadio, new GBC(0, 0).h(3).i(0, 5, 0, 0));
    Z4UI.addVLine(panel, new GBC(1, 0).h(3).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(2, 0).a(GBC.NORTHWEST).wx(1));
    let buttonGroup = new ButtonGroup();
    this.addRadioButton(panelRadio, buttonGroup, "STAMPER", "1px");
    this.addRadioButton(panelRadio, buttonGroup, "TRACER", "1px");
    this.addRadioButton(panelRadio, buttonGroup, "AIRBRUSH", "1px");
    this.addRadioButton(panelRadio, buttonGroup, "SPIROGRAPH", "10px");
    this.addRadioButton(panelRadio, buttonGroup, "SHAPE2D", "1px");
    this.addRadioButton(panelRadio, buttonGroup, "CENTERED-FIGURE", "10px");
    this.addRadioButton(panelRadio, buttonGroup, "COLOR", "1px");
    this.addRadioButton(panelRadio, buttonGroup, "GRADIENT-COLOR", "1px");
    this.addRadioButton(panelRadio, buttonGroup, "BIGRADIENT-COLOR", "10px");
    this.addRadioButton(panelRadio, buttonGroup, "COLOR-PROGRESSION", "0px");
    let colors = new JSPanel();
    panel.add(colors, new GBC(2, 1));
    this.transparent.addActionListener(event => {
      this.previewColor = null;
      this.drawPreview();
    });
    this.transparent.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(this.transparent, null);
    this.swatchesPanel.addActionListener(event => {
      this.previewColor = this.swatchesPanel.getSelectedColor();
      this.drawPreview();
    });
    colors.add(this.swatchesPanel, null);
    this.preview.setProperty("width", "500");
    this.preview.setProperty("height", "300");
    this.preview.cssAddClass("z4drawingtoolpanel-preview");
    panel.add(this.preview, new GBC(2, 2).i(5, 0, 0, 0));
    pane.addTab(Z4Translations.TRY_ME, new JSPanel());
    this.setValue(new Z4DrawingTool(new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.RELATIVE_TO_PATH, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, 3, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.01, Z4Lighting.NONE)));
  }

   addRadioButton(panelRadio, buttonGroup, card, marginBottom) {
    let radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = marginBottom;
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.setIcon(new Z4EmptyImageProducer(card));
    radio.addActionListener(event => {
      switch(card) {
        case "STAMPER":
        case "TRACER":
        case "AIRBRUSH":
        case "SPIROGRAPH":
          new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
          this.selectedPointInteratorCard = this.check(this.selectedPointInterator, card, card.toLowerCase(), null, true);
          break;
        case "SHAPE2D":
        case "CENTERED-FIGURE":
          new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-centered-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
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
      this.valueIsAdjusting = false;
      this.createValue();
      this.drawPreview();
      this.onchange();
    });
    this.radios[card] = radio;
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
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
    this.setPointInterator();
    this.setPainter();
    this.setSpatioTemporalColor();
    this.setColorProgression();
    this.setColorProgressionSettings();
    this.drawPreview();
  }

   setPointInterator() {
    new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
    if (this.value.getPointIterator().getType() === Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "stamper", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "tracer", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "airbrush", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "spirograph", this.value.getPointIterator(), true);
    }
  }

   setPainter() {
    new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-centered-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
    if (this.value.getPainter().getType() === Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "shape2d", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "centered-figure", this.value.getPainter(), false);
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
    let css = (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH ? "airbrush-" : "") + ("" + this.value.getProgression().getColorProgressionBehavior()).toLowerCase().replace("_", "");
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
        case "SHAPE2D":
          this.cardPanels[card] = new Z4Shape2DPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "CENTERED-FIGURE":
          this.cardPanels[card] = new Z4CenteredFigurePainterPanel();
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
    this.value = new Z4DrawingTool(pointIterator, painter, spatioTemporalColor, progression);
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
    this.ctx.clearRect(0, 0, 500, 300);
    if (this.previewColor) {
      this.ctx.fillStyle = Z4Constants.getStyle(this.previewColor.getRGBA_HEX());
      this.ctx.fillRect(0, 0, 500, 300);
    }
  }
}
