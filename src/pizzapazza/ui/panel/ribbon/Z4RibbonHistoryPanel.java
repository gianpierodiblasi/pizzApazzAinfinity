package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.clearInterval;
import def.dom.IDBDatabase;
import def.dom.IDBKeyRange;
import def.js.Date;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Translations;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import simulation.js.$Apply_3_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.setInterval;
import static simulation.js.$Globals.window;
import simulation.js.$IDBCursor;
import simulation.js.$Object;

/**
 * The ribbon panel containing the history
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonHistoryPanel extends JSPanel {

  private final JSButton undo = new JSButton();
  private final JSButton redo = new JSButton();
  private final JSButton save = new JSButton();
  private final JSButton consolidate = new JSButton();

  private Z4Canvas canvas;
  private Z4StatusPanel statusPanel;

  private String dbName;
  private IDBDatabase database;
  private int currentKey;

  private String z4historyManagement;
  private int z4savingDelay;
  private int z4savingInterval;

  private int timerID = -1;

  /**
   * Creates the object
   */
  public Z4RibbonHistoryPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonhistorypanel");

    this.addButton(this.undo, Z4Translations.UNDO, 0, 0, "left", event -> {
    });
    this.addButton(this.redo, Z4Translations.REDO, 1, 0, "right", event -> {
    });
    this.addButton(this.save, Z4Translations.SAVE, 2, 0, "", event -> this.saveHistory("manual"));
    
    this.addButton(this.consolidate, Z4Translations.CONSOLIDATE, 3, 0, "", event -> JSOptionPane.showConfirmDialog(Z4Translations.CONSOLIDATE_MESSAGE, Z4Translations.CONSOLIDATE, JSOptionPane.YES_NO_OPTION, JSOptionPane.WARNING_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.canvas.setChanged(false);
        this.resetHistory(() -> this.canvas.toHistory(json -> this.addHistory(json, key -> this.setCurrentKey(key), false)));
      }
    }));

    this.addVLine(4, 1);

    window.onunload = event -> {
      window.indexedDB.deleteDatabase(this.dbName);
      return null;
    };
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
      apply.$apply(event.target.$get("result"));
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

  private void addButton(JSButton button, String text, int gridx, int gridy, String border, ActionListener listener) {
    button.setText(text);
    button.setEnabled(false);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.NORTH;
    switch (border) {
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

  private void addVLine(int gridx, double weightx) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";

    GridBagConstraints constraints = new GridBagConstraints();
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
