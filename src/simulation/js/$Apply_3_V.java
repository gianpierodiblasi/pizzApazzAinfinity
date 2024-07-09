package simulation.js;

/**
 * The simulation of a functional interface with THREE parameters and V return
 * value
 *
 * @param <T>
 * @param <S>
 * @param <U>
 * @param <V> the return type
 * @author gianpiero.diblasi
 */
@FunctionalInterface
public interface $Apply_3_V<T, S, U, V> {

  V $apply(T elementT, S elementS, U elementU);
}
