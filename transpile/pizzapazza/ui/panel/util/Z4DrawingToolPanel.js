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

   radios = new Array();

   cardPanel = new JSPanel();

   cardLayout = new CardLayout(0, 0);

   cardPanels = new Array();

   selectedPointInteratorCard = null;

   selectedPainterCard = null;

   selectedSpatioTemporalColorCard = null;

   selectedColorProgressionCard = null;

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
    panel.add(panelRadio, new GBC(0, 0).i(0, 5, 0, 0));
    Z4UI.addVLine(panel, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(2, 0).a(GBC.NORTHWEST).wx(1));
    let buttonGroup = new ButtonGroup();
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "STAMPER", "new Z4StamperPanel()", "pointIterator", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "TRACER", "new Z4TracerPanel()", "pointIterator", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "AIRBRUSH", "new Z4AirbrushPanel()", "pointIterator", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "SPIROGRAPH", "new Z4SpirographPanel()", "pointIterator", "10px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPainter, "SHAPE2D", "new Z4Shape2DPainterPanel()", "painter", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPainter, "CENTERED-FIGURE", "new Z4CenteredFigurePainterPanel()", "painter", "10px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedSpatioTemporalColor, "COLOR", "new Z4ColorPanel()", "spatioTemporalColor", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "new Z4GradientColorPanel()", "spatioTemporalColor", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "new Z4BiGradientColorPanel()", "spatioTemporalColor", "10px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedColorProgression, "COLOR-PROGRESSION", "new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT)", "colorProgression", "0px");
    pane.addTab(Z4Translations.TRY_ME, new JSPanel());
    this.setValue(new Z4DrawingTool(new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.RELATIVE_TO_PATH, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, 3, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.01, Z4Lighting.NONE)));
  }

   addRadioButton(panelRadio, buttonGroup, selected, card, evaluate, type, marginBottom) {
    let radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = marginBottom;
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.setIcon(new Z4EmptyImageProducer(card));
    radio.addActionListener(event => {
      this.check(selected, card, evaluate, null, true);
      switch(type) {
        case "pointIterator":
          this.selectedPointInteratorCard = card;
          break;
        case "painter":
          this.selectedPainterCard = card;
          break;
        case "spatioTemporalColor":
          this.selectedSpatioTemporalColorCard = card;
          break;
        case "colorProgression":
          this.selectedColorProgressionCard = card;
          break;
      }
      this.createValue();
      this.onchange();
    });
    this.radios[card] = radio;
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
  }

   setValue(value) {
    this.value = value;
    this.setPointInterator();
    this.setPainter();
    this.setSpatioTemporalColor();
  }

   setPointInterator() {
    new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
    if (this.value.getPointIterator().getType() === Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "new Z4StamperPanel()", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "new Z4TracerPanel()", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "new Z4AirbrushPanel()", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "new Z4SpirographPanel()", this.value.getPointIterator(), true);
    }
  }

   setPainter() {
    new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-centered-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
    if (this.value.getPainter().getType() === Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "new Z4Shape2DPainterPanel()", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "new Z4CenteredFigurePainterPanel()", this.value.getPainter(), false);
    }
  }

   setSpatioTemporalColor() {
    new Array("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css => this.selectedSpatioTemporalColor.cssRemoveClass(css));
    this.selectedColorProgressionCard = this.check(this.selectedColorProgression, "COLOR-PROGRESSION", "new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT)", this.value.getProgression(), false);
    if (this.value.getSpatioTemporalColor().isColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "COLOR", "new Z4ColorPanel()", this.value.getSpatioTemporalColor().getColor(), false);
      (this.cardPanels[this.selectedColorProgressionCard]).setProgressionSettings(this.value.getPointIterator().getType(), true, false, false);
    } else if (this.value.getSpatioTemporalColor().isGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "new Z4GradientColorPanel()", this.value.getSpatioTemporalColor().getGradientColor(), false);
      (this.cardPanels[this.selectedColorProgressionCard]).setProgressionSettings(this.value.getPointIterator().getType(), false, true, false);
    } else if (this.value.getSpatioTemporalColor().isBiGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "new Z4BiGradientColorPanel()", this.value.getSpatioTemporalColor().getBiGradientColor(), false);
      (this.cardPanels[this.selectedColorProgressionCard]).setProgressionSettings(this.value.getPointIterator().getType(), false, false, true);
    }
  }

   check(selected, card, evaluate, value, show) {
    selected.cssAddClass("z4drawingtoolpanel-" + card.toLowerCase() + "-selected");
    if (!this.cardPanels[card]) {
      this.cardPanels[card] = eval(evaluate);
      this.cardPanel.add(this.cardPanels[card], card);
      if (card === "COLOR") {
        (this.cardPanels[card]).getStyle().minWidth = "15rem";
      }
      (this.cardPanels[card]).addChangeListener(event => {
        this.createValue();
        this.onchange();
      });
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
    let painter = (this.cardPanels[this.selectedPainterCard]).getValue();
    let spatioTemporalColor = null;
    let colorProgressionPanel = this.cardPanels[this.selectedColorProgressionCard];
    switch(this.selectedSpatioTemporalColorCard) {
      case "COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), true, false, false);
        break;
      case "GRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromGradientColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), false, true, false);
        break;
      case "BIGRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromBiGradientColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), false, false, true);
        break;
    }
    let progression = colorProgressionPanel.getValue();
    this.value = new Z4DrawingTool(pointIterator, painter, spatioTemporalColor, progression);
  }
}
