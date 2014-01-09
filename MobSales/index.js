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
            navigation: ms.config.navigation
        };

    $.extend(ms, {

        hardwareBackButton: (device.phone && device.platform === "win8") || device.platform === "android" || device.platform === "tizen",
    });

    var subviewMap = {
        "Home": [],
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

    function startApp() {
        //var current = wo.getCurrentFromStorage();

        //if (current && confirm("Do you want to continue workout in progress?")) {
        //    var workout = wo.createWorkoutViewModel();
        //    workout.fromJS(current);
        //    wo.currentWorkout = workout;
        //    wo.app.navigate("Results");
        //    return;
        //}

        //wo.removeCurrentWorkout();
        console.log("startapp");
        ms.app.navigate();
    }

    function onNavigate(args) {
        if (!args.currentUri)
            return;

        if (subviewMap[args.uri] && testUri(subviewMap[args.uri], args.currentUri) && args.options.location === "navigation") {
            args.cancel = true;
            return;
        }

        //if (args.options.location === "navigation" && args.options.target !== "back" && isWorkoutMaster(args.currentUri) && !isWorkoutMaster(args.uri)) {
        //    if (!confirm("Cancel workout in progress?")) {
        //        args.cancel = true;
        //    } else {
        //        wo.removeCurrentWorkout();
        //    }
        //}
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
        console.log("deviceready");
        document.addEventListener("backbutton", onBackButton, false);
       //document.addEventListener("pause", wo.saveCurrentWorkout, false);
        navigator.splashscreen.hide();
    }

    $(function () {
        // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
        // DevExpress.devices.current({ platform: "generic" });
        console.log("start");
        app = ms.app = new DevExpress.framework.html.HtmlApplication(APP_SETTINGS);
        app.router.register(":view/:action/:item", { view: "Home", action: undefined, item: undefined });
        ms.app.viewShown.add(onViewShown);
        ms.app.navigationManager.navigating.add(onNavigate);

        //wo.initUserData();
        startApp();

        setTimeout(function () {
            document.addEventListener("deviceready", onDeviceReady, false);
            //window.onunload = wo.saveCurrentWorkout;
            console.log("delay");
            if (device.platform == "tizen") {
                document.addEventListener("tizenhwkey", function (e) {
                    if (e.keyName === "back")
                        onBackButton();
                });
            }
        }, 1000);
    });
//    DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform);
}();