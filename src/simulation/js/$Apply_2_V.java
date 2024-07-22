package simulation.js;

/**
 * The simulation of a functional interface with TWO parameters and V return
 * value
 *
 * @param <T>
 * @param <S>
 * @param <V> the return type
 * @author gianpiero.diblasi
 */
@FunctionalInterface
public interface $Apply_2_V<T, S, V> {

  V $apply(T elementT, S elementS);
}
