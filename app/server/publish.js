Meteor.publish('users_profiles', function(){
    return Meteor.users.find({}, {fields: {profile: 1}});
});

Meteor.publish('images_publications', function(){
    return ImagesPublications.find();
});

TAPi18n.publish("categories", function () {
    return Categories.i18nFind();
});

TAPi18n.publish("ages", function () {
    return Ages.i18nFind();
});


Meteor.publish('publications', function(){
    return Publications.find();
});

Meteor.publish('publication', function(id){
    return Publications.find({_id: id});
});



Meteor.publish('bargains', function() {
    return Bargains.find({$or: [{buyer: this.userId},{seller: this.userId}]});
});


Meteor.publish('deals', function() {
    return Deals.find({$or: [{buyer: this.userId},{seller: this.userId}]});
});

Meteor.publish('deal', function(publicationId) {
    return Deals.find({publication: publicationId, $or: [{buyer: this.userId},{seller: this.userId}]});
});



Meteor.publish('notifications', function() {
    return Notifications.find({to: this.userId});
});