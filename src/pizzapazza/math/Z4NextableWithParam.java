package pizzapazza.math;

import pizzapazza.Z4JSONable;

/**
 * The common interface for objects able to provide a "next" value by means of a
 * parameter
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 * @param <S> The parameter type
 */
public interface Z4NextableWithParam<T, S> extends Z4JSONable {

  /**
   * Returns the next value
   *
   * @param param The parameter
   * @return The next value
   */
  public T next(S param);
}
