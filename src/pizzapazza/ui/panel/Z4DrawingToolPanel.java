package pizzapazza.ui.panel;

import static def.dom.Globals.clearTimeout;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.MouseEvent;
import def.js.Array;
import def.js.Date;
import javascript.awt.BoxLayout;
import javascript.awt.CardLayout;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.event.ActionListener;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSTabbedPane;
import javascript.swing.JSTextField;
import javascript.swing.colorchooser.JSColorMiniSwatchesPanel;
import javascript.swing.colorchooser.JSColorPanel;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4Airbrush;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.iterator.Z4PointIteratorDrawingAction;
import pizzapazza.iterator.Z4PointIteratorType;
import pizzapazza.iterator.Z4Scatterer;
import pizzapazza.iterator.Z4Spirograph;
import pizzapazza.iterator.Z4Stamper;
import pizzapazza.iterator.Z4Tracer;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4BrushPainter;
import pizzapazza.painter.Z4CenteredFigurePainter;
import pizzapazza.painter.Z4DropPainter;
import pizzapazza.painter.Z4NaturalFigurePainter;
import pizzapazza.painter.Z4Painter;
import pizzapazza.painter.Z4PainterType;
import pizzapazza.painter.Z4PatternPainter;
import pizzapazza.painter.Z4Shape2DPainter;
import pizzapazza.ui.panel.color.Z4BiGradientColorPanel;
import pizzapazza.ui.panel.color.Z4ColorProgressionPanel;
import pizzapazza.ui.panel.color.Z4ColorProgressionPanelOrientation;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.iterator.Z4AirbrushPanel;
import pizzapazza.ui.panel.iterator.Z4PointIteratorPanel;
import pizzapazza.ui.panel.iterator.Z4ScattererPanel;
import pizzapazza.ui.panel.iterator.Z4SpirographPanel;
import pizzapazza.ui.panel.iterator.Z4StamperPanel;
import pizzapazza.ui.panel.iterator.Z4TracerPanel;
import pizzapazza.ui.panel.painter.Z4BrushPainterPanel;
import pizzapazza.ui.panel.painter.Z4CenteredFigurePainterPanel;
import pizzapazza.ui.panel.painter.Z4DropPainterPanel;
import pizzapazza.ui.panel.painter.Z4NaturalFigurePainterPanel;
import pizzapazza.ui.panel.painter.Z4PainterPanel;
import pizzapazza.ui.panel.painter.Z4PatternPainterPanel;
import pizzapazza.ui.panel.painter.Z4Shape2DPainterPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;
import simulation.js.$Object;

/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingToolPanel extends Z4AbstractValuePanel<Z4DrawingTool> {

  private final JSTextField name = new JSTextField();
  private final JSButton selectedPointInterator = new JSButton();
  private final JSButton selectedPainter = new JSButton();
  private final JSButton selectedSpatioTemporalColor = new JSButton();
  private final JSButton selectedColorProgression = new JSButton();

  private final JSTabbedPane pane = new JSTabbedPane();

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

  private final JSPanel actions = new JSPanel();

  private String selectedPointInteratorCard;
  private String selectedPainterCard;
  private String selectedSpatioTemporalColorCard;

  private boolean valueIsAdjusting;

  private Color previewColor;

  private final int widthTryMe = 700;
  private final int heightTryMe = 600;
  private final $OffscreenCanvas offscreenObjects = new $OffscreenCanvas(this.widthTryMe, this.heightTryMe);
  private final $CanvasRenderingContext2D offscreenCtxObjects = this.offscreenObjects.getContext("2d");
  private final $OffscreenCanvas offscreenBounds = new $OffscreenCanvas(this.widthTryMe, this.heightTryMe);
  private final $CanvasRenderingContext2D offscreenCtxBounds = this.offscreenBounds.getContext("2d");
  private boolean pressedTryMe;

  private final String tabbedPaneID = "z4drawingtoolpanel_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());

  private int currentTimeoutID;

  /**
   * Creates the object
   */
  public Z4DrawingToolPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");

    Z4UI.addLabel(this, Z4Translations.DRAWING_TOOL_NAME, new GBC(0, 0).w(2).a(GBC.WEST));

    this.name.addActionListener(event -> {
      this.createValue();
      this.onchange();
    });
    this.add(this.name, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL).i(0, 0, 5, 0));

    JSPanel selected = new JSPanel();
    selected.setLayout(new BoxLayout(selected, BoxLayout.X_AXIS));

    this.setSelectedButton(this.selectedPointInterator);
    this.selectedPointInterator.addActionListener(event -> this.selectCard(this.selectedPointInteratorCard));
    selected.add(this.selectedPointInterator, null);

    this.setSelectedButton(this.selectedPainter);
    this.selectedPainter.addActionListener(event -> this.selectCard(this.selectedPainterCard));
    selected.add(this.selectedPainter, null);

    this.setSelectedButton(this.selectedSpatioTemporalColor);
    selected.add(this.selectedSpatioTemporalColor, null);
    this.selectedSpatioTemporalColor.addActionListener(event -> this.selectCard(this.selectedSpatioTemporalColorCard));

    this.setSelectedButton(this.selectedColorProgression);
    selected.add(this.selectedColorProgression, null);
    this.selectedColorProgression.addActionListener(event -> this.selectCard("COLOR-PROGRESSION"));
    this.add(selected, new GBC(1, 0).h(2).a(GBC.SOUTH).i(0, 0, 5, 0));

    this.pane.setID(this.tabbedPaneID);
    this.pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(this.pane, new GBC(0, 2).w(2).wxy(1, 1).f(GBC.BOTH));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.SETTINGS, panel);

    JSPanel panelRadioContainer = new JSPanel();
    panelRadioContainer.setLayout(new GridBagLayout());

    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(0, 0).a(GBC.NORTH).h(2).wxy(1, 1));

    ButtonGroup buttonGroup = new ButtonGroup();

    JSPanel panelRadio = new JSPanel();
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

    this.setValue(new Z4DrawingTool(
            Z4Translations.DRAWING_TOOL,
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
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false), Z4RotationBehavior.FIXED, false)),
            new Z4Shape2DPainter(
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false),
                    false, false, -1,
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
            new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE)
    ));
  }

  private void setSelectedButton(JSButton button) {
    button.setContentAreaFilled(false);
    button.getStyle().minHeight = "43px";
    button.getStyle().marginLeft = "1px";
    button.cssAddClass("z4drawingtoolpanel-selected");
    button.setIcon(new Z4EmptyImageProducer<>(""));
  }

  private void addRadioButton(JSPanel panelRadio, ButtonGroup buttonGroup, String card) {
    JSRadioButton radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = "1px";
    radio.getStyle().minHeight = "25px";
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.cssAddClass("z4drawingtoolpanel-selector-" + card.toLowerCase());
    radio.setIcon(new Z4EmptyImageProducer<>(card));
    radio.addActionListener(event -> this.selectCard(card));

    this.radios.$set(card, radio);
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
  }

  @SuppressWarnings("StringEquality")
  private void selectCard(String card) {
    ((HTMLElement) document.querySelector("#" + this.tabbedPaneID + " > .west > ul > li:nth-child(2) input")).click();

    switch (card) {
      case "STAMPER":
      case "TRACER":
      case "AIRBRUSH":
      case "SPIROGRAPH":
      case "SCATTERER":
        new Array<>("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected", "z4drawingtoolpanel-scatterer-selected").forEach(css -> this.selectedPointInterator.cssRemoveClass(css));
        this.selectedPointInteratorCard = this.check(this.selectedPointInterator, card, card.toLowerCase(), null, true);
        break;
      case "SHAPE2D":
      case "DROP":
      case "BRUSH":
      case "PATTERN":
      case "CENTERED-FIGURE":
      case "NATURAL-FIGURE":
        new Array<>("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-drop-selected", "z4drawingtoolpanel-brush-selected", "z4drawingtoolpanel-pattern-selected", "z4drawingtoolpanel-centered-figure-selected", "z4drawingtoolpanel-natural-figure-selected").forEach(css -> this.selectedPainter.cssRemoveClass(css));
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

    boolean b = card == "COLOR" || card == "BIGRADIENT-COLOR";
    this.transparent1.getStyle().display = b ? "none" : "flex";
    this.swatchesPanel1.getStyle().display = b ? "none" : "flex";
    this.preview1.getStyle().display = b ? "none" : "flex";
    this.transparent2.getStyle().display = b ? "flex" : "none";
    this.swatchesPanel2.getStyle().display = b ? "flex" : "none";
    this.preview2.getStyle().display = b ? "flex" : "none";

    this.valueIsAdjusting = false;
    this.createValue();
    this.drawPreview();
    this.onchange();
  }

  private JSComponent getHLine() {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().width = "100%";
    div.getStyle().margin = "21px 1px 22px 1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    return div;
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

    this.transparentTryMe.addActionListener(event -> {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    this.transparentTryMe.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(this.transparentTryMe, null);

    this.swatchesPanelTryMe.addActionListener(event -> {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);

      this.ctxTryMe.fillStyle = Z4Constants.$getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.ctxTryMe.fillRect(0, 0, this.widthTryMe, this.heightTryMe);

      this.offscreenCtxObjects.fillStyle = Z4Constants.$getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.offscreenCtxObjects.fillRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    colors.add(this.swatchesPanelTryMe, null);

    this.previewTryMe.setProperty("width", "" + this.widthTryMe);
    this.previewTryMe.setProperty("height", "" + this.heightTryMe);
    this.previewTryMe.cssAddClass("z4drawingtoolpanel-preview");
    this.previewTryMe.addEventListener("mouseenter", event -> this.onMouse((MouseEvent) event, "enter"));
    this.previewTryMe.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
    this.previewTryMe.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.previewTryMe.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.previewTryMe.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    panel.add(this.previewTryMe, new GBC(0, 1).wxy(1, 1).a(GBC.NORTH));
  }

  private void onMouse(MouseEvent event, String type) {
    double x = Math.min(this.widthTryMe, Math.max(0, event.offsetX));
    double y = Math.min(this.heightTryMe, Math.max(0, event.offsetY));

    switch (type) {
      case "enter":
        this.pressedTryMe = event.buttons == 1;
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

  private void onAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (this.pressedTryMe && this.value.drawAction(action, x, y)) {
      if (this.value.isDrawBoundsWhileMoving()) {
        this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
        this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      }

      this.iteratePoints(action);

      if (this.value.isDrawBoundsWhileMoving()) {
        this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
        this.ctxTryMe.drawImage(this.offscreenBounds, 0, 0);
      }
    }
  }

  private void onStop(double x, double y) {
    this.pressedTryMe = false;
    if (this.value.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    }
  }

  @SuppressWarnings("empty-statement")
  private void iteratePoints(Z4PointIteratorDrawingAction action) {
    if (action != Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint());

      if (this.value.isInfinitePointGenerator() && this.pressedTryMe) {
        setTimeout(() -> this.iteratePoints(action), this.value.getInfinitePointGeneratorSleep());
      }
    } else if ($exists(this.value.getNextCountOnSTOP())) {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);

      Z4UI.pleaseWait(this.previewTryMe, true, true, false, true, "", () -> this.iteratePoint(0));
    }
  }

  private void iteratePoint(int value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.value.getNextCountOnSTOP());

    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() -> this.iteratePoint(value + 1));
    } else {
      Z4UI.pleaseWaitCompleted();
    }
  }

  private boolean drawNextPoint() {
    Z4DrawingPoint next = this.value.next();
    if (!$exists(next)) {
      return false;
    } else if (next.intent == Z4DrawingPointIntent.DRAW_OBJECTS) {
      this.offscreenCtxObjects.save();
      this.offscreenCtxObjects.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.offscreenCtxObjects.rotate(next.z4Vector.phase);
      this.value.draw(this.offscreenCtxObjects, next);
      this.offscreenCtxObjects.restore();

      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      return true;
    } else {
      if (next.intent == Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
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
  public void addAction(String text, GridBagConstraints gbc, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.addActionListener(listener);
    this.actions.add(button, gbc);
  }

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

    this.name.setText(value.getName());
    this.setPointInterator();
    this.setPainter();
    this.setSpatioTemporalColor();
    this.setColorProgression();
    this.setColorProgressionSettings();

    this.drawPreview();
  }

  private void setPointInterator() {
    new Array<>("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected", "z4drawingtoolpanel-scatterer-selected").forEach(css -> this.selectedPointInterator.cssRemoveClass(css));

    if (this.value.getPointIterator().getType() == Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "stamper", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "tracer", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "airbrush", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "spirograph", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.SCATTERER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SCATTERER", "scatterer", this.value.getPointIterator(), true);
    }
  }

  private void setPainter() {
    new Array<>("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-drop-selected", "z4drawingtoolpanel-brush-selected", "z4drawingtoolpanel-pattern-selected", "z4drawingtoolpanel-centered-figure-selected", "z4drawingtoolpanel-natural-figure-selected").forEach(css -> this.selectedPainter.cssRemoveClass(css));

    if (this.value.getPainter().getType() == Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "shape2d", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.DROP) {
      this.selectedPainterCard = this.check(this.selectedPainter, "DROP", "drop", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.BRUSH) {
      this.selectedPainterCard = this.check(this.selectedPainter, "BRUSH", "brush", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.PATTERN) {
      this.selectedPainterCard = this.check(this.selectedPainter, "PATTERN", "pattern", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "centered-figure", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.NATURAL_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "NATURAL-FIGURE", "natural-figure", this.value.getPainter(), false);
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
            + ("" + this.value.getProgression().getColorProgressionBehavior()).toLowerCase().replaceAll("_", "");

    this.check(this.selectedColorProgression, "COLOR-PROGRESSION", css, this.value.getProgression(), false);
  }

  @SuppressWarnings({"unchecked", "StringEquality"})
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
        case "SCATTERER":
          this.cardPanels.$set(card, new Z4ScattererPanel());
          ((Z4AbstractValuePanel<Z4Scatterer>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PointIteratorPanel<Z4Scatterer>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "SHAPE2D":
          this.cardPanels.$set(card, new Z4Shape2DPainterPanel());
          ((Z4AbstractValuePanel<Z4Shape2DPainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4Shape2DPainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "DROP":
          this.cardPanels.$set(card, new Z4DropPainterPanel());
          ((Z4AbstractValuePanel<Z4DropPainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4DropPainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "BRUSH":
          this.cardPanels.$set(card, new Z4BrushPainterPanel());
          ((Z4AbstractValuePanel<Z4BrushPainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4BrushPainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "PATTERN":
          this.cardPanels.$set(card, new Z4PatternPainterPanel());
          ((Z4AbstractValuePanel<Z4PatternPainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4PatternPainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "CENTERED-FIGURE":
          this.cardPanels.$set(card, new Z4CenteredFigurePainterPanel());
          ((Z4AbstractValuePanel<Z4CenteredFigurePainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4CenteredFigurePainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "NATURAL-FIGURE":
          this.cardPanels.$set(card, new Z4NaturalFigurePainterPanel());
          ((Z4AbstractValuePanel<Z4NaturalFigurePainter>) this.cardPanels.$get(card)).addChangeListener(event -> this.valueIsAdjusting = ((Z4PainterPanel<Z4NaturalFigurePainter>) this.cardPanels.$get(card)).getValueIsAdjusting());
          break;
        case "COLOR":
          this.cardPanels.$set(card, new JSColorPanel());
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

    if (!$exists(value)) {
    } else if (card == "COLOR") {
      ((JSColorPanel) this.cardPanels.$get(card)).setSelectedColor((Color) value);
    } else {
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
        spatioTemporalColor = Z4SpatioTemporalColor.fromColor(((JSColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getSelectedColor());
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

    String currentName = this.name.getText();
    this.value = new Z4DrawingTool($exists(currentName) ? currentName : Z4Translations.DRAWING_TOOL, pointIterator, painter, spatioTemporalColor, progression);
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

  @SuppressWarnings({"empty-statement", "StringEquality"})
  private void drawPreview() {
    clearTimeout(this.currentTimeoutID);

    this.currentTimeoutID = setTimeout(() -> {
      if (this.preview1.getStyle().display != "none") {
        this.ctx1.clearRect(0, 0, 500, 300);

        if ($exists(this.previewColor)) {
          this.ctx1.fillStyle = Z4Constants.$getStyle(this.previewColor.getRGBA_HEX());
          this.ctx1.fillRect(0, 0, 500, 300);
        }

        this.value.getPointIterator().drawDemo(this.ctx1, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 500, 300, this.valueIsAdjusting);
      } else {
        this.ctx2.clearRect(0, 0, 300, 500);

        if ($exists(this.previewColor)) {
          this.ctx2.fillStyle = Z4Constants.$getStyle(this.previewColor.getRGBA_HEX());
          this.ctx2.fillRect(0, 0, 300, 500);
        }

        this.value.getPointIterator().drawDemo(this.ctx2, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 300, 500, this.valueIsAdjusting);
      }
    }, 0);

  }
}
