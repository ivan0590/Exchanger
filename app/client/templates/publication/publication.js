/*****************************************************************************/
/* Publication: Event Handlers */
/*****************************************************************************/
Template.Publication.events({
    'click #removePublication': function() {

        var id = this._id;

        bootbox.confirm(TAPi18n.__('modal_removePublication'), function(confirm) {

            if(confirm){
                Meteor.call('removePublication', id);

                Router.go('home');
            }
        }); 
    },
    'click #acceptPublication': function() {

        Meteor.call('acceptPublication', this._id);
    },
    'click #bargainPublication': function() {
        
        common.showBargainWindow('bargainPublication',this._id, 0, this.price);
    },
    'click .cancelDeal': function() {

        Meteor.call('cancelDeal', Template.currentData()._id);
    }
});

/*****************************************************************************/
/* Publication: Helpers */
/*****************************************************************************/
Template.Publication.helpers({
    checkBuyerAccepted: function() {
        return Deals.findOne({
            publication: this._id,
            buyer: Meteor.userId()
        })
    },
    checkBuyerBargained: function() {
        return Bargains.findOne({
            publication: this._id,
            buyer: Meteor.userId()
        });
    },
    checkSellerAccepted: function() {
        return Deals.findOne({
            publication: this._id
        })
    },
    checkSellerBargained: function() {
        return Bargains.findOne({
            publication: this._id
        });
    },
    statusLabel: function() {

        switch (this.status) {
            case 0:
                return 'success';
            case 1:
                return 'warning';
            case 2:
                return 'danger';
        }

    },
    statusText: function() {

        switch (this.status) {
            case 0:
                return TAPi18n.__('status_onSale');
            case 1:
                return TAPi18n.__('status_waiting');
            case 2:
                return TAPi18n.__('status_sold');
        }

    }
});

/*****************************************************************************/
/* Publication: Lifecycle Hooks */
/*****************************************************************************/
Template.Publication.onCreated(function() {

});

Template.Publication.onRendered(function() {

});

Template.Publication.onDestroyed(function() {

});
