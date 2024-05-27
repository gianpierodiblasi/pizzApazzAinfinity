/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
class Z4Translations {

  static  CURRENT_LANGUAGE = null;

  // Ribbon File
  static  FILE = "";

  static  NEW_PROJECT = "";

  static  CREATE = "";

  static  FROM_CLIPBOARD = "";

  static  FROM_FILE = "";

  static  OPEN = "";

  static  OPEN_PROJECT = "";

  static  SAVE = "";

  static  SAVE_PROJECT = "";

  static  EXPORT = "";

  static  PROJECT_NOT_SAVED_MESSAGE = "";

  // Ribbon Layer
  static  LAYER = "";

  static  LAYER_NAME = "";

  static  NEW_LAYER = "";

  static  BACKGROUND_LAYER = "";

  static  DELETE_LAYER_MESSAGE = "";

  // Ribbon Settings
  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

  static  THEME_COLOR = "";

  static  REFRESH_PAGE_MESSAGE = "";

  // Ribbon Help
  static  HELP = "";

  static  ABOUT = "";

  static  BASED_ON = "";

  static  INSTALL = "";

  static  CHECK_UPDATE = "";

  // Other
  static  PROJECT_NAME = "";

  static  FILENAME = "";

  static  QUALITY = "";

  static  RESET = "";

  static  WIDTH = "";

  static  HEIGHT = "";

  static  RESOLUTION = "";

  static  PATTERN = "";

  static  EDIT = "";

  static  FIT = "";

  static  OFFSET_X = "";

  static  OFFSET_Y = "";

  static  BASIC = "";

  static  ADVANCED = "";

  static  STAR = "";

  static  VERTICES = "";

  static  REGULAR = "";

  static  DIMENSION = "";

  static  FREE = "";

  static  LOCK_RATIO = "";

  static  LOCK = "";

  static  RIPPLE = "";

  static  DELETE = "";

  static  SPACE = "";

  static  TIME = "";

  static  FILLING = "";

  // Color
  static  COLOR = "";

  static  FILLING_COLOR = "";

  static  BACKGROUND_COLOR = "";

  static  MIRRORED = "";

  static  INVERTED = "";

  static  DELETE_COLOR_MESSAGE = "";

  // Composite Operation
  static  COMPOSITE_OPERATION = "";

  static  COMPOSITE_OPERATION_SOURCE_OVER = "";

  static  COMPOSITE_OPERATION_SOURCE_IN = "";

  static  COMPOSITE_OPERATION_SOURCE_OUT = "";

  static  COMPOSITE_OPERATION_SOURCE_ATOP = "";

  static  COMPOSITE_OPERATION_DESTINATION_OVER = "";

  static  COMPOSITE_OPERATION_DESTINATION_IN = "";

  static  COMPOSITE_OPERATION_DESTINATION_OUT = "";

  static  COMPOSITE_OPERATION_DESTINATION_ATOP = "";

  static  COMPOSITE_OPERATION_LIGHTER = "";

  static  COMPOSITE_OPERATION_COPY = "";

  static  COMPOSITE_OPERATION_XOR = "";

  static  COMPOSITE_OPERATION_MULTIPLY = "";

  static  COMPOSITE_OPERATION_SCREEN = "";

  static  COMPOSITE_OPERATION_OVERLAY = "";

  static  COMPOSITE_OPERATION_DARKEN = "";

  static  COMPOSITE_OPERATION_LIGHTEN = "";

  static  COMPOSITE_OPERATION_COLOR_DODGE = "";

  static  COMPOSITE_OPERATION_COLOR_BURN = "";

  static  COMPOSITE_OPERATION_HARD_LIGHT = "";

  static  COMPOSITE_OPERATION_SOFT_LIGHT = "";

  static  COMPOSITE_OPERATION_DIFFERENCE = "";

  static  COMPOSITE_OPERATION_EXCLUSION = "";

  static  COMPOSITE_OPERATION_HUE = "";

  static  COMPOSITE_OPERATION_SATURATION = "";

  static  COMPOSITE_OPERATION_COLOR = "";

  static  COMPOSITE_OPERATION_LUMINOSITY = "";

  static {
    switch(navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  constructor() {
  }
  /**
   * Sets the English language
   */
  static  setEnglish() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW_PROJECT = "New Project";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.EXPORT = "Export";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Project not saved, do you want to save your changes?";
    // Ribbon Layer
    Z4Translations.LAYER = "Layer";
    Z4Translations.LAYER_NAME = "Layer Name";
    Z4Translations.NEW_LAYER = "New Layer";
    Z4Translations.BACKGROUND_LAYER = "Bkgrd";
    Z4Translations.DELETE_LAYER_MESSAGE = "Do you really want to delete the layer?";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.THEME_COLOR = "Color";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
    // Ribbon Help
    Z4Translations.HELP = "Help";
    Z4Translations.ABOUT = "About";
    Z4Translations.BASED_ON = "<p>pizzApazzA<sup>&#8734;</sup> Version $version$ is based on pizzApazzA VB6 by Ettore Luzio and is licensed under <a href='https://unlicense.org/'>Unlicense license</a>.</p>" + "<p>Developed in Java by Gianpiero Di Blasi, transpilled in JavaScript by means of <a href='https://github.com/gianpierodiblasi/josetta' target='_blank'>Josetta</a> (<a href='https://github.com/gianpierodiblasi/pizzApazzAinfinity' target='_blank'>github repository</a>).</p>" + "<p>Dependencies: " + "<a href='https://repository.jsweet.org/artifactory/libs-release-local/org/jsweet/jsweet-core/' target='_blank'>jsweet-core</a>, " + "<a href='https://github.com/gianpierodiblasi/swing.js' target='_blank'>swing.js</a>, " + "<a href='https://pomax.github.io/bezierjs/' target='_blank'>Bezier.js</a>, " + "<a href='https://stuk.github.io/jszip/' target='_blank'>JSZip</a>." + "</p>";
    Z4Translations.INSTALL = "Install pizzApazzAinfinity";
    Z4Translations.CHECK_UPDATE = "Check for Updates";
    // Other
    Z4Translations.PROJECT_NAME = "Project Name";
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";
    Z4Translations.RESET = "Reset";
    Z4Translations.WIDTH = "Width";
    Z4Translations.HEIGHT = "Height";
    Z4Translations.RESOLUTION = "Resolution";
    Z4Translations.PATTERN = "Pattern";
    Z4Translations.EDIT = "Edit";
    Z4Translations.FIT = "Fit";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Basic";
    Z4Translations.ADVANCED = "Advanced";
    Z4Translations.STAR = "Star";
    Z4Translations.VERTICES = "Vertices";
    Z4Translations.REGULAR = "Regular";
    Z4Translations.DIMENSION = "Dimension";
    Z4Translations.FREE = "Free";
    Z4Translations.LOCK_RATIO = "Lock Ratio";
    Z4Translations.LOCK = "Lock";
    Z4Translations.RIPPLE = "Ripple";
    Z4Translations.DELETE = "Delete";
    Z4Translations.SPACE = "Space \u2192";
    Z4Translations.TIME = "\u2190 Time";
    Z4Translations.FILLING = "Filling";
    // Color
    Z4Translations.COLOR = "Color";
    Z4Translations.FILLING_COLOR = "Filling Color";
    Z4Translations.BACKGROUND_COLOR = "Background Color";
    Z4Translations.MIRRORED = "Mirrored";
    Z4Translations.INVERTED = "Inverted";
    Z4Translations.DELETE_COLOR_MESSAGE = "Do you really want to delete the color?";
    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Composite Operation";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "This is the default setting and draws the layer on top of the existing content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "The layer is drawn only where both the layer and the destination content overlap; everything else is made transparent";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "The layer is drawn where it doesn't overlap the existing content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "The layer is only drawn where it overlaps the existing content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "The layer is drawn behind the existing content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "The existing content is kept where both the layer and existing content overlap; everything else is made transparent";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "The existing content is kept where it doesn't overlap the layer";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "The existing content is only kept where it overlaps the layer; the layer is drawn behind the content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "Where both layer and existing content overlap the color is determined by adding color values";
    Z4Translations.COMPOSITE_OPERATION_COPY = "Only the layer is shown";
    Z4Translations.COMPOSITE_OPERATION_XOR = "Layer and existing content are made transparent where both overlap and drawn normal everywhere else";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "The pixels of the layer are multiplied with the corresponding pixel of the existing content; a darker picture is the result";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "The pixels are inverted, multiplied, and inverted again; a lighter picture is the result (opposite of 'multiply')";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "A combination of 'multiply' and 'screen'; dark parts on the existing content become darker, and light parts become lighter";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "Retains the darkest pixels of both layer and existing content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "Retains the lightest pixels of both layer and existing content";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "Divides the existing content by the inverted layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "Divides the inverted existing content by the layer, and then inverts the result";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "A combination of 'multiply' and 'screen' like 'overlay', but with layer and existing content swapped";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "A softer version of 'hard-light'; pure black or white does not result in pure black or white";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "Subtracts the existing content from the layer or the other way round to always get a positive value";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "Like 'difference', but with lower contrast";
    Z4Translations.COMPOSITE_OPERATION_HUE = "Preserves the luma and chroma of the existing content, while adopting the hue of the layer";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "Preserves the luma and hue of the existing content, while adopting the chroma of the layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "Preserves the luma of the existing content, while adopting the hue and chroma of the layer";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "Preserves the hue and chroma of the existing content, while adopting the luma of the layer";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW_PROJECT = "Nuovo Progetto";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.EXPORT = "Esporta";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Progetto non salvato, vuoi salvare le modifiche?";
    // Ribbon Layer
    Z4Translations.LAYER = "Livello";
    Z4Translations.LAYER_NAME = "Nome Livello";
    Z4Translations.NEW_LAYER = "Nuovo Livello";
    Z4Translations.BACKGROUND_LAYER = "Sfondo";
    Z4Translations.DELETE_LAYER_MESSAGE = "Vuoi davvero eliminare il livello?";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.THEME_COLOR = "Colore";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    // Ribbon Help
    Z4Translations.HELP = "Aiuto";
    Z4Translations.ABOUT = "Informazioni su";
    Z4Translations.BASED_ON = "<p>pizzApazzA<sup>&#8734;</sup> Versione $version$ \u00E8 basato su pizzApazzA VB6 di Ettore Luzio ed \u00E8 distribuito con <a href='https://unlicense.org/' target='_blank'>licenza Unlicense</a>.</p>" + "<p>Sviluppato in Java da Gianpiero Di Blasi, tradotto in JavaScript tramite <a href='https://github.com/gianpierodiblasi/josetta' target='_blank'>Josetta</a> (<a href='https://github.com/gianpierodiblasi/pizzApazzAinfinity' target='_blank'>repository github</a>).</p>" + "<p>Dipendenze: " + "<a href='https://repository.jsweet.org/artifactory/libs-release-local/org/jsweet/jsweet-core/' target='_blank'>jsweet-core</a>, " + "<a href='https://github.com/gianpierodiblasi/swing.js' target='_blank'>swing.js</a>, " + "<a href='https://pomax.github.io/bezierjs/' target='_blank'>Bezier.js</a>, " + "<a href='https://stuk.github.io/jszip/' target='_blank'>JSZip.</a>" + "</p>";
    Z4Translations.INSTALL = "Installa pizzApazzAinfinity";
    Z4Translations.CHECK_UPDATE = "Controlla gli Aggiornamenti";
    // Other
    Z4Translations.PROJECT_NAME = "Nome Progetto";
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";
    Z4Translations.RESET = "Ripristina";
    Z4Translations.WIDTH = "Larghezza";
    Z4Translations.HEIGHT = "Altezza";
    Z4Translations.RESOLUTION = "Risoluzione";
    Z4Translations.PATTERN = "Trama";
    Z4Translations.EDIT = "Modifica";
    Z4Translations.FIT = "Adatta";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Base";
    Z4Translations.ADVANCED = "Avanzato";
    Z4Translations.STAR = "Stella";
    Z4Translations.VERTICES = "Vertici";
    Z4Translations.REGULAR = "Regolare";
    Z4Translations.DIMENSION = "Dimensione";
    Z4Translations.FREE = "Libero";
    Z4Translations.LOCK_RATIO = "Blocca Rapporto";
    Z4Translations.LOCK = "Blocca";
    Z4Translations.RIPPLE = "Caoticit\u00E0";
    Z4Translations.DELETE = "Elimina";
    Z4Translations.SPACE = "Spazio \u2192";
    Z4Translations.TIME = "\u2190 Tempo";
    Z4Translations.FILLING = "Riempimento";
    // Color
    Z4Translations.COLOR = "Colore";
    Z4Translations.FILLING_COLOR = "Colore di Riempimento";
    Z4Translations.BACKGROUND_COLOR = "Colore di Sfondo";
    Z4Translations.MIRRORED = "Riflesso";
    Z4Translations.INVERTED = "Invertito";
    Z4Translations.DELETE_COLOR_MESSAGE = "Vuoi davvero eliminare il colore?";
    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Operazione Composita";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "Questa \u00E8 l'impostazione predefinita e disegna il livello sopra il contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "Il livello viene disegnato solo dove si sovrappongono sia il livello che il contenuto di destinazione; tutto il resto \u00E8 reso trasparente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "Il livello viene disegnato dove non si sovrappone al contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "Il livello viene disegnato solo dove si sovrappone al contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "Il livello viene disegnato dietro il contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "Il contenuto esistente viene mantenuto dove sia il livello che il contenuto esistente si sovrappongono; tutto il resto \u00E8 reso trasparente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "Il contenuto esistente viene mantenuto dove non si sovrappone al livello";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "Il contenuto esistente viene mantenuto solo dove si sovrappone al livello; il livello viene disegnato dietro il contenuto";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "Laddove sia il livello che il contenuto esistente si sovrappongono, il colore viene determinato sommando i colori";
    Z4Translations.COMPOSITE_OPERATION_COPY = "Viene mostrato solo il livello";
    Z4Translations.COMPOSITE_OPERATION_XOR = "Il livello e il contenuto esistente vengono resi trasparenti laddove entrambi si sovrappongono e vengono disegnati normali altrove";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "I pixel del layer vengono moltiplicati per il pixel corrispondente del contenuto esistente; il risultato \u00E8 un'immagine pi\u00F9 scura";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "I pixel vengono invertiti, moltiplicati e nuovamente invertiti; il risultato \u00E8 un'immagine pi\u00F9 chiara (opposto di 'multiply')";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "Una combinazione di 'multiply' e 'screen'; le parti scure del contenuto esistente diventano pi\u00F9 scure e le parti chiare diventano pi\u00F9 chiare";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "Mantiene i pixel pi\u00F9 scuri sia del livello che del contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "Mantiene i pixel pi\u00F9 chiari sia del livello che del contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "Divide il contenuto esistente per il livello invertito";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "Divide il contenuto esistente invertito per il livello, quindi inverte il risultato";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "Una combinazione di 'multiply' e 'screen' come 'overlay', ma con il livello e il contenuto esistente scambiati";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "Una versione pi\u00F9 morbida della 'hard-light'; il nero o il bianco puro non risultano in bianco o nero puro";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "Sottrae il contenuto esistente dal livello o viceversa per ottenere sempre un valore positivo";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "Come 'difference', ma con contrasto inferiore";
    Z4Translations.COMPOSITE_OPERATION_HUE = "Preserva la luminanza e la crominanza del contenuto esistente, adottando la tonalit\u00E0 del livello";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "Preserva la luminanza e la tonalit\u00E0 del contenuto esistente, adottando la crominanza del livello";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "Preserva la luminanza del contenuto esistente, adottando la tonalit\u00E0 e la saturazione del livello";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "Preserva la tonalit\u00E0 e il croma del contenuto esistente, adottando la luminanza del livello";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
