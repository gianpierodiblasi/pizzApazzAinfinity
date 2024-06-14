package pizzapazza.math;

import pizzapazza.util.Z4JSONable;

/**
 * The common interface for objects able to provide a "next" value by means of
 * two parameters
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 * @param <S> The first parameter type
 * @param <V> The second parameter type
 */
public interface Z4NextableWithTwoParams<T, S, V> extends Z4JSONable {

  /**
   * Returns the next value
   *
   * @param param1 The first parameter
   * @param param2 The second parameter
   * @return The next value
   */
  public T next(S param1, V param2);
}
