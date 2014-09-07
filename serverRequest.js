//var serverUrl = "https://interactive-markdown.ngrok.com";
// var serverUrl = "https://192.241.224.229:3000";
var serverUrl = "https://aviatoapi.ngrok.com";

//takes a language and a code block (as string) and posts to server for evaluation
function evalCode(language, code, success, error) {
	$.ajax({
	  type: "POST",
	  url: serverUrl + "/sessions",
	  data: JSON.stringify({
	  	language: language,
	  	code: code
	  }),
	  contentType : 'application/json',
	  success: success,
	  error: error,
	  dataFilter : function(inp) {
									return inp.replace(/\n/g, '<br>').replace(/<br>$/, '');
								}
	});
}
