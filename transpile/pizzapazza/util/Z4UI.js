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
    document.querySelector(".please-wait").classList.add("please-wait-visible");
    beforeProcess();
    setTimeout(() => {
      let obj = process();
      document.querySelector(".please-wait").classList.remove("please-wait-visible");
      afterProcess(obj);
    }, 0);
  }

  constructor() {
  }
}
