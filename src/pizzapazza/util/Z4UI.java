package pizzapazza.util;

import def.dom.Element;
import static def.dom.Globals.document;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSProgressBar;
import javascript.swing.JSSpinner;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;
import static simulation.js.$Globals.window;

/**
 * UI utilities
 *
 * @author gianpiero.diblasi
 */
public class Z4UI {

  private final static JSPanel PLEASE_WAIT = new JSPanel();
  private final static JSProgressBar PROGRESS_BAR = new JSProgressBar();

  static {
    Z4UI.PLEASE_WAIT.cssAddClass("please-wait");
    Z4UI.PLEASE_WAIT.setLayout(new GridBagLayout());
    Z4UI.PLEASE_WAIT.add(Z4UI.PROGRESS_BAR, new GBC(0, 0).wx(1).f(GBC.HORIZONTAL).i(0, 25, 0, 25));

    Z4UI.PROGRESS_BAR.getStyle().display = "none";
  }

  /**
   * Waits for a process to complete
   *
   * @param component The component requiring the process
   * @param async true if the process is async, false otherwise; an async
   * process needs to manually call the <i>pleaseWaitCompleted</i> method; a
   * "virtually" async process can "advance" the progress bar by calling the
   * <i>pleaseWaitAdvanced</i>
   * method
   * @param showProgressBar true to show the progress bar
   * @param progressBarIndeterminate true to sets the progress bar as
   * indeterminate, false otherwise
   * @param progressBarStringPainted true to sets the string painted in progress
   * bar, false otherwise
   * @param progressBarString The string to paint in the progress bar
   * @param process The process
   */
  public static void pleaseWait(JSComponent component, boolean async, boolean showProgressBar, boolean progressBarIndeterminate, boolean progressBarStringPainted, String progressBarString, $Apply_0_Void process) {
    Z4UI.PROGRESS_BAR.getStyle().display = showProgressBar ? "grid" : "none";

    if (showProgressBar) {
      Z4UI.PROGRESS_BAR.setIndeterminate(progressBarIndeterminate);
      Z4UI.PROGRESS_BAR.setStringPainted(progressBarStringPainted);
      Z4UI.PROGRESS_BAR.setValue(0);
      Z4UI.PROGRESS_BAR.setString(progressBarString);
    } else {
      Z4UI.PROGRESS_BAR.setIndeterminate(false);
      Z4UI.PROGRESS_BAR.setStringPainted(false);
      Z4UI.PROGRESS_BAR.setValue(0);
      Z4UI.PROGRESS_BAR.setString("");
    }

    Color color = Color.fromRGB_HEX(window.getComputedStyle(document.body).getPropertyValue("--main-action-bgcolor"));
    Z4UI.PLEASE_WAIT.getStyle().background = new Color(color.red, color.green, color.blue, 64).getRGBA_HEX();
    Z4UI.PLEASE_WAIT.appendInBody();
    Z4UI.PLEASE_WAIT.cssAddClass("please-wait-visible");

    component.cssAddClass("please-wait-request");
    Element parentRequest = document.querySelector(".jsdialog:has(.please-wait-request)");
    if (!$exists(parentRequest)) {
      parentRequest = document.querySelector(".jsframe:has(.please-wait-request)");
    }
    parentRequest.appendChild(document.querySelector(".please-wait"));
    component.cssRemoveClass("please-wait-request");

    setTimeout(() -> {
      process.$apply();

      if (!async) {
        Z4UI.pleaseWaitCompleted();
      }
    }, 0);
  }

  /**
   * Advances the please wait
   *
   * @param process The next process
   */
  public static void pleaseWaitAdvanced($Apply_0_Void process) {
    setTimeout(() -> process.$apply(), 0);
  }

  /**
   * Completes the please wait
   */
  public static void pleaseWaitCompleted() {
    Z4UI.PLEASE_WAIT.cssRemoveClass("please-wait-visible");
  }

  /**
   * Sets the progress bar value in the please wait
   *
   * @param value The progress bar value in the please wait
   */
  public static void setPleaseWaitProgressBarValue(int value) {
    Z4UI.PROGRESS_BAR.setValue(value);
  }

  /**
   * Sets the progress bar string in the please wait
   *
   * @param string The string in the please wait
   */
  public static void setPleaseWaitProgressBarString(String string) {
    Z4UI.PROGRESS_BAR.setString(string);
  }

  /**
   * Adds a label in a panel with a GridBagLayout manager
   *
   * @param panel The panel
   * @param text The text
   * @param gbc The constraints
   * @return The added label
   */
  public static JSLabel addLabel(JSPanel panel, String text, GridBagConstraints gbc) {
    JSLabel label = new JSLabel();
    label.setText(text);
    panel.add(label, gbc);
    return label;
  }

  /**
   * Adds a vertical line in a panel with a GridBagLayout manager
   *
   * @param panel The panel
   * @param gbc The constraints
   * @return The added line
   */
  public static JSComponent addVLine(JSPanel panel, GridBagConstraints gbc) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    panel.add(div, gbc);
    return div;
  }

  /**
   * Adds a horizontal line in a panel with a GridBagLayout manager
   *
   * @param panel The panel
   * @param gbc The constraints
   * @return The added line
   */
  public static JSComponent addHLine(JSPanel panel, GridBagConstraints gbc) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    panel.add(div, gbc);
    return div;
  }

  /**
   * Sets a spinner to be vertical
   *
   * @param spinner The spinner
   */
  public static void setVerticalSpinner(JSSpinner spinner) {
    spinner.cssAddClass("jsspinner-vertical");
    spinner.cssAddClass("jsspinner_h_4rem");
    spinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    spinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
  }

  private Z4UI() {
  }
}
