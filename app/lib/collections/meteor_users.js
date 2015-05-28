if (Meteor.isServer) {
    Meteor.users.deny({
        update: function() {
            return true;
        }
    });
}
