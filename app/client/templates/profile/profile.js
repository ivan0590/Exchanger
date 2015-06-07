/*****************************************************************************/
/* Profile: Event Handlers */
/*****************************************************************************/
Template.Profile.events({
    'click #chatWithUser': function() {
        
        Meteor.call('chatWithUser', this._id);
    },
    'click #userPublications': function() {

        $('[name=search]').val('USERID: ' + this._id);
        
        $('[name=search]').submit();
    }
});

/*****************************************************************************/
/* Profile: Helpers */
/*****************************************************************************/
Template.Profile.helpers({
    'soldSuccess': function() {

        var sellerPublications = _.pluck(Deals.find({
            seller: this._id
        }, {
            publication: 1
        }).fetch(), 'publication');

        return Publications.find({_id: {$in: sellerPublications}, status: 2}).count();
    },
    'boughtSuccess': function() {

        var buyerPublications = _.pluck(Deals.find({
            buyer: this._id
        }, {
            publication: 1
        }).fetch(), 'publication');

        return Publications.find({_id: {$in: buyerPublications}, status: 2}).count();
    },
    'publications': function() {

        return Publications.find({owner: this._id}).count();
    },
    'onSalePublications': function() {

        return Publications.find({owner: this._id, status: 0}).count();
    },
    'waitingPublications': function() {

        return Publications.find({owner: this._id, status: 1}).count();
    },
    'soldPublications': function() {

        return Publications.find({owner: this._id, status: 2}).count();
    }
});