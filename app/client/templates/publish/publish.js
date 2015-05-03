/*****************************************************************************/
/* Subscriptions */
/*****************************************************************************/
TAPi18n.subscribe("categories");
TAPi18n.subscribe("ages");
Meteor.subscribe("publications");

/*****************************************************************************/
/* Publish: Event Handlers */
/*****************************************************************************/
Template.Publish.events({
	"click #add_publication": function(event){

		var publication = 
		{
			name: $('[name="name"]').val(),
			description: $('[name="description"]').val(),
			price: $('[name="price"]').val(),
			category: $('[name="category"]').val().replace('ObjectID("', 'ObjectId("'),
			age: $('[name="age"]').val(),
			photo: UI._globalHelpers.uploadedFileId()
		}

		Meteor.call('addPublication', publication);
	}
});

/*****************************************************************************/
/* Publish: Helpers */
/*****************************************************************************/
Template.Publish.helpers({
	categories: function() {
        return Categories.find();
    },
    ages: function() {
        return Ages.find();
    }









    
 //    ,
	// publications: function () {

	// 	var publications = Publications.find().map(function(element){

	// 		element.photo = new FS.File(ImagesPublications.findOne({_id: element.photo}));

	// 		return element;
			
	// 	});

	// 	return publications;
	// }
});


/*****************************************************************************/
/* Publish: Lifecycle Hooks */
/*****************************************************************************/
Template.Publish.created = function () {
};

Template.Publish.rendered = function () {
};

Template.Publish.destroyed = function () {
};


/*****************************************************************************/
/* Upload template button label */
/*****************************************************************************/
Template.customUpload.helpers({
	buttonText: function(){
		return TAPi18n.__("photo");
	}
});