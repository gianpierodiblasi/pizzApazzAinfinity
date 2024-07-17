package pizzapazza.util;

/**
 * The filling used to color each character of a text
 *
 * @author gianpiero.diblasi
 */
public enum Z4TextInfoTextColorFilling {
  /**
   * Each character is filled by an uniform color obtained based on the
   * character's position in the text
   */
  UNIFORM,
  /**
   * Each character is filled by a gradient obtained as a proportional of the
   * gradient color based on the character's position in the text
   */
  SUBGRADIENT,
  /**
   * Each character is filled by using the gradient color
   */
  GRADIENT;
}
