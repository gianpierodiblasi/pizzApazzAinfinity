package pizzapazza.ui.panel.util;

import static def.dom.Globals.document;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.BoxLayout;
import javascript.awt.CardLayout;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSTabbedPane;
import javascript.swing.colorchooser.JSColorMiniSwatchesPanel;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4Airbrush;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.iterator.Z4PointIteratorType;
import pizzapazza.iterator.Z4Spirograph;
import pizzapazza.iterator.Z4Stamper;
import pizzapazza.iterator.Z4Tracer;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4CenteredFigurePainter;
import pizzapazza.painter.Z4Painter;
import pizzapazza.painter.Z4PainterType;
import pizzapazza.painter.Z4Shape2DPainter;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.ui.panel.color.Z4BiGradientColorPanel;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.ui.panel.color.Z4ColorProgressionPanel;
import pizzapazza.ui.panel.color.Z4ColorProgressionPanelOrientation;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.iterator.Z4AirbrushPanel;
import pizzapazza.ui.panel.iterator.Z4PointIteratorPanel;
import pizzapazza.ui.panel.iterator.Z4SpirographPanel;
import pizzapazza.ui.panel.iterator.Z4StamperPanel;
import pizzapazza.ui.panel.iterator.Z4TracerPanel;
import pizzapazza.ui.panel.painter.Z4CenteredFigurePainterPanel;
import pizzapazza.ui.panel.painter.Z4PainterPanel;
import pizzapazza.ui.panel.painter.Z4Shape2DPainterPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingToolPanel extends Z4AbstractValuePanel<Z4DrawingTool> {

  private final JSComponent selectedPointInterator = new JSComponent(document.createElement("img"));
  private final JSComponent selectedPainter = new JSComponent(document.createElement("img"));
  private final JSComponent selectedSpatioTemporalColor = new JSComponent(document.createElement("img"));
  private final JSComponent selectedColorProgression = new JSComponent(document.createElement("img"));

  private final JSButton transparent1 = new JSButton();
  private final JSColorMiniSwatchesPanel swatchesPanel1 = new JSColorMiniSwatchesPanel();
  private final JSComponent preview1 = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx1 = this.preview1.invoke("getContext('2d')");

  private final JSButton transparent2 = new JSButton();
  private final JSColorMiniSwatchesPanel swatchesPanel2 = new JSColorMiniSwatchesPanel();
  private final JSComponent preview2 = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx2 = this.preview2.invoke("getContext('2d')");

  private final JSButton transparentTryMe = new JSButton();
  private final JSColorMiniSwatchesPanel swatchesPanelTryMe = new JSColorMiniSwatchesPanel();
  private final JSComponent previewTryMe = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctxTryMe = this.previewTryMe.invoke("getContext('2d')");

  private final Array<JSRadioButton> radios = new Array<>();

  private final JSPanel cardPanel = new JSPanel();
  private final CardLayout cardLayout = new CardLayout(0, 0);
  private final Array<JSPanel> cardPanels = new Array<>();

  private String selectedPointInteratorCard;
  private String selectedPainterCard;
  private String selectedSpatioTemporalColorCard;

  private boolean valueIsAdjusting;
  private Color previewColor;
  private int widthTryMe = 700;
  private int heightTryMe = 600;
  
  public Z4DrawingToolPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");

    JSPanel selected = new JSPanel();
    this.selectedPointInterator.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedPointInterator, null);
    this.selectedPainter.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedPainter, null);
    this.selectedSpatioTemporalColor.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedSpatioTemporalColor, null);
    this.selectedColorProgression.cssAddClass("z4drawingtoolpanel-selected");
    selected.add(this.selectedColorProgression, null);
    this.add(selected, new GBC(0, 0).i(0, 0, 5, 0));

    JSTabbedPane pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, new GBC(0, 1).wxy(1, 1).f(GBC.BOTH));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab(Z4Translations.SETTINGS, panel);

    JSPanel panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panel.add(panelRadio, new GBC(0, 0).h(4).i(0, 5, 0, 0));

    Z4UI.addVLine(panel, new GBC(1, 0).h(4).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));

    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(2, 0).a(GBC.NORTH).h(2).wxy(1, 1));

    ButtonGroup buttonGroup = new ButtonGroup();
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

    this.addPreview(panel, 2, 2, this.transparent1, this.swatchesPanel1, this.preview1, 500, 300, new GBC(2, 3), false);
    this.addPreview(panel, 3, 0, this.transparent2, this.swatchesPanel2, this.preview2, 300, 500, new GBC(3, 1).a(GBC.NORTH).i(0, 5, 0, 0), true);

    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab(Z4Translations.TRY_ME, panel);
    this.addTryMe(panel);

    this.setValue(new Z4DrawingTool(
            new Z4Stamper(
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Z4Rotation(0, new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false), Z4RotationBehavior.RELATIVE_TO_PATH, false)
            ),
            new Z4Shape2DPainter(
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    false,
                    false,
                    3,
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Color(0, 0, 0, 0),
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Color(0, 0, 0, 0)
            ),
            Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)),
            new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.01, Z4Lighting.NONE)
    ));
  }

  @SuppressWarnings("StringEquality")
  private void addRadioButton(JSPanel panelRadio, ButtonGroup buttonGroup, String card, String marginBottom) {
    JSRadioButton radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = marginBottom;
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.setIcon(new Z4EmptyImageProducer<>(card));

    radio.addActionListener(event -> {
      switch (card) {
        case "STAMPER":
        case "TRACER":
        case "AIRBRUSH":
        case "SPIROGRAPH":
          new Array<>("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected").forEach(css -> this.selectedPointInterator.cssRemoveClass(css));
          this.selectedPointInteratorCard = this.check(this.selectedPointInterator, card, card.toLowerCase(), null, true);
          break;
        case "SHAPE2D":
        case "CENTERED-FIGURE":
          new Array<>("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-centered-figure-selected").forEach(css -> this.selectedPainter.cssRemoveClass(css));
          this.selectedPainterCard = this.check(this.selectedPainter, card, card.toLowerCase(), null, true);
          break;
        case "COLOR":
        case "GRADIENT-COLOR":
        case "BIGRADIENT-COLOR":
          new Array<>("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css -> this.selectedSpatioTemporalColor.cssRemoveClass(css));
          this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, card, card.toLowerCase(), null, true);
          break;
        case "COLOR-PROGRESSION":
          this.check(this.selectedColorProgression, "COLOR-PROGRESSION", null, null, true);
          break;
      }

      this.transparent1.getStyle().display = card == "BIGRADIENT-COLOR" ? "none" : "flex";
      this.swatchesPanel1.getStyle().display = card == "BIGRADIENT-COLOR" ? "none" : "flex";
      this.preview1.getStyle().display = card == "BIGRADIENT-COLOR" ? "none" : "flex";
      this.transparent2.getStyle().display = card == "BIGRADIENT-COLOR" ? "flex" : "none";
      this.swatchesPanel2.getStyle().display = card == "BIGRADIENT-COLOR" ? "flex" : "none";
      this.preview2.getStyle().display = card == "BIGRADIENT-COLOR" ? "flex" : "none";

      this.valueIsAdjusting = false;
      this.createValue();
      this.drawPreview();
      this.onchange();
    });

    this.radios.$set(card, radio);
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
  }

  private void addPreview(JSPanel panel, int x, int y, JSButton transparent, JSColorMiniSwatchesPanel swatchesPanel, JSComponent preview, int width, int height, GBC gbc, boolean hide) {
    JSPanel colors = new JSPanel();
    panel.add(colors, new GBC(x, y));

    transparent.addActionListener(event -> {
      this.previewColor = null;
      this.drawPreview();
    });
    transparent.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(transparent, null);

    swatchesPanel.addActionListener(event -> {
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

  private void addTryMe(JSPanel panel) {
    JSPanel colors = new JSPanel();
    panel.add(colors, new GBC(0, 0));

    this.transparentTryMe.addActionListener(event -> this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe));
    this.transparentTryMe.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(this.transparentTryMe, null);

    this.swatchesPanelTryMe.addActionListener(event -> {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.ctxTryMe.fillStyle = Z4Constants.$getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.ctxTryMe.fillRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    colors.add(this.swatchesPanelTryMe, null);

    this.previewTryMe.setProperty("width", ""+this.widthTryMe);
    this.previewTryMe.setProperty("height", ""+this.heightTryMe);
    this.previewTryMe.cssAddClass("z4drawingtoolpanel-preview");
    this.previewTryMe.addEventListener("mouseenter", event -> this.onMouse((MouseEvent) event, "enter"));
    this.previewTryMe.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
    this.previewTryMe.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.previewTryMe.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.previewTryMe.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    panel.add(this.previewTryMe, new GBC(0, 1).wxy(1, 1).a(GBC.NORTH));
  }

  public void onMouse(MouseEvent event, String type) {
//    double x = Math.min(this.size.width, Math.max(0, event.offsetX / this.zoom));
//    double y = Math.min(this.size.height, Math.max(0, event.offsetY / this.zoom));
//
//    switch (type) {
//      case "enter":
//        this.pressed = event.buttons == 1;
//        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
//        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
//        break;
//      case "down":
//        this.pressed = true;
//        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
//        break;
//      case "move":
//        this.statusPanel.setMousePosition(parseInt(x), parseInt(y));
//        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
//        break;
//      case "up":
//        this.onStop(x, y);
//        break;
//      case "leave":
//        if (this.pressed) {
//          this.onStop(x, y);
//        }
//        break;
//    }
  }

//  private void onAction(Z4PointIteratorDrawingAction action, double x, double y) {
//    if (this.pressed && this.drawingTool.drawAction(action, x, y)) {
//      this.ribbonHistoryPanel.stopStandard();
//      this.iteratePoints(action);
//    }
//  }

//  private void onStop(double x, double y) {
//    this.pressed = false;
//    if (this.drawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
//      this.ribbonHistoryPanel.stopStandard();
//      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
//    } else {
//      this.startStandard();
//    }
//  }

//  @SuppressWarnings("empty-statement")
//  private void iteratePoints(Z4PointIteratorDrawingAction action) {
//    if (action != Z4PointIteratorDrawingAction.STOP) {
//      while (this.drawNextPoint());
//
//      if (this.drawingTool.isInfinitePointGenerator() && this.pressed) {
//        setTimeout(() -> this.iteratePoints(action), this.drawingTool.getInfinitePointGeneratorSleep());
//      }
//    } else if ($exists(this.drawingTool.getNextCountOnSTOP())) {
//      Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> this.iteratePoint(0));
//    } else {
//      this.startStandard();
//    }
//  }

//  private void iteratePoint(int value) {
//    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.drawingTool.getNextCountOnSTOP());
//
//    if (this.drawNextPoint()) {
//      Z4UI.pleaseWaitAdvanced(() -> this.iteratePoint(value + 1));
//    } else {
//      this.startStandard();
//      Z4UI.pleaseWaitCompleted();
//    }
//  }

//  private boolean drawNextPoint() {
//    Z4DrawingPoint next = this.drawingTool.next();
//    if (!$exists(next)) {
//      return false;
//    } else if (next.intent == Z4DrawingPointIntent.DRAW_OBJECTS) {
//      this.selectedLayer.drawTool(this.drawingTool, next);
//      this.selectedLayer.getLayerPreview().drawLayer();
//      this.canvas.drawCanvas();
//      return true;
//    } else {
//      if (this.zoom != 1) {
//        next = new Z4DrawingPoint(Z4Vector.fromPoints(this.zoom * next.z4Vector.x0, this.zoom * next.z4Vector.y0, this.zoom * next.z4Vector.x, this.zoom * next.z4Vector.y), next.intensity, next.temporalPosition, next.intent, next.side, next.useVectorModuleAsSize);
//      }
//
//      if (next.intent == Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
//        this.canvas.drawCanvas();
//      }
//
//      this.ctx.save();
//      this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
//      this.ctx.rotate(next.z4Vector.phase);
//      this.drawingTool.draw(this.ctx, next);
//      this.ctx.restore();
//      return true;
//    }
//  }
  
  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  @Override
  public void setValue(Z4DrawingTool value) {
    this.value = value;

    this.setPointInterator();
    this.setPainter();
    this.setSpatioTemporalColor();
    this.setColorProgression();
    this.setColorProgressionSettings();

    this.drawPreview();
  }

  private void setPointInterator() {
    new Array<>("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected").forEach(css -> this.selectedPointInterator.cssRemoveClass(css));

    if (this.value.getPointIterator().getType() == Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "stamper", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "tracer", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "airbrush", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "spirograph", this.value.getPointIterator(), true);
    }
  }

  private void setPainter() {
    new Array<>("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-centered-figure-selected").forEach(css -> this.selectedPainter.cssRemoveClass(css));

    if (this.value.getPainter().getType() == Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "shape2d", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "centered-figure", this.value.getPainter(), false);
    }
  }

  private void setSpatioTemporalColor() {
    new Array<>("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css -> this.selectedSpatioTemporalColor.cssRemoveClass(css));

    if (this.value.getSpatioTemporalColor().isColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "COLOR", "color", this.value.getSpatioTemporalColor().getColor(), false);
    } else if (this.value.getSpatioTemporalColor().isGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "gradient-color", this.value.getSpatioTemporalColor().getGradientColor(), false);
    } else if (this.value.getSpatioTemporalColor().isBiGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "bigradient-color", this.value.getSpatioTemporalColor().getBiGradientColor(), false);
    }
  }

  private void setColorProgression() {
    new Array<>(
            "z4drawingtoolpanel-spatial-selected", "z4drawingtoolpanel-temporal-selected", "z4drawingtoolpanel-relativetopath-selected", "z4drawingtoolpanel-random-selected",
            "z4drawingtoolpanel-airbrush-spatial-selected", "z4drawingtoolpanel-airbrush-temporal-selected", "z4drawingtoolpanel-airbrush-relativetopath-selected", "z4drawingtoolpanel-airbrush-random-selected"
    ).forEach(css -> this.selectedColorProgression.cssRemoveClass(css));

    String css
            = (this.value.getPointIterator().getType() == Z4PointIteratorType.AIRBRUSH ? "airbrush-" : "")
            + ("" + this.value.getProgression().getColorProgressionBehavior()).toLowerCase().replace("_", "");

    this.check(this.selectedColorProgression, "COLOR-PROGRESSION", css, this.value.getProgression(), false);
  }

  @SuppressWarnings("unchecked")
  private String check(JSComponent selected, String card, String css, Object value, boolean show) {
    if ($exists(css)) {
      selected.cssAddClass("z4drawingtoolpanel-" + css + "-selected");
    }

    if (!$exists(this.cardPanels.$get(card))) {
      switch (card) {
        case "STAMPER":
          this.cardPanels.$set(card, new Z4StamperPanel());
          ((Z4AbstractValuePanel<Z4Stamper>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PointIteratorPanel<Z4Stamper>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "TRACER":
          this.cardPanels.$set(card, new Z4TracerPanel());
          ((Z4AbstractValuePanel<Z4Tracer>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PointIteratorPanel<Z4Tracer>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "AIRBRUSH":
          this.cardPanels.$set(card, new Z4AirbrushPanel());
          ((Z4AbstractValuePanel<Z4Airbrush>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PointIteratorPanel<Z4Airbrush>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "SPIROGRAPH":
          this.cardPanels.$set(card, new Z4SpirographPanel());
          ((Z4AbstractValuePanel<Z4Spirograph>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PointIteratorPanel<Z4Spirograph>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "SHAPE2D":
          this.cardPanels.$set(card, new Z4Shape2DPainterPanel());
          ((Z4AbstractValuePanel<Z4Shape2DPainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4Shape2DPainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "CENTERED-FIGURE":
          this.cardPanels.$set(card, new Z4CenteredFigurePainterPanel());
          ((Z4AbstractValuePanel<Z4CenteredFigurePainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4CenteredFigurePainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "COLOR":
          this.cardPanels.$set(card, new Z4ColorPanel());
          ((JSComponent) this.cardPanels.$get(card)).getStyle().minWidth = "15rem";
          break;
        case "GRADIENT-COLOR":
          this.cardPanels.$set(card, new Z4GradientColorPanel());
          ((Z4AbstractValuePanel<Z4GradientColor>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4GradientColorPanel) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "BIGRADIENT-COLOR":
          this.cardPanels.$set(card, new Z4BiGradientColorPanel());
          ((Z4AbstractValuePanel<Z4BiGradientColor>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4BiGradientColorPanel) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "COLOR-PROGRESSION":
          this.cardPanels.$set(card, new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT));
          ((Z4AbstractValuePanel<Z4ColorProgression>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4ColorProgressionPanel) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
      }

      ((Z4AbstractValuePanel) this.cardPanels.$get(card)).addChangeListener(event -> {
        this.createValue();
        this.drawPreview();
        this.onchange();
      });

      this.cardPanel.add(this.cardPanels.$get(card), card);
    }

    if ($exists(value)) {
      ((Z4AbstractValuePanel) this.cardPanels.$get(card)).setValue(value);
    }

    if (show) {
      ((JSRadioButton) this.radios.$get(card)).setSelected(true);
      this.cardLayout.show(this.cardPanel, card);
    }

    return card;
  }

  @SuppressWarnings("unchecked")
  private void createValue() {
    Z4PointIterator pointIterator = ((Z4PointIteratorPanel<Z4PointIterator>) this.cardPanels.$get(this.selectedPointInteratorCard)).getValue();

    $Object options = new $Object();
    if (pointIterator.getType() == Z4PointIteratorType.SPIROGRAPH) {
      options.$set("drawWhileMoving", ((Z4Spirograph) pointIterator).isDrawWhileMoving());
    }

    Z4Painter painter = ((Z4PainterPanel<Z4Painter>) this.cardPanels.$get(this.selectedPainterCard)).getValue();

    Z4SpatioTemporalColor spatioTemporalColor = null;
    Z4ColorProgressionPanel colorProgressionPanel = (Z4ColorProgressionPanel) this.cardPanels.$get("COLOR-PROGRESSION");
    switch (this.selectedSpatioTemporalColorCard) {
      case "COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromColor(((Z4ColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, true, false, false);
        break;
      case "GRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromGradientColor(((Z4GradientColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, false, true, false);
        break;
      case "BIGRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromBiGradientColor(((Z4BiGradientColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, false, false, true);
        break;
    }
    Z4ColorProgression progression = colorProgressionPanel.getValue();

    this.value = new Z4DrawingTool(pointIterator, painter, spatioTemporalColor, progression);
    this.setColorProgression();
  }

  private void setColorProgressionSettings() {
    $Object options = new $Object();
    if (this.value.getPointIterator().getType() == Z4PointIteratorType.SPIROGRAPH) {
      options.$set("drawWhileMoving", ((Z4Spirograph) this.value.getPointIterator()).isDrawWhileMoving());
    }

    ((Z4ColorProgressionPanel) this.cardPanels.$get("COLOR-PROGRESSION")).setProgressionSettings(
            this.value.getPointIterator().getType(),
            options,
            this.value.getSpatioTemporalColor().isColor(),
            this.value.getSpatioTemporalColor().isGradientColor(),
            this.value.getSpatioTemporalColor().isBiGradientColor());
  }

  private void drawPreview() {
    this.ctx1.clearRect(0, 0, 500, 300);
    this.ctx2.clearRect(0, 0, 300, 500);

    if ($exists(this.previewColor)) {
      this.ctx1.fillStyle = Z4Constants.$getStyle(this.previewColor.getRGBA_HEX());
      this.ctx1.fillRect(0, 0, 500, 300);

      this.ctx2.fillStyle = Z4Constants.$getStyle(this.previewColor.getRGBA_HEX());
      this.ctx2.fillRect(0, 0, 300, 500);
    }

    this.value.getPointIterator().drawDemo(this.ctx1, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 500, 300);
    this.value.getPointIterator().drawDemo(this.ctx2, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 300, 500);
  }
}
