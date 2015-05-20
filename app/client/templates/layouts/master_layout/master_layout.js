Meteor.startup(function () {
    TAPi18n.setLanguage("en");
});

accountsUIBootstrap3.setLanguage(TAPi18n.getLanguage()); 

/*****************************************************************************/
/* MasterLayout: Event Handlers */
/*****************************************************************************/
Template.MasterLayout.events({
});

/*****************************************************************************/
/* MasterLayout: Helpers */
/*****************************************************************************/
Template.MasterLayout.helpers({
});



//Ocultar el botón de cambiar contraseña
Template._loginButtonsAdditionalLoggedInDropdownActions.onRendered(function(){
    $("#login-buttons-open-change-password").hide();
});


//Configuración de la interfaz de login
Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: TAPi18n.__('firstName'),
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
        fieldName: 'last-name',
        fieldLabel: TAPi18n.__('lastName'),
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

Template.registerHelper("getCategory", function (id){
    return Categories.findOne(new Mongo.ObjectID(id));
});

Template.registerHelper("getAge", function (id){
    return Ages.findOne(new Mongo.ObjectID(id));
});

Template.registerHelper("getPhoto", function (id){
    return new FS.File(ImagesPublications.findOne({_id: id}));
});

Template.registerHelper("getUser", function (id){
    return Meteor.users.findOne({_id: id});
});
