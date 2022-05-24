/**
 * The abstract class of all UI components
 *
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentUI {

   root = null;

   devicePixelRatioListener = null;

  /**
   * Creates a Z4AbstractComponentUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    this.root = document.createElement("div");
    this.root.setAttribute("id", "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random()));
    this.root.innerHTML = ui;
    let list = this.root.querySelectorAll("#" + this.root.id + " [data-token-lang-inner_text]");
    for (let index = 0; index < list.length; index++) {
      let element = list.item(index);
      element.innerHTML = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text"));
    }
  }

  /**
   * Inizializes the monitoring of the device pixel ratio changes
   *
   * @param onDevicePixelRatioChange The method called on device pixel ratio
   * changes
   */
   initDevicePixelRatio(onDevicePixelRatioChange) {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        onDevicePixelRatioChange();
        this.addDevicePixelRatioListener();
      };
      this.addDevicePixelRatioListener();
    }
  }

   addDevicePixelRatioListener() {
    let options = new Object();
    options["once"] = true;
    window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").addEventListener("change", this.devicePixelRatioListener, options);
  }

  /**
   * Disposes the monitoring of the device pixel ratio changes
   */
   disposeDevicePixelRatio() {
    if (window.matchMedia) {
      window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").removeEventListener("change", this.devicePixelRatioListener);
    }
  }

  /**
   * Disposes the component
   */
   dispose() {
  }
  /**
   * Selects a child of this component
   *
   * @param selector The selector
   * @return The child of this component
   */
  // public $HTMLElement querySelector(String selector) {
  // return ($HTMLElement) this.root.querySelector(selector);
  // }
  /**
   * Selects all children of this component
   *
   * @param selector The selector
   * @return All children of this component
   */
  // public NodeList querySelectorAll(String selector) {
  // return this.root.querySelectorAll(selector);
  // }
  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param <T>
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T appendToElement(Element parent) {
  // parent.appendChild(this.root);
  // return (T) this;
  // }
  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param <T>
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T appendToComponent(Z4AbstractComponentUI parent) {
  // parent.root.appendChild(this.root);
  // return (T) this;
  // }
  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T prependElement(Element element) {
  // this.root.prepend(element);
  // return (T) this;
  // }
  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
  // @SuppressWarnings("unchecked")
  // public <T extends Z4AbstractComponentUI> T prependComponent(Z4AbstractComponentUI element) {
  // this.root.prepend(element.root);
  // return (T) this;
  // }
}
