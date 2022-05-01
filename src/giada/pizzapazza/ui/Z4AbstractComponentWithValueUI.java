package giada.pizzapazza.ui;

import simulation.js.$Apply_1_Void;

/**
 * The abstract class of all UI components providing a value
 *
 * @param <S>
 * @param <T>
 * @author gianpiero.di.blasi
 */
public abstract class Z4AbstractComponentWithValueUI<S, T extends Z4AbstractComponentWithValueUI<S, T>> extends Z4AbstractComponentUI<Z4AbstractComponentWithValueUI<S, T>> {

  /**
   * The provided value
   */
  protected S value;

  /**
   * The onchange function
   */
  public $Apply_1_Void<T> onchange = element -> {
  };

  /**
   * The oninput function
   */
  public $Apply_1_Void<T> oninput = element -> {
  };

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4AbstractComponentWithValueUI
   */
  @SuppressWarnings("unchecked")
  public T setValue(S value) {
    this.value = value;
    return (T) this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public S getValue() {
    return this.value;
  }
}
