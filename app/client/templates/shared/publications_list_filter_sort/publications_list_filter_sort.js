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
            if (!listOptions.filters.category) {
                listOptions.filters['category'] = {
                    $in: []
                };
            }

            //Add item to filter
            listOptions.filters.category.$in
                .push($(event.currentTarget).val());

        } else {

            //Remove item from filter
            listOptions.filters.category.$in
                .splice($.inArray($(event.currentTarget).val(), listOptions.filters.category.$in), 1);

            //Destroy the category filter
            if (!listOptions.filters.category.$in.length) {
                delete listOptions.filters.category;
            }
        }


        Session.set('listOptions', listOptions);

        PublicationsPagination.set(listOptions);
    },

    //Filter age
    'change .age': function(event) {

        var listOptions = Session.get('listOptions');

        //Age checked
        if ($(event.currentTarget).is(':checked')) {

            //Create the age filter
            if (!listOptions.filters.age) {
                listOptions.filters['age'] = {
                    $in: []
                };
            }

            //Add item to filter
            listOptions.filters.age.$in
                .push($(event.currentTarget).val());

        } else {

            //Remove item from filter
            listOptions.filters.age.$in
                .splice($.inArray($(event.currentTarget).val(), listOptions.filters.age.$in), 1);

            //Destroy the age filter
            if (!listOptions.filters.age.$in.length) {
                delete listOptions.filters.age;
            }
        }


        Session.set('listOptions', listOptions);

        PublicationsPagination.set(listOptions);
    },

    //Filter status
    'change .status': function(event) {

        var listOptions = Session.get('listOptions');

        //Status checked
        if ($(event.currentTarget).is(':checked')) {

            //Create the status filter
            if (!listOptions.filters.status) {
                listOptions.filters['status'] = {
                    $in: []
                };
            }

            //Add item to filter
            listOptions.filters.status.$in
                .push(parseInt($(event.currentTarget).val()));

        } else {

            //Remove item from filter
            listOptions.filters.status.$in
                .splice($.inArray($(event.currentTarget).val(), listOptions.filters.status.$in), 1);

            //Destroy the status filter
            if (!listOptions.filters.status.$in.length) {
                delete listOptions.filters.status;
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
            label = value == -1 ? 'filter_sort.ascending' : 'filter_sort.descending';

        //Change order
        listOptions.sort[Object.keys(listOptions.sort)[0]] = -value;

        Session.set('listOptions', listOptions);

        PublicationsPagination.set(listOptions);

        //Change button text
        $(event.currentTarget).find('h5').html(TAPi18n.__(label));
    }
});


/*****************************************************************************/
/* PublicationsListFilterSort: Helpers */
/*****************************************************************************/
Template.PublicationsListFilterSort.helpers({
    categories: function() {
        return Categories.find();
    },
    ages: function() {
        return Ages.find();
    }
});

/*****************************************************************************/
/* PublicationsListFilterSort: Lifecycle Hooks */
/*****************************************************************************/
Template.PublicationsListFilterSort.onCreated(function() {
    PublicationsPagination.set(Session.get('listOptions'));
});

Template.PublicationsListFilterSort.onRendered(function() {

    //Visual effects for dropdowns
    _.each(['Sort', 'Filter'], function(element, index) {

        $('#collapse' + element).on('show.bs.collapse', function() {
            $('#chevron' + element).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
        });

        $('#collapse' + element).on('hide.bs.collapse', function() {
            $('#chevron' + element).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
        });

    });

    //Visual effects for dropdowns filters
    _.each(['Status', 'Category', 'Age'], function(element, index) {

        $('#collapse' + element).on('click', function() {
            if ($('#chevron' + element).hasClass('glyphicon-chevron-right')) {
                
                $('#chevron' + element).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
                $('#filter' + element).removeClass('hidden').hide().slideDown();
                
            } else {

                $('#chevron' + element).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
                $('#filter' + element).slideUp();
            }
        });

    });

    //Setting options using session values
    var listOptions = Session.get('listOptions');

    //Categories
    if (listOptions.filters.category) {
        _.each(listOptions.filters.category.$in, function(element, index) {

            $('.category[value=' + element + ']').prop('checked', true);
        });
    }

    //Ages
    if (listOptions.filters.age) {
        _.each(listOptions.filters.age.$in, function(element, index) {

            $('.age[value=' + element + ']').prop('checked', true);
        });
    }

    //Sort
    $('[name=sort][value=' + Object.keys(listOptions.sort)[0] + ']').attr('checked', true);

    //Order
    var label = listOptions.sort[Object.keys(listOptions.sort)[0]] == 1 ? 'filter_sort.ascending' : 'filter_sort.descending';
    $('#order').find('h5').html(TAPi18n.__(label));
});
