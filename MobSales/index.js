"use strict";

window.MobSales = window.MobSales || {};

!function () {
   
    var ms = window.MobSales,
        app,
        currentBackAction,
        device = DevExpress.devices.current(),
        APP_SETTINGS = {
            namespace: ms,
            navigationType: ms.config.navigationType,
            navigation: ms.config.navigation,
            commandMapping: {
                "ios-header-toolbar": {
                    commands: [
                        { id: "search", location: 'right', showText: false }
                    ]
                },
                "android-footer-toolbar": {
                    commands: [
                        { id: "search", location: 'center', showText: false }
                    ]
                },
                "tizen-footer-toolbar": {
                    commands: [
                          { id: "search", location: 'center', showText: false }
                    ]
                },
                "generic-header-toolbar": {
                    commands: [
                        { id: "search", location: 'right', showText: false }
                    ]
                },
                "win8-phone-appbar": {
                    commands: [
                        { id: "search", location: 'center', showText: true }
                    ]
                },
            }
        };

    $.extend(ms, {

        hardwareBackButton: (device.phone && device.platform === "win8") || device.platform === "android" || device.platform === "tizen",
    });

    var subviewMap = {
        "Home": [],
        "Settings": [],
        "About": [],
    };

    function testUri(patterns, uri) {
        var pattern = [],
            regexp;

        $.each(patterns, function () {
            pattern.push(this.replace("/", "\\/").replace("*", ".+"));
        });

        regexp = new RegExp("^(" + pattern.join("|") + ")$");
        return regexp.test(uri);
    }

    function isWorkoutMaster(uri) {
        return testUri(subviewMap["Home"], uri);
    }

    function startApp(needToSynchronize) {
        if (needToSynchronize)
            ms.app.navigate("Settings/1");
        else
            ms.app.navigate();
    }

    function onNavigate(args) {
        if (!args.currentUri)
            return;

        if (subviewMap[args.uri] && testUri(subviewMap[args.uri], args.currentUri) && args.options.location === "navigation") {
            args.cancel = true;
            return;
        }

    }

    function onViewShown(args) {
        var viewInfo = args.viewInfo;
        if (viewInfo.model.hideNavigationButton)
            viewInfo.renderResult.$markup.find(".nav-button-item").remove();

        currentBackAction = viewInfo.model.backButtonDown;
    }

    function onBackButton() {
        if (currentBackAction) {
            currentBackAction();
        } else {
            if (ms.app.canBack()) {
                ms.app.back();
            } else {
                if (confirm("Are you sure you want to exit?")) {
                    switch (device.platform) {
                        case "tizen":
                            tizen.application.getCurrentApplication().exit();
                            break;
                        case "android":
                            navigator.app.exitApp();
                            break;
                        case "win8":
                            window.external.Notify("DevExpress.ExitApp");
                            break;
                    }
                }
            }
        }
    }

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackButton, false);
        navigator.splashscreen.hide();
    }

    $(function () {
        FastClick.attach(document.body);
        // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
        // DevExpress.devices.current({ platform: "generic" });
        app = ms.app = new DevExpress.framework.html.HtmlApplication(APP_SETTINGS);
        app.router.register(":view/:item", { view: "Home", item: undefined });

        startApp(!ms.dataservice.initUserData());
        
        setTimeout(function () {
            document.addEventListener("deviceready", onDeviceReady, false);
            if (device.platform == "tizen") {
                document.addEventListener("tizenhwkey", function (e) {
                    if (e.keyName === "back")
                        onBackButton();
                });
            }
        }, 1000);
    });
//    DevExpress.devices.current({ platform: 'ios' });
//    DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform);
}();
