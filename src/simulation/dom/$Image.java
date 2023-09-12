package simulation.dom;

import def.dom.Event;
import def.dom.Image;
import java.util.function.Consumer;

/**
 * The simulation of the Image object
 *
 * @author gianpiero.diblasi
 */
public class $Image extends Image {

  public String src;
  public Consumer<Event> onload;
}
