/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
class Z4ToolComposerUI extends Z4AbstractComponentUI {

   stamperUI = new Z4StamperUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   tracerUI = new Z4TracerUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   spirographUI = new Z4SpirographUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   shape2DPainterUI = new Z4Shape2DPainterUI().appendToElement(this.querySelector(".tool-composer-container-painter"));

   gradientColorUI = new Z4GradientColorUI().setGradientColorLabel("COLOR", true, true).setVertical().appendToElement(this.querySelector(".tool-composer-container-gradient-color"));

   pointIterator = null;

   painter = null;

   gradientColor = null;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  constructor() {
    super(Z4ToolComposerUI.UI);
    this.configTabs();
    this.configPointIterators();
    this.configPointPainters();
    this.pointIterator = this.stamperUI.getValue();
    this.painter = this.shape2DPainterUI.getValue();
    this.gradientColor = this.gradientColorUI.getValue();
    this.setPointIteratorUI(this.stamperUI);
    this.setPointIteratorUI(this.tracerUI);
    this.setPointIteratorUI(this.spirographUI);
    this.setPainterUI(this.shape2DPainterUI);
    this.gradientColorUI.oninput = (v) => {
      this.gradientColor = v;
      this.stamperUI.setGradientColor(v);
      this.tracerUI.setGradientColor(v);
      this.spirographUI.setGradientColor(v);
      this.shape2DPainterUI.setGradientColor(v);
    };
    this.gradientColorUI.onchange = (v) => {
      this.gradientColor = v;
      this.stamperUI.setGradientColor(v);
      this.tracerUI.setGradientColor(v);
      this.spirographUI.setGradientColor(v);
      this.shape2DPainterUI.setGradientColor(v);
    };
  }

   configTabs() {
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
        this.querySelector(".tool-composer-container-point-iterator").style.display = "none";
        this.querySelector(".tool-composer-container-painter").style.display = "none";
        this.querySelector(".tool-composer-container-try-me").style.display = "none";
        switch(anchor.getAttribute("data-value")) {
          case "stamper":
          case "tracer":
          case "spirograph":
            this.querySelector(".tool-composer-container-point-iterator").style.display = "flex";
            this.querySelector(".tool-composer-container-gradient-color").style.display = "block";
            break;
          case "shape2d":
            this.querySelector(".tool-composer-container-painter").style.display = "flex";
            this.querySelector(".tool-composer-container-gradient-color").style.display = "block";
            break;
          case "tryme":
            this.querySelector(".tool-composer-container-try-me").style.display = "flex";
            this.querySelector(".tool-composer-container-gradient-color").style.display = "none";
            break;
        }
        return null;
      };
    }
    this.querySelector(".tool-composer-container-painter").style.display = "none";
    this.querySelector(".tool-composer-container-try-me").style.display = "none";
  }

   configPointIterators() {
    let imgs = this.querySelectorAll(".tool-composer-btn-group-point-iterator img[data-type='tool-composer-tab-point-iterator']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let name = this.getUniqueName();
    let inputs = this.querySelectorAll(".tool-composer-btn-group-point-iterator input[data-type='tool-composer-tab-point-iterator']");
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      let id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);
      input.onclick = (event) => {
        let dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";
        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");
        switch(dataValue) {
          case "stamper":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "block";
            this.pointIterator = this.stamperUI.getValue();
            break;
          case "tracer":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "block";
            this.pointIterator = this.tracerUI.getValue();
            break;
          case "spirograph":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "block";
            this.pointIterator = this.spirographUI.getValue();
            break;
        }
        this.shape2DPainterUI.setPointIterator(this.pointIterator);
        return null;
      };
    }
    this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
    this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";
  }

   configPointPainters() {
    let imgs = this.querySelectorAll(".tool-composer-btn-group-painter img[data-type='tool-composer-tab-painter']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let name = this.getUniqueName();
    let inputs = this.querySelectorAll(".tool-composer-btn-group-painter input[data-type='tool-composer-tab-painter']");
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      let id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);
      input.onclick = (event) => {
        let dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");
        switch(dataValue) {
          case "shape2d":
            this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "block";
            this.painter = this.shape2DPainterUI.getValue();
            break;
        }
        this.stamperUI.setPainter(this.painter);
        this.tracerUI.setPainter(this.painter);
        this.spirographUI.setPainter(this.painter);
        return null;
      };
    }
  }

   setPointIteratorUI(pointIteratorUI) {
    pointIteratorUI.setPainter(this.painter);
    pointIteratorUI.setGradientColor(this.gradientColor);
    pointIteratorUI.oninput = (v) => {
      this.pointIterator = v;
      this.shape2DPainterUI.setPointIterator(v);
    };
    pointIteratorUI.onchange = (v) => {
      this.pointIterator = v;
      this.shape2DPainterUI.setPointIterator(v);
    };
  }

   setPainterUI(painterUI) {
    painterUI.setPointIterator(this.pointIterator);
    painterUI.setGradientColor(this.gradientColor);
    painterUI.oninput = (v) => {
      this.painter = v;
      this.stamperUI.setPainter(v);
      this.tracerUI.setPainter(v);
      this.spirographUI.setPainter(v);
    };
    painterUI.onchange = (v) => {
      this.painter = v;
      this.stamperUI.setPainter(v);
      this.tracerUI.setPainter(v);
      this.spirographUI.setPainter(v);
    };
  }

   dispose() {
    this.stamperUI.dispose();
    this.tracerUI.dispose();
    this.spirographUI.dispose();
    this.shape2DPainterUI.dispose();
  }
}
