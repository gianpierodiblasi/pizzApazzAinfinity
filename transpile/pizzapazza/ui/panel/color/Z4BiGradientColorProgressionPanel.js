/**
 * The panel to manage a bigradient color progressing
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorProgressionPanel extends Z4AbstractValuePanel {

   lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);

   radios = new Array();

   temporalStepSlider = new JSSlider();

   temporalStepSpinner = new JSSpinner();

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4bigradientcolorprogressionpanel");
    this.setLayout(new GridBagLayout());
    let panel = new JSPanel();
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.X_AXIS));
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, buttonGroup, panel, "left");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, buttonGroup, panel, "centerh");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, buttonGroup, panel, "right");
      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(0, 1).a(GBC.WEST).wx(1));
      this.add(this.temporalStepSpinner, new GBC(1, 1).w(3).a(GBC.EAST).i(1, 0, 0, 0));
      this.add(this.temporalStepSlider, new GBC(0, 2).w(4));
      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(0, 3).a(GBC.EAST).w(2).wx(1).i(0, 0, 0, 1));
      this.add(this.lightingPanel, new GBC(2, 3).w(2).a(GBC.EAST));
    } else if (orientation === Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(4).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, buttonGroup, panel, "top");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, buttonGroup, panel, "centerv");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, buttonGroup, panel, "bottom");
      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(1, 1).a(GBC.WEST).wx(1));
      this.add(this.temporalStepSpinner, new GBC(2, 1).w(2).a(GBC.EAST));
      this.add(this.temporalStepSlider, new GBC(1, 2).w(3));
      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(2, 3).a(GBC.EAST).i(0, 0, 0, 1));
      this.add(this.lightingPanel, new GBC(3, 3));
    }
    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event => this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event => this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.lightingPanel.addChangeListener(event => this.onProgressionChange(false));
    this.setValue(new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, 0.1, Z4Lighting.NONE));
  }

   addRadio(behavior, buttonGroup, panel, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4bigradientcolorprogressionpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.temporalStepSpinner.setEnabled(behavior === Z4BiGradientColorProgressionBehavior.TEMPORAL);
      this.temporalStepSlider.setEnabled(behavior === Z4BiGradientColorProgressionBehavior.TEMPORAL);
      this.onProgressionChange(false);
    });
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerh":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerv":
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
    this.radios["" + behavior] = radio;
    panel.add(radio, null);
  }

   onProgressionChange(b) {
    this.valueIsAdjusting = b;
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "TEMPORAL":
            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
        }
      }
    });
    this.onchange();
  }

   onTemporalStepChange(spTosl, adjusting, spinner, slider) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
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
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getBiGradientColorProgressionBehavior()]).setSelected(true);
    (this.radios["" + value.getBiGradientColorProgressionBehavior()]).setContentAreaFilled(true);
    this.temporalStepSpinner.setEnabled(value.getBiGradientColorProgressionBehavior() === Z4BiGradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSlider.setEnabled(value.getBiGradientColorProgressionBehavior() === Z4BiGradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
  }

   setEnabled(b) {
    this.lightingPanel.setEnabled(b);
    Object.keys(this.radios).forEach(key => {
      let radio = this.radios[key];
      radio.setEnabled(b);
      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) !== ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) !== ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
