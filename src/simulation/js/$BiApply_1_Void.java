package simulation.js;

/**
 * The simulation of a bifunctional interface with ONE parameter and VOID return
 * value
 *
 * @param <A>
 * @param <B>
 * @param <T>
 * @param <U>
 * @author gianpiero.diblasi
 */
@FunctionalInterface
public interface $BiApply_1_Void<A, B, T extends $Apply_1_Void<A>, U extends $Apply_1_Void<B>> {

  public void $apply(T resolve, U reject);
}
