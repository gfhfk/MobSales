MobSales.CreateOrder = function (params) {
    logger = MobSales.logger,
    app = MobSales;

    var viewModel = {

        customerID: params.id,
        // Wizard
        steps: [
            { text: "New Order" },
            { text: "Select Products" },
            { text: "Summary" }
        ],
        backBtntext: ko.observable('Cancel'),
        nextBtntext: ko.observable('Next'),
        currentStep: ko.observable(0),
        previousStep: previousStep,
        nextStep: nextStep,
        // data
        newOrder: ko.observable(createOrder(params.id)),
        productTypes: ko.observableArray(),
        currentElemet: ko.observableArray(),
        orderDetails: ko.observableArray(),
        productList: ko.observableArray(),
        totalSum: ko.observable(0),
        // filters
        productTypeId: ko.observable(0),
        showSearch: ko.observable(false),
        find: function () {
            viewModel.showSearch(!viewModel.showSearch());
            viewModel.productTypeId(0);
        },
        //calsulator
        overlayVisible: ko.observable(false),
        display: ko.observable("0"),
        cancelOrder: cancelOrder,
        showOverlay: showOverlay,
        hideOverlay: hideOverlay,
        numberClick: numberClick,
        backspaceClick: backspaceClick,
        clearClick: clearClick,

        viewShowing: viewShowing,

    };
    function viewShowing() {
        viewModel.productTypes(app.dataservice.getProductTypes());
        viewModel.productTypes.unshift({ ProductTypeID: 0, ProductTypeName: "All..." });
        viewModel.productList (app.dataservice.getProducts().map(function (item) {
                        item.Quantity = ko.observable(0);
                        item.filtered = ko.computed(function () {
                            var ret = true;
                            if (viewModel.productTypeId() > 0 && viewModel.productTypeId() != item.ProductTypeID())
                                ret = false;
                            return ret;
                        });
                        item.sum = ko.computed(function () {
                            return Math.round(item.Price() * item.Quantity() * 100) / 100;
                        });
                        return item;

        }));
        

    }
  

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

        return app.dataservice.createOrder(customerID);
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
    viewModel.totalSum = ko.computed(function () {
        var total = 0;
        ko.utils.arrayForEach(this.productList(), function (item) {
            var value = parseFloat(item.sum());
            if (!isNaN(value)) {
                total += value;
            }
        });
        return total.toFixed(2);
    }, viewModel);
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
