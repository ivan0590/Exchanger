Meteor.publish('user_profile', function(id){

    return Meteor.users.find({_id: id}, {fields: {profile: 1}});
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

Meteor.publish('images_publications', function(){
    return ImagesPublications.find();
});