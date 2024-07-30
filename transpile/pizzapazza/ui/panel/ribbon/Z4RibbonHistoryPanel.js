/**
 * The ribbon panel containing the history
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonHistoryPanel extends Z4AbstractRibbonPanel {

   undo = null;

   redo = null;

   save = null;

   consolidate = null;

   historyPreview = new JSPanel();

   canvas = null;

   statusPanel = null;

   dbName = null;

   database = null;

   currentKey = 0;

   z4historyManagement = null;

   z4savingDelay = 0;

   z4savingInterval = 0;

   timerID = -1;

   standardID = -1;

   standardRand = 0.0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonhistorypanel");
    this.undo = this.addButton(Z4Translations.UNDO, false, 0, 0, "left", 5, event => this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.upperBound(this.currentKey, true), "prev").onsuccess = event2 => this.undoRedo(event2));
    this.redo = this.addButton(Z4Translations.REDO, false, 1, 0, "right", 5, event => this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event2 => this.undoRedo(event2));
    this.save = this.addButton(Z4Translations.SAVE, false, 2, 0, "", 5, event => this.saveHistory("manual"));
    this.consolidate = this.addButton(Z4Translations.CONSOLIDATE, false, 3, 0, "", 5, event => JSOptionPane.showConfirmDialog(Z4Translations.CONSOLIDATE_MESSAGE, Z4Translations.CONSOLIDATE, JSOptionPane.YES_NO_OPTION, JSOptionPane.WARNING_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.canvas.setChanged(false);
        this.resetHistory(() => this.canvas.toHistory(json => this.addHistory(json, key => this.setCurrentKey(key), false)));
      }
    }));
    Z4UI.addVLine(this, new GBC(4, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.historyPreview.setLayout(new BoxLayout(this.historyPreview, BoxLayout.X_AXIS));
    this.historyPreview.getStyle().overflowX = "scroll";
    this.add(this.historyPreview, new GBC(5, 0).h(2).wx(1).f(GBC.BOTH));
    window.onunload = event => {
      window.indexedDB.deleteDatabase(this.dbName);
      return null;
    };
    this.addEventListener("keydown", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.key === "z") {
        evt.stopPropagation();
        this.undo.invoke("click()");
      } else if (evt.key === "y") {
        evt.stopPropagation();
        this.redo.invoke("click()");
      }
    });
  }

   undoRedo(event2) {
    let cursor = event2.target["result"];
    this.setCurrentKey(cursor.key);
    this.canvas.openFromHistory(cursor["value"]);
    setTimeout(() => (document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey)).scrollIntoView(), 0);
    return null;
  }

  /**
   * Resets the history
   *
   * @param apply The function to call after reset
   */
   resetHistory(apply) {
    this.clearIntervals();
    this.undo.setEnabled(false);
    this.redo.setEnabled(false);
    this.consolidate.setEnabled(false);
    this.historyPreview.setProperty("innerHTML", "");
    if (this.dbName) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
    this.dbName = "pizzapazza_" + new Date().getTime();
    window.indexedDB.open(this.dbName, 1).onupgradeneeded = event => {
      this.database = event.target["result"];
      let options = new Object();
      options["autoIncrement"] = true;
      this.database.createObjectStore("history", options).transaction.oncomplete = event2 => {
        this.setIntervals();
        apply();
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
        this.database.transaction("history", "readwrite").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event2 => {
          let cursor = event2.target["result"];
          if (cursor) {
            document.querySelector(".z4historypreview.z4historypreview-" + cursor.key).remove();
            cursor.delete().onsuccess = event3 => {
              cursor.continue();
              return null;
            };
          } else {
            this.canvas.toHistory(json => {
              this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event => {
                this.undo.setEnabled(true);
                this.redo.setEnabled(false);
                this.consolidate.setEnabled(true);
                this.canvas.setChanged(false);
                this.currentKey = event.target["result"];
                let hPreview = new Z4HistoryPreview();
                hPreview.setHistory(this.currentKey, json, this.canvas);
                hPreview.setRibbonHistoryPanel(this);
                this.historyPreview.add(hPreview, null);
                document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element => element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
                document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey + " .z4historypreview-selector").textContent = Z4HistoryPreview.SELECTED_HISTORY_CONTENT;
                setTimeout(() => (document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey)).scrollIntoView(), 0);
                return null;
              };
            });
          }
          return null;
        };
      }
    }
  }

  /**
   * Adds an element to the history
   *
   * @param json The element
   * @param apply The function to call after the add
   * @param consolidate true to enable the consolidate button, false otherwise
   */
   addHistory(json, apply, consolidate) {
    this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event => {
      this.consolidate.setEnabled(consolidate);
      let key = event.target["result"];
      let hPreview = new Z4HistoryPreview();
      hPreview.setHistory(key, json, this.canvas);
      hPreview.setRibbonHistoryPanel(this);
      this.historyPreview.add(hPreview, null);
      apply(key);
      return null;
    };
  }

  /**
   * Iterates over the history buffer
   *
   * @param apply The function to apply
   */
   iterateHistoryBuffer(apply) {
    this.database.transaction("history", "readonly").objectStore("history").openCursor().onsuccess = event => {
      let cursor = event.target["result"];
      if (cursor) {
        apply(cursor.key, cursor["value"], () => cursor.continue());
      } else {
        apply(-1, null, null);
      }
      return null;
    };
  }

  /**
   * Sets the current key in the history buffer
   *
   * @param currentKey The current key in the history buffer
   */
   setCurrentKey(currentKey) {
    this.currentKey = currentKey;
    document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element => element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey + " .z4historypreview-selector").textContent = Z4HistoryPreview.SELECTED_HISTORY_CONTENT;
    this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.upperBound(this.currentKey, true)).onsuccess = event => {
      this.undo.setEnabled(!!(event.target["result"]));
      return null;
    };
    this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event => {
      this.redo.setEnabled(!!(event.target["result"]));
      return null;
    };
  }

  /**
   * Returns the current key in the history buffer
   *
   * @return The current key in the history buffer
   */
   getCurrentKey() {
    return this.currentKey;
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
   * Starts the timer for the standard saving
   */
   startStandard() {
    if (this.z4historyManagement === "standard") {
      this.clearIntervals();
      this.standardRand = Math.random();
      let rnd = this.standardRand;
      this.standardID = setTimeout(() => {
        if (this.standardRand === rnd) {
          this.saveHistory("standard");
        }
      }, this.z4savingDelay);
    }
  }

  /**
   * Stops the timer for the standard saving
   */
   stopStandard() {
    if (this.z4historyManagement === "standard") {
      this.clearIntervals();
      this.standardRand = Math.random();
    }
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
    this.clearIntervals();
    this.setIntervals();
  }

   clearIntervals() {
    if (this.timerID !== -1) {
      clearInterval(this.timerID);
      this.timerID = -1;
    }
    if (this.standardID !== -1) {
      clearTimeout(this.standardID);
      this.standardID = -1;
    }
  }

   setIntervals() {
    switch(this.z4historyManagement) {
      case "standard":
        break;
      case "timer":
        this.timerID = setInterval(() => this.saveHistory("timer"), this.z4savingInterval);
        break;
      case "manual":
        break;
      case "tool":
        break;
    }
  }
}
