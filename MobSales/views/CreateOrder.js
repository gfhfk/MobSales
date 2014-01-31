MobSales.CreateOrder = function (params) {
    logger = MobSales.logger;
    var viewModel = {

        customerID: params.id,
        steps: [
            { text: "New Order" },
            { text: "Select Products" },
            { text: "Summary" }
        ],
        backBtntext: ko.observable('Cancel'),
        nextBtntext: ko.observable('Next'),
        currentStep: ko.observable(0),
        newOrder: ko.observable(createOrder(params.id)),
        showSearch: ko.observable(false),
        overlayVisible: ko.observable(false),
        productTypeId: ko.observable(0),
        productTypes: ko.observableArray(),
        currentElemet: ko.observableArray(),
        display: ko.observable("0"),
        orderDetails: ko.observableArray(),
        find: function () {
            viewModel.showSearch(!viewModel.showSearch());
            viewModel.productTypeId(0);
        },
        productList: ko.observableArray(),

        previousStep: previousStep,
        nextStep: nextStep,
        cancelOrder: cancelOrder,
        showOverlay: showOverlay,
        hideOverlay: hideOverlay,
        numberClick: numberClick,
        backspaceClick: backspaceClick,
        clearClick: clearClick
    };

    //MSalesApp.dataservice.getAllProductTypes().
    //    then(function (data) {
    //        viewModel.productTypes = data.results;
    //        viewModel.productTypes.unshift({ ProductTypeID: 0, ProductTypeName: "All..." });
    //    }).fail(function (error) {
    //        logger.error("Load data error. Try later.");
    //        logger.log(error);
    //    });
    //MSalesApp.dataservice.getAllProducts().
    //    then(function (data) {
    //        viewModel.productList = ko.observableArray($.map(data.results, function (item) {
    //            item.Quantity = ko.observable(0);
    //            item.filtered = ko.computed(function () {
    //                var ret = true;
    //                if (viewModel.productTypeId() > 0 && viewModel.productTypeId() != item.ProductTypeID())
    //                    ret = false;
    //                return ret;
    //            });
    //            item.sum = ko.computed(function () {
    //                return Math.round(item.Price() * item.Quantity() * 100) / 100;
    //            });
    //            return item;

    //        }));
    //        viewModel.totalSum = ko.computed(function () {
    //            var total = 0;
    //            ko.utils.arrayForEach(this.productList(), function (item) {
    //                var value = parseFloat(item.sum());
    //                if (!isNaN(value)) {
    //                    total += value;
    //                }
    //            });
    //            return total.toFixed(2);
    //        }, viewModel);
    //    }).fail(function (error) {
    //        logger.error("Load data error. Try later.");
    //        logger.log(error);
    //    });



    function cancelOrder() {
        if (!confirm("Are you sure you want to cancel this Oreder?"))
            return;
        MSalesApp.app.navigate("orders/" + viewModel.customerID);

    }
    function previousStep() {
        viewModel.currentStep(viewModel.currentStep() - 1);
    };
    function nextStep() {
        viewModel.currentStep(viewModel.currentStep() + 1);
    };

    function createOrder(customerID) {

        return MSalesApp.dataservice.createOrder(customerID);
    };
    viewModel.currentStep.subscribe(function (value) {
        if (value == 0) {
            viewModel.backBtntext("Cancel");
        } else {
            viewModel.backBtntext("Back");
        }
        if (value == viewModel.steps.length - 1) {

            viewModel.nextBtntext("Save");
        } else {
            viewModel.nextBtntext("Next");
        }

    });

    function showOverlay(data) {
        viewModel.display(String(data.Quantity()));
        viewModel.overlayVisible(true);
        viewModel.currentElemet = data;
    };
    function hideOverlay(data) {
        viewModel.currentElemet.Quantity(viewModel.display());
        viewModel.overlayVisible(false);
    };
    function numberClick(number) {
        var button = number.element.text();
        var newValue = (viewModel.display() === "0") ? button : viewModel.display() + button;
        this.display(newValue);
    };
    function clearClick(number) {
        viewModel.display("0");
    }
    function backspaceClick(number) {
        var self = viewModel;
        if (this.display().length > 1) {
            self.display(self.display().substr(0, self.display().length - 1));
        } else {
            self.display("0");
        }
    }
    return viewModel;
}
