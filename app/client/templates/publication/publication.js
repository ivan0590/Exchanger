
/*****************************************************************************/
/* Publication: Event Handlers */
/*****************************************************************************/
Template.Publication.events({
    'click #removePublication': function() {

        if(confirm(TAPi18n.__('message_removePublication'))){
            
            Meteor.call('removePublication', Template.currentData()._id);

            Router.go('home');
        }
    }
});

/*****************************************************************************/
/* Publication: Helpers */
/*****************************************************************************/
Template.Publication.helpers({
    getStatus: function(status) {

        switch(status){
            case 0:
                return {label: 'success', text: TAPi18n.__('status_onSale')};
            case 1:
                return {label: 'warning', text: TAPi18n.__('status_waiting')};
            case 2:
                return {label: 'danger',  text: TAPi18n.__('status_sold')};
        }

    },
    checkUser: function(userId) {

        return userId === Meteor.userId();
    }
});

/*****************************************************************************/
/* Publication: Lifecycle Hooks */
/*****************************************************************************/
Template.Publication.onCreated(function () {
    
    var self = this;

    self.autorun(function () {
        self.subscribe('user_profile', Template.currentData().owner);
    });

});

Template.Publication.onRendered(function () {

});

Template.Publication.onDestroyed(function () {

});
