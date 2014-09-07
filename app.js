
require.config({
  baseUrl: chrome.extension.getURL('/lib/')
});


require(['jquery'], function($) {

  console.log('here yo');

   var request = $.ajax({ type: 'GET', url: encodeURI('https://api.uwaterloo.ca/v2/weather/current.json'), async : false });
   console.log(request.responseText)

   eval("alert(10)");

});
