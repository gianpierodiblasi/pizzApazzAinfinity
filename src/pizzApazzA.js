/* global Translations, Z4Translations, SwingJS, LaunchParams, launchQueue */

window.onload = () => {
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

  if ("serviceWorker" in navigator) {
    let newWorker, refreshing;

    navigator.serviceWorker.register('service-worker.js').then(reg => {
      reg.onupdatefound = () => {
        newWorker = reg.installing;

        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            document.querySelector(".z4ribbonhelppanel .z4check-update").style.display = "flex";
            document.querySelector(".z4ribbonhelppanel .z4check-update").onclick = () => newWorker.postMessage({action: 'skipWaiting'});
          }
        };
      };
    });

    navigator.serviceWorker.oncontrollerchange = () => {
      if (!refreshing) {
        caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        window.location.reload();
        refreshing = true;
      }
    };

    window.addEventListener('beforeinstallprompt', event => {
      document.querySelector(".z4ribbonhelppanel .z4check-install").style.display = "flex";
      document.querySelector(".z4ribbonhelppanel .z4check-install").onclick = () => event.prompt();
    });

    window.addEventListener('appinstalled', () => {
      document.querySelector(".z4ribbonhelppanel .z4check-install").style.display = "none";
    });

    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      document.head.title = "";
    }
  }
};
