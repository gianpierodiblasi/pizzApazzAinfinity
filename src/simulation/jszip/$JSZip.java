package simulation.jszip;

import def.js.Promise;
import simulation.js.$Object;

/**
 * Ths simulation of JSZip https://stuk.github.io/jszip/
 *
 * @author gianpiero.diblasi
 */
public class $JSZip {

  public $JSZip() {
  }

  public $JSZip file(String name, Object content, $Object options) {
    return this;
  }

  public $JSZip folder(String name) {
    return this;
  }
  
  public Promise<?> generateAsync($Object options) {
    return null;
  }
}
