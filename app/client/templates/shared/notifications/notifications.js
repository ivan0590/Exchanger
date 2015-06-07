/*****************************************************************************/
/* Notifications: Subscriptions */
/*****************************************************************************/
Meteor.subscribe('notifications');
Meteor.subscribe('bargains');
Meteor.subscribe('users_profiles');

/*****************************************************************************/
/* Notifications: Event Handlers */
/*****************************************************************************/
Template.Notifications.events({
    'click .confirmDeal': function(event) {
        Meteor.call('confirmDeal', this._id);
        
        //Avoid closing the dropdown
        event.stopPropagation();
    },
    'click .rejectDeal': function(event) {
        Meteor.call('rejectDeal', this._id);
        
        event.stopPropagation();
    },
    'click .confirmBargain': function(event) {
        Meteor.call('confirmBargain', this._id);
        
        event.stopPropagation();
    },
    'click .keepBargaining': function(event) {
        
        var bargain = Bargains.findOne({
            _id: this.bargain
        });

        common.showBargainWindow('keepBargaining', this._id, bargain.buyerPrice, bargain.sellerPrice);

        event.stopPropagation();
    },
    'click .stopBargaining': function(event) {
        Meteor.call('stopBargaining', this._id);
        
        event.stopPropagation();
    },
    'click .closeNotification': function(event) {
        Meteor.call('closeNotification', this._id);

        event.stopPropagation();
    }
});

/*****************************************************************************/
/* Notifications: Helpers */
/*****************************************************************************/
Template.Notifications.helpers({
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
            case 'notification.accepted':
            case 'notification.confirmed':
            case 'notification.sold':
                return 'success';

            case 'notification.rejected':
            case 'notification.cancelled':
            case 'notification.stopBargaining':
            case 'notification.publicationRemoved':
                return 'danger';

            case 'notification.bargained':
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