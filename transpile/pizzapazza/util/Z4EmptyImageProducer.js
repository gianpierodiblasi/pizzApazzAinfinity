/**
 * An implementation of the AbstractHTMLImageProducer providing an empty image
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
class Z4EmptyImageProducer extends AbstractHTMLImageProducer {

  /**
   * Creates the object
   *
   * @param value The value
   */
  constructor(value) {
    super(value);
  }

   produce() {
    return document.createElement("img");
  }
}
