TAPi18n.publish("categories", function () {
	return Categories.i18nFind();
});


TAPi18n.publish("ages", function () {
	return Ages.i18nFind();
});

Meteor.publish('publications', function(limit){

    limit = limit || 20;

    return Publications.find({}, {sort: {createdAt: -1 }, limit: limit});
});

Meteor.publish('images_publications', function(){
    return ImagesPublications.find();
});
