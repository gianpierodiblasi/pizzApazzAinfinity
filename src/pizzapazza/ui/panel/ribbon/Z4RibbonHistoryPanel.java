package pizzapazza.ui.panel.ribbon;

import def.dom.Event;
import static def.dom.Globals.clearInterval;
import static def.dom.Globals.clearTimeout;
import def.dom.HTMLElement;
import def.dom.IDBDatabase;
import def.dom.IDBKeyRange;
import def.dom.KeyboardEvent;
import def.js.Date;
import javascript.awt.BoxLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4HistoryPreview;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$IDBCursor;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import simulation.js.$Apply_3_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.setInterval;
import static simulation.js.$Globals.setTimeout;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The ribbon panel containing the history
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonHistoryPanel extends Z4AbstractRibbonPanel {

  private final JSButton undo;
  private final JSButton redo;
  private final JSButton save;
  private final JSButton consolidate;
  private final JSPanel historyPreview = new JSPanel();

  private Z4Canvas canvas;
  private Z4StatusPanel statusPanel;

  private String dbName;
  private IDBDatabase database;
  private int currentKey;

  private String z4historyManagement;
  private int z4savingDelay;
  private int z4savingInterval;

  private int timerID = -1;
  private int standardID = -1;
  private double standardRand;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4RibbonHistoryPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonhistorypanel");

    this.undo = this.addButton(Z4Translations.UNDO, false, 0, 0, "left", 5, event -> this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.upperBound(this.currentKey, true), "prev").onsuccess = event2 -> this.undoRedo(event2));
    this.redo = this.addButton(Z4Translations.REDO, false, 1, 0, "right", 5, event -> this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event2 -> this.undoRedo(event2));
    this.save = this.addButton(Z4Translations.SAVE, false, 2, 0, "", 5, event -> this.saveHistory("manual"));

    this.consolidate = this.addButton(Z4Translations.CONSOLIDATE, false, 3, 0, "", 5, event -> JSOptionPane.showConfirmDialog(Z4Translations.CONSOLIDATE_MESSAGE, Z4Translations.CONSOLIDATE, JSOptionPane.YES_NO_OPTION, JSOptionPane.WARNING_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.canvas.setChanged(false);
        this.resetHistory(() -> this.canvas.toHistory(json -> this.addHistory(json, key -> this.setCurrentKey(key), false)));
      }
    }));

    Z4UI.addVLine(this, new GBC(4, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.historyPreview.setLayout(new BoxLayout(this.historyPreview, BoxLayout.X_AXIS));
    this.historyPreview.getStyle().overflowX = "scroll";
    this.add(this.historyPreview, new GBC(5, 0).h(2).wx(1).f(GBC.BOTH));

    window.onunload = event -> {
      window.indexedDB.deleteDatabase(this.dbName);
      return null;
    };

    this.addEventListener("keydown", event -> {
      KeyboardEvent evt = (KeyboardEvent) event;
      if (!evt.ctrlKey) {
      } else if (evt.key == "z") {
        evt.stopPropagation();
        this.undo.invoke("click()");
      } else if (evt.key == "y") {
        evt.stopPropagation();
        this.redo.invoke("click()");
      }
    });
  }

  private Object undoRedo(Event event2) {
    $IDBCursor cursor = ($IDBCursor) event2.target.$get("result");
    this.setCurrentKey((int) cursor.key);
    this.canvas.openFromHistory(cursor.$get("value"));

    setTimeout(() -> ((HTMLElement) document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey)).scrollIntoView(), 0);
    return null;
  }

  /**
   * Resets the history
   *
   * @param apply The function to call after reset
   */
  public void resetHistory($Apply_0_Void apply) {
    this.clearIntervals();
    this.undo.setEnabled(false);
    this.redo.setEnabled(false);
    this.consolidate.setEnabled(false);
    this.historyPreview.setProperty("innerHTML", "");

    if ($exists(this.dbName)) {
      window.indexedDB.deleteDatabase(this.dbName);
    }

    this.dbName = "pizzapazza_" + new Date().getTime();
    window.indexedDB.open(this.dbName, 1).onupgradeneeded = event -> {
      this.database = (IDBDatabase) event.target.$get("result");

      $Object options = new $Object();
      options.$set("autoIncrement", true);
      this.database.createObjectStore("history", options).transaction.oncomplete = event2 -> {
        this.setIntervals();
        apply.$apply();
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
  @SuppressWarnings("IndexOfReplaceableByContains")
  public void saveHistory(String policies) {
    if (this.canvas.isChanged()) {
      if (policies.indexOf(this.z4historyManagement) != -1) {
        this.database.transaction("history", "readwrite").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event2 -> {
          $IDBCursor cursor = ($IDBCursor) event2.target.$get("result");
          if ($exists(cursor)) {
            document.querySelector(".z4historypreview.z4historypreview-" + cursor.key).remove();

            cursor.delete().onsuccess = event3 -> {
              cursor.$continue();
              return null;
            };
          } else {
            this.canvas.toHistory(json -> {
              this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event -> {
                this.undo.setEnabled(true);
                this.redo.setEnabled(false);
                this.consolidate.setEnabled(true);

                this.canvas.setChanged(false);
                this.currentKey = event.target.$get("result");

                Z4HistoryPreview hPreview = new Z4HistoryPreview();
                hPreview.setHistory(this.currentKey, json, this.canvas);
                hPreview.setRibbonHistoryPanel(this);
                this.historyPreview.add(hPreview, null);

                document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element -> element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
                document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey + " .z4historypreview-selector").textContent = Z4HistoryPreview.SELECTED_HISTORY_CONTENT;
                setTimeout(() -> ((HTMLElement) document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey)).scrollIntoView(), 0);

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
  public void addHistory($Object json, $Apply_1_Void<Integer> apply, boolean consolidate) {
    this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event -> {
      this.consolidate.setEnabled(consolidate);

      int key = event.target.$get("result");

      Z4HistoryPreview hPreview = new Z4HistoryPreview();
      hPreview.setHistory(key, json, this.canvas);
      hPreview.setRibbonHistoryPanel(this);
      this.historyPreview.add(hPreview, null);

      apply.$apply(key);
      return null;
    };
  }

  /**
   * Iterates over the history buffer
   *
   * @param apply The function to apply
   */
  public void iterateHistoryBuffer($Apply_3_Void<Integer, $Object, $Apply_0_Void> apply) {
    this.database.transaction("history", "readonly").objectStore("history").openCursor().onsuccess = event -> {
      $IDBCursor cursor = ($IDBCursor) event.target.$get("result");
      if ($exists(cursor)) {
        apply.$apply((Integer) cursor.key, cursor.$get("value"), () -> cursor.$continue());
      } else {
        apply.$apply(-1, null, null);
      }
      return null;
    };
  }

  /**
   * Sets the current key in the history buffer
   *
   * @param currentKey The current key in the history buffer
   */
  public void setCurrentKey(int currentKey) {
    this.currentKey = currentKey;

    document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element -> element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey + " .z4historypreview-selector").textContent = Z4HistoryPreview.SELECTED_HISTORY_CONTENT;

    this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.upperBound(this.currentKey, true)).onsuccess = event -> {
      this.undo.setEnabled($exists(event.target.$get("result")));
      return null;
    };

    this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event -> {
      this.redo.setEnabled($exists(event.target.$get("result")));
      return null;
    };
  }

  /**
   * Returns the current key in the history buffer
   *
   * @return The current key in the history buffer
   */
  public int getCurrentKey() {
    return this.currentKey;
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Starts the timer for the standard saving
   */
  @SuppressWarnings("StringEquality")
  public void startStandard() {
    if (this.z4historyManagement == "standard") {
      this.clearIntervals();

      this.standardRand = Math.random();
      double rnd = this.standardRand;
      this.standardID = setTimeout(() -> {
        if (this.standardRand == rnd) {
          this.saveHistory("standard");
        }
      }, this.z4savingDelay);
    }
  }

  /**
   * Stops the timer for the standard saving
   */
  @SuppressWarnings("StringEquality")
  public void stopStandard() {
    if (this.z4historyManagement == "standard") {
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
  @SuppressWarnings("StringEquality")
  public void setHistoryManagementSettings(String z4historyManagement, int z4savingDelay, int z4savingInterval) {
    this.z4historyManagement = z4historyManagement;
    this.z4savingDelay = z4savingDelay;
    this.z4savingInterval = z4savingInterval;

    this.save.setEnabled(z4historyManagement == "manual");

    this.clearIntervals();
    this.setIntervals();
  }

  private void clearIntervals() {
    if (this.timerID != -1) {
      clearInterval(this.timerID);
      this.timerID = -1;
    }

    if (this.standardID != -1) {
      clearTimeout(this.standardID);
      this.standardID = -1;
    }
  }

  private void setIntervals() {
    switch (this.z4historyManagement) {
      case "standard":
        break;
      case "timer":
        this.timerID = setInterval(() -> this.saveHistory("timer"), this.z4savingInterval);
        break;
      case "manual":
        break;
      case "tool":
        break;
    }
  }
}
