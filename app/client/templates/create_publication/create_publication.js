/*****************************************************************************/
/* CreatePublication: Event Handlers */
/*****************************************************************************/
Template.CreatePublication.events({
    'submit #insertPublicationForm': function() {

        $('#insertPublicationForm').fadeOut('400', function() {
            var last = Publications.find({}, {sort: {createdAt:-1}, limit: 1}).fetch()[0];

            Router.go('/publication/' + last._id._str);
            
        });
    }
    
});

/*****************************************************************************/
/* CreatePublication: Helpers */
/*****************************************************************************/
Template.CreatePublication.helpers({
    
});


/*****************************************************************************/
/* CreatePublication: Lifecycle Hooks */
/*****************************************************************************/
Template.CreatePublication.onCreated(function () {
});

Template.CreatePublication.onRendered(function () {

    //Disable the first options of the selects
    $('option[value=""]').prop('disabled', true);

});

Template.CreatePublication.onDestroyed(function () {
    AutoForm.resetForm('insertPublicationForm');
});