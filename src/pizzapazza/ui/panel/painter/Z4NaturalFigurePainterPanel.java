package pizzapazza.ui.panel.painter;

import def.js.Array;
import def.js.Object;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSTabbedPane;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4NaturalFigurePainter;
import pizzapazza.painter.Z4NaturalFigurePainterControlPointClosure;
import pizzapazza.painter.Z4NaturalFigurePainterType;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;

/**
 * The panel to edit a Z4NaturalFigurePainter
 *
 * @author gianpiero.diblasi
 */
public class Z4NaturalFigurePainterPanel extends Z4PainterPanel<Z4NaturalFigurePainter> {

  private final Array<JSRadioButton> radios = new Array<>();
  private final Array<JSRadioButton> radiosClosure = new Array<>();
  private final JSComponent sample = new JSComponent(document.createElement("img"));

  private final Z4FancifulValuePanel size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  private final Z4FancifulValuePanel internalAngle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final Z4FancifulValuePanel externalAngle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final Z4FancifulValuePanel internalAngle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final Z4FancifulValuePanel externalAngle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

  private final Z4FancifulValuePanel internalTension1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final Z4FancifulValuePanel externalTension1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final Z4FancifulValuePanel internalTension2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
  private final Z4FancifulValuePanel externalTension2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

  private final Z4FancifulValuePanel externalForceAngle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel externalForceTension = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  private final JSSpinner indentationSpinner = new JSSpinner();
  private final JSSlider indentationSlider = new JSSlider();

  private final Z4FancifulValuePanel shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4ColorPanel shadowColorPanel = new Z4ColorPanel();

  private final Z4FancifulValuePanel borderSize = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4ColorPanel borderColorPanel = new Z4ColorPanel();

  /**
   * Creates the object
   */
  public Z4NaturalFigurePainterPanel() {
    super();
    this.cssAddClass("z4naturalfigurepainterpanel");

    JSTabbedPane tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.BASIC, panel);

    JSPanel panelType = new JSPanel();
    panel.add(panelType, new GBC(0, 0).w(2));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_0, panelType, this.radios, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_1, panelType, this.radios, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_2, panelType, this.radios, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_3, panelType, this.radios, buttonGroup);

    buttonGroup = new ButtonGroup();
    this.addRadio("" + Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0, panelType, this.radiosClosure, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1, panelType, this.radiosClosure, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2, panelType, this.radiosClosure, buttonGroup);

    this.size.setSignsVisible(false);
    this.size.setConstantRange(1, 200);
    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.cssAddClass("z4abstractvaluepanel-titled");
    this.size.addChangeListener(event -> this.onfigurechange(this.size.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.size, new GBC(0, 1).w(2).i(0, 0, 1, 0));

    Z4UI.addLabel(panel, Z4Translations.INDENTATION, new GBC(0, 2).a(GBC.WEST));

    this.indentationSpinner.cssAddClass("jsspinner_w_4rem");
    this.indentationSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.indentationSpinner.addChangeListener(event -> this.onfigurechange(this.indentationSpinner.getValueIsAdjusting(), null, null, (int) this.indentationSpinner.getValue()));
    panel.add(this.indentationSpinner, new GBC(1, 2).a(GBC.EAST));

    this.indentationSlider.addChangeListener(event -> this.onfigurechange(this.indentationSlider.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.indentationSlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));

    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.POINTS, panel);

    this.sample.cssAddClass("z4naturalfigurepainterpanel-sample");
    panel.add(this.sample, new GBC(0, 0).h(2));

    this.createPoint(panel, this.internalAngle1, this.internalTension1, Z4Translations.INTERNAL_BASE_POINT, "i1", 1);
    this.createPoint(panel, this.externalAngle1, this.externalTension1, Z4Translations.EXTERNAL_BASE_POINT, "e1", 3);
    this.createPoint(panel, this.internalAngle2, this.internalTension2, Z4Translations.INTERNAL_TERMINAL_POINT, "i2", 5);
    this.createPoint(panel, this.externalAngle2, this.externalTension2, Z4Translations.EXTERNAL_TERMINAL_POINT, "e2", 7);

    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.EXTERNAL_FORCE, panel);

    this.externalForceAngle.setConstantRange(0, 90);
    this.externalForceAngle.setRandomRange(0, 90);
    this.externalForceAngle.setLabel(Z4Translations.ANGLE + " (\u03B1)");
    this.externalForceAngle.cssAddClass("z4abstractvaluepanel-titled");
    this.externalForceAngle.addChangeListener(event -> this.onfigurechange(this.externalForceAngle.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalForceAngle, new GBC(0, 0).i(1, 0, 0, 1));

    this.externalForceTension.setSignsVisible(false);
    this.externalForceTension.setConstantRange(0, 100);
    this.externalForceTension.setLabel(Z4Translations.TENSION + " (\u03C4)");
    this.externalForceTension.cssAddClass("z4abstractvaluepanel-titled");
    this.externalForceTension.addChangeListener(event -> this.onfigurechange(this.externalForceTension.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalForceTension, new GBC(1, 0).a(GBC.SOUTH));

    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event -> this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));

    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event -> this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));

    this.shadowColorPanel.addChangeListener(event -> this.onfigurechange(false, this.shadowColorPanel.getValue(), null, this.indentationSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPanel);

    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event -> this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));

    this.borderColorPanel.addChangeListener(event -> this.onfigurechange(false, null, this.borderColorPanel.getValue(), this.indentationSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPanel);

    this.setValue(new Z4NaturalFigurePainter(
            Z4NaturalFigurePainterType.TYPE_0,
            Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            0,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Color(0, 0, 0, 255),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Color(0, 0, 0, 255)
    ));
  }

  private void addRadio(String object, JSPanel panel, Array<JSRadioButton> radios, ButtonGroup buttonGroup) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4naturalfigurepainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(object));
    radio.addActionListener(event -> this.onfigurechange(false, null, null, this.indentationSlider.getValue()));

    buttonGroup.add(radio);
    radios.$set(object, radio);
    panel.add(radio, null);
  }

  private void createPoint(JSPanel panel, Z4FancifulValuePanel angle, Z4FancifulValuePanel tension, String title, String suffix, int x) {
    Z4UI.addLabel(panel, title, new GBC(x, 0).w(2).a(GBC.WEST)).getStyle().fontWeight = "bold";

    angle.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    angle.setSignsVisible(false);
    angle.setConstantRange(0, 90);
    angle.setRandomRange(0, 90);
    angle.setLabel(Z4Translations.ANGLE + " (\u03B1" + suffix + ")");
    angle.cssAddClass("z4abstractvaluepanel-titled");
    angle.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    angle.addChangeListener(event -> this.onfigurechange(angle.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(angle, new GBC(x, 1).i(0, 0, 0, 1));

    tension.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    tension.setSignsVisible(false);
    tension.setConstantRange(1, 100);
    tension.setLabel(Z4Translations.TENSION + " (\u03C4" + suffix + ")");
    tension.cssAddClass("z4abstractvaluepanel-titled");
    tension.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    tension.addChangeListener(event -> this.onfigurechange(tension.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(tension, new GBC(x + 1, 1).i(0, 0, 0, 1));
  }

  private void createPanel(JSTabbedPane tabbedPane, String text, Z4FancifulValuePanel p1, Z4FancifulValuePanel p2, Z4ColorPanel colorPanel) {
    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);

    panel.add(p1, new GBC(0, 1).i(1, 0, 1, 0));
    if ($exists(p2)) {
      panel.add(p2, new GBC(0, 2));
    }

    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    panel.add(colorPanel, new GBC(0, 3).f(GBC.HORIZONTAL));
  }

  private void onfigurechange(boolean b, Color shadowColor, Color borderColor, int indentation) {
    this.valueIsAdjusting = b;

    this.indentationSpinner.setValue(indentation);
    this.indentationSlider.setValue(indentation);

    Z4NaturalFigurePainterType type = null;
    switch ("" + Object.keys(this.radios).find((key, index, array) -> ((JSRadioButton) this.radios.$get(key)).isSelected())) {
      case "TYPE_0":
        type = Z4NaturalFigurePainterType.TYPE_0;
        break;
      case "TYPE_1":
        type = Z4NaturalFigurePainterType.TYPE_1;
        break;
      case "TYPE_2":
        type = Z4NaturalFigurePainterType.TYPE_2;
        break;
      case "TYPE_3":
        type = Z4NaturalFigurePainterType.TYPE_3;
        break;
    }

    Z4NaturalFigurePainterControlPointClosure controlPointClosure = null;
    switch ("" + Object.keys(this.radiosClosure).find((key, index, array) -> ((JSRadioButton) this.radiosClosure.$get(key)).isSelected())) {
      case "CONTROL_POINT_CLOSURE_0":
        controlPointClosure = Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0;
        break;
      case "CONTROL_POINT_CLOSURE_1":
        controlPointClosure = Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1;
        break;
      case "CONTROL_POINT_CLOSURE_2":
        controlPointClosure = Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2;
        break;
    }

    this.value = new Z4NaturalFigurePainter(
            type, controlPointClosure,
            this.size.getValue(),
            this.internalAngle1.getValue(), this.externalAngle1.getValue(), this.internalAngle2.getValue(), this.externalAngle2.getValue(),
            this.internalTension1.getValue(), this.externalTension1.getValue(), this.internalTension2.getValue(), this.externalTension2.getValue(),
            this.indentationSlider.getValue(),
            this.externalForceAngle.getValue(), this.externalForceTension.getValue(),
            this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), $exists(shadowColor) ? shadowColor : this.value.getShadowColor(),
            this.borderSize.getValue(), $exists(borderColor) ? borderColor : this.value.getBorderColor()
    );

    this.onchange();
  }

  @Override
  public void setValue(Z4NaturalFigurePainter value) {
    this.value = value;

    ((JSRadioButton) this.radios.$get("" + value.getNaturalFigurePainterType())).setSelected(true);
    ((JSRadioButton) this.radiosClosure.$get("" + value.getControlPointClosure())).setSelected(true);

    this.size.setValue(this.value.getSize());

    this.internalAngle1.setValue(this.value.getInternalAngle1());
    this.externalAngle1.setValue(this.value.getExternalAngle1());
    this.internalAngle2.setValue(this.value.getInternalAngle2());
    this.externalAngle2.setValue(this.value.getExternalAngle2());

    this.internalTension1.setValue(this.value.getInternalTension1());
    this.externalTension1.setValue(this.value.getExternalTension1());
    this.internalTension2.setValue(this.value.getInternalTension2());
    this.externalTension2.setValue(this.value.getExternalTension2());

    this.externalForceAngle.setValue(this.value.getExternalForceAngle());
    this.externalForceTension.setValue(this.value.getExternalForceTension());

    this.indentationSpinner.setValue(this.value.getIndentation());
    this.indentationSlider.setValue(this.value.getIndentation());

    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPanel.setValue(this.value.getShadowColor());

    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPanel.setValue(this.value.getBorderColor());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setEnabled(b));
    Object.keys(this.radiosClosure).forEach(key -> ((JSRadioButton) this.radiosClosure.$get(key)).setEnabled(b));

    this.size.setEnabled(b);

    this.internalAngle1.setEnabled(b);
    this.externalAngle1.setEnabled(b);
    this.internalAngle2.setEnabled(b);
    this.externalAngle2.setEnabled(b);

    this.internalTension1.setEnabled(b);
    this.externalTension1.setEnabled(b);
    this.internalTension2.setEnabled(b);
    this.externalTension2.setEnabled(b);

    this.externalForceAngle.setEnabled(b);
    this.externalForceTension.setEnabled(b);

    this.indentationSpinner.setEnabled(b);
    this.indentationSlider.setEnabled(b);

    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);

    this.borderSize.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
