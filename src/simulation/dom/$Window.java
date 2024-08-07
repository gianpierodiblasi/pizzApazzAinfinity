package simulation.dom;

import def.dom.Window;
import def.js.Array;
import def.js.Promise;
import javascript.util.fsa.FilePickerOptions;
import javascript.util.fsa.FileSystemFileHandle;
import simulation.js.$FontData;

/**
 * The simulation of the Window object
 *
 * @author gianpiero.diblasi
 */
public class $Window extends Window {

  public String matchMedia;

  public native $MediaQueryList $matchMedia(String string);

  public Promise<Array<FileSystemFileHandle>> showOpenFilePicker(FilePickerOptions options) {
    return null;
  }

  public Promise<FileSystemFileHandle> showSaveFilePicker(FilePickerOptions options) {
    return null;
  }

  public Promise<Array<$FontData>> queryLocalFonts() {
    return null;
  }
}
