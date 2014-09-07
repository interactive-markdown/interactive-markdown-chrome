function TEST_injectDisplay(){
  var codeBlock = document.getElementsByClassName("srg")[0].getElementsByClassName("g")[0];
  var ifrmRef = injectIframe(codeBlock);
  console.log(ifrmRef);

  var sample_html = "<div>html code is successfully injected</div>";
  var elemAbove = ifrmRef.firstDiv;
  var injectedHTML_elem = injectHTML(elemAbove, sample_html);
  console.log(injectedHTML_elem);

  var sample_js = "alert('js code successfully injected');";
  var injectedJS_elem = injectJS(sample_js, ifrmRef.idoc);
  console.log("injectedJS:", injectedJS_elem);
  var injectedJS_bySrc = injectJS_src('https://ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js', ifrmRef.idoc);
  console.log("injectedJS:", injectedJS_bySrc);

  var sample_css = "div{background-color:green;}";
  var injectedCSS_elem = injectCSS(sample_css, ifrmRef.idoc);
  console.log(injectedCSS_elem);
  var injectedCSS_bySrc = injectCSS_src("https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css", ifrmRef.idoc);
  console.log("injectedCSS:", injectedCSS_bySrc);
}
//-------------------------
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

function injectIframe(elementAboveInjectionPosition){
  var ifrm = document.createElement("iframe");
  insertElemAfter(elementAboveInjectionPosition, ifrm); //Must add iframe to DOM before it gets its own DOM contentWindow contentDocument
  var idoc = (ifrm.contentWindow || ifrm.contentDocument);
  if (idoc.document){idoc = idoc.document};
  var firstDiv = idoc.createElement("div");
  firstDiv.id = "firstDiv";
  idoc.getElementsByTagName("body")[0].appendChild(firstDiv);
// y.body.style.backgroundColor = "red";
  return {"idoc":idoc, "firstDiv":firstDiv};
}


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
function injectResult_evalJS(elementAboveInjectionPosition, jsCode_string){
  var returnVal = eval(jsCode_string);
  var injectContainer = document.createElement("div");
  var pre = document.createElement("pre");
  pre.innerText = returnVal;
  injectContainer.appendChild(pre);
  insertElemAfter(elementAboveInjectionPosition, injectContainer);
  return injectContainer;
}


function injectJS(jsCode_string, ddocument){
  if (typeof ddocument == "undefined"){
    ddocument = document;
  }
  ////document.write("<scr"+"ipt>" +jsCode_string+ "</scr"+"ipt>");
  var scriptElem = ddocument.createElement("script");
  scriptElem.innerText = jsCode_string; //This line is not compatible with Mozilla Firefox.
  ddocument.getElementsByTagName("html")[0].appendChild(scriptElem);
  return scriptElem;
}
function injectJS_src(src, ddocument){
  if (typeof ddocument == "undefined"){
    ddocument = document;
  }
  var scriptElem = ddocument.createElement("script");
  scriptElem.src = src;
  ddocument.getElementsByTagName("html")[0].appendChild(scriptElem);
  return scriptElem;
}


function injectCSS(cssCode_string, ddocument){
  if (typeof ddocument == "undefined"){
    ddocument = document;
  }
  var styleElem = ddocument.createElement('style');
  styleElem.type = 'text/css';
  styleElem.innerHTML = cssCode_string;
  ddocument.getElementsByTagName('head')[0].appendChild(styleElem);
}
function injectCSS_src(cssSrc, ddocument){
  if (typeof ddocument == "undefined"){
    ddocument = document;
  }
  var linkElem = ddocument.createElement('link');
  linkElem.setAttribute('rel', 'stylesheet');
  linkElem.setAttribute('type', 'text/css');
  linkElem.setAttribute('href', cssSrc);
  ddocument.getElementsByTagName('head')[0].appendChild(linkElem);
}