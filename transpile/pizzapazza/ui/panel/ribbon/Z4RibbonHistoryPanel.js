/**
 * The ribbon panel containing the history
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonHistoryPanel extends JSPanel {

   undo = new JSButton();

   redo = new JSButton();

   save = new JSButton();

   consolidate = new JSButton();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonhistorypanel");
    this.addButton(this.undo, Z4Translations.UNDO, false, 0, 0, "left", event => {
    });
    this.addButton(this.redo, Z4Translations.REDO, false, 1, 0, "right", event => {
    });
    this.addButton(this.save, Z4Translations.SAVE, localStorage.getItem("z4historymanagement") === "manual", 2, 0, "", event => {
    });
    this.addButton(this.consolidate, Z4Translations.CONSOLIDATE, false, 3, 0, "", event => {
    });
    this.addVLine(4, 1);
  }

   addButton(button, text, enabled, gridx, gridy, border, listener) {
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.NORTH;
    switch(border) {
      case "left":
        constraints.insets = new Insets(5, 5, 0, 0);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
        constraints.insets = new Insets(5, 0, 0, 0);
        button.getStyle().borderRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        constraints.insets = new Insets(5, 0, 0, 5);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      default:
        constraints.insets = new Insets(5, 0, 0, 5);
    }
    this.add(button, constraints);
  }

   addVLine(gridx, weightx) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridheight = 2;
    constraints.fill = GridBagConstraints.VERTICAL;
    constraints.weightx = weightx;
    constraints.weighty = 1;
    constraints.insets = new Insets(1, 2, 1, 2);
    this.add(div, constraints);
  }

  /**
   * Enables the undo button
   *
   * @param b true to enable the button, false otherwise
   */
   setUndoEnabled(b) {
    this.undo.setEnabled(b);
  }

  /**
   * Enables the redo button
   *
   * @param b true to enable the button, false otherwise
   */
   setRedoEnabled(b) {
    this.redo.setEnabled(b);
  }

  /**
   * Enables the save button
   *
   * @param b true to enable the button, false otherwise
   */
   setSaveEnabled(b) {
    this.save.setEnabled(b);
  }

  /**
   * Enables the consolidate button
   *
   * @param b true to enable the button, false otherwise
   */
   setConsolidateEnabled(b) {
    this.consolidate.setEnabled(b);
  }
}
