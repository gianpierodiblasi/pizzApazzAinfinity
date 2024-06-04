package pizzapazza.ui.panel;

import def.js.Array;
import javascript.swing.JSPanel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import static simulation.js.$Globals.$typeof;

/**
 * The abstract panel of all panels able to manage a "value"
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
public abstract class Z4AbstractValuePanel<T> extends JSPanel {

  /**
   * The value
   */
  protected T value;

  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  public Z4AbstractValuePanel() {
    super();
    this.cssAddClass("z4abstractvaluepanel");
  }

  /**
   * Sets the value
   *
   * @param value The value
   */
  public abstract void setValue(T value);

  /**
   * Returns the value
   *
   * @return The value
   */
  public T getValue() {
    return this.value;
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }

  /**
   * to call to invoke a change event
   */
  protected void onchange() {
    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
