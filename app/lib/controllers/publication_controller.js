PublicationController = RouteController.extend({
    subscriptions: function() {

        TAPi18n.subscribe("categories");
        TAPi18n.subscribe("ages");
        Meteor.subscribe("images_publications");
    },

    data: function() {

    },

    create: function() {
        this.render('CreatePublication');
    },

    show: function() {

        var publication = Publications.findOne({
            _id: new Mongo.ObjectID(this.params._id)
        });

        this.render('Publication', {
            data: publication
        });

    },

    edit: function() {

        var publication = Publications.findOne({
            _id: new Mongo.ObjectID(this.params._id)
        });

        this.render('EditPublication', {
            data: publication
        });

    }
});
