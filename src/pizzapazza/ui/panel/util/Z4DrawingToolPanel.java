package pizzapazza.ui.panel.util;

import def.js.Array;
import static def.js.Globals.eval;
import javascript.awt.BoxLayout;
import javascript.awt.CardLayout;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSTabbedPane;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.iterator.Z4PointIteratorType;
import pizzapazza.iterator.Z4Stamper;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4Painter;
import pizzapazza.painter.Z4PainterType;
import pizzapazza.painter.Z4Shape2DPainter;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.ui.panel.color.Z4BiGradientColorPanel;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.iterator.Z4PointIteratorPanel;
import pizzapazza.ui.panel.painter.Z4PainterPanel;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;

/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingToolPanel extends Z4AbstractValuePanel<Z4DrawingTool> {

  private final JSComponent selectedPointInterator = new JSComponent(document.createElement("img"));
  private final JSComponent selectedPainter = new JSComponent(document.createElement("img"));
  private final JSComponent selectedSpatioTemporalColor = new JSComponent(document.createElement("img"));

  private final Array<JSRadioButton> radios = new Array<>();

  private final JSPanel cardPanel = new JSPanel();
  private final CardLayout cardLayout = new CardLayout(0, 0);
  private final Array<JSPanel> cardPanels = new Array<>();

  private String selectedPointInteratorCard;
  private String selectedPainterCard;
  private String selectedSpatioTemporalColorCard;

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
    this.add(selected, new GBC(0, 0));

    JSTabbedPane pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, new GBC(0, 1));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab(Z4Translations.SETTINGS, panel);

    JSPanel panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panel.add(panelRadio, new GBC(0, 0).i(0, 5, 0, 0));

    Z4UI.addVLine(panel, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));

    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(2, 0).a(GBC.NORTH));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "STAMPER", "new Z4StamperPanel()", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "TRACER", "new Z4TracerPanel()", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "AIRBRUSH", "new Z4AirbrushPanel()", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPointInterator, "SPIROGRAPH", "new Z4SpirographPanel()", "10px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPainter, "SHAPE2D", "new Z4Shape2DPainterPanel()", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedPainter, "CENTERED-FIGURE", "new Z4CenteredFigurePainterPanel()", "10px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedSpatioTemporalColor, "COLOR", "new Z4ColorPanel()", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "new Z4GradientColorPanel()", "1px");
    this.addRadioButton(panelRadio, buttonGroup, this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "new Z4BiGradientColorPanel()", "10px");

    pane.addTab(Z4Translations.TRY_ME, new JSPanel());

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

  private void addRadioButton(JSPanel panelRadio, ButtonGroup buttonGroup, JSComponent selected, String card, String evaluate, String marginBottom) {
    JSRadioButton radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = marginBottom;
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.setIcon(new Z4EmptyImageProducer<>(card));

    radio.addActionListener(event -> {
      this.check(selected, card, evaluate, null, true);
      // IMPOSTARE this.value
      this.onchange();
    });

    this.radios.$set(card, radio);
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
  }

  @Override
  public void setValue(Z4DrawingTool value) {
    this.value = value;

    this.setPointInterator();
    this.setPainter();
    this.spatioTemporalColor();
  }

  private void setPointInterator() {
    new Array<>("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected").forEach(css -> this.selectedPointInterator.cssRemoveClass(css));

    if (this.value.getPointIterator().getType() == Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "new Z4StamperPanel()", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "new Z4TracerPanel()", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "new Z4AirbrushPanel()", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() == Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "new Z4SpirographPanel()", this.value.getPointIterator(), true);
    }
  }

  private void setPainter() {
    new Array<>("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-centered-figure-selected").forEach(css -> this.selectedPainter.cssRemoveClass(css));

    if (this.value.getPainter().getType() == Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "new Z4Shape2DPainterPanel()", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() == Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "new Z4CenteredFigurePainterPanel()", this.value.getPainter(), false);
    }
  }

  private void spatioTemporalColor() {
    new Array<>("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css -> this.selectedSpatioTemporalColor.cssRemoveClass(css));

    if (this.value.getSpatioTemporalColor().isColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "COLOR", "new Z4ColorPanel()", this.value.getSpatioTemporalColor().getColor(), false);
    } else if (this.value.getSpatioTemporalColor().isGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "new Z4GradientColorPanel()", this.value.getSpatioTemporalColor().getGradientColor(), false);
    } else if (this.value.getSpatioTemporalColor().isBiGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "new Z4BiGradientColorPanel()", this.value.getSpatioTemporalColor().getBiGradientColor(), false);
    }
  }

  @SuppressWarnings({"unchecked", "StringEquality"})
  private String check(JSComponent selected, String card, String evaluate, Object value, boolean show) {
    selected.cssAddClass("z4drawingtoolpanel-" + card.toLowerCase() + "-selected");

    if (!$exists(this.cardPanels.$get(card))) {
      this.cardPanels.$set(card, eval(evaluate));
      this.cardPanel.add(this.cardPanels.$get(card), card);

      if (card == "COLOR") {
        ((JSComponent) this.cardPanels.$get(card)).getStyle().minWidth = "15rem";
      }

      ((Z4AbstractValuePanel) this.cardPanels.$get(card)).addChangeListener(event -> {
        this.createValue();
        this.onchange();
      });
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
    Z4Painter painter = ((Z4PainterPanel<Z4Painter>) this.cardPanels.$get(this.selectedPainterCard)).getValue();

    Z4SpatioTemporalColor spatioTemporalColor = null;
    switch (this.selectedSpatioTemporalColorCard) {
      case "COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromColor(((Z4ColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getValue());
        break;
      case "GRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromGradientColor(((Z4GradientColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getValue());
        break;
      case "BIGRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromBiGradientColor(((Z4BiGradientColorPanel) this.cardPanels.$get(this.selectedSpatioTemporalColorCard)).getValue());
        break;
    }

    this.value = new Z4DrawingTool(pointIterator, painter, spatioTemporalColor, new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.01, Z4Lighting.NONE));
  }
}
