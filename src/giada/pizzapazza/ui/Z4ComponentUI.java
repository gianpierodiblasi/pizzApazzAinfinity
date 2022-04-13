package giada.pizzapazza.ui;

import def.dom.Element;
import static def.dom.Globals.window;
import def.dom.HTMLElement;
import def.dom.XMLHttpRequest;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;
import simulation.js.$URLSearchParams;

/**
 * The abstract class of all UI components
 *
 * @author gianpiero.di.blasi
 */
public abstract class Z4ComponentUI {

  private final HTMLElement html;

  /**
   * Loads an HTML file
   * @param html The HTML file
   * @return The HTML file
   */
  public static String loadHTML(String html) {
    $URLSearchParams urlParams = new $URLSearchParams(window.location.search);
    String path = Z4Loader.UP + (urlParams.get("allFiles") ? "src/" : "build/html/");

    XMLHttpRequest client = new XMLHttpRequest();
    client.open("GET", path + html, false);
    client.send();

    return client.responseText;
  }

  public Z4ComponentUI(String ui) {
    this.html = document.createElement("div");
    this.html.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
    this.html.innerHTML = ui;
  }

  /**
   * Appends this component to its parent
   *
   * @param parent The parent
   */
  public void appendTo(Element parent) {
    parent.appendChild(this.html);
  }

  /**
   * Selects a child of this component
   * @param selector The selector
   * @return The child of this component
   */
  protected $HTMLElement querySelector(String selector) {
    return ($HTMLElement) this.html.querySelector(selector);
  }
}
