PublicationController = RouteController.extend({
    subscriptions: function() {
        
    },

    data: function() {
        
    },

    create: function() {

        if (!Meteor.userId()) {
            Router.go('home');
        }
        
        this.render('CreatePublication');
    },

    show: function() {

        var publication;

        try {

            publication = Publications.findOne({
                _id: new Mongo.ObjectID(this.params._id)
            });

            if (publication) {
                this.render('Publication', {
                    data: publication
                });
            }

        } catch (e) {
            
            console.log("Publication doesn't exists");

        } finally {

            if(!publication){
                Router.go('home');
            }
        }

    },

    edit: function() {
        
        var publication;

        try {

            publication = Publications.findOne({
                _id: new Mongo.ObjectID(this.params._id)
            });

            if (publication) {
                this.render('EditPublication', {
                    data: publication
                });
            }

        } catch (e) {
            
            console.log("Publication doesn't exists");

        } finally {

            if(!publication){
                Router.go('home');
            }
        }

    }
});
