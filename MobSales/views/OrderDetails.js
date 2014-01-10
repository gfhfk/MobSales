MobSales.OrderDetails = function (params) {
    var app = MobSales,
        self = this;

    var vm = {
        orderID: params.item,
        orderDetails: ko.observableArray([]),
        viewShowing: viewShowing,
    };
    function viewShowing() {
        vm.orderDetails(app.dataservice.getOrderDetails(vm.orderID));
    }
    return vm;
};

