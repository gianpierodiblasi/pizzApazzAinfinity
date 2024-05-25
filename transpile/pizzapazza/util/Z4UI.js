/**
 * UI utilities
 *
 * @author gianpiero.diblasi
 */
class Z4UI {

  /**
   * Waits for a process to complete
   *
   * @param <T> The object returned by the process
   * @param beforeProcess The actions to do before the process
   * @param process The process
   * @param afterProcess The actions to do before the process
   */
  static  pleaseWait(beforeProcess, process, afterProcess) {
    document.querySelectorAll("dialog").forEach(dialog => {
      if (!dialog.querySelector(".please-wait")) {
        let pleaseWait = document.createElement("div");
        pleaseWait.classList.add("please-wait");
        dialog.appendChild(pleaseWait);
      }
    });
    document.querySelectorAll(".please-wait").forEach(element => element.classList.add("please-wait-visible"));
    beforeProcess();
    setTimeout(() => {
      let obj = process();
      document.querySelectorAll(".please-wait").forEach(element => element.classList.remove("please-wait-visible"));
      afterProcess(obj);
    }, 0);
  }

  constructor() {
  }
}
