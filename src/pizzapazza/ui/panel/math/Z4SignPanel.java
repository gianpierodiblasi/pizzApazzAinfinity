package pizzapazza.ui.panel.math;

import def.js.Array;
import def.js.Object;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSRadioButton;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;

/**
 * The panel to manage a sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignPanel extends Z4AbstractValuePanel<Z4Sign> {

  private final Array<JSRadioButton> radios = new Array<>();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4SignPanel(Z4SignPanelOrientation orientation) {
    super();
    this.cssAddClass("z4signpanel");
    this.setLayout(new GridBagLayout());

    ButtonGroup buttonGroup = new ButtonGroup();

    if (orientation == Z4SignPanelOrientation.HORIZONTAL) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "left");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "centerh");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 2, 0, "centerh");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 3, 0, "right");
    } else if (orientation == Z4SignPanelOrientation.VERTICAL) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "top");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 0, 1, "centerv");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 0, 2, "centerv");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 0, 3, "bottom");
    } else if (orientation == Z4SignPanelOrientation.SQUARED) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "topleft");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "topright");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 0, 1, "bottomleft");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 1, 1, "bottomright");
    }

    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

  private void addRadio(Z4SignBehavior behavior, ButtonGroup buttonGroup, int x, int y, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.getStyle().padding = "1px";
    radio.setContentAreaFilled(false);
    radio.setTooltip(Z4Translations.$get("" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> {
      this.value = new Z4Sign(behavior);
      this.onchange();
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
      case "topleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
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
    this.add(radio, new GBC(x, y));
  }

  @Override
  public void setValue(Z4Sign value) {
    this.value = value;
    ((JSRadioButton) this.radios.$get("" + value.getSignBehavior())).setSelected(true);
  }

  @Override
  public void setEnabled(boolean b) {
    Object.keys(this.radios).forEach(key -> ((JSComponent) this.radios.$get(key)).setEnabled(b));
  }
}
