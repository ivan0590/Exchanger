/*****************************************************************************/
/* Subscriptions */
/*****************************************************************************/
TAPi18n.subscribe("categories");
TAPi18n.subscribe("ages");
Meteor.subscribe("publications");
Meteor.subscribe("images_publications");

/*****************************************************************************/
/* EditPublication: Event Handlers */
/*****************************************************************************/
Template.EditPublication.events({
    
});

/*****************************************************************************/
/* EditPublication: Helpers */
/*****************************************************************************/
Template.EditPublication.helpers({
    statuses: function() {

        return [
                {label: TAPi18n.__('status_onSale'), value: 0},
                {label: TAPi18n.__('status_waiting'), value: 1},
                {label: TAPi18n.__('status_sold'), value: 2}
            ];

    },
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
    allowedStatuses: function() {
        
        return [0, 1, 2];

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
/* EditPublication: Lifecycle Hooks */
/*****************************************************************************/
Template.EditPublication.onCreated(function () {


});

Template.EditPublication.onRendered(function () {

    $('option[value=""]').prop('disabled', true);

});

Template.EditPublication.onDestroyed(function () {
});