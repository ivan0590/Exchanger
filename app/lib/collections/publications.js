Publications = new Meteor.Collection('publications');

Meteor.startup(function() {

    Schema = new SimpleSchema({
        name: {
            type: String,
            max: 200
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            min: 0
        },
        category: {
            type: String
        },
        age: {
            type: String
        },
        photo: {
            type: String
        },
        createdAt: {
            type: Date
        },
        owner: {
            type: String
        }
    });

    Schema.i18n("schemas.publications");
    
    Publications.attachSchema(Schema);

});


if (Meteor.isServer) {
    Publications.allow({
        insert: function(userId, doc) {
            return false;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return false;
        },

        remove: function(userId, doc) {
            return false;
        }
    });

    Publications.deny({
        insert: function(userId, doc) {
            return true;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return true;
        },

        remove: function(userId, doc) {
            return true;
        }
    });
}
