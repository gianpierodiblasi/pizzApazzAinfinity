package pizzapazza.util;

import def.dom.Element;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSProgressBar;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
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

    Z4UI.PROGRESS_BAR.getStyle().display = "none";

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 0;
    constraints.gridwidth = 1;
    constraints.gridheight = 1;
    constraints.weightx = 1;
    constraints.anchor = GridBagConstraints.CENTER;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(0, 25, 0, 25);
    Z4UI.PLEASE_WAIT.add(Z4UI.PROGRESS_BAR, constraints);
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

  private Z4UI() {
  }
}
