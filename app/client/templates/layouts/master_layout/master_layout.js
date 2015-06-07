/*****************************************************************************/
/* MasterLayout: Event Handlers */
/*****************************************************************************/
Template.MasterLayout.events({

    'submit #search': function(event) {

        event.preventDefault();

        var listOptions, value, userIds;


        listOptions = Session.get('listOptions');

        //Search value
        value = $('[name=search]').val();

        if (value.toLowerCase().startsWith('userid:') && value.split(':').length === 2) {

            delete listOptions.filters.$or;

            listOptions.filters.owner = value.split(':')[1].trim();

        } else {

            delete listOptions.filters.owner;

            value = '.*' + common.escapeRegExp(value) + '.*';

            //Searching value in users names
            userIds = _.pluck(
                Meteor.users.find({
                    $or: [{
                        'profile.firstName': {
                            $regex: value,
                            $options: 'i'
                        }
                    }, {
                        'profile.lastName': {
                            $regex: value,
                            $options: 'i'
                        }
                    }]
                }, {
                    fields: {
                        _id: 1
                    }
                }).fetch(), '_id');


            //Adding found users, name and description to the filter
            listOptions.filters['$or'] = [{
                name: {
                    $regex: value,
                    $options: 'i'
                }
            }, {
                owner: {
                    $in: userIds
                }
            }, {
                description: {
                    $regex: value,
                    $options: 'i'
                }
            }];
        }


        Session.set('listOptions', listOptions);

        if (Router.current().route.getName() === 'home') {
            PublicationsPagination.set(Session.get('listOptions'));
        } else {
            Router.go('home');
        }

    },
    'click #login-buttons-edit-profile': function() {
        Router.go('show_profile', {
            _id: Meteor.userId()
        });
    }
});

/*****************************************************************************/
/* MasterLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.MasterLayout.onCreated(function() {

    if (!Session.get('listOptions')) {

        Session.set('listOptions', {
            sort: {
                createdAt: -1
            },
            filters: {

            }
        });

    }

});




//Close the notifications dropdown when the login dropdown is clicked
Template._loginButtonsAdditionalLoggedInDropdownActions.onRendered(function() {

    $("#login-dropdown-list").on('click', function() {
        if($("#notifications").hasClass('open')){
            $("#notifications a").dropdown('toggle');            
        }
    });
});
