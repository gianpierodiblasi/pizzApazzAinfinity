package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.document;
import static def.dom.Globals.localStorage;
import def.dom.IDBDatabase;
import def.js.Date;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.window;
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
  private int currentIndex;

  /**
   * Creates the object
   */
  public Z4RibbonHistoryPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonhistorypanel");
    
    this.addButton(this.undo, Z4Translations.UNDO, false, 0, 0, "left", event -> {
    });
    this.addButton(this.redo, Z4Translations.REDO, false, 1, 0, "right", event -> {
    });
    this.addButton(this.save, Z4Translations.SAVE, localStorage.getItem("z4historymanagement") == "manual", 2, 0, "", event -> this.saveHistory("manual"));
    this.addButton(this.consolidate, Z4Translations.CONSOLIDATE, false, 3, 0, "", event -> {
    });
    
    this.addVLine(4, 1);
    
    window.onunload = event -> {
      window.indexedDB.deleteDatabase(this.dbName);
      return null;
    };
  }

  /**
   * Resets the history
   */
  public void resetHistory() {
    if ($exists(this.dbName)) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
    
    this.dbName = "pizzapazza_" + new Date().getTime();
    window.indexedDB.open(this.dbName, 1).onupgradeneeded = event -> {
      this.database = (IDBDatabase) event.target.$get("result");
      
      $Object options = new $Object();
      options.$set("autoIncrement", true);
      this.database.createObjectStore("history", options).transaction.oncomplete = event2 -> {
        this.canvas.toHistory(json -> {
          this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event3 -> {
            this.currentIndex = event3.target.$get("result");
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
  @SuppressWarnings("IndexOfReplaceableByContains")
  public void saveHistory(String policies) {
    String z4historyManagement = (String) localStorage.getItem("z4historymanagement");
    if (!$exists(z4historyManagement)) {
      z4historyManagement = "standard";
    }
    
    if (policies.indexOf(z4historyManagement) != -1) {
      this.canvas.toHistory(json -> {
        this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event3 -> {
          this.currentIndex = event3.target.$get("result");
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
  
  private void addButton(JSButton button, String text, boolean enabled, int gridx, int gridy, String border, ActionListener listener) {
    button.setText(text);
    button.setEnabled(enabled);
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

  /**
   * Enables the undo button
   *
   * @param b true to enable the button, false otherwise
   */
  public void setUndoEnabled(boolean b) {
    this.undo.setEnabled(b);
  }

  /**
   * Enables the redo button
   *
   * @param b true to enable the button, false otherwise
   */
  public void setRedoEnabled(boolean b) {
    this.redo.setEnabled(b);
  }

  /**
   * Enables the save button
   *
   * @param b true to enable the button, false otherwise
   */
  public void setSaveEnabled(boolean b) {
    this.save.setEnabled(b);
  }

  /**
   * Enables the consolidate button
   *
   * @param b true to enable the button, false otherwise
   */
  public void setConsolidateEnabled(boolean b) {
    this.consolidate.setEnabled(b);
  }
}
