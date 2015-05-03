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
Template._loginButtonsAdditionalLoggedInDropdownActions.rendered = function(){
    $("#login-buttons-open-change-password").hide();
};


//Configuración de la interfaz de login
Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: 'First name',
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
        fieldLabel: 'Last name',
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