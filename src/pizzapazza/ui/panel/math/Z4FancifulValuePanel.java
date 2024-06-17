package pizzapazza.ui.panel.math;

import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSLabel;
import javascript.swing.JSToggleButton;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import simulation.dom.$DOMRect;

/**
 * The panel to manage a fanciful value
 *
 * @author gianpiero.diblasi
 */
public class Z4FancifulValuePanel extends Z4AbstractValuePanel<Z4FancifulValue> {

  private final JSLabel label = new JSLabel();
  private final JSToggleButton uniformSign = new JSToggleButton();
  private final Z4SignPanel sign;
  private final Z4SignedValuePanel constant;
  private final Z4RandomValuePanel random;
  private final Z4SignedRandomValuePanel signedRandom;

  private boolean signsVisible = true;
  private boolean valueIsAdjusting;
  private final Z4FancifulValuePanelOrientation orientation;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4FancifulValuePanel(Z4FancifulValuePanelOrientation orientation) {
    super();
    this.cssAddClass("z4fancifulvaluepanel");
    this.setLayout(new GridBagLayout());

    this.orientation = orientation;
    if (orientation == Z4FancifulValuePanelOrientation.HORIZONTAL) {
      this.add(this.label, new GBC(0, 0).w(3).a(GBC.WEST));
      this.add(this.uniformSign, new GBC(3, 0).a(GBC.EAST));

      this.sign = new Z4SignPanel(Z4SignPanelOrientation.SQUARED);
      this.add(this.sign, new GBC(0, 1).i(0, 0, 0, 2).a(GBC.SOUTH));

      this.constant = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.constant, new GBC(1, 1).i(0, 0, 0, 2));

      this.random = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
      this.add(this.random, new GBC(2, 1));

      this.signedRandom = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
      this.add(this.signedRandom, new GBC(3, 1));
    } else if (orientation == Z4FancifulValuePanelOrientation.VERTICAL) {
      this.add(this.label, new GBC(0, 0).a(GBC.WEST));
      this.add(this.uniformSign, new GBC(1, 0).a(GBC.EAST));

      this.sign = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
      this.add(this.sign, new GBC(0, 1).w(2).i(1, 0, 0, 0));

      this.constant = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.constant, new GBC(0, 2).w(2).i(0, 0, 2, 0));

      this.random = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
      this.add(this.random, new GBC(0, 3).w(2));

      this.signedRandom = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
      this.add(this.signedRandom, new GBC(0, 4).w(2));
    } else if (orientation == Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL) {
      this.add(this.label, new GBC(0, 0).w(2).wx(1).a(GBC.WEST));
      this.add(this.uniformSign, new GBC(2, 0).a(GBC.EAST));

      this.sign = new Z4SignPanel(Z4SignPanelOrientation.SQUARED);
      this.add(this.sign, new GBC(0, 1).a(GBC.SOUTH));

      this.constant = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.constant, new GBC(1, 1).w(2));

      this.random = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTALLY_VERTICAL);
      this.add(this.random, new GBC(0, 2).w(3).a(GBC.EAST));

      this.signedRandom = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTALLY_VERTICAL);
      this.add(this.signedRandom, new GBC(0, 3).w(3).a(GBC.EAST));
    } else {
      this.sign = null;
      this.constant = null;
      this.random = null;
      this.signedRandom = null;
    }

    this.uniformSign.cssAddClass("z4fancifulvaluepanel-uniform-sign");
    this.uniformSign.getStyle().padding = "1px";
    this.uniformSign.setTooltip(Z4Translations.UNIFORM_SIGN);
    this.uniformSign.setIcon(new Z4EmptyImageProducer<>(""));
    this.uniformSign.addActionListener(event -> this.onFancifulValueChange(false));

    this.sign.getStyle().display = "none";
    this.sign.addChangeListener(event -> this.onFancifulValueChange(false));

    this.constant.setLabel(Z4Translations.CONSTANT);
    this.constant.addChangeListener(event -> this.onFancifulValueChange(this.constant.getValueIsAdjusting()));

    this.random.setLabel(Z4Translations.RANDOM);
    this.random.getStyle().display = "none";
    this.random.addChangeListener(event -> this.onFancifulValueChange(this.random.getValueIsAdjusting()));

    this.signedRandom.setLabel(Z4Translations.RANDOM);
    this.signedRandom.addChangeListener(event -> this.onFancifulValueChange(this.signedRandom.getValueIsAdjusting()));

    this.setValue(new Z4FancifulValue(
            new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
            false));
  }

  private void onFancifulValueChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.uniformSign.setContentAreaFilled(this.uniformSign.isSelected());

    if (!this.signsVisible) {
      this.signedRandom.setValue(new Z4SignedRandomValue(this.signedRandom.getValue().getSign(), this.random.getValue()));
    } else if (this.uniformSign.isSelected()) {
      this.constant.setValue(new Z4SignedValue(this.sign.getValue(), this.constant.getValue().getValue()));
      this.signedRandom.setValue(new Z4SignedRandomValue(this.sign.getValue(), this.random.getValue()));
    } else {
      this.sign.setValue(this.constant.getValue().getSign());
      this.random.setValue(this.signedRandom.getValue().getValue());
    }

    this.value = new Z4FancifulValue(this.constant.getValue(), this.signedRandom.getValue(), this.uniformSign.isSelected());
    this.setSignsVisible(this.signsVisible);
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
  public void setLabel(String label) {
    this.label.setText(label);
  }

  /**
   * Sets the range of the constant component
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
  public void setConstantRange(int min, int max) {
    this.constant.setRange(min, max);
  }

  /**
   * Sets the range of the random component
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
  public void setRandomRange(int min, int max) {
    this.random.setRange(min, max);
    this.signedRandom.setRange(min, max);
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
  public void setRandomLengthRange(int min, int max) {
    this.random.setLengthRange(min, max);
    this.signedRandom.setLengthRange(min, max);
  }

  /**
   * Sets the visibility of the signs
   *
   * @param visible true to make the signs visible, false otherwise
   */
  public void setSignsVisible(boolean visible) {
    this.signsVisible = visible;

    this.uniformSign.getStyle().display = visible ? "flex" : "none";

    this.sign.getStyle().display = visible && this.uniformSign.isSelected() ? "grid" : "none";
    this.constant.setSignVisible(visible && !this.uniformSign.isSelected());

    this.random.getStyle().display = visible && !this.uniformSign.isSelected() ? "none" : "grid";
    this.signedRandom.getStyle().display = visible && !this.uniformSign.isSelected() ? "grid" : "none";

    if (this.orientation == Z4FancifulValuePanelOrientation.VERTICAL) {
      $DOMRect rect = this.random.invoke("getBoundingClientRect()");
      $DOMRect signedRect = this.signedRandom.invoke("getBoundingClientRect()");
      this.constant.getStyle().minWidth = Math.max(rect.width, signedRect.width) + "px";
    }
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
  public void setValue(Z4FancifulValue value) {
    this.value = value;

    this.sign.setValue(value.getConstant().getSign());
    this.constant.setValue(value.getConstant());
    this.random.setValue(value.getRandom().getValue());
    this.signedRandom.setValue(value.getRandom());
    this.uniformSign.setSelected(value.isUniformSign());
    this.uniformSign.setContentAreaFilled(value.isUniformSign());

    this.setSignsVisible(this.signsVisible);
  }

  @Override
  public void setEnabled(boolean b) {
    this.uniformSign.setEnabled(b);
    this.sign.setEnabled(b);
    this.constant.setEnabled(b);
    this.random.setEnabled(b);
    this.signedRandom.setEnabled(b);
  }
}
