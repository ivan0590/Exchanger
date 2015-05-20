/*****************************************************************************/
/* PublicationsListFilterSort: Event Handlers */
/*****************************************************************************/
Template.PublicationsListFilterSort.events({

    //Filter category
    'change .category': function(event) {

        var listOptions = Session.get('listOptions');

        //Category checked
        if ($(event.currentTarget).is(':checked')) {
            
            //Create the category filter
            if(!listOptions.filters.category){
                listOptions.filters['category'] = {$in: []};
            }

            //Add item to filter
            listOptions.filters.category.$in
                .push($(event.currentTarget).val());

        } else {
            
            //Remove item from filter
            listOptions.filters.category.$in
                .splice($.inArray($(event.currentTarget).val(), listOptions.filters.category.$in), 1);

            //Destroy the category filter
            if(!listOptions.filters.category.$in.length){
                delete listOptions.filters.category;
            }
        }


        Session.set('listOptions', listOptions);

        PublicationsPagination.set(listOptions);
    },

    //Order by name, price or date
    'change [name=sort]': function(event) {

        var listOptions = Session.get('listOptions'),
            value = listOptions.sort[Object.keys(listOptions.sort)[0]];

        delete listOptions.sort[Object.keys(listOptions.sort)[0]];

        listOptions.sort[$(event.currentTarget).val()] = value;

        Session.set('listOptions', listOptions);

        PublicationsPagination.set(listOptions);
    },

    //Order ascending or descending
    'click #order': function(event) {
        
        var listOptions = Session.get('listOptions'),
            value = listOptions.sort[Object.keys(listOptions.sort)[0]],
            label = $(event.currentTarget).find('h5').data('label') === 'descending' ? 'ascending' : 'descending';
            
        //Change order
        listOptions.sort[Object.keys(listOptions.sort)[0]] = -value;

        Session.set('listOptions', listOptions);

        PublicationsPagination.set(listOptions);

        //Change button text
        $(event.currentTarget).find('h5').data('label', label)
        $(event.currentTarget).find('h5').html(TAPi18n.__(label));
    }
});


/*****************************************************************************/
/* PublicationsListFilterSort: Helpers */
/*****************************************************************************/
Template.PublicationsListFilterSort.helpers({
    categories: function() {
        return Categories.find();
    }
});

/*****************************************************************************/
/* PublicationsListFilterSort: Lifecycle Hooks */
/*****************************************************************************/
Template.PublicationsListFilterSort.onCreated(function() {

    if (!Session.get('listOptions')) {

        Session.set('listOptions', {
            sort: {
                createdAt: -1
            }
            ,
            filters: {

            }
        });

    }
    
    PublicationsPagination.set(Session.get('listOptions'));

});
