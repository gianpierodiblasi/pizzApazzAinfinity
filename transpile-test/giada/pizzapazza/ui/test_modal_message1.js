/* global Z4ModalMessageUI */

/**
 * @author gianpiero.di.blasi
 */
class test_modal_message1 {

  static  onLoad() {
    (document.querySelector(".test-info")).onclick = (event) => {
      Z4ModalMessageUI.showInfo("pizzApazzA", "This is an information message", () => {
      });
      return null;
    };
    (document.querySelector(".test-warning")).onclick = (event) => {
      Z4ModalMessageUI.showWarning("pizzApazzA", "This is a warning message", () => {
      });
      return null;
    };
    (document.querySelector(".test-error")).onclick = (event) => {
      Z4ModalMessageUI.showError("pizzApazzA", "This is an error message", () => {
      });
      return null;
    };
    (document.querySelector(".test-question")).onclick = (event) => {
      Z4ModalMessageUI.showQuestion("pizzApazzA", "This is a question message", () => {
      }, null, null, null);
      return null;
    };
  }

  constructor() {
  }
}
