/**
 * The panel to manage the progression of a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgressionPanel extends Z4AbstractValuePanel {

   lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);

   radios = new Array();

   temporalStepSlider = new JSSlider();

   temporalStepSpinner = new JSSpinner();

   enabled = true;

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4colorprogressionpanel");
    this.setLayout(new GridBagLayout());
    let panel = new JSPanel();
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.X_AXIS));
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4ColorProgressionBehavior.SPATIAL, panel, buttonGroup, "left");
      this.addRadio(Z4ColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerh");
      this.addRadio(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4ColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");
      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(0, 1).a(GBC.WEST).wx(1));
      this.add(this.temporalStepSpinner, new GBC(1, 1).w(3).a(GBC.EAST).i(1, 0, 0, 0));
      this.add(this.temporalStepSlider, new GBC(0, 2).w(4));
      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(0, 3).a(GBC.EAST).w(2).wx(1).i(0, 0, 0, 1));
      this.add(this.lightingPanel, new GBC(2, 3).w(2).a(GBC.EAST));
    } else if (orientation === Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(4).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4ColorProgressionBehavior.SPATIAL, panel, buttonGroup, "top");
      this.addRadio(Z4ColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerv");
      this.addRadio(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4ColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");
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
    this.lightingPanel.addChangeListener(event => {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });
    this.setValue(new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.1, Z4Lighting.NONE));
    this.setProgressionSettings(Z4PointIteratorType.STAMPER, true, false, false);
  }

   addRadio(behavior, panel, buttonGroup, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4colorprogressionpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.temporalStepSpinner.setEnabled(behavior === Z4ColorProgressionBehavior.TEMPORAL);
      this.temporalStepSlider.setEnabled(behavior === Z4ColorProgressionBehavior.TEMPORAL);
      this.valueIsAdjusting = false;
      this.onProgressionChange();
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

   onTemporalStepChange(spTosl, adjusting, spinner, slider) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    this.valueIsAdjusting = adjusting;
    this.onProgressionChange();
  }

   onProgressionChange() {
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "SPATIAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "TEMPORAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
        }
      }
    });
    this.onchange();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the progression settings
   *
   * @param type The point iterator type
   * @param isColor true if the color is a flat color, false otherwise
   * @param isGradientColor true if the color is a gradient color, false
   * otherwise
   * @param isBiGradientColor true if the color is a bigradient color, false
   * otherwise
   */
   setProgressionSettings(type, isColor, isGradientColor, isBiGradientColor) {
    if (type === Z4PointIteratorType.AIRBRUSH) {
      Object.keys(this.radios).forEach(key => (this.radios[key]).cssAddClass("z4colorprogressionpanel-airbrush-radio"));
    } else {
      Object.keys(this.radios).forEach(key => (this.radios[key]).cssRemoveClass("z4colorprogressionpanel-airbrush-radio"));
    }
    if (isColor) {
      Object.keys(this.radios).forEach(key => {
        let radio = this.radios[key];
        radio.setContentAreaFilled(false);
        radio.getStyle().visibility = "hidden";
      });
      let spatial = this.radios["" + Z4ColorProgressionBehavior.SPATIAL];
      spatial.setContentAreaFilled(true);
      if (!spatial.isSelected()) {
        spatial.setSelected(true);
        this.onProgressionChange();
      }
    } else if (isGradientColor) {
      Object.keys(this.radios).forEach(key => {
        let radio = this.radios[key];
        radio.setEnabled(this.enabled);
        radio.getStyle().visibility = "visible";
      });
      if (type === Z4PointIteratorType.STAMPER) {
        let relative = this.radios["" + Z4ColorProgressionBehavior.RELATIVE_TO_PATH];
        relative.setEnabled(false);
        relative.setContentAreaFilled(false);
        if (relative.isSelected()) {
          (this.radios["" + Z4ColorProgressionBehavior.SPATIAL]).setSelected(true);
          (this.radios["" + Z4ColorProgressionBehavior.SPATIAL]).setContentAreaFilled(true);
          this.onProgressionChange();
        }
      }
    } else if (isBiGradientColor) {
      Object.keys(this.radios).forEach(key => {
        let radio = this.radios[key];
        radio.setEnabled(this.enabled);
        radio.getStyle().visibility = "visible";
      });
      let spatial = this.radios["" + Z4ColorProgressionBehavior.SPATIAL];
      spatial.setEnabled(false);
      spatial.setContentAreaFilled(false);
      let relative = this.radios["" + Z4ColorProgressionBehavior.RELATIVE_TO_PATH];
      if (type === Z4PointIteratorType.STAMPER) {
        relative.setEnabled(false);
        relative.setContentAreaFilled(false);
      }
      if (spatial.isSelected() || (type === Z4PointIteratorType.STAMPER && relative.isSelected())) {
        (this.radios["" + Z4ColorProgressionBehavior.TEMPORAL]).setSelected(true);
        (this.radios["" + Z4ColorProgressionBehavior.TEMPORAL]).setContentAreaFilled(true);
        this.temporalStepSpinner.setEnabled(this.enabled);
        this.temporalStepSlider.setEnabled(this.enabled);
        this.onProgressionChange();
      }
    }
  }

   setValue(value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getColorProgressionBehavior()]).setSelected(true);
    (this.radios["" + value.getColorProgressionBehavior()]).setContentAreaFilled(true);
    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSpinner.setEnabled(value.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
    this.temporalStepSlider.setEnabled(value.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL);
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.enabled = b;
    this.lightingPanel.setEnabled(b);
    Object.keys(this.radios).forEach(key => {
      let radio = this.radios[key];
      radio.setEnabled(b);
      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) !== ("" + Z4ColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) !== ("" + Z4ColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
