/**
 * The abstract panel of all panels able to manage a "value"
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
class Z4AbstractValuePanel extends JSPanel {

  /**
   * The value
   */
   value = null;

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4abstractvaluepanel");
  }

  /**
   * Sets the value
   *
   * @param value The value
   */
   setValue(value) {
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value;
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * to call to invoke a change event
   */
   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
