
function TEST_injectHTML(){
  var sample_html = "<div>html code is successfully injected</div>";
  var elemAbove = document.getElementsByClassName("srg")[0].getElementsByClassName("g")[0];
  var injectedHTML_elem = injectHTML(elemAbove, sample_html);
  console.log(injectedHTML_elem);
}
function TEST_injectJS(){
  var sample_js = "alert('js code successfully injected');";
  var injectedJS_elem = injectJS(sample_js);
  console.log("injectedJS:", injectedJS_elem);
  var injectedJS_bySrc = injectJS_src('https://ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js');
  console.log("injectedJS:", injectedJS_bySrc);
}
function TEST_injectCSS(){
  var sample_css = "div{background-color:black;}";
  var injectedCSS_elem = injectCSS(sample_css);
  console.log(injectedCSS_elem);
  var injectedCSS_bySrc = injectCSS_src("https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css");
  console.log("injectedCSS:", injectedCSS_bySrc);
}


//==================================================
function injectHTML(elementAboveInjectionPosition, htmlCode_string){
  var injectContainer = document.createElement("div");
  injectContainer.className = "injectedHTMLContainer";
  injectContainer.innerHTML = htmlCode_string;
  insertElemAfter(elementAboveInjectionPosition, injectContainer);
  return injectContainer;
  // var docFrag = document.createDocumentFragment();
  // docFrag.innerHTML = htmlCode_string;
  // elemAbove.appendChild(docFrag);
  // return docFrag;
}
function insertElemAfter(elementAboveInjectionPosition, elemToInject){
  var elemAbove = elementAboveInjectionPosition;
  if (elemAbove.nextSibling){
    elemAbove.parentNode.insertBefore(elemToInject, elemAbove.nextSibling);
  }
  else {
    elemAbove.parentNode.appendChild(elemToInject);
  }
  return elemToInject;  
}

function injectJS(jsCode_string){
  ////document.write("<scr"+"ipt>" +jsCode_string+ "</scr"+"ipt>");
  var scriptElem = document.createElement("script");
  scriptElem.innerText = jsCode_string; //This line is not compatible with Mozilla Firefox.
  document.getElementsByTagName("html")[0].appendChild(scriptElem);
  return scriptElem;
}
function injectJS_src(src){
  var scriptElem = document.createElement("script");
  scriptElem.src = src;
  document.getElementsByTagName("html")[0].appendChild(scriptElem);
  return scriptElem;
}

function injectCSS(cssCode_string){
  var styleElem = document.createElement('style');
  styleElem.type = 'text/css';
  styleElem.innerHTML = cssCode_string;
  document.getElementsByTagName('head')[0].appendChild(styleElem);
}
function injectCSS_src(cssSrc){
  var linkElem = document.createElement('link');
  linkElem.setAttribute('rel', 'stylesheet');
  linkElem.setAttribute('type', 'text/css');
  linkElem.setAttribute('href', cssSrc);
  document.getElementsByTagName('head')[0].appendChild(linkElem);
}