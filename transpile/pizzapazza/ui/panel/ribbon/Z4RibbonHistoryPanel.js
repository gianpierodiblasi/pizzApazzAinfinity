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

   z4historyManagement = null;

   z4savingDelay = 0;

   z4savingInterval = 0;

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
    this.addButton(this.save, Z4Translations.SAVE, false, 2, 0, "", event => this.saveHistory("manual"));
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
   * @param policies A comma-separated list of history management policies
   * indicating which criteria should perform saving
   */
   saveHistory(policies) {
    if (this.canvas.isChanged()) {
      if (policies.indexOf(this.z4historyManagement) !== -1) {
        this.canvas.toHistory(json => {
          this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event => {
            this.canvas.setChanged(false);
            this.currentIndex = event.target["result"];
            return null;
          };
        });
      }
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

  /**
   * Sets the history management settings
   *
   * @param z4historyManagement The history management policy
   * @param z4savingDelay The saving delay (used if z4historyManagement =
   * standard)
   * @param z4savingInterval The saving interval (used if z4historyManagement =
   * timer)
   */
   setHistoryManagementSettings(z4historyManagement, z4savingDelay, z4savingInterval) {
    this.z4historyManagement = z4historyManagement;
    this.z4savingDelay = z4savingDelay;
    this.z4savingInterval = z4savingInterval;
    this.save.setEnabled(z4historyManagement === "manual");
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
}
