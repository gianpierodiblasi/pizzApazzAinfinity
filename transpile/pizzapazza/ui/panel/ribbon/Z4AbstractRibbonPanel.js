/**
 * The abstract panel for all ribbon panels
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractRibbonPanel extends JSPanel {

  /**
   * Creates the object
   */
  constructor() {
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
   * @param listener The listener
   * @return The added button
   */
   addButton(text, enabled, gridx, gridy, border, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let gbc = new GBC(gridx, gridy).a(GBC.NORTH);
    switch(border) {
      case "left":
        gbc.i(0, 5, 0, 0);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
        button.getStyle().borderRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        gbc.i(0, 0, 0, 5);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }
    this.add(button, gbc);
    return button;
  }
}
