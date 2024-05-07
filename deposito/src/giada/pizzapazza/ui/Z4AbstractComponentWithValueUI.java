package giada.pizzapazza.ui;

import simulation.js.$Apply_1_Void;

/**
 * The abstract class of all UI components providing a value
 *
 * @param <S>
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractComponentWithValueUI<S> extends Z4AbstractComponentUI {

  /**
   * The provided value
   */
  protected S value;

  /**
   * The onchange function
   */
  public $Apply_1_Void<S> onchange = element -> {
  };

  /**
   * The oninput function
   */
  public $Apply_1_Void<S> oninput = element -> {
  };

  /**
   * Creates a Z4AbstractComponentWithValueUI
   *
   * @param ui The HTML
   */
  protected Z4AbstractComponentWithValueUI(String ui) {
    super(ui);
  }

  /**
   * Sets the value
   *
   * @param <T>
   * @param value The value
   * @return This Z4AbstractComponentWithValueUI
   */
  public abstract <T extends Z4AbstractComponentWithValueUI<?>> T setValue(S value);

  /**
   * Returns the value
   *
   * @return The value
   */
  public S getValue() {
    return this.value;
  }
}
