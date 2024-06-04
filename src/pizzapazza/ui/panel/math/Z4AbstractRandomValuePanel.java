package pizzapazza.ui.panel.math;

import def.js.Array;
import def.js.Object;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSRadioButton;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;

/**
 * The abstract panel to manage a random value
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
public abstract class Z4AbstractRandomValuePanel<T> extends Z4AbstractValuePanel<T> {

  /**
   * The value panel
   */
  protected final Z4SignedValuePanel valuePanel;

  /**
   * The array of random behaviors
   */
  protected final Array<JSRadioButton> radios = new Array<>();

  /**
   * The length panel
   */
  protected final Z4SignedValuePanel lengthPanel;

  private boolean valueIsAdjusting;

  /**
   * Creates the object
   *
   * @param signed true for a signed random value, false otherwise
   * @param orientation The orientation
   */
  public Z4AbstractRandomValuePanel(boolean signed, Z4RandomValuePanelOrientation orientation) {
    super();
    this.cssAddClass("z4abstractrandomvaluepanel");
    this.setLayout(new GridBagLayout());

    ButtonGroup buttonGroup = new ButtonGroup();

    if (orientation == Z4RandomValuePanelOrientation.HORIZONTAL) {
      this.valuePanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.valuePanel, new GBC(0, 0).h(2).a(GBC.SOUTH).i(0, 0, 0, 1));

      this.addRadio(Z4RandomValueBehavior.CLASSIC, buttonGroup, 1, 0, "topleft");
      this.addRadio(Z4RandomValueBehavior.BEZIER, buttonGroup, 2, 0, "topright");
      this.addRadio(Z4RandomValueBehavior.POLYLINE, buttonGroup, 1, 1, "bottomleft");
      this.addRadio(Z4RandomValueBehavior.STEPPED, buttonGroup, 2, 1, "bottomright");

      this.lengthPanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.lengthPanel, new GBC(3, 0).h(2).a(GBC.SOUTH));
    } else if (orientation == Z4RandomValuePanelOrientation.VERTICAL) {
      this.valuePanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.valuePanel, new GBC(0, 0).w(4).f(GBC.HORIZONTAL).i(0, 0, 1, 0));

      this.addRadio(Z4RandomValueBehavior.CLASSIC, buttonGroup, 0, 1, "left");
      this.addRadio(Z4RandomValueBehavior.BEZIER, buttonGroup, 1, 1, "center");
      this.addRadio(Z4RandomValueBehavior.POLYLINE, buttonGroup, 2, 1, "center");
      this.addRadio(Z4RandomValueBehavior.STEPPED, buttonGroup, 3, 1, "right");

      this.lengthPanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.lengthPanel, new GBC(0, 2).w(4).f(GBC.HORIZONTAL));
    } else {
      this.valuePanel = null;
      this.lengthPanel = null;
    }

    this.valuePanel.setSignVisible(signed);
    this.valuePanel.addChangeListener(event -> {
      this.valueIsAdjusting = this.valuePanel.getValueIsAdjusting();
      this.onRandomValueChange();
    });

    this.lengthPanel.setLabel(Z4Translations.LENGTH);
    this.lengthPanel.setSignVisible(false);
    this.lengthPanel.addChangeListener(event -> {
      this.valueIsAdjusting = this.lengthPanel.getValueIsAdjusting();
      this.onRandomValueChange();
    });
  }

  private void addRadio(Z4RandomValueBehavior behavior, ButtonGroup buttonGroup, int x, int y, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4abstractrandomvaluepanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations.$get("" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> {
      Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.lengthPanel.setEnabled(behavior != Z4RandomValueBehavior.CLASSIC);
      this.onRandomValueChange();
      this.onchange();
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
      case "topleft":
        gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
        gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomright":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }

    buttonGroup.add(radio);
    this.radios.$set("" + behavior, radio);
    this.add(radio, gbc);
  }

  protected abstract void onRandomValueChange();

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
  public void setLabel(String label) {
    this.valuePanel.setLabel(label);
  }

  /**
   * Sets the range
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
  public void setRange(int min, int max) {
    this.valuePanel.setRange(min, max);
  }

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive)
   */
  public void setLengthRange(int min, int max) {
    this.lengthPanel.setRange(min, max);
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
    this.valuePanel.setEnabled(b);
    
    Object.keys(this.radios).forEach(key -> {
      JSRadioButton radio = this.radios.$get(key);
      radio.setEnabled(b);

      if (radio.isSelected()) {
        this.lengthPanel.setEnabled(b && ("" + key) != ("" + Z4RandomValueBehavior.CLASSIC));
      }
    });
  }
}
