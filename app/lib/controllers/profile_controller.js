ProfileController = RouteController.extend({
    subscriptions: function() {
        Meteor.subscribe("images_profiles");
    },

    data: function() {

    },

    show: function() {

        var user = Meteor.users.findOne({
            _id: this.params._id
        });

        this.render('Profile', {
            data: user
        });

    },

    edit: function() {

        var user;

        user = Meteor.users.findOne({
            _id: this.params._id
        });

        this.render('EditProfile', {
            data: user
        });
        
    }
});
