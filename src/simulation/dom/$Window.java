package simulation.dom;

import def.dom.Window;

/**
 * The simulation of the Window object
 *
 * @author gianpiero.diblasi
 */
public class $Window extends Window {

  public String matchMedia;

  public native $MediaQueryList $matchMedia(String string);
}
