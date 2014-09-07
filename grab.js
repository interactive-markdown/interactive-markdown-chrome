//You can test this with https://github.com/CoderDojoSF/AroundTheWorld
function TEST_injectDisplay(){
  setup_view();
  var codeBlock = document.getElementsByClassName("srg")[0].getElementsByClassName("g")[0];
  var codeStringDict = getCode(codeBlockList, checkboxList);
  //theRunButtonElement.addEventListener('click', function(){  injectCode(theRunButtonElement, codeStringDict);  });
}

//==================================================
//Assumes that the Readme follows Github's conventions of having "highlight" as a class.
var codeBlockList = document.getElementsByClassName("highlight");
var checkboxList = [];
var attributeNameOptions = ["interactive-markdown", "imd"];
var opt = 0;

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
    checkboxList.push(checkbox);
    //codeBlockList[i].insertBefore(checkbox, codeBlockList[i].getElementsByTagName("pre")[0]);
    codeBlockList[i].appendChild(checkbox);
    // checkbox.checked = false;
  }
}


function getCode(codeBlockList, checkboxList){
  var codeStringDict = {};
  for (var i=0; i<codeBlockList.length; ++i){
    if (checkboxList[i].checked == true){
      var codeType = codeBlockList[i].className.split(' ')[1].split('-')[1]; //#FUTURE: Handle exception cases. Currently assumes that github will always have those 2 classes.
      var codeString = codeBlockList[i].getElementsByTagName("pre")[0].textContent;
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





