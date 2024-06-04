package pizzapazza.math;

import pizzapazza.Z4JSONable;

/**
 * The common interface for objects able to provide a "next" value
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 */
public interface Z4Nextable<T> extends Z4JSONable {

  /**
   * Returns the next value
   *
   * @return The next value
   */
  public T next();
}
