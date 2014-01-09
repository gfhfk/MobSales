MobSales.logger = (function () {

    var timeOut=2000; 

    var logger = {
        error: error,
        info: info,
        success: success,
        warning: warning,
        log: log // straight to console; bypass toast
    };

    function error(message, title) {
        DevExpress.ui.notify(message, 'error', timeOut);
        log("Error: " + message);
    };
    function info(message, title) {
        DevExpress.ui.notify(message, 'info', timeOut);
        log("Info: " + message);
    };
    function success(message, title) {
        DevExpress.ui.notify(message, 'success', timeOut);
        log("Success: " + message);
    };
    function warning(message, title) {
        DevExpress.ui.notify(message, 'warning', timeOut);
        log("Warning: " + message);
    };

    // IE and google chrome workaround
    // http://code.google.com/p/chromium/issues/detail?id=48662
    function log() {
        var console = window.console;
        !!console && console.log && console.log.apply && console.log.apply(console, arguments);
    }

    return logger;
})();