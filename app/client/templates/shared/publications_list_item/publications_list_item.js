/*****************************************************************************/
/* PublicationsListItem: Event Handlers */
/*****************************************************************************/
Template.PublicationsListItem.events({
    'click .setCategory': function(event) {
        
        _.each($('.category:checked'), function(element, index) {

            $(element).prop('checked', false).trigger("change");
        });
        
        $('.category[value=' + $(event.currentTarget).data('id') + ']').prop('checked', true).trigger("change");
    }
});