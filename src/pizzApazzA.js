/* global Translations, Z4Translations, SwingJS, LaunchParams, launchQueue */

window.onload = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }

  window.addEventListener("wheel", event => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, {passive: false});

  window.addEventListener("keydown", event => {
    if (event.ctrlKey && (event.key === "+" || event.key === "-")) {
      event.preventDefault();
      document.querySelector(".z4canvas").dispatchEvent(new event.constructor(event.type, event));
    }
  });

  switch (localStorage.getItem("z4language")) {
    case "en":
      Translations.setEnglish();
      Z4Translations.setEnglish();
      break;
    case "it":
      Translations.setItalian();
      Z4Translations.setItalian();
      break;
  }

  switch (localStorage.getItem("z4theme")) {
    case "light":
      break;
    case "dark":
      SwingJS.instance().darkMode(true).build();
      break;
    case "auto":
    default:
      SwingJS.instance().darkMode(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches).build();
      break;
  }

  let color = localStorage.getItem("z4color");
  if (color) {
    SwingJS.instance().mainActionBGColor(color).build();
  }

  SwingJS.instance().fontSize(12).build();

  var frame = new Z4Frame();

  if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
    launchQueue.setConsumer(launchParams => {
      if (launchParams.files[0]) {
        launchParams.files[0].getFile().then(file => {
          if (file.name.toLowerCase().endsWith(".z4i")) {
            frame.canvas.openProject(file);
          } else {
            frame.canvas.createFromFile(file);
          }
        });
      }
    });
  }
};
