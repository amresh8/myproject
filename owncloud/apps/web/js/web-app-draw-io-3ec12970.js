define(["./chunks/vendor-22992e2c","./chunks/base-fbc1ccef","./chunks/useAppDefaults-a6c3be91","./chunks/visibility-c7f197c2","./chunks/useSpacesLoading-b404aeae","./chunks/functions-f74c7f04","./chunks/useGraphClient-6c0c047b","./chunks/useDriveResolver-be2aa3cc"],(function(e,t,i,a,s,r,o,n){"use strict";var d={cs:{},de:{"An error occurred":"Ein Fehler ist aufgetreten","Couldn't save. Error when contacting the server":"Speichern nicht möglich. Fehler beim Kontaktieren des Servers","Diagram imported":"Diagramm importiert","Draw.io document":"Draw.io-Datei","Draw.io editor":"Draw.io Editor","File saved!":"Datei gespeichert!","Loading media":"Lade Daten","Saving error. You're not authorized to save this file":"Fehler beim Speichern. Keine ausreichenden Berechtigungen, um die Datei zu speichern","The diagram was successfully saved":"Das Diagram wurde erfolgreich gespeichert","The diagram will open as a new .drawio file: %{file}":"Das Diagramm wird als neue .drawio Datei geöffnet: %{file}","This file was updated outside this window. Please refresh the page. All changes will be lost, so download a copy first.":"Die Datei wurde außerhalb dieses Fensters aktualisiert. Bitte lade die Seite neu. Alle Änderungen gehen dabei verloren, bitte lade zuerst eine Kopie herunter."},es:{"Diagram imported":"Diagrama importado","Draw.io editor":"Editor Draw.io","Loading media":"Cargando medios"},fr:{"An error occurred":"Une erreur est survenue","Couldn't save. Error when contacting the server":"Enregistrement impossible. Erreur de communication avec le serveur","Diagram imported":"Diagramme importé","Draw.io document":"Document Draw.io","Draw.io editor":"Éditeur Draw.io","File saved!":"Fichier enregistré !","Loading media":"Chargement du media","Saving error. You're not authorized to save this file":"Erreur d'enregistrement. Vous n'êtes pas autorisé à enregistrer ce fichier","The diagram was successfully saved":"Le diagramme a bien été enregistré","The diagram will open as a new .drawio file: %{file}":"Le diagramme va s'ouvrir comme un nouveau fichier .drawio : %{file}","This file was updated outside this window. Please refresh the page. All changes will be lost, so download a copy first.":"Ce fichier a été modifié en dehors de cette fenêtre. Veuillez rafraîchir la page. Tous les changements seront perdus, téléchargez-en une copie avant."},gl:{},it:{"Diagram imported":"Diagramma importato","Draw.io document":"Documento Draw.io","Draw.io editor":"Editor Draw.io","File saved!":"File salvato!","Loading media":"Caricamento media","Saving error. You're not authorized to save this file":"Errore di salvataggio. L'utente non è autorizzato a salvare questo file","The diagram will open as a new .drawio file: %{file}":"Il diagramma verrà aperto come nuovo file .drawio: %{file}"}};const l=e.defineComponent({name:"DrawIoEditor",setup:()=>({...i.useAppDefaults({applicationId:"draw-io"})}),data:()=>({loading:!0,filePath:"",fileExtension:"",isReadOnly:null,currentETag:null}),computed:{config(){const{url:e="https://embed.diagrams.net",theme:t="minimal",autosave:i=!1}=this.applicationConfig;return{url:e,theme:t,autosave:i?1:0}},urlHost(){const e=new URL(this.config.url),t=`${e.protocol}//${e.hostname}`;return e.port?`${t}:${e.port}`:t},iframeSource(){const t=e.lib.stringify({embed:1,chrome:this.isReadOnly?0:1,picker:0,stealth:1,spin:1,proto:"json",ui:this.config.theme});return`${this.config.url}?${t}`}},watch:{currentFileContext:{handler:function(){this.checkPermissions()},immediate:!0}},created(){this.filePath=this.currentFileContext.path,this.fileExtension=this.filePath.split(".").pop(),window.addEventListener("message",(e=>{if(e.data.length>0){if(e.origin!==this.config.url)return;const t=JSON.parse(e.data);switch(t.event){case"init":"vsdx"===this.fileExtension?this.importVisio():this.load();break;case"autosave":this.save(t,!0);break;case"save":this.save(t);break;case"exit":this.exit()}}}))},methods:{...e.mapActions(["showMessage"]),errorPopup(e){this.showMessage({title:this.$gettext("An error occurred"),desc:e,status:"danger"})},successPopup(e){this.showMessage({title:this.$gettext("The diagram was successfully saved"),desc:e,status:"success"})},errorNotification(e){this.$refs.drawIoEditor.contentWindow.postMessage(JSON.stringify({action:"status",message:e,modified:!1}),this.urlHost)},async checkPermissions(){try{const e=await this.getFileInfo(this.currentFileContext,{davProperties:[t.DavProperty.FileId,t.DavProperty.Permissions]});this.replaceInvalidFileRoute(this.currentFileContext,e),this.isReadOnly=![t.DavPermission.Updateable,t.DavPermission.FileUpdateable].some((t=>(e.permissions||"").indexOf(t)>-1)),this.loading=!1}catch(e){this.errorPopup(e)}},async loadFileContent(){try{const e=await this.getFileContents(this.currentFileContext);this.currentETag=e.headers.ETag,this.$refs.drawIoEditor.contentWindow.postMessage(JSON.stringify({action:"load",xml:e.body,autosave:this.config.autosave}),this.urlHost)}catch(e){this.errorPopup(e)}},async load(){await Promise.all([this.checkPermissions(),this.loadFileContent()])},importVisio(){this.filePath+=`_${this.getTimestamp()}.drawio`,this.showMessage({title:this.$gettext("Diagram imported"),desc:(()=>this.$gettextInterpolate(this.$gettext("The diagram will open as a new .drawio file: %{file}"),{file:e.basename(this.filePath)},!0))()}),this.getFileContents(this.currentFileContext,{responseType:"arrayBuffer"}).then((e=>e.body)).then((e=>{const t=new Blob([e],{type:"application/vnd.visio"}),i=new FileReader;i.onloadend=()=>{this.$refs.drawIoEditor.contentWindow.postMessage(JSON.stringify({action:"load",xml:i.result,autosave:this.config.autosave}),this.urlHost)},i.readAsDataURL(t)})).catch((e=>{this.errorPopup(e)}))},save(e,t=!1){this.putFileContents(this.currentFileContext,{content:e.xml,previousEntityTag:this.currentETag}).then((e=>{this.currentETag=e.ETag;const i=this.$gettext("File saved!");t?this.$refs.drawIoEditor.contentWindow.postMessage(JSON.stringify({action:"status",message:i,modified:!1}),this.urlHost):this.successPopup(i)})).catch((e=>{const i=t?this.errorNotification:this.errorPopup;switch(e.statusCode){case 412:i(this.$gettext("This file was updated outside this window. Please refresh the page. All changes will be lost, so download a copy first."));break;case 500:i(this.$gettext("Couldn't save. Error when contacting the server"));break;case 401:i(this.$gettext("Saving error. You're not authorized to save this file"));break;default:i(e.message||e)}}))},exit(){window.close()},getTimestamp:()=>e.DateTime_1.local().toFormat("YYYYMMDD[T]HHmmss")}});var c=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("main",[e.loading?i("div",{staticClass:"oc-position-center"},[i("oc-spinner",{attrs:{size:"xlarge"}}),e._v(" "),i("p",{directives:[{name:"translate",rawName:"v-translate"}],staticClass:"oc-invisible"},[e._v("Loading media")])],1):i("iframe",{ref:"drawIoEditor",attrs:{id:"drawio-editor",src:e.iframeSource,title:e.$gettext("Draw.io editor")}})])};c._withStripped=!0;return{appInfo:{name:"Draw.io",id:"draw-io",icon:"grid",extensions:[{extension:"drawio",newTab:!0,routeName:"draw-io",newFileMenu:{menuTitle:function(e){return e("Draw.io document")}}},{extension:"vsdx",newTab:!0,routeName:"draw-io"}]},routes:[{name:"draw-io",path:"/:driveAliasAndItem*",component:e.normalizeComponent({render:c,staticRenderFns:[]},undefined,l,"data-v-4577f547",false,undefined,!1,void 0,void 0,void 0),meta:{authContext:"hybrid",patchCleanPath:!0}}],translations:d}}));
