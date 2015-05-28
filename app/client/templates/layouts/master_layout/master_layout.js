Meteor.subscribe('notifications');
Meteor.subscribe('bargains');
Meteor.subscribe('users_profiles');

Meteor.startup(function() {
    TAPi18n.setLanguage("en");
});

accountsUIBootstrap3.setLanguage(TAPi18n.getLanguage());

/*****************************************************************************/
/* MasterLayout: Event Handlers */
/*****************************************************************************/
Template.MasterLayout.events({
    'click .confirmDeal': function() {
        Meteor.call('confirmDeal', this._id);
    },
    'click .rejectDeal': function() {
        Meteor.call('rejectDeal', this._id);
    },
    'click .confirmBargain': function() {
        Meteor.call('confirmBargain', this._id);
    },
    'click .keepBargaining': function() {

        var bargain = Bargains.findOne({
            _id: this.bargain
        });

        common.showBargainWindow('keepBargaining', this._id, bargain.buyerPrice, bargain.sellerPrice);
    },
    'click .stopBargaining': function() {
        
        Meteor.call('stopBargaining', this._id);
    },
    'click .closeNotification': function() {
        Meteor.call('closeNotification', this._id);
    }
});

/*****************************************************************************/
/* MasterLayout: Helpers */
/*****************************************************************************/
Template.MasterLayout.helpers({
    notificationsCount: function() {
        return Notifications.find().count();
    },
    notifications: function() {
        return Notifications.find();
    },
    notificationMessage: function() {

        return {
            textKey: this.textKey,
            from: Meteor.users.findOne({
                _id: this.from
            }),
            price: this.price
        }
    },
    notificationColor: function() {

        switch (this.textKey) {
            case 'notification_accepted':
            case 'notification_confirmed':
                return 'success';

            case 'notification_rejected':
            case 'notification_cancelled':
            case 'notification_stopBargaining':
            case 'notification_publicationRemoved':
                return 'danger';
                
            case 'notification_bargained':
                return 'warning';

            default:
                return 'info';
        }
    },
    checkBargainPrice: function() {
        
        var bargainObj = Bargains.findOne({
            _id: this.bargain
        });

        return (bargainObj.sellerPrice - bargainObj.buyerPrice).toFixed(2) <= 0.01;

    }
});



//Ocultar el botón de cambiar contraseña
Template._loginButtonsAdditionalLoggedInDropdownActions.onRendered(function() {
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
