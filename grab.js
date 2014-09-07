//You can test this with https://github.com/CoderDojoSF/AroundTheWorld
function TEST_injectDisplay(){
  setup_view();
  var codeStringDict = getCode(codeBlockList, checkboxList); //#TEMP: codeBlockList is from the global scope.
  //theRunButtonElement.addEventListener('click', function(){  injectCode(theRunButtonElement, codeStringDict);  });
}

//==================================================
//Assumes that the Readme follows Github's conventions of having "highlight" as a class.
var codeBlockList = document.getElementsByClassName("highlight");
var checkboxList = [];
var attributeNameOptions = ["interactive-markdown", "imd"];
var opt = 0;
var currRunCodeType = ''; //#QUICK-HACK

function setup_view(){
  //Check to prevent overwriting of existing attributes.
  for (var i=0; i<codeBlockList.length; ++i){
    if (codeBlockList[i].hasAttribute(attributeNameOptions[opt])){
      if (opt < attributeNameOptions.length-1){
        i=0;
        opt += 1;
      }
      else{
        attributeNameOptions[opt] += (new Date).getTime(); 
        break;
      }
    }
  }

  //Create the checkboxes.
  for (var i=0; i<codeBlockList.length; ++i){
    codeBlockList[i].setAttribute(attributeNameOptions[opt], i);
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = attributeNameOptions[opt]+"_"+i;
    checkbox.hidden = true; //#QUICK-HACK
    checkboxList.push(checkbox);
    //codeBlockList[i].insertBefore(checkbox, codeBlockList[i].getElementsByTagName("pre")[0]);
    codeBlockList[i].appendChild(checkbox);
    // checkbox.checked = false;
  }

  //create button to launch simulator
  var isAndroid = $("a[title='AndroidManifest.xml']");
  if (isAndroid && isAndroid.length > 0) {
    var button=$('<input/>').attr({
          type: "button",
          id: "field",
          value: "Try Live"
      });
    
    //create canvas on click
    button.on('click', function(e) {
      var frame = $('<div class="frame" style="background: no-repeat bottom center url(' + chrome.extension.getURL('/img/droid/android_top.png') + "),\
                    repeat-x bottom center url(" + chrome.extension.getURL('/img/droid/android_bot_tile.png') + "),\
                    no-repeat center 27px url(" + chrome.extension.getURL('/img/droid/android_top.png') + "),\
                    repeat-x top center url(" + chrome.extension.getURL('/img/droid/android_top_tile.png') + ');"><div class="frame-inner"></div></div>');
      document.getElementsByTagName('body')[0].appendChild(frame[0]);
      var subframe = frame.find('.frame-inner');
      var ifrm = document.createElement("iframe");
      subframe[0].appendChild(ifrm); //Must add iframe to DOM before it gets its own DOM contentWindow contentDocument
      var idoc = (ifrm.contentWindow || ifrm.contentDocument);
      if (idoc.document){idoc = idoc.document};
      var firstDiv = idoc.createElement("div");
      firstDiv.id = "firstDiv";
      idoc.getElementsByTagName("body")[0].appendChild(firstDiv);
      ifrm.src = chrome.extension.getURL('popup.html');

    });

    $(".file-wrap").append(button);
  }


  // //Create the Launch App button
  // var launchButton = document.createElement("input");
  // launchButton.type = "button";
  // launchButton.value = "Launch App";
  // launchButton.addEventListener("click", function(){});
  // launchButton.className = "minibutton sidebar-button";
  // document.getElementsByClassName("only-with-full-nav")[0].appendChild(launchButton);
  //Create the MasterCard Pay button
  var donateButton = document.createElement("input");
  donateButton.type = "button";
  donateButton.value = "Donate to Developer";
  donateButton.addEventListener("click", function(){});
  donateButton.className = "minibutton sidebar-button";
  donateButton.style.marginTop = "20px";
  document.getElementsByClassName("only-with-full-nav")[0].appendChild(donateButton);


}

function getCode(codeBlockList, checkboxList){
  var codeStringDict = {};
  console.log("!@@", codeBlockList.length, "#", checkboxList.length);
  for (var i=0; i<codeBlockList.length; ++i){
      console.log("@@@",i,checkboxList[i].checked);
    if (checkboxList[i].checked == true){
      var codeType = codeBlockList[i].className.split(' ')[1].split('-')[1]; //#FUTURE: Handle exception cases. Currently assumes that github will always have those 2 classes.
      var codeString = '';
      if (codeBlockList[i].children[0].tagName.toLowerCase()=="pre"){ //For normal Github Readme page.
        codeString = codeBlockList[i].getElementsByTagName("pre")[0].textContent.replace(/\s/g, " "); //#GOTCHA: Must remove no-break-space.
      }
      else{ //For codeblock edited Github Readme page.
        var codeDivs = codeBlockList[i].getElementsByClassName("ace_layer ace_text-layer")[0].children;
        console.debug(codeDivs);
        for (var j=0; j<codeDivs.length; ++j){ //#GOTCHA: Dont use variable i here.
          codeString += codeDivs[j].textContent.replace(/\s/g, " ")+"\n"; //#GOTCHA: Must remove no-break-space.
          console.debug(codeString);
        }
      }

      if (typeof codeStringDict[codeType] == "undefined"){
        codeStringDict[codeType] = [];
      }//else if codeType is already a key in codeStringDict
      codeStringDict[codeType].push(codeString);
    }
  }
  return codeStringDict;
}

function injectCode(elementAboveInjectionPosition, codeStringDict){
  var elemAbove = elementAboveInjectionPosition;

  var ifrmRef = injectIframe(elemAbove);
  console.debug(ifrmRef);

  if (typeof codeStringDict["html"] != "undefined"){
    var curr_elemAbove = ifrmRef.firstDiv;
    for (var i=0; i<codeStringDict["html"].length; ++i){
      var injectedHTML_elem = injectHTML(curr_elemAbove, codeStringDict["html"][i]);
      //for the next iteration
      curr_elemAbove = injectedHTML_elem;
    }
  }//end html case

  if (typeof codeStringDict["css"] != "undefined"){
    for (var i=0; i<codeStringDict["css"].length; ++i){
      var injectedCSS_elem = injectCSS(codeStringDict["css"][i], ifrmRef.idoc);
    }
  }//end css case
  if (typeof codeStringDict["js"] != "undefined"){
    for (var i=0; i<codeStringDict["js"].length; ++i){
      var injectedJS_elem = injectJS(codeStringDict["js"][i], ifrmRef.idoc);
    }
  }//end js case

  //The other types of code that require streaming
  for (var codeType in codeStringDict){
    if (codeType == "python"){
    }
    else if (codeType == "ruby"){
    }

  }//end for-loop of all codeType(s)
}





