package pizzapazza.ui.panel.painter;

import def.js.Array;
import def.js.Object;
import javascript.awt.GBC;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4DropPainter;
import pizzapazza.painter.Z4DropPainterType;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;

/**
 * The panel to edit a Z4DropPainter
 *
 * @author gianpiero.diblasi
 */
public class Z4DropPainterPanel extends Z4PainterPanel<Z4DropPainter> {

  private final Array<JSRadioButton> radios = new Array<>();

  private final Z4FancifulValuePanel radius = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  private final JSSpinner intensitySpinner = new JSSpinner();
  private final JSSlider intensitySlider = new JSSlider();
  private final JSSpinner gaussianCorrectionSpinner = new JSSpinner();
  private final JSSlider gaussianCorrectionSlider = new JSSlider();

  /**
   * Creates the object
   */
  public Z4DropPainterPanel() {
    super();
    this.cssAddClass("z4droppainterpanel");

    JSPanel panelType = new JSPanel();
    this.add(panelType, new GBC(0, 0).w(2));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(Z4DropPainterType.THOUSAND_POINTS, panelType, buttonGroup);
    this.addRadio(Z4DropPainterType.THOUSAND_LINES, panelType, buttonGroup);
    this.addRadio(Z4DropPainterType.THOUSAND_AREAS, panelType, buttonGroup);

    this.radius.setSignsVisible(false);
    this.radius.setConstantRange(1, 100);
    this.radius.setLabel(Z4Translations.RADIUS);
    this.radius.cssAddClass("z4abstractvaluepanel-titled");
    this.radius.addChangeListener(event -> this.ondropchange(this.radius.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.radius, new GBC(0, 1).w(2).i(0, 0, 1, 0));

    Z4UI.addLabel(this, Z4Translations.INTENSITY, new GBC(0, 2).a(GBC.WEST));

    this.intensitySpinner.cssAddClass("jsspinner_w_4rem");
    this.intensitySpinner.setModel(new SpinnerNumberModel(20, 1, 200, 1));
    this.intensitySpinner.addChangeListener(event -> this.ondropchange(this.intensitySpinner.getValueIsAdjusting(), (int) this.intensitySpinner.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.intensitySpinner, new GBC(1, 2).a(GBC.EAST));

    this.intensitySlider.setMinimum(1);
    this.intensitySlider.setMaximum(200);
    this.intensitySlider.addChangeListener(event -> this.ondropchange(this.intensitySlider.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.intensitySlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));

    Z4UI.addLabel(this, Z4Translations.GAUSSIAN_CORRECTION, new GBC(0, 4).a(GBC.WEST));

    this.gaussianCorrectionSpinner.cssAddClass("jsspinner_w_4rem");
    this.gaussianCorrectionSpinner.setModel(new SpinnerNumberModel(10, 1, 100, 1));
    this.gaussianCorrectionSpinner.addChangeListener(event -> this.ondropchange(this.gaussianCorrectionSpinner.getValueIsAdjusting(), this.intensitySlider.getValue(), (int) this.gaussianCorrectionSpinner.getValue()));
    this.add(this.gaussianCorrectionSpinner, new GBC(1, 4).a(GBC.EAST));

    this.gaussianCorrectionSlider.setMinimum(1);
    this.gaussianCorrectionSlider.setMaximum(100);
    this.gaussianCorrectionSlider.addChangeListener(event -> this.ondropchange(this.gaussianCorrectionSlider.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.gaussianCorrectionSlider, new GBC(0, 5).w(2).f(GBC.HORIZONTAL));

    this.setValue(new Z4DropPainter(
            Z4DropPainterType.THOUSAND_POINTS,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            20,
            10
    ));
  }

  private void addRadio(Z4DropPainterType dropPainterType, JSPanel panel, ButtonGroup buttonGroup) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4droppainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(dropPainterType));
    radio.addActionListener(event -> this.ondropchange(false, this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));

    buttonGroup.add(radio);
    this.radios.$set("" + dropPainterType, radio);
    panel.add(radio, null);
  }

  private void ondropchange(boolean b, int intensity, int gaussianCorrection) {
    this.valueIsAdjusting = b;

    this.intensitySpinner.setValue(intensity);
    this.intensitySlider.setValue(intensity);

    this.gaussianCorrectionSpinner.setValue(gaussianCorrection);
    this.gaussianCorrectionSlider.setValue(gaussianCorrection);

    Z4DropPainterType type = null;
    switch ("" + Object.keys(this.radios).find((key, index, array) -> ((JSRadioButton) this.radios.$get(key)).isSelected())) {
      case "THOUSAND_POINTS":
        type = Z4DropPainterType.THOUSAND_POINTS;
        break;
      case "THOUSAND_LINES":
        type = Z4DropPainterType.THOUSAND_LINES;
        break;
      case "THOUSAND_AREAS":
        type = Z4DropPainterType.THOUSAND_AREAS;
        break;
    }

    this.value = new Z4DropPainter(type, this.radius.getValue(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue());
    this.onchange();
  }

  @Override
  public void setValue(Z4DropPainter value) {
    this.value = value;

    ((JSRadioButton) this.radios.$get("" + value.getDropPainterType())).setSelected(true);

    this.radius.setValue(this.value.getRadius());
    this.intensitySpinner.setValue(this.value.getIntensity());
    this.intensitySlider.setValue(this.value.getIntensity());
    this.gaussianCorrectionSpinner.setValue(this.value.getGaussianCorrection());
    this.gaussianCorrectionSlider.setValue(this.value.getGaussianCorrection());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setEnabled(b));

    this.radius.setEnabled(b);
    this.intensitySpinner.setEnabled(b);
    this.intensitySlider.setEnabled(b);
    this.gaussianCorrectionSpinner.setEnabled(b);
    this.gaussianCorrectionSlider.setEnabled(b);
  }
}
