/**
 * UI utilities
 *
 * @author gianpiero.diblasi
 */
class Z4UI {

  static  PLEASE_WAIT = new JSPanel();

  static  PROGRESS_BAR = new JSProgressBar();

  static {
    Z4UI.PLEASE_WAIT.cssAddClass("please-wait");
    Z4UI.PLEASE_WAIT.setLayout(new GridBagLayout());
    Z4UI.PROGRESS_BAR.getStyle().visibility = "hidden";
    let constraints = new GridBagConstraints();
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
   * @param <T> The object returned by the process
   * @param component The component requiring the process
   * @param async true if the process is async, false otherwise; an async
   * process needs to manually call the <i>pleaseWaitCompleted</i> method and
   * cannot define an <i>afterProcess</i> parameter
   * @param showProgressBar true to show the progress bar
   * @param progressBarIndeterminate true to sets the progress bar as
   * indeterminate, false otherwise
   * @param progressBarStringPainted true to sets the string painted in progress
   * bar, false otherwise
   * @param progressBarString The string to paint in the progress bar
   * @param beforeProcess The actions to do before the process
   * @param process The process
   * @param afterProcess The actions to do before the process
   */
  static  pleaseWait(component, async, showProgressBar, progressBarIndeterminate, progressBarStringPainted, progressBarString, beforeProcess, process, afterProcess) {
    Z4UI.PROGRESS_BAR.getStyle().visibility = showProgressBar ? "visible" : "hidden";
    if (showProgressBar) {
      Z4UI.PROGRESS_BAR.setIndeterminate(progressBarIndeterminate);
      Z4UI.PROGRESS_BAR.setStringPainted(progressBarStringPainted);
      Z4UI.PROGRESS_BAR.setValue(0);
      Z4UI.PROGRESS_BAR.setString(progressBarString);
    }
    Z4UI.PLEASE_WAIT.appendInBody();
    component.cssAddClass("please-wait-request");
    let parentRequest = document.querySelector(".jsdialog:has(.please-wait-request)");
    if (!parentRequest) {
      parentRequest = document.querySelector(".jsframe:has(.please-wait-request)");
    }
    parentRequest.appendChild(document.querySelector(".please-wait"));
    component.cssRemoveClass("please-wait-request");
    Z4UI.PLEASE_WAIT.cssAddClass("please-wait-visible");
    beforeProcess();
    setTimeout(() => {
      let obj = process();
      if (!async) {
        Z4UI.PLEASE_WAIT.cssRemoveClass("please-wait-visible");
        afterProcess(obj);
      }
    }, 0);
  }

  /**
   * Completes the please wait
   */
  static  pleaseWaitCompleted() {
    Z4UI.PLEASE_WAIT.cssRemoveClass("please-wait-visible");
  }

  /**
   * Sets the progress bar value in the please wait
   *
   * @param value The progress bar value in the please wait
   */
  static  setPleaseWaitProgressBarValue(value) {
    Z4UI.PROGRESS_BAR.setValue(value);
  }

  /**
   * Sets the progress bar string in the please wait
   *
   * @param string The string in the please wait
   */
  static  setPleaseWaitProgressBarString(string) {
    Z4UI.PROGRESS_BAR.setString(string);
  }

  constructor() {
  }
}
