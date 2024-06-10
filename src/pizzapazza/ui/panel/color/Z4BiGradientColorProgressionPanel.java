package pizzapazza.ui.panel.color;

import javascript.awt.GBC;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import pizzapazza.color.Z4BiGradientColorProgression;
import pizzapazza.color.Z4BiGradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;

/**
 * The panel to manage a bigradient color progressing
 *
 * @author gianpiero.diblasi
 */
public class Z4BiGradientColorProgressionPanel extends Z4AbstractGradientColorProgressionPanel<Z4BiGradientColorProgression, Z4BiGradientColorProgressionBehavior> {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation orientation) {
    super(orientation);
    this.cssAddClass("z4bigradientcolorprogressionpanel");
    this.setValue(new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, 0.1, Z4Lighting.NONE));
  }

  @Override
  protected void addRadioPanel(JSPanel panel, ButtonGroup buttonGroup, Z4GradientColorProgressionPanelOrientation orientation) {
    if (orientation == Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "left");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");
    } else if (orientation == Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "top");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");
    }
  }

  @Override
  protected void onRadioChanged(Z4BiGradientColorProgressionBehavior behavior) {
    this.temporalStepSpinner.setEnabled(behavior == Z4BiGradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setEnabled(behavior == Z4BiGradientColorProgressionBehavior.TEMPORAL);
  }

  private void onProgressionChange(boolean b) {
//    this.valueIsAdjusting = b;
//
//    Object.keys(this.radios).forEach(key -> {
//      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
//        switch ("" + key) {
//          case "TEMPORAL":
//            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
//            break;
//          case "RELATIVE_TO_PATH":
//            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
//            break;
//          case "RANDOM":
//            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
//            break;
//        }
//      }
//    });
//
//    this.onchange();
  }

  private void onTemporalStepChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
//    if (spTosl) {
//      slider.setValue((int) spinner.getValue());
//    } else {
//      spinner.setValue(slider.getValue());
//    }
//
//    this.onProgressionChange(adjusting);
  }

  @Override
  public void setValue(Z4BiGradientColorProgression value) {
//    this.value = value;
//    this.lightingPanel.setValue(value.getLighting());
//
//    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
//    ((JSRadioButton) this.radios.$get("" + value.getBiGradientColorProgressionBehavior())).setSelected(true);
//    ((JSRadioButton) this.radios.$get("" + value.getBiGradientColorProgressionBehavior())).setContentAreaFilled(true);
//
//    this.temporalStepSpinner.setEnabled(value.getBiGradientColorProgressionBehavior() == Z4BiGradientColorProgressionBehavior.TEMPORAL);
//    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
//    this.temporalStepSlider.setEnabled(value.getBiGradientColorProgressionBehavior() == Z4BiGradientColorProgressionBehavior.TEMPORAL);
//    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
//    this.lightingPanel.setEnabled(b);
//
//    Object.keys(this.radios).forEach(key -> {
//      JSRadioButton radio = this.radios.$get(key);
//      radio.setEnabled(b);
//
//      if (radio.isSelected()) {
//        this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
//        this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
//      }
//    });
  }
}
