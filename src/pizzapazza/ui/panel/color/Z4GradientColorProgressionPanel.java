package pizzapazza.ui.panel.color;

import def.js.Array;
import def.js.Object;
import javascript.awt.BoxLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4GradientColorProgression;
import pizzapazza.color.Z4GradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to manage a gradient color progressing
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorProgressionPanel extends Z4AbstractValuePanel<Z4GradientColorProgression> {

  private final Z4LightingPanel lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
  private final Array<JSRadioButton> radios = new Array<>();
  private final JSSlider temporalStepSlider = new JSSlider();
  private final JSSpinner temporalStepSpinner = new JSSpinner();

  private boolean valueIsAdjusting;

  /**
   * Creates the object
   */
  public Z4GradientColorProgressionPanel() {
    super();
    this.cssAddClass("z4gradientcolorprogressionpanel");
    this.setLayout(new GridBagLayout());

    Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(4).a(GBC.WEST));

    JSPanel panel = new JSPanel();
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(Z4GradientColorProgressionBehavior.SPATIAL, buttonGroup, panel, "top");
    this.addRadio(Z4GradientColorProgressionBehavior.TEMPORAL, buttonGroup, panel, "center");
    this.addRadio(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, buttonGroup, panel, "center");
    this.addRadio(Z4GradientColorProgressionBehavior.RANDOM, buttonGroup, panel, "bottom");

    Z4UI.addLabel(this, Z4Translations.STEP, new GBC(1, 1).a(GBC.WEST).wx(1));

    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event -> this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.add(this.temporalStepSpinner, new GBC(2, 1).w(2).a(GBC.EAST));

    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event -> this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.add(this.temporalStepSlider, new GBC(1, 2).w(3));

    Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(2, 3).a(GBC.EAST).i(0, 0, 0, 1));

    this.add(this.lightingPanel, new GBC(3, 3));
    this.lightingPanel.addChangeListener(event -> this.onProgressionChange(false));
    this.setValue(new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.SPATIAL, 0.1, Z4Lighting.NONE));
  }

  private void addRadio(Z4GradientColorProgressionBehavior behavior, ButtonGroup buttonGroup, JSPanel panel, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4gradientcolorprogressionpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations.$get("" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> {
      Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.lightingPanel.setEnabled(behavior != Z4GradientColorProgressionBehavior.SPATIAL);
      this.temporalStepSpinner.setEnabled(behavior == Z4GradientColorProgressionBehavior.TEMPORAL);
      this.temporalStepSlider.setEnabled(behavior == Z4GradientColorProgressionBehavior.TEMPORAL);

      this.onProgressionChange(false);
    });

    switch (border) {
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "center":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottom":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }

    buttonGroup.add(radio);
    this.radios.$set("" + behavior, radio);
    panel.add(radio, null);
  }

  private void onProgressionChange(boolean b) {
    this.valueIsAdjusting = b;

    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
          case "SPATIAL":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.SPATIAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "TEMPORAL":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
        }
      }
    });

    this.onchange();
  }

  private void onTemporalStepChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    this.onProgressionChange(adjusting);
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
  public void setValue(Z4GradientColorProgression value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());
    this.lightingPanel.setEnabled(value.getGradientColorProgressionBehavior() != Z4GradientColorProgressionBehavior.SPATIAL);

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    ((JSRadioButton) this.radios.$get("" + value.getGradientColorProgressionBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getGradientColorProgressionBehavior())).setContentAreaFilled(true);

    this.temporalStepSpinner.setEnabled(value.getGradientColorProgressionBehavior() == Z4GradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSlider.setEnabled(value.getGradientColorProgressionBehavior() == Z4GradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
    this.lightingPanel.setEnabled(b);

    Object.keys(this.radios).forEach(key -> {
      JSRadioButton radio = this.radios.$get(key);
      radio.setEnabled(b);

      if (radio.isSelected()) {
        this.lightingPanel.setEnabled(b && ("" + key) != ("" + Z4GradientColorProgressionBehavior.SPATIAL));
        this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4GradientColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4GradientColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
