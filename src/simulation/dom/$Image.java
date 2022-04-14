package simulation.dom;

import def.dom.Event;
import def.dom.Image;
import java.util.function.Consumer;

/**
 * The simulation of a JavaScript Image Object
 *
 * @author gianpiero.di.blasi
 */
public class $Image extends Image {

  public String src;
  public Consumer<Event> onload;
}
