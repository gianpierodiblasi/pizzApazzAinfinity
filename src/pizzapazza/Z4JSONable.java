package pizzapazza;

import simulation.js.$Object;

/**
 * The common interface for objects able to be converted to a JSON object
 *
 * @author gianpiero.diblasi
 */
public interface Z4JSONable {

  /**
   * Returns this object as a JSON object
   *
   * @return This object as a JSON object
   */
  public abstract $Object toJSON();
}
