package pizzapazza.ui.panel.color;

import def.js.Array;
import def.js.Object;
import javascript.awt.BoxLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSToggleButton;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.iterator.Z4PointIteratorType;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The panel to manage the progression of a color
 *
 * @author gianpiero.diblasi
 */
public class Z4ColorProgressionPanel extends Z4AbstractValuePanel<Z4ColorProgression> {

  private final Z4LightingPanel lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
  private final Array<JSRadioButton> radios = new Array<>();
  private final JSSlider temporalStepSlider = new JSSlider();
  private final JSSpinner temporalStepSpinner = new JSSpinner();
  private final JSToggleButton resetOnStartMoving = new JSToggleButton();

  private boolean enabled = true;
  private boolean valueIsAdjusting;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation orientation) {
    super();
    this.cssAddClass("z4colorprogressionpanel");
    this.setLayout(new GridBagLayout());

    JSPanel panel = new JSPanel();
    ButtonGroup buttonGroup = new ButtonGroup();

    if (orientation == Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(2).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.X_AXIS));

      this.add(panel, new GBC(2, 0).a(GBC.EAST));
      this.addRadio(Z4ColorProgressionBehavior.SPATIAL, panel, buttonGroup, "left");
      this.addRadio(Z4ColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerh");
      this.addRadio(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4ColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");

      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(0, 1).w(2).a(GBC.WEST));
      this.add(this.temporalStepSpinner, new GBC(2, 1).a(GBC.EAST).i(1, 0, 0, 0));
      this.add(this.temporalStepSlider, new GBC(0, 2).w(3));

      this.add(this.resetOnStartMoving, new GBC(0, 3).a(GBC.WEST).wx(1));

      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(1, 3).a(GBC.EAST).i(0, 0, 0, 2));
      this.add(this.lightingPanel, new GBC(2, 3).a(GBC.EAST));
    } else if (orientation == Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(4).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));

      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4ColorProgressionBehavior.SPATIAL, panel, buttonGroup, "top");
      this.addRadio(Z4ColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerv");
      this.addRadio(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4ColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");

      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(1, 1).w(2).a(GBC.WEST));
      this.add(this.temporalStepSpinner, new GBC(3, 1).a(GBC.EAST));
      this.add(this.temporalStepSlider, new GBC(1, 2).w(3));

      this.add(this.resetOnStartMoving, new GBC(1, 3).a(GBC.WEST).wx(1));
      
      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(2, 3).a(GBC.EAST).i(0, 0, 0, 2));
      this.add(this.lightingPanel, new GBC(3, 3).a(GBC.EAST));
    }

    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event -> this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));

    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event -> this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));

    this.resetOnStartMoving.setContentAreaFilled(false);
    this.resetOnStartMoving.cssAddClass("z4colorprogressionpanel-toggle");
    this.resetOnStartMoving.getStyle().padding = "1px";
    this.resetOnStartMoving.setTooltip(Z4Translations.RESET_ON_START_MOVING);
    this.resetOnStartMoving.setIcon(new Z4EmptyImageProducer<>(""));
    this.resetOnStartMoving.addActionListener(event -> {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });

    this.lightingPanel.addChangeListener(event -> {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });

    this.setValue(new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.1, false, Z4Lighting.NONE));
    this.setProgressionSettings(Z4PointIteratorType.STAMPER, null, true, false, false);
  }

  private void addRadio(Z4ColorProgressionBehavior behavior, JSPanel panel, ButtonGroup buttonGroup, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4colorprogressionpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations.$get("" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> {
      Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);

      this.temporalStepSpinner.setEnabled(behavior == Z4ColorProgressionBehavior.TEMPORAL);
      this.temporalStepSlider.setEnabled(behavior == Z4ColorProgressionBehavior.TEMPORAL);

      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });

    switch (border) {
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
    this.radios.$set("" + behavior, radio);
    panel.add(radio, null);
  }

  private void onTemporalStepChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    this.valueIsAdjusting = adjusting;
    this.onProgressionChange();
  }

  private void onProgressionChange() {
    this.resetOnStartMoving.setContentAreaFilled(this.resetOnStartMoving.isSelected());

    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
          case "SPATIAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
          case "TEMPORAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
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
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the progression settings
   *
   * @param type The point iterator type
   * @param options Options relative to the point iterator
   * @param isColor true if the color is a flat color, false otherwise
   * @param isGradientColor true if the color is a gradient color, false
   * otherwise
   * @param isBiGradientColor true if the color is a bigradient color, false
   * otherwise
   */
  public void setProgressionSettings(Z4PointIteratorType type, $Object options, boolean isColor, boolean isGradientColor, boolean isBiGradientColor) {
    if (type == Z4PointIteratorType.AIRBRUSH) {
      Object.keys(this.radios).forEach(key -> ((JSComponent) this.radios.$get(key)).cssAddClass("z4colorprogressionpanel-airbrush-radio"));
    } else {
      Object.keys(this.radios).forEach(key -> ((JSComponent) this.radios.$get(key)).cssRemoveClass("z4colorprogressionpanel-airbrush-radio"));
    }

    if (isColor) {
      Object.keys(this.radios).forEach(key -> {
        JSRadioButton radio = this.radios.$get(key);
        radio.setContentAreaFilled(false);
        radio.getStyle().visibility = "hidden";
      });

      JSRadioButton spatial = this.radios.$get("" + Z4ColorProgressionBehavior.SPATIAL);
      spatial.setContentAreaFilled(true);
      if (!spatial.isSelected()) {
        spatial.setSelected(true);
        this.onProgressionChange();
      }
    } else if (isGradientColor) {
      Object.keys(this.radios).forEach(key -> {
        JSRadioButton radio = this.radios.$get(key);
        radio.setEnabled(this.enabled);
        radio.getStyle().visibility = "visible";
      });

      if (type == Z4PointIteratorType.STAMPER || (type == Z4PointIteratorType.SPIROGRAPH && !$exists(options.$get("drawWhileMoving"))) || type == Z4PointIteratorType.SCATTERER) {
        JSRadioButton relative = this.radios.$get("" + Z4ColorProgressionBehavior.RELATIVE_TO_PATH);
        relative.setEnabled(false);
        relative.setContentAreaFilled(false);

        if (relative.isSelected()) {
          ((JSRadioButton) this.radios.$get("" + Z4ColorProgressionBehavior.SPATIAL)).setSelected(true);
          ((JSRadioButton) this.radios.$get("" + Z4ColorProgressionBehavior.SPATIAL)).setContentAreaFilled(true);

          this.onProgressionChange();
        }
      }
    } else if (isBiGradientColor) {
      Object.keys(this.radios).forEach(key -> {
        JSRadioButton radio = this.radios.$get(key);
        radio.setEnabled(this.enabled);
        radio.getStyle().visibility = "visible";
      });

      JSRadioButton spatial = this.radios.$get("" + Z4ColorProgressionBehavior.SPATIAL);
      spatial.setEnabled(false);
      spatial.setContentAreaFilled(false);

      JSRadioButton relative = this.radios.$get("" + Z4ColorProgressionBehavior.RELATIVE_TO_PATH);
      if (type == Z4PointIteratorType.STAMPER || (type == Z4PointIteratorType.SPIROGRAPH && $exists(options.$get("drawWhileMoving"))) || type == Z4PointIteratorType.SCATTERER) {
        relative.setEnabled(false);
        relative.setContentAreaFilled(false);
      }

      if (spatial.isSelected()
              || (type == Z4PointIteratorType.STAMPER && relative.isSelected())
              || (type == Z4PointIteratorType.SPIROGRAPH && !$exists(options.$get("drawWhileMoving")) && relative.isSelected())
              || (type == Z4PointIteratorType.SCATTERER && relative.isSelected())) {
        ((JSRadioButton) this.radios.$get("" + Z4ColorProgressionBehavior.TEMPORAL)).setSelected(true);
        ((JSRadioButton) this.radios.$get("" + Z4ColorProgressionBehavior.TEMPORAL)).setContentAreaFilled(true);
        this.temporalStepSpinner.setEnabled(this.enabled);
        this.temporalStepSlider.setEnabled(this.enabled);

        this.onProgressionChange();
      }
    }
  }

  @Override
  public void setValue(Z4ColorProgression value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    ((JSRadioButton) this.radios.$get("" + value.getColorProgressionBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getColorProgressionBehavior())).setContentAreaFilled(true);

    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSpinner.setEnabled(value.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
    this.temporalStepSlider.setEnabled(value.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL);

    this.resetOnStartMoving.setSelected(value.isResetOnStartMoving());
    this.resetOnStartMoving.setContentAreaFilled(value.isResetOnStartMoving());
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.enabled = b;
    this.resetOnStartMoving.setEnabled(b);
    this.lightingPanel.setEnabled(b);

    Object.keys(this.radios).forEach(key -> {
      JSRadioButton radio = this.radios.$get(key);
      radio.setEnabled(b);

      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4ColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4ColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
