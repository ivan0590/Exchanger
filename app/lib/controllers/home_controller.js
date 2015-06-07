HomeController = RouteController.extend({
    subscriptions: function() {
        TAPi18n.subscribe("categories");
        TAPi18n.subscribe("ages");
    },
    action: function() {
        this.render('Home');
    }
});
