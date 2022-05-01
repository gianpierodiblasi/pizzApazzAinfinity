/**
 * The abstract class of all UI components providing a value
 *
 * @param <S>
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentWithValueUI extends Z4AbstractComponentUI {

  /**
   * The provided value
   */
   value = null;

  /**
   * The onchange function
   */
   onchange = element => {
  };

  /**
   * The oninput function
   */
   oninput = element => {
  };

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4AbstractComponentWithValueUI
   */
   setValue(value) {
    this.value = value;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value;
  }
}
