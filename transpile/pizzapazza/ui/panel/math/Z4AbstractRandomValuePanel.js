/**
 * The abstract panel to manage a random value
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
class Z4AbstractRandomValuePanel extends Z4AbstractValuePanel {

  /**
   * The value panel
   */
   valuePanel = null;

  /**
   * The array of random behaviors
   */
   radios = new Array();

  /**
   * The length panel
   */
   lengthPanel = null;

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param signed true for a signed random value, false otherwise
   * @param orientation The orientation
   */
  constructor(signed, orientation) {
    super();
    this.cssAddClass("z4abstractrandomvaluepanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4RandomValuePanelOrientation.HORIZONTAL) {
      this.valuePanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.valuePanel, new GBC(0, 0).h(2).a(GBC.SOUTH).i(0, 0, 0, 1));
      this.addRadio(Z4RandomValueBehavior.CLASSIC, buttonGroup, 1, 0, "topleft");
      this.addRadio(Z4RandomValueBehavior.BEZIER, buttonGroup, 2, 0, "topright");
      this.addRadio(Z4RandomValueBehavior.POLYLINE, buttonGroup, 1, 1, "bottomleft");
      this.addRadio(Z4RandomValueBehavior.STEPPED, buttonGroup, 2, 1, "bottomright");
      this.lengthPanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.lengthPanel, new GBC(3, 0).h(2).a(GBC.SOUTH));
    } else if (orientation === Z4RandomValuePanelOrientation.VERTICAL) {
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
    this.valuePanel.addChangeListener(event => {
      this.valueIsAdjusting = this.valuePanel.getValueIsAdjusting();
      this.onRandomValueChange();
      this.onchange();
    });
    this.lengthPanel.setLabel(Z4Translations.LENGTH);
    this.lengthPanel.setSignVisible(false);
    this.lengthPanel.addChangeListener(event => {
      this.valueIsAdjusting = this.lengthPanel.getValueIsAdjusting();
      this.onRandomValueChange();
      this.onchange();
    });
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4abstractrandomvaluepanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.lengthPanel.setEnabled(behavior !== Z4RandomValueBehavior.CLASSIC);
      this.onRandomValueChange();
      this.onchange();
    });
    let gbc = new GBC(x, y);
    switch(border) {
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
    this.radios["" + behavior] = radio;
    this.add(radio, gbc);
  }

   onRandomValueChange() {
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
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.valuePanel.setLabel(label);
  }

  /**
   * Sets the range
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setRange(min, max) {
    this.valuePanel.setRange(min, max);
  }

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive)
   */
   setLengthRange(min, max) {
    this.lengthPanel.setRange(min, max);
  }

   setEnabled(b) {
    this.valuePanel.setEnabled(b);
    Object.keys(this.radios).forEach(key => {
      let radio = this.radios[key];
      radio.setEnabled(b);
      if (radio.isSelected()) {
        this.lengthPanel.setEnabled(b && ("" + key) !== ("" + Z4RandomValueBehavior.CLASSIC));
      }
    });
  }
}
