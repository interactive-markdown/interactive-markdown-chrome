var serverUrl = "https://interactive-markdown.ngrok.com";

//takes a language and a code block (as string) and posts to server for evaluation
function evalCode(language, code, success, error) {
	$.ajax({
	  type: "POST",
	  url: serverUrl + "/sessions",
	  data: JSON.stringify({
	  	language: language,
	  	code: code
	  }),
	  //contentType : 'application/json',
	  success: success,
	  error: error
	});
}