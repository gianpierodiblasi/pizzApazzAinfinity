package giada.pizzapazza.ui;

import def.dom.Element;
import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.setting.Z4HTMLFactory;

/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
public class Z4ToolComposerUI extends Z4AbstractComponentUI {
  
  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  public Z4ToolComposerUI() {
    super(Z4ToolComposerUI.UI);
    
    NodeList imgs = this.querySelectorAll(".tool-composer-nav img[data-type='tool-composer-tab']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    
    NodeList anchors = this.querySelectorAll(".tool-composer-nav a[data-type='tool-composer-tab']");
    for (int i = 0; i < anchors.length; i++) {
      HTMLElement anchor = (HTMLElement) anchors.item(i);
      anchor.onclick = (event) -> {
        for (int j = 0; j < anchors.length; j++) {
          ((Element) anchors.item(j)).classList.remove("active");
        }
        anchor.classList.add("active");
        return null;
      };
    }
  }
  
  @Override
  public void dispose() {
  }
}
