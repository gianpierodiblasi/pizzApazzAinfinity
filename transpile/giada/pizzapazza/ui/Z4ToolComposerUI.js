/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
class Z4ToolComposerUI extends Z4AbstractComponentUI {

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  constructor() {
    super(Z4ToolComposerUI.UI);
    let imgs = this.querySelectorAll(".tool-composer-nav img[data-type='tool-composer-tab']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let anchors = this.querySelectorAll(".tool-composer-nav a[data-type='tool-composer-tab']");
    for (let i = 0; i < anchors.length; i++) {
      let anchor = anchors.item(i);
      anchor.onclick = (event) => {
        for (let j = 0; j < anchors.length; j++) {
          (anchors.item(j)).classList.remove("active");
        }
        anchor.classList.add("active");
        return null;
      };
    }
  }

   dispose() {
  }
}
