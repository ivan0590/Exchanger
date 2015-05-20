/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
    createPublication: function(publication) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        publication['status'] = 0;

        check(publication, PublicationsSchema);

        publication = _.extend(publication, {
            _id: new Mongo.ObjectID(),
            createdAt: new Date(),
            owner: Meteor.userId()
        });

        Publications.insert(publication);

    },

    updatePublication: function(publication, id) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var exists = Publications.find({
            _id: id,
            owner: Meteor.userId()
        });

        if(!exists.count()){
            throw new Meteor.Error("publication-not-owned");
        }

        check(publication.$set, PublicationsSchema);

        Publications.update(id, publication);
    },

    removePublication: function(id) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var exists = Publications.find({
            _id: id,
            owner: Meteor.userId()
        });

        if(!exists.count()){
            throw new Meteor.Error("publication-not-owned");
        }

        Publications.remove({_id: id});
    }
});
