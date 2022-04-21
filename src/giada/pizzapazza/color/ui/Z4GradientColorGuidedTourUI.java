package giada.pizzapazza.color.ui;

import static def.dom.Globals.console;
import def.dom.HTMLElement;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ModalMessageUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import simulation.js.$Object;

/**
 * The guided tour for the Z4GradientColorUI
 *
 * @author gianpiero.di.blasi
 */
public class Z4GradientColorGuidedTourUI extends Z4GradientColorUI {

  private final $Object options = new $Object();
  private $HTMLElement element1;
  private $HTMLElement element2;
  private String event;
  private String message;

  /**
   * Creates a Z4GradientColorGuidedTourUI
   */
  public Z4GradientColorGuidedTourUI() {
    super();
    this.querySelector(".dropdown-divider").remove();
    this.querySelector(".gradient-guided-tour").remove();

    this.options.$set("once", true);
    this.doStep(0);
  }

  /**
   * Shows the guided tour
   */
  public static void show() {
    Z4ModalMessageUI.showInfo(Z4MessageFactory.get("TITLE"), "", () -> {
      document.querySelector(".modal-dialog").classList.remove("modal-lg");
      ((HTMLElement) document.querySelector(".modal-message")).innerHTML = "";
      ((HTMLElement) document.querySelector(".modal-dialog .modal-footer")).innerHTML = "";
    });

    HTMLElement label = document.createElement("label");
    label.className = "z4-guided-tour";

    document.querySelector(".modal-dialog").classList.add("modal-lg");
    document.querySelector(".modal-dialog .modal-footer").insertBefore(label, document.querySelector(".modal-dialog .modal-footer button"));

    new Z4GradientColorGuidedTourUI().appendTo(document.querySelector(".modal-message"));
  }

  private void doStep(int step) {
    switch (step) {
      case 0:
        this.element1 = this.element2 = this.querySelector(".form-check-input[value='1']");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_SELECT_COLOR");
        break;
      case 1:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_COMPONENTS1");
        break;
      case 2:
        this.element1 = this.querySelector(".dropdown-toggle-split");
        this.element2 = this.querySelector(".dropdown-menu .form-range");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_OPACITY");
        break;
      case 3:
        this.element1 = this.element2 = this.querySelector(".sliders");
        this.event = Z4Loader.touch ? "touchstart" : "mousedown";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_ADD_COLOR");
        break;
      case 4:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_COMPONENTS2");
        break;
      case 5:
        this.element1 = this.element2 = this.querySelector(".form-check-input:nth-child(3)");
        this.event = Z4Loader.touch ? "touchend" : "mouseup";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_MOVE");
        break;
      case 6:
        this.element1 = this.querySelector(".bi-three-dots");
        this.element2 = this.querySelector(".gradient-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_INVERT");
        break;
      case 7:
        this.element1 = this.querySelector(".bi-three-dots");
        this.element2 = this.querySelector(".gradient-negative");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_NEGATIVIZE");
        break;
      case 8:
        this.element1 = this.element2 = this.querySelector(".mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_MIRROR");
        break;
      case 9:
        this.element1 = this.element2 = this.querySelector(".form-range[step='0.01']");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_ADD_RIPPLE");
        break;
      default:
        this.element1 = null;
        this.message = Z4MessageFactory.get("GUIDED_TOUR_COMPLETED");
    }

    HTMLElement label = (HTMLElement) document.querySelector(".modal-dialog .modal-footer label");

    if ($exists(this.element1)) {
      this.element1.classList.add("z4-guided-tour");
      this.element2.classList.add("z4-guided-tour");

      this.element2.addEventListener(this.event, (evt) -> {
        this.element1.classList.remove("z4-guided-tour");
        this.element2.classList.remove("z4-guided-tour");
        this.doStep(step + 1);
      }, this.options);
    } else if ($exists(label)) {
      label.className = "";
    }

    if ($exists(label)) {
      label.innerText = this.message;
    } else {
      console.log(this.message);
    }
  }
}
