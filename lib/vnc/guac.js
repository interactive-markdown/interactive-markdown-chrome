function VNC(options) {
    var self = this;
    var display = document.getElementById(options.el);
    var guac = new Guacamole.Client(new Guacamole.ChainedTunnel(
            new Guacamole.WebSocketTunnel("websocket-tunnel"),
            new Guacamole.HTTPTunnel("tunnel")
        ));
    display.appendChild(guac.getDisplay().getElement());
    guac.onerror = function(error) {
        console.log('ERROR: ' + error);
    };

    guac.connect();

    var mouse = new Guacamole.Mouse(guac.getDisplay().getElement());
    mouse.onmousedown = mouse.onmouseup = mouse.onmousemove = function(mouseState) {
        guac.sendMouseState(mouseState);
    };

    var keyboard = new Guacamole.Keyboard(document);
    keyboard.onkeydown = function (keysym) {
        guac.sendKeyEvent(1, keysym);
    };
    keyboard.onkeyup = function (keysym) {
        guac.sendKeyEvent(0, keysym);
    };
    window.onunload = function() {
        guac.disconnect();
    }
    self._guac = guac;
}
