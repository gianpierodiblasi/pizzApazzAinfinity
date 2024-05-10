window.onload=t=>{switch(localStorage.getItem("z4language")){case"en":Translations.setEnglish(),Z4Translations.setEnglish();break;case"it":Translations.setItalian(),Z4Translations.setItalian()}switch(localStorage.getItem("z4theme")){case"light":break;case"dark":SwingJS.instance().darkMode(!0).build();break;default:SwingJS.instance().darkMode(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches).build()}let e=localStorage.getItem("z4color");e&&SwingJS.instance().mainActionBGColor(e).build(),new Z4Frame};class Z4ColorPreview extends JSComponent{component=new JSComponent(document.createElement("div"));componentOpacity=new JSComponent(document.createElement("div"));constructor(){super(document.createElement("div")),this.cssAddClass("z4colorpreview"),this.component.cssAddClass("z4colorpreview-opaque"),this.appendChild(this.component),this.componentOpacity.cssAddClass("z4colorpreview-transparent"),this.appendChild(this.componentOpacity),this.setColor(new Color(0,0,0,255))}setColor(t){this.component.getStyle().backgroundColor=t.getRGB_String(),this.componentOpacity.getStyle().backgroundColor=t.getRGBA_String();let e=[],s=[];e[0]=t.red,e[1]=t.green,e[2]=t.blue,Color.RGBtoHSL(e,s),this.getStyle().border="1px solid "+(s[2]>.5?t.darkened(.1).getRGB_HEX():t.lighted(.1).getRGB_HEX())}}class Z4Frame extends JSFrame{ribbon=new Z4Ribbon;canvas=new Z4Canvas;constructor(){super(),this.cssAddClass("z4frame"),this.getContentPane().setLayout(new BorderLayout(5,5)),this.ribbon.setCanvas(this.canvas),this.getContentPane().add(this.ribbon,BorderLayout.NORTH),this.getContentPane().add(this.canvas,BorderLayout.CENTER)}}class Z4RibbonFilePanel extends JSPanel{canvas=null;constructor(){super(),this.setLayout(new GridBagLayout),this.cssAddClass("z4ribbonfilepanel"),this.addLabel(Z4Translations.NEW_PROJECT,0,3),this.addButton(Z4Translations.CREATE,!0,0,1,"left",t=>this.createFromColor()),this.addButton(Z4Translations.FROM_CLIPBOARD,"function"==typeof navigator.clipboard.read,1,1,"both",t=>this.createFromClipboard()),this.addButton(Z4Translations.FROM_FILE,!0,2,1,"right",t=>this.createFromFile()),this.addVLine(3,0),this.addLabel(Z4Translations.OPEN,4,1),this.addButton(Z4Translations.OPEN_PROJECT,!0,4,1,"",null),this.addVLine(5,0),this.addLabel(Z4Translations.SAVE,6,2),this.addButton(Z4Translations.SAVE_PROJECT,!0,6,1,"left",null),this.addButton(Z4Translations.EXPORT,!0,7,1,"right",t=>this.exportToFile()),this.addVLine(8,1)}setCanvas(t){this.canvas=t}addLabel(t,e,s){let a=new JSLabel;a.setText(t);let i=new GridBagConstraints;i.gridx=e,i.gridy=0,i.gridwidth=s,i.anchor=GridBagConstraints.WEST,i.insets=new Insets(5,5,2,0),this.add(a,i)}addButton(t,e,s,a,i,n){let r=new JSButton;r.setText(t),r.setEnabled(e),r.setContentAreaFilled(!1),r.addActionListener(n);let l=new GridBagConstraints;switch(l.gridx=s,l.gridy=a,i){case"left":l.insets=new Insets(0,5,0,0),r.getStyle().borderTopRightRadius="0px",r.getStyle().borderBottomRightRadius="0px",r.getStyle().borderRight="1px solid var(--main-action-bgcolor)";break;case"both":r.getStyle().borderRadius="0px",r.getStyle().borderLeft="1px solid var(--main-action-bgcolor)",r.getStyle().borderRight="1px solid var(--main-action-bgcolor)";break;case"right":l.insets=new Insets(0,0,0,5),r.getStyle().borderTopLeftRadius="0px",r.getStyle().borderBottomLeftRadius="0px",r.getStyle().borderLeft="1px solid var(--main-action-bgcolor)"}this.add(r,l)}addVLine(t,e){let s=new JSComponent(document.createElement("div"));s.getStyle().width="1px",s.getStyle().background="var(--main-action-bgcolor";let a=new GridBagConstraints;a.gridx=t,a.gridy=0,a.gridheight=2,a.fill=GridBagConstraints.VERTICAL,a.weightx=e,a.weighty=1,a.insets=new Insets(1,2,1,2),this.add(s,a)}createFromColor(){let t=new Z4NewImagePanel;JSOptionPane.showInputDialog(t,Z4Translations.CREATE,t=>{},()=>!0,e=>{if(e===JSOptionPane.OK_OPTION){let s=t.getSelectedSize();this.canvas.create(s.width,s.height,t.getSelectedColor())}})}createFromFile(){JSFileChooser.showOpenDialog(""+Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","),JSFileChooser.SINGLE_SELECTION,0,t=>t.forEach(t=>this.canvas.createFromFile(t)))}createFromClipboard(){this.canvas.createFromClipboard()}exportToFile(){let t=new Z4ExportToFilePanel;t.setFilename(this.canvas.getProjectName()),JSOptionPane.showInputDialog(t,Z4Translations.EXPORT,e=>t.addChangeListener(e),()=>t.isValid(),e=>{e===JSOptionPane.OK_OPTION&&this.canvas.exportToFile(t.getFilename(),t.getFileExtension(),t.getQuality())})}}class Z4RibbonLayerPanel extends JSPanel{canvas=null;constructor(){super(),this.setLayout(new GridBagLayout),this.cssAddClass("z4ribbonlayerpanel"),this.addLabel(Z4Translations.NEW_LAYER,0),this.addButton(Z4Translations.CREATE,!0,0,1,"left",t=>this.addFromColor()),this.addButton(Z4Translations.FROM_CLIPBOARD,"function"==typeof navigator.clipboard.read,1,1,"both",t=>this.addFromClipboard()),this.addButton(Z4Translations.FROM_FILE,!0,2,1,"right",t=>this.addFromFile()),this.addVLine(3,1)}setCanvas(t){this.canvas=t}addLabel(t,e){let s=new JSLabel;s.setText(t);let a=new GridBagConstraints;a.gridx=e,a.gridy=0,a.gridwidth=3,a.anchor=GridBagConstraints.WEST,a.insets=new Insets(5,5,2,0),this.add(s,a)}addButton(t,e,s,a,i,n){let r=new JSButton;r.setText(t),r.setEnabled(e),r.setContentAreaFilled(!1),r.addActionListener(n);let l=new GridBagConstraints;switch(l.gridx=s,l.gridy=a,i){case"left":l.insets=new Insets(0,5,0,0),r.getStyle().borderTopRightRadius="0px",r.getStyle().borderBottomRightRadius="0px",r.getStyle().borderRight="1px solid var(--main-action-bgcolor)";break;case"both":r.getStyle().borderRadius="0px",r.getStyle().borderLeft="1px solid var(--main-action-bgcolor)",r.getStyle().borderRight="1px solid var(--main-action-bgcolor)";break;case"right":l.insets=new Insets(0,0,0,5),r.getStyle().borderTopLeftRadius="0px",r.getStyle().borderBottomLeftRadius="0px",r.getStyle().borderLeft="1px solid var(--main-action-bgcolor)"}this.add(r,l)}addVLine(t,e){let s=new JSComponent(document.createElement("div"));s.getStyle().width="1px",s.getStyle().background="var(--main-action-bgcolor";let a=new GridBagConstraints;a.gridx=t,a.gridy=0,a.gridheight=2,a.fill=GridBagConstraints.VERTICAL,a.weightx=e,a.weighty=1,a.insets=new Insets(1,2,1,2),this.add(s,a)}addFromColor(){let t=new Z4NewImagePanel;JSOptionPane.showInputDialog(t,Z4Translations.CREATE,t=>{},()=>!0,e=>{if(e===JSOptionPane.OK_OPTION){let s=t.getSelectedSize();this.canvas.addLayer(s.width,s.height,t.getSelectedColor())}})}addFromFile(){JSFileChooser.showOpenDialog(""+Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","),JSFileChooser.SINGLE_SELECTION,0,t=>t.forEach(t=>this.canvas.addLayerFromFile(t)))}addFromClipboard(){this.canvas.addLayerFromClipboard()}}class Z4RibbonSettingsPanel extends JSPanel{language=new JSComboBox;theme=new JSComboBox;color=new JSColorChooser;constructor(){super(),this.setLayout(new GridBagLayout),this.cssAddClass("z4ribbonsettingspanel");let t=new JSLabel;t.setText(Z4Translations.LANGUAGE);let e=new GridBagConstraints;e.gridx=0,e.gridy=0,e.anchor=GridBagConstraints.WEST,e.insets=new Insets(5,5,2,0),this.add(t,e);let s=new DefaultKeyValueComboBoxModelAndRenderer;s.addElement(new KeyValue("en",Z4Translations.LANGUAGE_ENGLISH_NATIVE)),s.addElement(new KeyValue("it",Z4Translations.LANGUAGE_ITALIAN_NATIVE)),this.language.setModelAndRenderer(s),this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE),this.language.addActionListener(t=>this.onchangeLanguage()),(e=new GridBagConstraints).gridx=0,e.gridy=1,e.fill=GridBagConstraints.HORIZONTAL,e.insets=new Insets(0,5,0,5),this.add(this.language,e),(t=new JSLabel).setText(Z4Translations.THEME),(e=new GridBagConstraints).gridx=1,e.gridy=0,e.anchor=GridBagConstraints.WEST,e.insets=new Insets(5,5,2,0),this.add(t,e);let a=null;switch(localStorage.getItem("z4theme")){case"light":a=new KeyValue("light",Z4Translations.THEME_LIGHT);break;case"dark":a=new KeyValue("dark",Z4Translations.THEME_DARK);break;default:a=new KeyValue("auto",Z4Translations.THEME_AUTO)}let i=new DefaultKeyValueComboBoxModelAndRenderer;i.addElement(new KeyValue("auto",Z4Translations.THEME_AUTO)),i.addElement(new KeyValue("light",Z4Translations.THEME_LIGHT)),i.addElement(new KeyValue("dark",Z4Translations.THEME_DARK)),this.theme.setModelAndRenderer(i),this.theme.setSelectedItem(a),this.theme.addActionListener(t=>this.onchangeTheme()),(e=new GridBagConstraints).gridx=1,e.gridy=1,e.fill=GridBagConstraints.HORIZONTAL,e.insets=new Insets(0,5,0,5),this.add(this.theme,e),(t=new JSLabel).setText(Z4Translations.THEME_COLOR),(e=new GridBagConstraints).gridx=2,e.gridy=0,e.anchor=GridBagConstraints.WEST,e.insets=new Insets(5,5,2,0),this.add(t,e);let n=localStorage.getItem("z4color");this.color.setSelectedColor(Color.fromRGB_HEX(n||"#0d6efd")),this.color.setOpacityVisible(!1),this.color.addChangeListener(t=>this.onchangeColor()),(e=new GridBagConstraints).gridx=2,e.gridy=1,e.fill=GridBagConstraints.HORIZONTAL,e.insets=new Insets(0,5,0,5),this.add(this.color,e);let r=new JSButton;r.setText(Z4Translations.RESET),r.setContentAreaFilled(!1),r.addActionListener(t=>this.onreset()),(e=new GridBagConstraints).gridx=3,e.gridy=1,e.fill=GridBagConstraints.HORIZONTAL,e.insets=new Insets(0,5,0,5),this.add(r,e),t=new JSLabel,(e=new GridBagConstraints).gridx=4,e.gridy=0,e.fill=GridBagConstraints.BOTH,e.weightx=1,this.add(t,e)}onchangeLanguage(){localStorage.setItem("z4language",this.language.getSelectedItem().key),JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE,Z4Translations.LANGUAGE,JSOptionPane.INFORMATION_MESSAGE,null)}onchangeTheme(){localStorage.setItem("z4theme",this.theme.getSelectedItem().key),JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE,Z4Translations.THEME,JSOptionPane.INFORMATION_MESSAGE,null)}onchangeColor(){this.color.getValueIsAdjusting()||(localStorage.setItem("z4color",this.color.getSelectedColor().getRGB_HEX()),JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE,Z4Translations.THEME_COLOR,JSOptionPane.INFORMATION_MESSAGE,null))}onreset(){localStorage.removeItem("z4language"),localStorage.removeItem("z4theme"),localStorage.removeItem("z4color"),JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE,Z4Translations.RESET,JSOptionPane.INFORMATION_MESSAGE,null)}}class Z4ExportToFilePanel extends JSPanel{filename=new JSTextField;png=new JSRadioButton;jpg=new JSRadioButton;qualitySlider=new JSSlider;qualitySpinner=new JSSpinner;listeners=[];constructor(){super(),this.cssAddClass("z4exporttofilepanel"),this.setLayout(new GridBagLayout),this.addLabel(Z4Translations.FILENAME,0,0),this.filename.addActionListener(t=>this.onchange());let t=new GridBagConstraints;t.gridx=0,t.gridy=1,t.gridwidth=2,t.fill=GridBagConstraints.HORIZONTAL,t.weightx=1,this.add(this.filename,t);let e=new ButtonGroup;e.add(this.png),e.add(this.jpg),this.addRadio(this.png,!0,"PNG",0),this.addRadio(this.jpg,!1,"JPG",1),this.addLabel(Z4Translations.QUALITY,0,3),this.qualitySlider.setEnabled(!1),this.qualitySlider.setValue(100),this.qualitySlider.addChangeListener(t=>this.qualitySpinner.setValue(this.qualitySlider.getValue())),(t=new GridBagConstraints).gridx=0,t.gridy=4,t.gridwidth=2,t.fill=GridBagConstraints.HORIZONTAL,t.weightx=1,this.add(this.qualitySlider,t),this.qualitySpinner.setEnabled(!1),this.qualitySpinner.setModel(new SpinnerNumberModel(100,0,100,1)),this.qualitySpinner.addChangeListener(t=>this.qualitySlider.setValue(this.qualitySpinner.getValue())),this.qualitySpinner.getStyle().minWidth="3rem",this.qualitySpinner.getChilStyleByQuery("input[type=number]").minWidth="2.5rem",this.qualitySpinner.getChilStyleByQuery("input[type=number]").width="2.5rem",(t=new GridBagConstraints).gridx=1,t.gridy=3,t.anchor=GridBagConstraints.EAST,this.add(this.qualitySpinner,t)}addLabel(t,e,s){let a=new JSLabel;a.setText(t);let i=new GridBagConstraints;i.gridx=e,i.gridy=s,i.anchor=GridBagConstraints.WEST,this.add(a,i)}onchange(){let t=new ChangeEvent;this.listeners.forEach(e=>{"function"==typeof e?e(t):e.stateChanged(t)})}addRadio(t,e,s,a){t.setSelected(e),t.setText(s),t.addActionListener(t=>{this.qualitySlider.setEnabled(!e),this.qualitySpinner.setEnabled(!e)});let i=new GridBagConstraints;i.gridx=a,i.gridy=2,i.anchor=GridBagConstraints.WEST,this.add(t,i)}addChangeListener(t){this.listeners.push(t)}isValid(){return!!this.filename.getText()}setFilename(t){this.filename.setText(t)}getFilename(){return this.filename.getText()}getFileExtension(){return this.png.isSelected()?".png":".jpg"}getQuality(){return this.qualitySpinner.getValue()/100}}class Z4NewImagePanel extends JSPanel{width=new JSSpinner;height=new JSSpinner;resolution=new JSSpinner;dimensionMM=new JSLabel;dimensionIN=new JSLabel;colorPreview=new Z4ColorPreview;selectedColor=new Color(255,255,255,255);constructor(){super(),this.cssAddClass("z4newimagepanel"),this.setLayout(new GridBagLayout),this.addLabel(Z4Translations.WIDTH+" (px)",0,0,1,0),this.addSpinner(this.width,Z4Constants.DEFAULT_IMAGE_SIZE,Z4Constants.MAX_IMAGE_SIZE,0,1),this.addLabel(Z4Translations.HEIGHT+" (px)",1,0,1,0),this.addSpinner(this.height,Z4Constants.DEFAULT_IMAGE_SIZE,Z4Constants.MAX_IMAGE_SIZE,1,1),this.addLabel(Z4Translations.RESOLUTION+" (dpi)",2,0,1,0),this.addSpinner(this.resolution,Z4Constants.DEFAULT_DPI,Z4Constants.MAX_DPI,2,1),this.addDimension(this.dimensionMM,3),this.addDimension(this.dimensionIN,4),this.addLabel(Z4Translations.FILLING_COLOR,0,5,3,10),this.colorPreview.setColor(this.selectedColor);let t=new GridBagConstraints;t.gridx=0,t.gridy=6,t.gridwidth=2,t.fill=GridBagConstraints.HORIZONTAL,t.insets=new Insets(0,5,0,5),this.add(this.colorPreview,t);let e=new JSButton;e.setText(Z4Translations.EDIT),e.addActionListener(t=>{JSColorChooser.showDialog(Z4Translations.FILLING_COLOR,this.selectedColor,!0,null,t=>{this.selectedColor=t,this.colorPreview.setColor(t)})}),(t=new GridBagConstraints).gridx=2,t.gridy=6,t.gridwidth=1,t.anchor=GridBagConstraints.WEST,this.add(e,t),this.setDimensions()}addLabel(t,e,s,a,i){let n=new JSLabel;n.setText(t);let r=new GridBagConstraints;r.gridx=e,r.gridy=s,r.gridwidth=a,r.anchor=GridBagConstraints.WEST,r.insets=new Insets(i,5,0,5),this.add(n,r)}addSpinner(t,e,s,a,i){t.setModel(new SpinnerNumberModel(e,1,s,1)),t.getStyle().minWidth="6.6rem",t.getChilStyleByQuery("input[type=number]").minWidth="5.5rem",t.getChilStyleByQuery("input[type=number]").width="5.5rem",t.addChangeListener(t=>this.setDimensions());let n=new GridBagConstraints;n.gridx=a,n.gridy=i,n.anchor=GridBagConstraints.WEST,n.insets=new Insets(0,5,0,5),this.add(t,n)}addDimension(t,e){let s=new GridBagConstraints;s.gridy=e,s.gridwidth=3,s.fill=GridBagConstraints.HORIZONTAL,s.insets=new Insets(2,5,0,0),this.add(t,s)}setDimensions(){let t=this.width.getValue(),e=this.height.getValue(),s=this.resolution.getValue(),a=t/s,i=e/s;this.dimensionMM.setText(new Number(25.4*a).toFixed(2)+" ✖ "+new Number(25.4*i).toFixed(2)+" mm"),this.dimensionIN.setText(new Number(a).toFixed(2)+" ✖ "+new Number(i).toFixed(2)+" inch")}getSelectedSize(){return new Dimension(this.width.getValue(),this.height.getValue())}getSelectedColor(){return this.selectedColor}}class Z4Ribbon extends JSTabbedPane{filePanel=new Z4RibbonFilePanel;layerPanel=new Z4RibbonLayerPanel;settingsPanel=new Z4RibbonSettingsPanel;constructor(){super(),this.cssAddClass("z4ribbon"),this.addTab(Z4Translations.FILE,this.filePanel),this.addTab(Z4Translations.LAYER,this.layerPanel),this.addTab(Z4Translations.SETTINGS,this.settingsPanel)}setCanvas(t){this.filePanel.setCanvas(t),this.layerPanel.setCanvas(t)}}class Z4Canvas extends JSComponent{canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");chessboard=null;resizeObserver=new ResizeObserver(()=>this.drawCanvas());projectName=null;paper=new Z4Paper;constructor(){super(document.createElement("div")),this.cssAddClass("z4canvas"),this.resizeObserver.observe(this.canvas),this.canvas.width=Z4Constants.DEFAULT_IMAGE_SIZE,this.canvas.height=Z4Constants.DEFAULT_IMAGE_SIZE,this.appendNodeChild(this.canvas),this.addLayer(Z4Constants.DEFAULT_IMAGE_SIZE,Z4Constants.DEFAULT_IMAGE_SIZE,new Color(0,0,0,0));let t=document.createElement("img");t.onload=e=>(this.chessboard=this.ctx.createPattern(t,"repeat"),this.drawCanvas(),null),t.src="image/chessboard.png"}create(t,e,s){this.paper.reset(),this.paper.addLayer(t,e,s,t,e),this.afterCreate("",t,e),this.drawCanvas()}createFromFile(t){let e=new FileReader;e.onload=s=>this.createFromURL(t.name.substring(0,t.name.lastIndexOf(".")),e.result),e.readAsDataURL(t)}createFromClipboard(){navigator.clipboard.read().then(t=>{t.forEach(t=>{let e=t.types.find((t,e,s)=>t.startsWith("image/"));t.getType(e).then(t=>{this.createFromURL("",URL.createObjectURL(t))})})})}createFromURL(t,e){let s=document.createElement("img");return s.onload=e=>(this.paper.reset(),this.paper.addLayerFromImage(s,s.width,s.height),this.afterCreate(t,s.width,s.height),this.drawCanvas(),null),s.src=e,null}afterCreate(t,e,s){this.projectName=t,this.canvas.width=e,this.canvas.height=s}exportToFile(t,e,s){let a=new OffscreenCanvas(this.canvas.width,this.canvas.height),i=a.getContext("2d");this.paper.draw(i);let n={};n.type=".png"===e?"image/png":"image/jpeg",n.quality=s,a.convertToBlob(n).then(s=>{let a=document.createElement("a");a.setAttribute("href",URL.createObjectURL(s)),a.setAttribute("download",t+e),document.body.appendChild(a);let i=document.createEvent("MouseEvents");i.initEvent("click",!1,!1),a.dispatchEvent(i),document.body.removeChild(a)})}addLayer(t,e,s){this.paper.addLayer(t,e,s,this.canvas.width,this.canvas.height),this.afterAddLayer(),this.drawCanvas()}addLayerFromFile(t){let e=new FileReader;e.onload=t=>this.addLayerFromURL(e.result),e.readAsDataURL(t)}addLayerFromClipboard(){navigator.clipboard.read().then(t=>{t.forEach(t=>{let e=t.types.find((t,e,s)=>t.startsWith("image/"));t.getType(e).then(t=>{this.addLayerFromURL(URL.createObjectURL(t))})})})}addLayerFromURL(t){let e=document.createElement("img");return e.onload=t=>(this.paper.addLayerFromImage(e,this.canvas.width,this.canvas.height),this.afterAddLayer(),this.drawCanvas(),null),e.src=t,null}afterAddLayer(){let t=this.paper.getSize(),e=(t.width-this.canvas.width)/2,s=(t.height-this.canvas.height)/2;this.paper.shift(e,s),this.canvas.width=t.width,this.canvas.height=t.height}getProjectName(){return this.projectName}drawCanvas(){this.ctx.save(),this.ctx.fillStyle=this.chessboard,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore(),this.paper.draw(this.ctx)}}class Z4Translations{static CURRENT_LANGUAGE=null;static FILE="";static NEW_PROJECT="";static CREATE="";static FROM_CLIPBOARD="";static FROM_FILE="";static OPEN="";static OPEN_PROJECT="";static SAVE="";static SAVE_PROJECT="";static EXPORT="";static LAYER="";static NEW_LAYER="";static SETTINGS="";static LANGUAGE="";static LANGUAGE_ENGLISH_NATIVE="";static LANGUAGE_ITALIAN_NATIVE="";static THEME="";static THEME_AUTO="";static THEME_LIGHT="";static THEME_DARK="";static THEME_COLOR="";static REFRESH_PAGE_MESSAGE="";static FILENAME="";static QUALITY="";static RESET="";static WIDTH="";static HEIGHT="";static RESOLUTION="";static FILLING_COLOR="";static EDIT="";static{switch(navigator.language.substring(0,2)){case"en":default:Z4Translations.setEnglish();break;case"it":Z4Translations.setItalian()}}constructor(){}static setEnglish(){Z4Translations.FILE="File",Z4Translations.NEW_PROJECT="New Project",Z4Translations.CREATE="Create",Z4Translations.FROM_CLIPBOARD="From Clipboard",Z4Translations.FROM_FILE="From File",Z4Translations.OPEN="Open",Z4Translations.OPEN_PROJECT="Open Project",Z4Translations.SAVE="Save",Z4Translations.SAVE_PROJECT="Save Project",Z4Translations.EXPORT="Export",Z4Translations.LAYER="Layer",Z4Translations.NEW_LAYER="New Layer",Z4Translations.SETTINGS="Settings",Z4Translations.LANGUAGE="Language",Z4Translations.LANGUAGE_ENGLISH_NATIVE="English",Z4Translations.LANGUAGE_ITALIAN_NATIVE="Italiano",Z4Translations.THEME="Theme",Z4Translations.THEME_AUTO="Auto",Z4Translations.THEME_LIGHT="Light",Z4Translations.THEME_DARK="Dark",Z4Translations.THEME_COLOR="Color",Z4Translations.REFRESH_PAGE_MESSAGE="Refresh the page to make the changes",Z4Translations.FILENAME="File Name",Z4Translations.QUALITY="Quality",Z4Translations.RESET="Reset",Z4Translations.WIDTH="Width",Z4Translations.HEIGHT="Height",Z4Translations.RESOLUTION="Resolution",Z4Translations.FILLING_COLOR="Filling Color",Z4Translations.EDIT="Edit",Z4Translations.CURRENT_LANGUAGE=new KeyValue("en",Z4Translations.LANGUAGE_ENGLISH_NATIVE)}static setItalian(){Z4Translations.FILE="File",Z4Translations.NEW_PROJECT="Nuovo Progetto",Z4Translations.CREATE="Crea",Z4Translations.FROM_CLIPBOARD="Dagli Appunti",Z4Translations.FROM_FILE="Da File",Z4Translations.OPEN="Apri",Z4Translations.OPEN_PROJECT="Apri Progetto",Z4Translations.SAVE="Salva",Z4Translations.SAVE_PROJECT="Salva Progetto",Z4Translations.EXPORT="Esporta",Z4Translations.LAYER="Livello",Z4Translations.NEW_LAYER="Nuovo Livello",Z4Translations.SETTINGS="Impostazioni",Z4Translations.LANGUAGE="Lingua",Z4Translations.LANGUAGE_ENGLISH_NATIVE="English",Z4Translations.LANGUAGE_ITALIAN_NATIVE="Italiano",Z4Translations.THEME="Tema",Z4Translations.THEME_AUTO="Auto",Z4Translations.THEME_LIGHT="Chiaro",Z4Translations.THEME_DARK="Scuro",Z4Translations.THEME_COLOR="Colore",Z4Translations.REFRESH_PAGE_MESSAGE="Aggiorna la pagina per eseguire le modifiche",Z4Translations.FILENAME="Nome File",Z4Translations.QUALITY="Qualit\xe0",Z4Translations.RESET="Ripristina",Z4Translations.WIDTH="Larghezza",Z4Translations.HEIGHT="Altezza",Z4Translations.RESOLUTION="Risoluzione",Z4Translations.FILLING_COLOR="Colore di Riempimento",Z4Translations.EDIT="Modifica",Z4Translations.CURRENT_LANGUAGE=new KeyValue("it",Z4Translations.LANGUAGE_ITALIAN_NATIVE)}}class Z4Constants{static ACCEPTED_IMAGE_FILE_FORMAT=[".gif",".png",".jpeg",".jpg"];static DEFAULT_IMAGE_SIZE=500;static MAX_IMAGE_SIZE=3e3;static DEFAULT_DPI=150;static MAX_DPI=1500;constructor(){}}class Z4Layer{offscreen=null;offscreenCtx=null;offsetX=0;offsetY=0;width=0;height=0;constructor(t,e,s,a,i){this.offscreen=new OffscreenCanvas(t,e),this.offscreenCtx=this.offscreen.getContext("2d"),this.offscreenCtx.fillStyle=this.getFillStyle(s.getRGBA_HEX()),this.offscreenCtx.fillRect(0,0,t,e),this.offsetX=(a-t)/2,this.offsetY=(i-e)/2,this.width=t,this.height=e}getFillStyle(t){return t}static fromImage(t,e,s){let a=new Z4Layer(t.width,t.height,new Color(0,0,0,0),e,s);return a.offscreenCtx.drawImage(t,0,0),a}shift(t,e){this.offsetX+=t,this.offsetY+=e}move(t,e){this.offsetX=t,this.offsetY=e}getSize(){return new Dimension(this.width,this.height)}draw(t){t.drawImage(this.offscreen,this.offsetX,this.offsetY)}}class Z4Paper{layers=[];getLayersCount(){return this.layers.length}getLayerAt(t){return this.layers[t]}addLayer(t,e,s,a,i){this.layers.push(new Z4Layer(t,e,s,a,i))}addLayerFromImage(t,e,s){this.layers.push(Z4Layer.fromImage(t,e,s))}reset(){this.layers.length=0}shift(t,e){this.layers.forEach(s=>s.shift(t,e))}getSize(){return this.layers.map(t=>t.getSize()).reduce((t,e,s,a)=>t?new Dimension(Math.max(t.width,e.width),Math.max(t.height,e.height)):e)}draw(t){this.layers.forEach(e=>e.draw(t))}}