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
			category: $('[name="category"]').val(),
			age: $('[name="age"]').val(),
			photo: UI._globalHelpers.uploadedFileId ? UI._globalHelpers.uploadedFileId() : ""
		}
        
		Meteor.call('addPublication', publication);
	}
});

/*****************************************************************************/
/* Publish: Helpers */
/*****************************************************************************/
Template.Publish.helpers({
	categories: function() {
		
        return Categories.find().map(function (element){
			return {label: element.name, value: element._id._str};
		});

    },
    ages: function() {

        return Ages.find().map(function (element){
			return {label: element.name, value: element._id._str};
		});

    },
    allowedCategories: function() {

        return Categories.find().map(function (element){
			return element._id._str;
		});

    },
    allowedAges: function() {

        return Ages.find().map(function (element){
			return element._id._str;
		});

    }
});


/*****************************************************************************/
/* Publish: Lifecycle Hooks */
/*****************************************************************************/
Template.Publish.onCreated(function () {
});

Template.Publish.onRendered(function () {
});

Template.Publish.onDestroyed(function () {
});


/*****************************************************************************/
/* Upload template button label */
/*****************************************************************************/
Template.CustomUpload.helpers({
	buttonText: function(){
		return TAPi18n.__("photo");
	}
});