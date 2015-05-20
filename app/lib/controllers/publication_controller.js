PublicationController = RouteController.extend({
    subscriptions: function() {

    },

    data: function() {
        
    },

    create: function() {

        this.render('CreatePublication');
    },

    show: function() {

        try {

            var publication = Publications.findOne({
                _id: new Mongo.ObjectID(this.params._id)
            });

            if (publication) {
                this.render('Publication', {
                    data: publication
                });
            } else {
                Router.go('home');
            }

        } catch (e) {
            Router.go('home');
        }

    },

    edit: function() {
        
        try {

            var publication = Publications.findOne({
                _id: new Mongo.ObjectID(this.params._id),
                owner: Meteor.userId()
            });

            if (publication) {
                this.render('EditPublication', {
                    data: publication
                });
            } else {
                Router.go('home');
            }

        } catch (e) {
            Router.go('home');
        }

    }
});
