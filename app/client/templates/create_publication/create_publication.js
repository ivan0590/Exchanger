/*****************************************************************************/
/* Subscriptions */
/*****************************************************************************/
TAPi18n.subscribe("categories");
TAPi18n.subscribe("ages");
Meteor.subscribe("publications");

/*****************************************************************************/
/* CreatePublication: Event Handlers */
/*****************************************************************************/
Template.CreatePublication.events({
    
});

/*****************************************************************************/
/* CreatePublication: Helpers */
/*****************************************************************************/
Template.CreatePublication.helpers({
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
/* CreatePublication: Lifecycle Hooks */
/*****************************************************************************/
Template.CreatePublication.onCreated(function () {
});

Template.CreatePublication.onRendered(function () {

    $('option[value=""]').prop('disabled', true);

});

Template.CreatePublication.onDestroyed(function () {
});