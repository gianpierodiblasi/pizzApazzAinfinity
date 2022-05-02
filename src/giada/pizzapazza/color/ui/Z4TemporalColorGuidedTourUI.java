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
 * The guided tour for the Z4TemporalColorUI
 *
 * @author gianpiero.di.blasi
 */
public class Z4TemporalColorGuidedTourUI extends Z4TemporalColorUI {

  private final $Object options = new $Object();
  private $HTMLElement element1;
  private $HTMLElement element2;
  private String event;
  private String message;

  private final HTMLElement i = document.createElement("i");

  /**
   * Creates a Z4TemporalColorGuidedTourUI
   */
  public Z4TemporalColorGuidedTourUI() {
    super();
    this.querySelector(".dropdown-divider").remove();
    this.querySelector(".temporal-guided-tour").remove();

    HTMLElement div = document.createElement("div");
    div.setAttribute("style", "float:right");
    this.querySelector(".canvas-container div div:nth-child(3)").appendChild(div);

    this.i.className = "bi bi-arrow-left-circle";
    this.i.setAttribute("style", "font-size:30px;border-radius:48px;position:relative;top:50px;padding:0px 5px;visibility:hidden");
    div.appendChild(this.i);

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

    new Z4TemporalColorGuidedTourUI().appendToElement(document.querySelector(".modal-message"));
  }

  private void doStep(int step) {
    switch (step) {
      case 0:
        this.element1 = this.element2 = this.querySelector(".form-check-input[value='1-1']");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_SELECT_COLOR");
        break;
      case 1:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_COMPONENTS1");
        break;
      case 2:
        this.element1 = this.querySelector(".dropdown-toggle-split");
        this.element2 = this.querySelector(".dropdown-menu .form-range");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_OPACITY");
        break;
      case 3:
        this.i.style.visibility = "visible";
        this.element1 = this.querySelector(".bi-arrow-left-circle");
        this.element2 = this.querySelector(".canvas");
        this.event = Z4Loader.touch ? "touchstart" : "mousedown";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_COLOR");
        break;
      case 4:
        this.i.style.visibility = "hidden";
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_COMPONENTS2");
        break;
      case 5:
        this.element1 = this.element2 = this.querySelector(".form-check-input:nth-child(9)");
        this.event = Z4Loader.touch ? "touchend" : "mouseup";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MOVE");
        break;
      case 6:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".spatial-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_INVERT_SPATIAL");
        break;
      case 7:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".temporal-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_INVERT_TEMPORAL");
        break;
      case 8:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".temporal-negative");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_NEGATIVIZE");
        break;
      case 9:
        this.element1 = this.element2 = this.querySelector(".temporal-mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MIRROR_TEMPORAL");
        break;
      case 10:
        this.element1 = this.element2 = this.querySelector(".spatial-mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MIRROR_SPATIAL");
        break;
      case 11:
        this.element1 = this.element2 = this.querySelector(".form-range-spatial");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_RIPPLE_SPATIAL");
        break;
      case 12:
        this.element1 = this.element2 = this.querySelector(".form-range-temporal");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_RIPPLE_TEMPORAL");
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
