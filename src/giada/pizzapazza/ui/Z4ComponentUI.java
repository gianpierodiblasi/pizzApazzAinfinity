package giada.pizzapazza.ui;

import def.dom.Element;
import def.dom.HTMLElement;
import def.dom.XMLHttpRequest;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;

/**
 * The abstract class of all UI components
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public abstract class Z4ComponentUI<T> {

  private final HTMLElement html;

  /**
   * The onchange function
   */
  public $Apply_1_Void<T> onchange = element -> {
  };

  /**
   * The oninput function
   */
  public $Apply_1_Void<T> oninput = element -> {
  };
  
  /**
   * Loads an HTML file
   *
   * @param html The HTML file
   * @return The HTML file
   */
  protected static String loadHTML(String html) {
    String path = Z4Loader.UP + (Z4Loader.allFiles ? "src/" : "build/html/");

    XMLHttpRequest client = new XMLHttpRequest();
    client.open("GET", path + html, false);
    client.send();

    return client.responseText;
  }

  /**
   * Creates a Z4ComponentUI
   *
   * @param ui The HTML
   */
  protected Z4ComponentUI(String ui) {
    this.html = document.createElement("div");
    this.html.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
    this.html.innerHTML = ui;
  }

  /**
   * Selects a child of this component
   *
   * @param selector The selector
   * @return The child of this component
   */
  protected $HTMLElement querySelector(String selector) {
    return ($HTMLElement) this.html.querySelector(selector);
  }

  /**
   * Appends this Z4ComponentUI to its parent
   *
   * @param parent The parent
   * @return This Z4ComponentUI
   */
  public Z4ComponentUI<T> appendTo(Element parent) {
    parent.appendChild(this.html);
    return this;
  }
}
