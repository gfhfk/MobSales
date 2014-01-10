MobSales.Home = function (params) {
    var app = MobSales,
        self = this;

    var vm = {
        routes: ko.observableArray([]),
        customers: ko.observableArray([]),
        viewShowing: viewShowing,
        routeId: ko.observable(),
    };
    function viewShowing() {
        vm.routes(app.dataservice.getRoutes());
        vm.routes.unshift({ RouteID: 0, RouteName: "All..." });
        vm.customers($.map(app.dataservice.getCustomers(), function (item) {
            item.filtered = ko.computed(function () {
                if (vm.routeId() > 0 && vm.routeId() != item.RouteID()) {
                    return false;
                }
                return true;
            });
            return item;

        }));
    }
    return vm;
};

