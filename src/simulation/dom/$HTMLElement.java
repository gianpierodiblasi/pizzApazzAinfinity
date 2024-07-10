package simulation.dom;

import def.dom.EventListener;
import def.dom.HTMLElement;
import def.dom.Node;
import simulation.js.$Object;

/**
 * The simulation of the HTMLElement object
 *
 * @author gianpiero.diblasi
 */
public class $HTMLElement extends HTMLElement {

  public double valueAsNumber;
  public String value;
  public boolean checked;

  public void addEventListener(String event, EventListener listener, $Object options) {
  }

  public void select() {
  }

  public void prepend(Node node) {
  }

  public $HTMLElement closest(String selector) {
    return null;
  }
}
