package pizzapazza.util;

import static def.dom.Globals.document;
import javascript.util.AbstractHTMLImageProducer;
import simulation.dom.$Image;

/**
 * An implementation of the AbstractHTMLImageProducer providing an empty image
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
public class Z4EmptyImageProducer<T> extends AbstractHTMLImageProducer<T> {

  /**
   * Creates the object
   *
   * @param value The value
   */
  public Z4EmptyImageProducer(T value) {
    super(value);
  }

  @Override
  public $Image produce() {
    return ($Image) document.createElement("img");
  }
}
