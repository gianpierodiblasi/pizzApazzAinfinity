package pizzapazza.ui.panel.ribbon;

import javascript.awt.GBC;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSPanel;

/**
 * The abstract panel for all ribbon panels
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractRibbonPanel extends JSPanel {

  /**
   * Creates the object
   */
  public Z4AbstractRibbonPanel() {
    super();
  }

  /**
   * Adds a button
   *
   * @param text The text
   * @param enabled true to enable the button, false otherwise
   * @param gridx The grid x
   * @param gridy The grid y
   * @param border The border type
   * @param top The top margin
   * @param listener The listener
   * @return The added button
   */
  protected JSButton addButton(String text, boolean enabled, int gridx, int gridy, String border, int top, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);

    GBC gbc = new GBC(gridx, gridy).a(GBC.NORTHWEST);
    switch (border) {
      case "left":
        gbc.i(top, 5, 0, 0);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
        gbc.i(top, 0, 0, 0);
        button.getStyle().borderRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        gbc.i(top, 0, 0, 5);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      default:
        gbc.i(top, 5, 0, 5);
        break;
    }

    this.add(button, gbc);
    return button;
  }
}
