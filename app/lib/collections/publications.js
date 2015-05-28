Publications = new Meteor.Collection('publications');

PublicationsPagination = new Meteor.Pagination(Publications, {
    templateName: "PublicationsList",
    itemTemplate: "PublicationsListItem",
    divWrapper: false,
    infinite: true,
    infiniteTrigger: 0.8,
    infiniteItemsLimit: Infinity,
    dataMargin: 0,
    paginationMargin: 0,
    perPage: 21,
    resetOnReload: true,
    fastRender: false,
    availableSettings: {
        sort: true,
        filters: true
    }
});

Meteor.startup(function() {
    PublicationsSchema = new SimpleSchema({
        _id: {
            type: Mongo.ObjectID,
            optional: true
        },
        name: {
            type: String,
            max: 200
        },
        description: {
            type: String,
            max: 500
        },
        price: {
            type: Number,
            decimal: true,
            min: 0
        },
        category: {
            type: String,
            autoform: {
                firstOption: TAPi18n.__('category')
            }
        },
        age: {
            type: String,
            autoform: {
                firstOption: TAPi18n.__('age')
            }
        },
        photo: {
            type: String
        },
        status: {
            type: Number,
            optional: true,
            decimal: false,
            autoform: {
                firstOption: TAPi18n.__('status')
            }
        },
        createdAt: {
            type: Date,
            optional: true
        },
        owner: {
            type: String,
            optional: true
        }
    });

    PublicationsSchema.i18n("schemas.publications");

    Publications.attachSchema(PublicationsSchema);

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
