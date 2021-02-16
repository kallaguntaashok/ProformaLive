document.getElementById("browserview").setAttribute("style", "display:none;");
var ua = window.navigator.userAgent;
var isIE = /MSIE|Trident/.test(ua);
var isEdge = /Edge/.test(navigator.userAgent);
var is_chrome = /chrome/.test(navigator.userAgent.toLowerCase());
if (isIE) {
    document.getElementById("browserview").setAttribute("style", "background-color:#6c757d; z-index: 99999; display:block;");
}
else if (isEdge) {
    document.getElementById("browserview").setAttribute("style", "background-color:#6c757d; z-index: 99999; display:block;");
} else if (is_chrome) {
    document.getElementById("mainwindow").setAttribute("style", "background: linear-gradient(to right, #000428, #004e92); display:block; overflow-x: hidden; overflow-y: hidden; width: 100%; position: absolute; float: left; height: 100%;");
} else if (navigator.userAgent.indexOf("Firefox") > 0) {
    document.getElementById("browserview").setAttribute("style", "background-color:#6c757d; z-index: 99999; display:block;");
}