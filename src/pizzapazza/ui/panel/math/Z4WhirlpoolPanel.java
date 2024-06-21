package pizzapazza.ui.panel.math;

import def.js.Array;
import def.js.Object;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSRadioButton;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.math.Z4Whirlpool;
import pizzapazza.math.Z4WhirlpoolBehavior;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;

/**
 * The panel to manage a whirlpool
 *
 * @author gianpiero.diblasi
 */
public class Z4WhirlpoolPanel extends Z4AbstractValuePanel<Z4Whirlpool> {

  private final Z4FancifulValuePanel angle;
  private final Array<JSRadioButton> radios = new Array<>();

  private boolean enabled = true;
  private boolean valueIsAdjusting;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation orientation) {
    super();
    this.cssAddClass("z4whirlpoolpanel");
    this.setLayout(new GridBagLayout());

    ButtonGroup buttonGroup = new ButtonGroup();

    if (orientation == Z4WhirlpoolPanelOrientation.HORIZONTAL) {
      Z4UI.addLabel(this, Z4Translations.WHIRLPOOL, new GBC(0, 0).a(GBC.WEST).wx(1));

      this.addRadio(Z4WhirlpoolBehavior.NONE, buttonGroup, 1, 0, "left");
      this.addRadio(Z4WhirlpoolBehavior.FORWARD, buttonGroup, 2, 0, "center");
      this.addRadio(Z4WhirlpoolBehavior.BACKWARD, buttonGroup, 3, 0, "right");

      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
      this.add(this.angle, new GBC(0, 1).w(4));
    } else if (orientation == Z4WhirlpoolPanelOrientation.VERTICAL) {
      Z4UI.addLabel(this, Z4Translations.WHIRLPOOL, new GBC(0, 0).w(4).a(GBC.WEST));

      this.addRadio(Z4WhirlpoolBehavior.NONE, buttonGroup, 0, 1, "left");
      this.addRadio(Z4WhirlpoolBehavior.FORWARD, buttonGroup, 1, 1, "center");
      this.addRadio(Z4WhirlpoolBehavior.BACKWARD, buttonGroup, 2, 1, "right");
      Z4UI.addLabel(this, "", new GBC(3, 1).wx(1));

      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
      this.add(this.angle, new GBC(0, 2).w(4));
    } else {
      this.angle = null;
    }

    this.angle.setLabel(Z4Translations.ANGLE);
    this.angle.setSignsVisible(false);
    this.angle.setConstantRange(0, 90);
    this.angle.setRandomRange(0, 90);
    this.angle.addChangeListener(event -> this.onWhirlpoolChange(this.angle.getValueIsAdjusting()));

    this.setValue(new Z4Whirlpool(
            Z4WhirlpoolBehavior.NONE,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false)
    ));
  }

  private void addRadio(Z4WhirlpoolBehavior behavior, ButtonGroup buttonGroup, int x, int y, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4whirlpoolpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations.$get(behavior == Z4WhirlpoolBehavior.NONE ? "NONE_HIM" : "" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> {
      Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.onWhirlpoolChange(false);
    });

    GBC gbc = new GBC(x, y);
    switch (border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "center":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }

    buttonGroup.add(radio);
    this.radios.$set("" + behavior, radio);
    this.add(radio, gbc);
  }

  private void onWhirlpoolChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;

    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
          case "NONE":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, this.angle.getValue());
            break;
          case "FORWARD":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.FORWARD, this.angle.getValue());
            break;
          case "BACKWARD":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.BACKWARD, this.angle.getValue());
            break;
        }
      }
    });

    this.angle.setEnabled(this.enabled && this.value.getWhirlpoolBehavior() != Z4WhirlpoolBehavior.NONE);
    this.onchange();
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   */
  public void setRandomLengthRange(int min, int max) {
    this.angle.setRandomLengthRange(min, max);
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
  public void setValue(Z4Whirlpool value) {
    this.value = value;

    this.angle.setValue(value.getAngle());
    this.angle.setEnabled(this.enabled && value.getWhirlpoolBehavior() != Z4WhirlpoolBehavior.NONE);

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    ((JSRadioButton) this.radios.$get("" + value.getWhirlpoolBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getWhirlpoolBehavior())).setContentAreaFilled(true);
  }

  @Override
  public void setEnabled(boolean b) {
    this.enabled = b;
    this.angle.setEnabled(b && this.value.getWhirlpoolBehavior() != Z4WhirlpoolBehavior.NONE);
    Object.keys(this.radios).forEach(key -> ((JSComponent) this.radios.$get(key)).setEnabled(b));
  }
}
