//Used to update the date format when changing locale
ReactiveDate = new Tracker.Dependency();

function languageChange (){

    var locale = TAPi18n.getLanguage();

    //Change date locale
    moment.locale(locale, TAPi18n.__('momentjs', { returnObjectTrees: true }));
    ReactiveDate.changed();

    //Change UI login locale
    accountsUIBootstrap3.setLanguage(locale);
}

Meteor.startup(languageChange);

TAPi18n._afterUILanguageChange = languageChange;

//Redirect to the home page on logout
accountsUIBootstrap3.logoutCallback = function(error) {
    Router.go('home');
};

//Login UI config
Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'firstName',
        fieldLabel: TAPi18n.__('schemas.users.profile.firstName.label'),
        inputType: 'text',
        visible: true,
        saveToProfile: true,
        validate: function(value, errorFunction) {

            if (!value) {
                errorFunction("First name is required");
            }

            return !!value;
        }
    }, {
        fieldName: 'lastName',
        fieldLabel: TAPi18n.__('schemas.users.profile.lastName.label'),
        inputType: 'text',
        visible: true,
        saveToProfile: true,
        validate: function(value, errorFunction) {

            if (!value) {
                errorFunction("Last name is required");
            }

            return !!value;
        }
    }]
});

Template._loginButtonsAdditionalLoggedInDropdownActions.onRendered(function() {

    $("#login-dropdown-list").addClass('text-center');

    //Close the notifications dropdown when the login dropdown is clicked
    $("#login-dropdown-list").on('click', function() {
        if($("#notifications").hasClass('open')){
            $("#notifications a").dropdown('toggle');            
        }
    });
});
