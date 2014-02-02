/// <reference path="../Scripts/_references.js" />
MobSales.dataservice = function ($, DX, app, undefined) {
    var DATA_VERSION_KEY = "mobilesales-version",
    DATA_KEY = "mobilesales-data",
    logger = app.logger;
    serviceName = "http://mobsalessrv.azurewebsites.net/odata/";
    breeze.config.initializeAdapterInstances({ dataService: "OData" });
    var manager = new breeze.EntityManager(serviceName);
    var store = manager.metadataStore;

    var queries = {
       Routes: {
            name: "Routes",
            query: breeze.EntityQuery.from("Routes").orderBy("RouteID"),
        },
       Customers: {
            name: "Customers",
            query: breeze.EntityQuery.from("Customers").orderBy("CustomerName"),
         },
       ProductTypes: {
           name: "ProductTypes",
           query: breeze.EntityQuery.from("ProductTypes").orderBy("ProductTypeName"),
       },
       Products: {
           name: "Products",
           query: breeze.EntityQuery.from("Products").orderBy("ProductName"),
       },
       Orders: {
           name: "Orders",
           query: breeze.EntityQuery.from("Orders").orderBy("Date"),
       },
       OrderDetails: {
           name: "OrderDetails",
           query: breeze.EntityQuery.from("OrderDetails"),
       },
    };
    
    function initUserData() {
        var dataFromStorage = localStorage.getItem(DATA_KEY);
        if (dataFromStorage) {
            manager.importEntities(dataFromStorage);
            return true;
        } else {
            return false;
        }
    }

    
    function loadData(query) {
        return manager.executeQuery(query);
    }
    function  getRoutes(){
        return manager.executeQueryLocally(queries.Routes.query);
    };
    function getProductTypes() {
        return manager.executeQueryLocally(queries.ProductTypes.query);
    };
    function getProducts() {
        return manager.executeQueryLocally(queries.Products.query);
    };
    function getCustomers() {
        return manager.executeQueryLocally(queries.Customers.query);
    };
    function getProduct(productID) {
        var query = queries.Products.query.where("ProductID", "==", productID);
        return manager.executeQueryLocally(query)[0];
    };

    function getOrders(customerID) {
        var query = queries.Orders.query;
    
        if (typeof customerID != "undefined" && customerID > 0)
            query= query.where("CustomerID", "==", customerID);

        return manager.executeQueryLocally(query);
    };
    function getOrderDetails(orderID) {
        var query = queries.OrderDetails.query;
        if (typeof orderID != "undefined" && orderID > 0)
            query = query.where("OrderID", "==", orderID);
        var result = manager.executeQueryLocally(query);
        result.forEach(function (item) {
                item.ProductName = getProduct(item.ProductID()).ProductName;
        });
        return result;
    };

    function saveDataLocally() {
        var exportData = manager.exportEntities();
        localStorage.setItem(DATA_KEY, exportData);
    }

    function createOrder(customerID) {
     
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        var orderType = manager.metadataStore.getEntityType("Order");
        var newOrder = orderType.createEntity({
            OrderID: breeze.core.getUuid(),
            CustomerID: customerID,
            Date: today,
            DeliveryDate: tomorrow,
        });

        return manager.addEntity(newOrder);
    }

    var dataservice =  {
        manager: manager,
        metadataStore: manager.metadataStore,
        initUserData: initUserData,
        queries: queries,
        loadData: loadData,
        getRoutes: getRoutes,
        getCustomers: getCustomers,
        saveDataLocally: saveDataLocally,
        getOrders: getOrders,
        getOrderDetails: getOrderDetails,
        getProductTypes: getProductTypes,
        getProducts: getProducts,
        createOrder: createOrder,
    };
    return dataservice;
}(jQuery, DevExpress, MobSales);