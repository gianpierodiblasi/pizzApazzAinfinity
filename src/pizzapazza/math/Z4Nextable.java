package pizzapazza.math;

/**
 * The common interface for objects able to provide a "next" value
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 */
public interface Z4Nextable<T> {

  /**
   * Returns the next value
   *
   * @return The next velu
   */
  public T next();
}
