Meteor.startup(function() {

    ProfilesSchema = new SimpleSchema({
        'firstName': {
            type: String
        },
        'lastName': {
            type: String
        },
        birthdate: {
            type: Date,
            optional: true
        },
        location: {
            type: String,
            optional: true
        },
        avatar: {
            type: String,
            optional: true
        }
    });

    UsersSchema = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: true
        },
        services: {
            type: Object,
            optional: true,
            blackbox: true
        },
        emails: {
            type: [Object],
            optional: true
        },
        "emails.$.address": {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        "emails.$.verified": {
            type: Boolean
        },
        profile: {
            type: ProfilesSchema,
            optional: true
        }
    });

    UsersSchema.i18n("schemas.users");

    Meteor.users.attachSchema(UsersSchema);
});



if (Meteor.isServer) {
    Meteor.users.deny({
        update: function() {
            return true;
        }
    });
}
