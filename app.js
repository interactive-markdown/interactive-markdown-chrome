
require.config({
  baseUrl: chrome.extension.getURL('/lib/')
});


var scripts = [
                'jquery',
                'codeblock/vendor/ace/ace',
                'codeblock/vendor/ace/theme-dawn',
                'codeblock/vendor/ace/mode-javascript',
                'codeblock/vendor/jquery-textrange',
                'codeblock/js/linked-editor'
              ];



require(scripts, function($) {

  console.log('here yo');
  $('pre').each(function () {
    $(this).codeblock();
  });

   // var request = $.ajax({ type: 'GET', url: encodeURI('https://api.uwaterloo.ca/v2/weather/current.json'), async : false });
   // console.log(request.responseText)
   // eval("alert(10)");

});
