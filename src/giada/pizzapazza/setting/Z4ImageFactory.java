package giada.pizzapazza.setting;

import def.dom.XMLHttpRequest;
import def.js.Array;
import giada.pizzapazza.Z4Loader;
import simulation.dom.$Image;
import static simulation.js.$Globals.$exists;
import simulation.js.$String;

/**
 * The message factory
 *
 * @author gianpiero.di.blasi
 */
public class Z4ImageFactory {

  private final static Array<$Image> IMAGES = Z4ImageFactory.initImages();

  /**
   * Returns an image
   *
   * @param key The image key
   * @return The image value
   */
  public static $Image get(String key) {
    return Z4ImageFactory.IMAGES.$get(key);
  }

  private static Array<$Image> initImages() {
    Array<$Image> array = new Array<>();
    String path = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
    String file = Z4Loader.allFiles
            ? "image_list.properties?random=" + Math.random()
            : "image_list-" + Z4Loader.version + ".properties";

    XMLHttpRequest client = new XMLHttpRequest();
    client.open("GET", Z4Loader.UP + path + file, false);
    client.send();
    Z4ImageFactory.readImages(path, array, new $String(client.responseText).split("\n"));

    return array;
  }

  private static void readImages(String path, Array<$Image> array, Array<def.js.String> images) {
    images.forEach(row -> {
      if ($exists(row) && !row.startsWith("#")) {
        Array<def.js.String> keyValue = row.split("=");
        $Image image = new $Image();
        image.onload = (event) -> Z4ImageFactory.readImages(path, array, images.slice(1));
        image.src = path + keyValue.$get(1).trim();

        array.$set(keyValue.$get(0).trim(), image);
      }
    });
  }

  private Z4ImageFactory() {
  }
}
