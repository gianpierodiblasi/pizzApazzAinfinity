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

   canvas = null;

   statusPanel = null;

   dbName = null;

   database = null;

   currentIndex = 0;

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
    this.addButton(this.save, Z4Translations.SAVE, localStorage.getItem("z4historymanagement") === "manual", 2, 0, "", event => this.saveHistory("manual"));
    this.addButton(this.consolidate, Z4Translations.CONSOLIDATE, false, 3, 0, "", event => {
    });
    this.addVLine(4, 1);
    window.onunload = event => {
      window.indexedDB.deleteDatabase(this.dbName);
      return null;
    };
  }

  /**
   * Resets the history
   */
   resetHistory() {
    if (this.dbName) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
    this.dbName = "pizzapazza_" + new Date().getTime();
    window.indexedDB.open(this.dbName, 1).onupgradeneeded = event => {
      this.database = event.target["result"];
      let options = new Object();
      options["autoIncrement"] = true;
      this.database.createObjectStore("history", options).transaction.oncomplete = event2 => {
        this.canvas.toHistory(json => {
          this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event3 => {
            this.currentIndex = event3.target["result"];
            return null;
          };
        });
        return null;
      };
      return null;
    };
  }

  /**
   * Saves the history
   *
   * @param policies A comma separated value of the history management policies
   * which can save
   */
   saveHistory(policies) {
    let z4historyManagement = localStorage.getItem("z4historymanagement");
    if (!z4historyManagement) {
      z4historyManagement = "standard";
    }
    if (policies.indexOf(z4historyManagement) !== -1) {
      this.canvas.toHistory(json => {
        this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event3 => {
          this.currentIndex = event3.target["result"];
          return null;
        };
      });
    }
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
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
