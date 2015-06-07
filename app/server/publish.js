var normalPublish = {
    users_profiles: function(){
        return Meteor.users.find({}, {fields: {profile: 1}});
    },
    user: function(id){
        return Meteor.users.find({_id: id}, {fields: {emails: 1,profile: 1}});
    },
    images_publications: function(){
        return ImagesPublications.find();
    },
    images_profiles: function(){
        return ImagesProfiles.find();
    },
    publications: function(){
        return Publications.find();
    },
    publication: function(id){
        check(id, Mongo.ObjectID);
        return Publications.find({_id: id});
    },
    bargains: function() {
        return Bargains.find({$or: [{buyer: this.userId},{seller: this.userId}]});
    },
    deals: function() {
        return Deals.find({$or: [{buyer: this.userId},{seller: this.userId}]});
    },
    deal: function(publicationId) {
        check(publicationId, Mongo.ObjectID);
        return Deals.find({publication: publicationId, $or: [{buyer: this.userId},{seller: this.userId}]});
    },
    notifications: function() {
        return Notifications.find({to: this.userId});
    },
    conversations: function() {
        return Conversations.find({participants: {$in: [{user: this.userId, active: true}]}});
    }
};

var i18nPublish = {
    categories: function () {
        return Categories.i18nFind();
    },
    ages: function () {
        return Ages.i18nFind();
    }
};

_.each(normalPublish, function(element, index) {
    Meteor.publish(index, element);
});

_.each(i18nPublish, function(element, index) {
    TAPi18n.publish(index, element);
});