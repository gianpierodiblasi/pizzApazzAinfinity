package giada.pizzapazza.ui;

import def.dom.Element;
import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Date;
import giada.pizzapazza.setting.Z4MessageFactory;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;

/**
 * The abstract class of all UI components
 *
 * @author gianpiero.di.blasi
 */
public abstract class Z4AbstractComponentUI {

  private final $HTMLElement root;

  /**
   * Creates a Z4AbstractComponentUI
   *
   * @param ui The HTML
   */
  protected Z4AbstractComponentUI(String ui) {
    this.root = ($HTMLElement) document.createElement("div");
    this.root.setAttribute("id", "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random()));
    this.root.innerHTML = ui;

    NodeList list = this.root.querySelectorAll("#" + this.root.id + " [data-token-lang-inner_text]");
    for (int index = 0; index < list.length; index++) {
      HTMLElement element = (HTMLElement) list.item(index);
      element.innerHTML = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text"));
    }
  }

  /**
   * Selects a child of this component
   *
   * @param selector The selector
   * @return The child of this component
   */
  public $HTMLElement querySelector(String selector) {
    return ($HTMLElement) this.root.querySelector(selector);
  }

  /**
   * Selects all children of this component
   *
   * @param selector The selector
   * @return All children of this component
   */
  public NodeList querySelectorAll(String selector) {
    return this.root.querySelectorAll(selector);
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param <T>
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentUI> T appendToElement(Element parent) {
    parent.appendChild(this.root);
    return (T) this;
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param <T>
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentUI> T appendToComponent(Z4AbstractComponentUI parent) {
    parent.root.appendChild(this.root);
    return (T) this;
  }

  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentUI> T prependElement(Element element) {
    this.root.prepend(element);
    return (T) this;
  }

  /**
   * Prepends an element to this Z4AbstractComponentUI
   *
   * @param <T>
   * @param element The element
   * @return This Z4AbstractComponentUI
   */
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentUI> T prependComponent(Z4AbstractComponentUI element) {
    this.root.prepend(element.root);
    return (T) this;
  }
}
