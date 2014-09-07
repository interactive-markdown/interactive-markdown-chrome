// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "codeblock",
        defaults = {
          editable: true,
          consoleText: "Output from the example appears here",
          consoleClass: "codeblock-console-text",
          runButtonText: "run",
          runButtonClass: "codeblock-console-run",
          console: true,
          resetable: true,
          runnable: true,
          editorTheme: "ace/theme/dawn",
          lineNumbers: true
        };

    // The actual plugin constructor
    function CodeBlock( element, options ) {
        this.element = element;
        this.original = $(this.element);
        this.enabled = true;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
        this._exports = {
            "run": this.run,
            "reset": this.reset,
            "destroy": this.destroy,
            "editor": this.getEditor,
            "text": this.getSetText,
            "runnable": this.getSetRunnable,
            "editable": this.getSetEditable
        };

        this.init();
    }

    CodeBlock.prototype = {
        init: function() {
          this.setUpDom();
          this.setUpEditor();
          if (this.options.console) {
            this.createConsole();
          }
          if (this.options.resetable) {
            this.createResetButton();
          }
          this.base.data("plugin_" + pluginName, this);
        },

        setUpDom: function() {
            //the ACE editor directly manipulates the classes, etc. of the
            //element it latches on to, so we set up an encapsulating DOM structure
            this.el = $('<div></div>').addClass("codeblock-container");
            var inner = $('<div></div>').addClass("codeblock-editor-wrapper");

            this.base = this.original.clone();

            //A set width & height keeps the editor the right size.
            //TODO: make this configurable
            var width = this.original.width();
            this.el.width(width);
            inner.height(this.original.height()*1.1);

            //Strip whitespace to make writing html easier
            this.base.html($.trim(this.base.html()));
            this.base.addClass("codeblock-editor");

            this.originalText = this.base.text();

            this.el.insertBefore(this.original);
            this.el.append(inner);
            inner.append(this.base);
            this.original.remove();
        },

        setUpEditor: function() {
            //Set up ace editor - requires an ID to latch on to
            if (!this.base.attr("id")) {
                this.base.attr("id", "codeblock-editor-"+(+new Date));
            }

            this.editor = ace.edit(this.base.attr("id"));
            this.editor.setTheme(this.options.editorTheme);
            this.editor.getSession().setUseWorker(false);
            this.editor.getSession().setMode("ace/mode/javascript");
            this.editor.setShowFoldWidgets(false);
            //override their fancy ctrl-f, ctrl-r: http://stackoverflow.com/questions/13677898/how-to-disable-ace-editors-find-dialog
            this.editor.commands.addCommands([{
                    name: "unfind",
                    bindKey: { win: "Ctrl-F", mac: "Command-F" },
                    exec: function(editor, line) { return false; },
                    readOnly: true
            }, {
                    name: "unreplace",
                    bindKey: { win: "Ctrl-R", mac: "Command-R" },
                    exec: function(editor, line) { return false; },
                    readOnly: true
            }]);

            this.editor.setReadOnly(!this.options.editable);
            this.editor.renderer.setShowGutter(this.options.lineNumbers); 
        },

        createConsole: function() {
            var console_wrapper = $('<div></div>').addClass("codeblock-console");
            this.console  = $("<span></span>").addClass("codeblock-console-text");
            console_wrapper.append(this.console);
            this.console.text(this.options.consoleText);
            this.console.addClass("placeholder");
            this.console.width(this.el.width() - 70);

            if (this.options.runnable) {
                this.runButton = $("<span></span>").addClass("codeblock-console-run");
                this.runButton.text(this.options.runButtonText);

                var cur = this;
                this.runButton.click(function() {
                  if (cur.enabled) {
                      cur.run();
                  }
                });
                console_wrapper.append(this.runButton);
            }

            this.el.append(console_wrapper);
        },

        createResetButton: function() {
            var reset_button = $("<i></i>").addClass("codeblock-reset").attr("title", "Reset");

            var cur = this;
            reset_button.click(function() {
              cur.reset();
              return false;
            });
            this.base.after(reset_button);
        },

        destroy: function() {
            this.editor.destroy();
            this.editor = undefined;
            this.options = undefined;
            this.originalText = undefined;
            this.console = undefined;
            this.runButton = undefined;

            this.original.insertBefore(this.el);
            $.removeData(this.element, "plugin_" + pluginName);
            this.base.removeData("plugin_" + pluginName);

            this.base.remove();
            this.base = undefined;
            this.el.remove();
            this.el = undefined;
        },

        run: function() {
            // var val = "";
            // console.log("$$$",$(this));
            // //#MOD: Added this chunk.
            // var codeStringDict = getCode(codeBlockList, checkboxList);
            // console.log(codeStringDict);
            // //Two Possible Cases: Javascript OR Not-Javascript
            // //#MOD: Added this chunk. //For JavaScript
            // var originalEditorVal = this.editor.getValue();
            // var addedEditorVal = '';
            // if (typeof codeStringDict["js"] != "undefined"){
            //     for (var i=0; i<codeStringDict["js"].length; ++i){
            //         addedEditorVal += codeStringDict["js"][i]+"\n";
            //         console.debug("addedEditorVal:--> ",addedEditorVal);
            //     }
            //     val = addedEditorVal;//#REPLACED to solve duplicate-printing //this.editor.setValue( addedEditorVal + originalEditorVal );
            //     manageConsoleVal(addedEditorVal, this, true);
            // }

            //#ORIGINAL
            this.base.add(this.original).trigger("codeblock.run");
            //var val = this.editor.getValue(); //#MOD: This is replaced.

            // //#MOD: Added this chunk. //For Non-JavaScript
            // var passthis = this; //#QUICK-HACK
            // var codeTypeList = ["python", "ruby", "java"];
            // for (var i=0; i<codeTypeList.length; ++i){ //#QUICK-HACK
            //     languageManager(codeTypeList[i], codeStringDict, passthis);
            // }
            // function languageManager(languageName, codeStringDict, pthis){
            //     if(typeof codeStringDict[languageName] !="undefined"){ //#QUICK-HACK
            //         console.debug("evalCode() on "+languageName+" code...");
            //         console.debug(codeStringDict[languageName].join(';\n'));
            //         for (var i=0; i<codeStringDict[languageName].length; ++i){
            //             console.debug(codeStringDict[languageName][i]);
            //         }
            //         var precedingStr = '';
            //         //if (languageName=="python"){precedingStr = "# coding=utf-8\n";}
            //         pthis.console.html("(Loading...)"); //#QUICK-HACK
            //         evalCode(languageName, precedingStr+codeStringDict[languageName].join('\n'), function(returnValResult){manageConsoleVal(returnValResult, pthis, false)}, function(msg){console.error("ERROR return:-->", msg)});
            //     }
            // }

            //#QUICK-HACK
            var val = currRunCodeText;
            var pthis = this;
            if(currRunCodeType == "js"){
                manageConsoleVal(val, pthis, true);
            }
            else if (currRunCodeType == "html" || currRunCodeType == "css"){
                if (typeof htmlIframeRet == "undefined"){ //#QUICK-HACK
                    var ifrmRet = injectIframe(currRunCodeParent.children[currRunCodeParent.children.length-1]);
                    ifrmRet.idoc.getElementsByTagName("html")[0].innerHTML = this.editor.getValue();
                    ifrmRet.ifrm.id = "html-iframe-demo";
                    ifrmRet.ifrm.width = 700;
                    ifrmRet.ifrm.height = 500;
                    htmlIframeRet = ifrmRet;
                }
                else{ //#QUICK-HACK
                    htmlIframeRet.idoc.getElementsByTagName("html")[0].innerHTML = this.editor.getValue();
                }
            }
            else{
                pthis.console.html("(Loading...)");
                evalCode(currRunCodeType, currRunCodeText, function(returnValResult){manageConsoleVal(returnValResult, pthis, false)}, function(msg){console.error("ERROR return:-->", msg)});
            }

            function manageConsoleVal(returnValResult, pthis, isJS){
                val = returnValResult;

                //#ORIGINAL
                //clear text
                pthis.console.text('');
                pthis.console.removeClass("placeholder");
                var cur = pthis;
                //closure to overload console
                (function(){
                    var c = {};
                    c.log = function() {
                        var text = $.makeArray(arguments).join(" ");
                        var currText = cur.console.html();
                        currText += text + "<br/>";
                        cur.console.html(currText);
                        cur.base.add(cur.original).trigger("codeblock.console", [text]);
                    };
                    try {
                        //To catch returns & exceptions
                        //NOTE - this must be minified "by hand" to make sure that
                        //the variable named "console" is preserved
                        //Depending on your minifier, you may be able to set javascript
                        //comment flags to tell the minifier not to compile this
                        if (isJS){
                            (function(console){eval(val);})(c);
                        }
                        else {
                            c.log(val);
                        }

                    } catch (err) {
                        c.log("Error:", err);
                    }
                })();
            }//endof manageConsoleVal()

            return this;
        },

        reset: function() {
          this.base.add(this.original).trigger("codeblock.reset");

          this.editor.setValue(this.originalText);
          this.editor.clearSelection();
          this.editor.navigateFileStart();
          this.console.text(this.options.consoleText);
          this.console.addClass('placeholder');

          return this;
        },

        getSetText: function(newText) {
          if (newText !== undefined) {
              this.editor.setValue(newText);
              return this;
          } else {
              return this.editor.getValue();
          }
        },

        getEditor: function(){
          return this.editor;
        },

        getSetEditable: function(param){
          if (param !== undefined) {
              this.editor.setReadOnly(!param);
              return this;
          } else {
              return !this.editor.getReadOnly();
          }
        },

        getSetRunnable: function(param){
          if (param !== undefined) {
              this.enabled = param;
              this.runButton.toggleClass("disabled", !param);
              return this;
          } else {
              return this.options.runnable && this.enabled;
          }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing for
    // jquery-ui like method calls
    $.fn[pluginName] = function () {
        if (arguments.length === 0 || (arguments.length == 1 && typeof arguments[0] === "object")) {
            //constructor
            var options = arguments[0];
            return this.each(function(){
                var codeblock = $.data(this, "plugin_" + pluginName);
                if (!codeblock) {
                    codeblock = new CodeBlock( this, options );
                    $.data(this, "plugin_" + pluginName, codeblock);
                }
            });
        } else {
            //action (i.e. $(".blah").codeblock('run');
            var action = arguments[0];
            var params = Array.prototype.slice.call(arguments, 1);
            var ret = this.map(function(){
                var codeblock = $.data(this, "plugin_" + pluginName);
                if (codeblock) {
                    var method = codeblock._exports[action];
                    if (!method) { throw "Codeblock has no method "+action;}
                    return method.apply(codeblock, params);
                }
            }).get();

            //return "this" for everything but the getters
            if (action === "editor" || (params.length ===0 && (action == "runnable" || action == "editable"))) {
                return ret.length >= 1 ? ret[0] : undefined;
            } else if (params.length === 0 && action == "text") {
                return ret.join();
            } else {
                return this;
            }
        }
    };
})( jQuery, window, document );



// ;(function (global, $) {
//     'use strict';

//     var LinkedEditor = function ($textarea, options) {
//         var config = $.extend(true, {
//                 theme: 'textmate',
//                 mode: 'js'
//             }, options),

//             $editDiv = $('<div/>', {
//                     width: $textarea.width(),
//                     height: $textarea.height(),
//                     css: {
//                         margin: '8px 0 0 0'
//                     }
//                 }).insertAfter($textarea),

//             editor = ace.edit($editDiv[0]);

//         $textarea.css({
//             width: '1px',
//             height: '1px',
//             padding: 0,
//             margin: 0,
//             display: 'none'
//         });

//         editor.getSession().setUseSoftTabs(true);
//         editor.getSession().setMode('ace/mode/' + config.mode);
//         editor.setTheme('ace/theme/' + config.theme);
//         editor.getSession().setValue($textarea.val());

//         this.$textarea = $textarea;
//         this.editor = editor;
//         this.$editDiv = $editDiv;

//         this.setupListeners();
//     };

//     LinkedEditor.prototype.setupListeners = function () {
//         var _this = this,
//             $textarea = this.$textarea,
//             editor = this.editor,
//             $editDiv = this.$editDiv,
//             $container = $textarea.parent(),
//             $buttonRow = $container.find('.wmd-button-row'),
//             $grippie = $container.find('.grippie'),
//             keyCommands = {
//                 bold:    'Ctrl-b',
//                 italic:  'Ctrl-i',
//                 link:    'Ctrl-l',
//                 quote:   'Ctrl-q',
//                 code:    'Ctrl-k',
//                 image:   'Ctrl-g',
//                 olist:   'Ctrl-o',
//                 ulist:   'Ctrl-u',
//                 heading: 'Ctrl-h',
//                 hr:      'Ctrl-r',
//                 undo:    'Ctrl-z',
//                 redo:    'Ctrl-Shift-z'
//             },

//             resizeListener = function (e) {
//                 var height = e.data.originalHeight + (e.clientY - e.data.draggedAt);

//                 if (height > 64) {
//                     $editDiv.height(height);
//                 }
//             },

//             undoButton = (function () {
//                 var $undoButton,
//                     enabled = false;

//                 $buttonRow.find('#wmd-undo-button').replaceWith(
//                     '<li class="wmd-button" id="wmd-undo-button" title="Undo - Ctrl+Z" style="left: 325px;">' +
//                         '<span style="background-position: -200px -20px;"></span>' +
//                     '</li>'
//                 );

//                 $undoButton = $buttonRow.find('#wmd-undo-button');

//                 $undoButton.on('mouseover', function () {
//                     if (enabled) {
//                         $(this).find('span').css('background-position', '-200px -40px');
//                     }
//                 });

//                 $undoButton.on('mouseout', function () {
//                     if (enabled) {
//                         $(this).find('span').css('background-position', '-200px 0');
//                     } else {
//                         $(this).find('span').css('background-position', '-200px -20px');
//                     }
//                 });

//                 $undoButton.on('click', function () {
//                     if (enabled) {
//                         editor.focus();
//                         editor.undo();
//                     }
//                 });

//                 return {
//                     enable: function () {
//                         enabled = true;
//                         $buttonRow.find('#wmd-undo-button span').css('background-position', '-200px 0');
//                     },

//                     disable: function () {
//                         enabled = false;
//                         $buttonRow.find('#wmd-undo-button span').css('background-position', '-200px -20px');
//                     }
//                 };
//             }()),

//             redoButton = (function () {
//                 var $redoButton,
//                     enabled = false;

//                 $buttonRow.find('#wmd-redo-button').replaceWith(
//                     '<li class="wmd-button" id="wmd-redo-button" title="Redo - Ctrl+Shift+Z" style="left: 350px;">' +
//                         '<span style="background-position: -220px -20px;"></span>' +
//                     '</li>'
//                 );

//                 $redoButton = $buttonRow.find('#wmd-redo-button');

//                 $redoButton.on('mouseover', function () {
//                     if (enabled) {
//                         $(this).find('span').css('background-position', '-220px -40px');
//                     }
//                 });

//                 $redoButton.on('mouseout', function () {
//                     if (enabled) {
//                         $(this).find('span').css('background-position', '-220px 0');
//                     } else {
//                         $(this).find('span').css('background-position', '-220px -20px');
//                     }
//                 });

//                 $redoButton.on('click', function () {
//                     if (enabled) {
//                         editor.focus();
//                         editor.redo();
//                     }
//                 });

//                 return {
//                     enable: function () {
//                         enabled = true;
//                         $buttonRow.find('#wmd-redo-button span').css('background-position', '-220px 0');
//                     },

//                     disable: function () {
//                         enabled = false;
//                         $buttonRow.find('#wmd-redo-button span').css('background-position', '-220px -20px');
//                     }
//                 };
//             }());

//         // On editor change update textarea value
//         editor.getSession().on('change', function () {
//             $textarea.val(editor.getSession().getValue());
//             $textarea.trigger('paste');
//             _this.updateUndoRedoButtonState();
//             _this.prettifyOutput();
//         });

//         // On textarea input update editor value
//         $textarea.on('keypress', function () {
//             editor.getSession().setValue($textarea.val());
//         });

//         // Update text from textarea on image upload dialog close
//         $(document).on('submit', '#image-upload #upload-form', function () {
//             var originalCloseDialog = window.closeDialog;

//             window.closeDialog = function (url) {
//                 originalCloseDialog(url);

//                 setTimeout(function () {
//                     _this.copyTextareaSelectionToEditor();
//                 }, 100);
//             };

//             setTimeout(function () {
//                 _this.copyTextareaSelectionToEditor();
//             }, 0);
//         });

//         // Update text from textarea on url dialog form submit (eg. close)
//         $(document).on('submit', '.wmd-prompt-dialog form', function () {
//             setTimeout(function () {
//                 _this.copyTextareaSelectionToEditor();
//             }, 0);
//         });
//         // Clicking OK in url dialog not firing form submit event, so listen to OK's mouseup...
//         $(document).on('mouseup', '.wmd-prompt-dialog form :button:first', function () {
//             setTimeout(function () {
//                 _this.copyTextareaSelectionToEditor();
//             }, 0);
//         });

//         // Proxy key commands from editor to textarea
//         _this.setupEditorKeyCommands(keyCommands);

//         // Disable button bar buttons default behaviour and replace with
//         // manually triggered key commands.
//         $buttonRow.find('.wmd-button:not(#wmd-help-button)').each(function () {
//             this.onclick = null;
//         });

//         $buttonRow.find('.#wmd-help-button').on('mouseup', function () {
//             $textarea.show();
//         });

//         $buttonRow.on('click', '.wmd-button:not(#wmd-undo-button, #wmd-redo-button)', function (e) {
//             var commandName = this.id.match(/wmd-(.+)-button/)[1];

//             _this.copyEditorSelectionToTextarea();

//             if (commandName in keyCommands) {
//                 _this.triggerKeydownEvent($textarea, keyCommands[commandName])
//             }

//             _this.copyTextareaSelectionToEditor();
//         });

//         $textarea.closest('form').on('submit', function () {
//             $textarea.val(editor.getSession().getValue());
//         });

//         if ($grippie.length > 0) {
//             $grippie.off('mousedown');

//             $grippie.on('mousedown', function (e) {
//                 $editDiv.css('opacity', 0.25);

//                 $('body').on(
//                     'mousemove',
//                     {
//                         draggedAt: e.clientY,
//                         originalHeight: $editDiv.height()
//                     },
//                     resizeListener
//                 );
//             });

//             $grippie.on('mouseup', function () {
//                 editor.resize();
//                 $editDiv.css('opacity', 1);
//                 editor.focus();
//                 $('body').off('mousemove', resizeListener);
//             });
//         }

//         this.undoButton = undoButton;
//         this.redoButton = redoButton;
//     };

//     LinkedEditor.prototype.createSelectionFromRange = function () {
//         var session = this.editor.getSession(),
//             numberOfLines = session.getLength(),
//             i,
//             count = 0,
//             start,
//             end,
//             newLineCharacterLength = session.getDocument().getNewLineCharacter().length,
//             text = session.getLines(0, numberOfLines),
//             range = session.selection.getRange();

//         for (i = 0; i <= range.start.row; i++) {
//             count += text[i].length + newLineCharacterLength;
//         }

//         start = count - (text[range.start.row].length - range.start.column) - newLineCharacterLength;

//         for (i = range.start.row + 1; i <= range.end.row; i++) {
//             count += text[i].length + newLineCharacterLength;
//         }

//         end = count - (text[range.end.row].length - range.end.column) - newLineCharacterLength;

//         return {
//             start: start,
//             end: end
//         };
//     };

//     LinkedEditor.prototype.createRangeFromSelection = function (start, end) {
//         var editor = this.editor,
//             session = editor.getSession(),
//             numberOfLines = session.getLength(),
//             i,
//             count = 0,
//             newLineCharacterLength = session.getDocument().getNewLineCharacter().length,
//             text = session.getLines(0, numberOfLines),
//             range = session.selection.getRange();

//         for (i = 0; i < numberOfLines; i++) {
//             count += text[i].length + newLineCharacterLength;
//             if (count > start) {
//                 break;
//             }
//         }

//         range.start = {
//             row: i,
//             column: (text[i].length + newLineCharacterLength) - (count - start)
//         };

//         if (count < end) {
//             for (i = range.start.row + 1; i < numberOfLines; i++) {
//                 count += text[i].length + newLineCharacterLength;

//                 if (count >= end) {
//                     break;
//                 }
//             }
//         }

//         range.end = {
//             row: i,
//             column: (text[i].length + newLineCharacterLength) - (count - end)
//         };

//         return range;
//     };

//     LinkedEditor.prototype.triggerKeydownEvent = function (element, keyCombination) {
//         var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events"),
//             ctrl = /[Cc]trl/.test(keyCombination),
//             shift = /[Ss]hift/.test(keyCombination),
//             keyCode = keyCombination.match(/.$/)[0].charCodeAt(0);

//         if (element instanceof $) {
//             element = element.get(0);
//         }

//         if (eventObj.initEvent) {
//             eventObj.initEvent("keydown", true, true);
//         }

//         eventObj.keyCode = keyCode;
//         eventObj.which = keyCode;
//         eventObj.ctrlKey = ctrl;
//         eventObj.shiftKey = shift;

//         element.dispatchEvent ? element.dispatchEvent(eventObj) : element.fireEvent("onkeydown", eventObj);
//     };

//     LinkedEditor.prototype.copyEditorSelectionToTextarea = function () {
//         var selection = this.createSelectionFromRange();

//         this.$textarea
//             .show()
//             .focus()
//             .textrange('set', selection.start, selection.end - selection.start);
//     };

//     LinkedEditor.prototype.copyTextareaSelectionToEditor = function () {
//         var $textarea = this.$textarea,
//             editor = this.editor,
//             textareaRange = $textarea.textrange('get');

//         editor.getSession().setValue($textarea.val());
//         editor.getSelection().setSelectionRange(
//             this.createRangeFromSelection(textareaRange.start, textareaRange.end)
//         );

//         editor.focus();
//         $textarea.hide();
//     };

//     LinkedEditor.prototype.setupEditorKeyCommands = function (keyCombinations) {
//         var _this = this,
//             editor = this.editor,
//             $textarea = this.$textarea;

//         for (var i in keyCombinations) {
//             if (keyCombinations.hasOwnProperty(i)) {
//                 (function (i) {
//                     editor.commands.addCommand({
//                         name: keyCombinations[i],
//                         bindKey: {
//                             win: keyCombinations[i],
//                             mac: keyCombinations[i]
//                         },
//                         exec: function () {
//                             if (i === 'undo') {
//                                 editor.undo();
//                             } else if (i === 'redo') {
//                                 editor.redo();
//                             } else {
//                                 _this.copyEditorSelectionToTextarea();
//                                 _this.triggerKeydownEvent($textarea.get(0), keyCombinations[i]);
//                                 _this.copyTextareaSelectionToEditor();
//                             }
//                         }
//                     });
//                 }(i));
//             }
//         }
//     };

//     LinkedEditor.prototype.updateUndoRedoButtonState = (function () {
//         var timer;

//         return function () {
//             var _this = this;

//             global.clearTimeout(timer);

//             timer = global.setTimeout(function () {
//                 if (_this.editor.getSession().getUndoManager().hasUndo()) {
//                     _this.undoButton.enable();
//                 } else {
//                     _this.undoButton.disable();
//                 }

//                 if (_this.editor.getSession().getUndoManager().hasRedo()) {
//                     _this.redoButton.enable();
//                 } else {
//                     _this.redoButton.disable();
//                 }
//             }, 100);
//         }
//     }());

//     LinkedEditor.prototype.prettifyOutput = (function () {
//         var timer;

//         return function () {
//             var $textarea = this.$textarea,
//                 $pre = $textarea.closest('.post-editor').find('.wmd-preview pre');

//             $pre.each(function () {
//                 $(this).attr('class', '');
//             });

//             global.clearTimeout(timer);

//             timer = global.setTimeout(function () {
//                 $pre.each(function () {
//                     $(this).attr('class', 'prettyprint');
//                 });
//             }, 2000);
//         };
//     }());

//     global.LinkedEditor = LinkedEditor;
// }(window, window.jQuery));