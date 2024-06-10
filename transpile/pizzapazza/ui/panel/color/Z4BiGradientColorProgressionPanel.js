/**
 * The panel to manage a bigradient color progressing
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorProgressionPanel extends Z4AbstractGradientColorProgressionPanel {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super(orientation);
    this.cssAddClass("z4bigradientcolorprogressionpanel");
    this.setValue(new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, 0.1, Z4Lighting.NONE));
  }

   addRadioPanel(panel, buttonGroup, orientation) {
    if (orientation === Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "left");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");
    } else if (orientation === Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "top");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");
    }
  }

   onRadioChanged(behavior) {
    this.temporalStepSpinner.setEnabled(behavior === Z4BiGradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setEnabled(behavior === Z4BiGradientColorProgressionBehavior.TEMPORAL);
  }

   onProgressionChange(b) {
    // this.valueIsAdjusting = b;
    // 
    // Object.keys(this.radios).forEach(key -> {
    // if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
    // switch ("" + key) {
    // case "TEMPORAL":
    // this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
    // break;
    // case "RELATIVE_TO_PATH":
    // this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
    // break;
    // case "RANDOM":
    // this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
    // break;
    // }
    // }
    // });
    // 
    // this.onchange();
  }

   onTemporalStepChange(spTosl, adjusting, spinner, slider) {
    // if (spTosl) {
    // slider.setValue((int) spinner.getValue());
    // } else {
    // spinner.setValue(slider.getValue());
    // }
    // 
    // this.onProgressionChange(adjusting);
  }

   setValue(value) {
    // this.value = value;
    // this.lightingPanel.setValue(value.getLighting());
    // 
    // Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    // ((JSRadioButton) this.radios.$get("" + value.getBiGradientColorProgressionBehavior())).setSelected(true);
    // ((JSRadioButton) this.radios.$get("" + value.getBiGradientColorProgressionBehavior())).setContentAreaFilled(true);
    // 
    // this.temporalStepSpinner.setEnabled(value.getBiGradientColorProgressionBehavior() == Z4BiGradientColorProgressionBehavior.TEMPORAL);
    // this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    // this.temporalStepSlider.setEnabled(value.getBiGradientColorProgressionBehavior() == Z4BiGradientColorProgressionBehavior.TEMPORAL);
    // this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
  }

   setEnabled(b) {
    // this.lightingPanel.setEnabled(b);
    // 
    // Object.keys(this.radios).forEach(key -> {
    // JSRadioButton radio = this.radios.$get(key);
    // radio.setEnabled(b);
    // 
    // if (radio.isSelected()) {
    // this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
    // this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
    // }
    // });
  }
}
