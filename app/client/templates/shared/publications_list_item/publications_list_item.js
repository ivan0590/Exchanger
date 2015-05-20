/*****************************************************************************/
/* PublicationsListItem: Event Handlers */
/*****************************************************************************/
Template.PublicationsListItem.events({

});

/*****************************************************************************/
/* PublicationsListItem: Helpers */
/*****************************************************************************/
Template.PublicationsListItem.helpers({
	
});

/*****************************************************************************/
/* PublicationsListItem: Lifecycle Hooks */
/*****************************************************************************/
Template.PublicationsListItem.onCreated(function () {
    
	var self = this;

	self.autorun(function () {
		self.subscribe('user_profile', Template.currentData().owner);
	});

});

Template.PublicationsListItem.onRendered(function () {

});

Template.PublicationsListItem.onDestroyed(function () {
	
});