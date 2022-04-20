package simulation.dom;

import def.dom.EventListener;
import def.dom.HTMLElement;
import simulation.js.$Object;

/**
 * The simulation of the HTMLElement object
 *
 * @author gianpiero.di.blasi
 */
public class $HTMLElement extends HTMLElement {

  public double valueAsNumber;
  public String value;
  public boolean checked;

  public void addEventListener(String event, EventListener listener, $Object options) {
  }
}
