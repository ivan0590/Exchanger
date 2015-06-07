ImagesProfiles = new FS.Collection("images_profiles", {
    stores: [
        new FS.Store.FileSystem("images_profiles", {
            path: "/home/ivan/uploads/images/profiles"
        })
    ],
    filter: {
        maxSize: 2097152,
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png', 'jpg', 'jpeg']
        },
        onInvalid: function(message) {
            if (Meteor.isClient) {
                alert(message);
            } else {
                console.log(message);
            }
        }
    }
});



if (Meteor.isServer) {
    ImagesProfiles.allow({
        insert: function(userId, doc) {
            return true;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return true;
        },

        remove: function(userId, doc) {
            return true;
        },

        download: function(userId, doc) {
            return true;
        }
    });

    ImagesProfiles.deny({
        insert: function(userId, doc) {
            return false;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return false;
        },

        remove: function(userId, doc) {
            return false;
        },

        download: function(userId, doc) {
            return false;
        }
    });
}
