/**
 * kcpop.js 
 * Popup Message Object 2 extension for HTML5 exporter
 * @author Loic OVIGNE
 * 2020 Oviglo - www.oviglo.fr
*/

// Alert object
function OvigloAlert()
{
    this.lang = navigator.language || navigator.userLanguage; // Get browser language for buttons
    this.lang = this.lang.substring(0, 2);
    this.translations = {
        "en": {
            "ok": "OK",
            "cancel": "Cancel",
            "yes": "Yes",
            "no": "No",
            "retry": "Retry",
            "abort": "Abort",
            "ignore": "Ignore"

        },
        "fr": {
            "ok": "OK",
            "cancel": "Annuler",
            "yes": "Oui",
            "no": "Non",
            "retry": "Recommencer",
            "abort": "Abandonner",
            "ignore": "Ignorer"

        },
    };
    if (typeof this.translation[this.lang] == "undefined") {
        this.lang = "fr";
    }
    
    this.alert = null;
    this.isShow = false;
    this.buttons = [];
    this.btnClicked = "";
    this.lastMessage = "";
    // By FontAwesome
    this.icons = {
        'cross': '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>',
        'exclamation': '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
        'information': '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>',
        'question':'<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>',
        'stop': '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>'
    }
    // Size
    var MMFDiv = document["querySelector"](".MMFDiv");
    var maxW = Math.max(200, MMFDiv.offsetWidth-120);
    var maxH = Math.max(200, MMFDiv.offsetHeight-120);
    this.cssBase = '/* BASE */#kcpop{position:absolute;left:0;right:0;top:0;bottom:0;background-color:rgba(0,0,0,0.5);} #kcpop .kcpop-dialog{position:absolute;min-width: 200px;max-width:'+maxW+'px; max-height:'+maxH+'px} #kcpop .kcpop-dialog .kcpop-dialog-header{display:flex; justify-content:space-between} #kcpop .kcpop-dialog .kcpop-dialog-header .kcpop-close{padding:1px; text-align: right;} #kcpop .kcpop-title{padding:4px;line-height: 14px;} #kcpop .kcpop-dialog .kcpop-dialog-body{display:flex; padding: 10px; min-height: 80px; align-items: center;} #kcpop .kcpop-dialog .kcpop-message{padding:4px;margin-left:10px;} #kcpop .kcpop-close{text-align:right;} #kcpop .kcpop-close button{ background:none; border:none}#kcpop .kcpop-close svg{width:12px} #kcpop .kcpop-dialog-footer{padding:1px; display:flex;justify-content:space-around;}#kcpop .kcpop-dialog-footer button{flex-grow:1;margin:4px}';

    this.cssTheme = '/* THEME LIGHT */ #kcpop .kcpop-dialog{background-color:#fefefe; color:#333; font-family:calibri} #kcpop .kcpop-dialog-header{border-bottom: solid #777 1px}#kcpop .kcpop-dialog-footer{background-color:#efefef; padding-top: 4px;} #kcpop .kcpop-dialog-footer button{background-color:#fefefe; border:solid #333 1px;padding: 4px 6px;}#kcpop .kcpop-dialog-footer button:hover{background-color:#efefef; cursor:pointer} #kcpop .kcpop-icon.exclamation svg{color:#FF8C42} #kcpop .kcpop-icon.information svg{color:#6699CC} #kcpop .kcpop-icon.question svg{color:#52489C} #kcpop .kcpop-icon.stop svg{color:#E94F37}';
}

OvigloAlert.prototype = {
    createAlertHtmlBase() {
        
        // CSS
        var cssEl = document.createElement("style"); 
        cssEl.innerHTML = this.cssBase + this.cssTheme;
        cssEl.setAttribute("type", "text/css");
        document.head.appendChild(cssEl);

        this.alert = document.createElement("div");
        this.alert.id = "kcpop";
        this.alert.style.display = "none";

        var alertHtml = document.createElement("div");
        alertHtml.classList.add("kcpop-dialog");

        var alertHtmlHeader = document.createElement("div");
        alertHtmlHeader.classList.add("kcpop-dialog-header");

        alertTitle = document.createElement("div");
        alertTitle.classList.add("kcpop-title");
        alertHtmlHeader.appendChild(alertTitle);

        alertCloseDiv = document.createElement("div");
        alertCloseDiv.classList.add("kcpop-close");
        alertCloseBtn = document.createElement("button");
        alertCloseBtn.setAttribute("type", "button");
        alertCloseBtn.innerHTML = this.getIcon("cross");
        alertCloseBtn.onclick = () => { this.hide()};
        alertCloseDiv.appendChild(alertCloseBtn);

        alertHtmlHeader.appendChild(alertCloseDiv);
        alertHtml.appendChild(alertHtmlHeader);

        var alertHtmlBody = document.createElement("div");
        alertHtmlBody.classList.add("kcpop-dialog-body");

        var iconHtml = document.createElement("div");
        iconHtml.classList.add("kcpop-icon");
        alertHtmlBody.appendChild(iconHtml);

        var messageContent = document.createElement("div");
        messageContent.classList.add('kcpop-message');
        alertHtmlBody.appendChild(messageContent);

        

        alertHtml.appendChild(alertHtmlBody);

        var alertHtmlFooter = document.createElement("div");
        alertHtmlFooter.classList.add("kcpop-dialog-footer");
        alertHtml.appendChild(alertHtmlFooter);

        this.alert.appendChild(alertHtml);


        document.body.appendChild(this.alert);
    },

    getIcon(name) {
        if (typeof this.icons[name] == "undefined") return;

        return this.icons[name];
    },

    center() {
        var d = this.alert["querySelector"]('.kcpop-dialog');
        var MMFDiv = document["querySelector"](".MMFDiv");
        var rect = MMFDiv.getBoundingClientRect();
        var l = rect.left  + (rect.width - d.offsetWidth) / 2;
        var t = rect.top + (rect.height - d.offsetHeight) / 2;
        d.style.left = l+'px';
        d.style.top = t+'px';
    },

    generateButton(buttons) {
        if (typeof buttons == "undefined") return;

        buttons.forEach((caption) => {
            var button = document.createElement("button");
            button.setAttribute("type", "button");
            button.innerHTML = this.translations[this.lang][caption];
            button.onclick = () => {
                this.btnClicked = caption;
                this.hide();
            };
            this.buttons.push(button);
            this.alert["querySelector"]('.kcpop-dialog-footer').appendChild(button);
        });
    },

    deleteButtons() {
        this.buttons.forEach((btn) => {
            btn.onclick = null;
            btn.remove();
        });

        this.buttons = [];
    },

    show(title, message, buttons,  icon) {
        if (this.isShow) return;

        this.alert["querySelector"]('.kcpop-dialog-header .kcpop-title').innerHTML = title;
        this.alert["querySelector"]('.kcpop-message').innerHTML = message;

        this.generateButton(buttons);

        if (icon != "") {
            this.alert["querySelector"]('.kcpop-icon').innerHTML = this.getIcon(icon);
            this.alert["querySelector"]('.kcpop-icon').style.width = "40px";
            this.alert["querySelector"]('.kcpop-icon').classList.add(icon);
        }

        this.alert.style.display = "block";
        this.center();
        this.isShow = true;
        this.lastMessage = message;
    },

    hide() {
        this.alert.style.display = "none";
        this.deleteButtons();
        var iconDiv = this.alert["querySelector"]('.kcpop-icon');
        iconDiv.style.width = "0px";
        iconDiv.className = '';
        iconDiv.classList.add("kcpop-icon");
        this.isShow = false;
    },

    isButtonClicked(type) {
        if (this.btnClicked == type) {
            this.btnClicked = "";
            return true;
        }

        return false;
    }
};

function CRunkcpop()
{
    this.oAlert = new OvigloAlert();
}

CRunkcpop.prototype = CServices.extend(new CRunExtension(),
{
    getNumberOfConditions:function()
    {
        return 8;
    },

    createRunObject:function(file, cob, version)
    {
        this.oAlert.createAlertHtmlBase();
    },

    condition: function(num, cnd)
    {
        switch(num) {
            case 0:
                return this.oAlert.isButtonClicked("ok");
            case 1:
                return this.oAlert.isButtonClicked("cancel");
            case 2:
                return this.oAlert.isButtonClicked("yes");
            case 3:
                return this.oAlert.isButtonClicked("no");
            case 4:
                return this.oAlert.isButtonClicked("abort");
            case 5:
                return this.oAlert.isButtonClicked("retry");
            case 6:
                return this.oAlert.isButtonClicked("ignore");

            case 7:
                var message = cnd.getParamExpString(this.rh, 0);
                return this.oAlert.lastMessage == message;
        }

        return false;
    },

    action: function(num, act)
    {  
        var icon = "";
        var buttons = ["ok"];

        var okBox = [0,1,2,3,4];
        var okCancelBox = [5,6,7,8,9];
        var yesNoBox = [10,11,12,13,14];
        var yesNoCancelBox = [15,16,17,18,19];
        var retryCancelBox = [20,21,22,23,24];
        var abortRetryCancelBox = [25,26,27,28,29];

        if (okBox.includes(num)) {
            buttons = ["ok"];
        } else if(okCancelBox.includes(num)) {
            buttons = ["ok", "cancel"];
        } else if(yesNoBox.includes(num)) {
            buttons = ["yes", "no"];
        } else if(yesNoCancelBox.includes(num)) {
            buttons = ["yes", "no", "cancel"];
        } else if(retryCancelBox.includes(num)) {
            buttons = ["retry", "cancel"];
        }else if(abortRetryCancelBox.includes(num)) {
            buttons = ["abort", "retry", "ignore"];
        }
        

        // Icon
        var exIcon = [1, 6, 11, 16, 21, 26];
        var inIcon = [2, 7, 12, 17, 22, 27];
        var quIcon = [3, 8, 13, 18, 23, 28];
        var stIcon = [4, 9, 14, 19, 24, 29];

        if (exIcon.includes(num)) {
            icon = "exclamation";
        } else if(inIcon.includes(num)) {
            icon = "information";
        } else if(quIcon.includes(num)) {
            icon ="question";
        } else if(stIcon.includes(num)) {
            icon ="stop";
        }

        var message = act.getParamExpString(this.rh, 0);
        var title = act.getParamExpString(this.rh, 1);
        this.oAlert.show(title, message, buttons, icon);
    },

    expression: function(num)
    {
        switch(num) {
            case 0:
                return this.oAlert.lastMessage;
        }
        return 0;
    }
});
