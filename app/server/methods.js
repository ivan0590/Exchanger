/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
    createPublication: function(newPublication) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        newPublication['status'] = 0;

        check(newPublication, PublicationsSchema);

        newPublication = _.extend(newPublication, {
            _id: new Mongo.ObjectID(),
            createdAt: new Date(),
            owner: Meteor.userId()
        });

        Publications.insert(newPublication);

    },

    updatePublication: function(modifiedPublication, publicationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var currentPublication = Publications.findOne({
            _id: publicationId
        });

        if (currentPublication.owner != Meteor.userId()) {
            throw new Meteor.Error("Publication not owned");
        }

        check(modifiedPublication.$set, PublicationsSchema);

        Publications.update(publicationId, modifiedPublication);
    },

    removePublication: function(publicationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var publication, dealsUsers;

        publication = Publications.findOne({
            _id: publicationId
        });

        if (publication.owner != Meteor.userId()) {
            throw new Meteor.Error("Publication not owned");
        }


        dealsUsers =
            _.pluck(
                Deals.find({
                    publication: publicationId
                }, {
                    fields: {
                        buyer: 1
                    }
                }).fetch(), 'buyer');

        //Remove all the notifications related to the publication
        Notifications.remove({
            publication: publicationId
        });

        //Notify possible buyers about the publication removal
        Deals.find({
            publication: publicationId

        }).forEach(function(element, index) {
            
            Notifications.insert({
                _id: new Mongo.ObjectID(),
                type: 'deal',
                publication: publication.name,
                from: publication.owner,
                to: element.buyer,
                textKey: 'notification_publicationRemoved',
                needsConfirmation: false
            });

        });

        //Remove all the deals related to the publication
        Deals.remove({
            publication: publicationId
        });

        //Notify bargainers about the publication removal
        Bargains.find({

            //This is for not sending two notifications to the same user in case he also has a deal
            buyer: {
                $nin: dealsUsers
            },

            publication: publicationId

        }).forEach(function(element, index) {
            
            Notifications.insert({
                _id: new Mongo.ObjectID(),
                type: 'bargain',
                publication: publication.name,
                from: publication.owner,
                to: element.buyer,
                textKey: 'notification_publicationRemoved',
                needsConfirmation: false
            });

        });

        //Remove all the bargains related to the publication
        Bargains.remove({
            publication: publicationId
        });

        //Remove the publication
        Publications.remove({
            _id: publicationId
        });
    },

    acceptPublication: function(publicationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var publication = Publications.findOne({
            _id: publicationId
        });

        if (publication.status !== 0) {
            throw new Meteor.Error("Publication already accepted");
        }

        if (publication.owner === Meteor.userId()) {
            throw new Meteor.Error("Owned publications cannot be accepted");
        }


        var dealId = new Mongo.ObjectID();

        Deals.insert({
            _id: dealId,
            publication: publicationId,
            buyer: Meteor.userId(),
            seller: publication.owner
        });

        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'deal',
            deal: dealId,
            publication: publicationId,
            from: Meteor.userId(),
            to: publication.owner,
            textKey: 'notification_accepted',
            needsConfirmation: true
        });
    },

    bargainPublication: function(publicationId, price) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var publication, bargainId;

        publication = Publications.findOne({
            _id: publicationId
        });

        if (publication.owner === Meteor.userId()) {
            throw new Meteor.Error("Owned publications cannot be bargained");
        }

        if (price <= 0 || price >= publication.price) {
            throw new Meteor.Error("The price is out of range");
        }


        bargainId = new Mongo.ObjectID();

        Bargains.insert({
            _id: bargainId,
            publication: publicationId,
            buyer: Meteor.userId(),
            seller: publication.owner,
            buyerPrice: price,
            sellerPrice: publication.price,
            turn: 'seller'
        });

        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'bargain',
            bargain: bargainId,
            publication: publicationId,
            from: Meteor.userId(),
            to: publication.owner,
            textKey: 'notification_bargained',
            needsConfirmation: true,
            price: price
        });
    },

    keepBargaining: function(notificationId, price) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var notification, bargain;

        notification = Notifications.findOne({
            _id: notificationId
        });

        if (notification.to !== Meteor.userId()) {
            throw new Meteor.Error("Notification not owned");
        }

        bargain = Bargains.findOne({
            _id: notification.bargain
        });

        if (bargain.seller !== Meteor.userId() && bargain.buyer !== Meteor.userId()) {
            throw new Meteor.Error("User not included in the bargain");
        }

        if (price <= bargain.buyerPrice || price >= bargain.sellerPrice) {
            throw new Meteor.Error("The price is out of range");
        }


        //The seller is the bargainer
        if (bargain.seller === Meteor.userId() && bargain.turn === 'seller') {

            Bargains.update({
                _id: notification.bargain
            }, {
                $set: {
                    sellerPrice: price,
                    turn: 'buyer'
                }
            });

            //The buyer is the bargainer
        } else if (bargain.buyer === Meteor.userId() && bargain.turn === 'buyer') {

            Bargains.update({
                _id: notification.bargain
            }, {
                $set: {
                    buyerPrice: price,
                    turn: 'seller'
                }
            });

        } else {
            throw new Meteor.Error("The counterpart of the bargain didn't respond to the previous bargain yet");
        }


        //Remove the notification
        Notifications.remove({
            _id: notification._id
        });

        //Notify the counterpart about the new bargain
        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'bargain',
            bargain: notification.bargain,
            publication: notification.publication,
            from: notification.to,
            to: notification.from,
            textKey: 'notification_bargained',
            needsConfirmation: true,
            price: price
        });

    },

    stopBargaining: function(notificationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var notification = Notifications.findOne({
            _id: notificationId
        });

        if (notification.to !== Meteor.userId()) {
            throw new Meteor.Error("Notification not owned");
        }


        //Remove the bargain
        Bargains.remove({
            _id: notification.bargain
        });

        //Remove all the notifications associated to the bargain
        Notifications.remove({
            type: 'bargain',
            bargain: notification.bargain
        });

        //Notify the buyer about the seller rejection
        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'bargain',
            publication: notification.publication,
            from: notification.to,
            to: notification.from,
            textKey: 'notification_stopBargaining',
            needsConfirmation: false
        });
    },

    confirmBargain: function(notificationId) {



        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var notification, publication, dealId;


        notification = Notifications.findOne({
            _id: notificationId
        });

        if (notification.to !== Meteor.userId()) {
            throw new Meteor.Error("Notification not owned");
        }

        publication = Publications.findOne({
            _id: notification.publication
        });

        if (publication.status !== 0) {
            throw new Meteor.Error("Publication already accepted");
        }

        //Remove all bargains related to the publication except the one that is confirmed
        Bargains.remove({
            _id: {
                $nin: [notification.bargain]
            },
            publication: notification.publication
        });

        dealId = new Mongo.ObjectID();

        Deals.insert({
            _id: dealId,
            publication: publication._id,
            buyer: Meteor.userId() == publication.owner ? notification.from : Meteor.userId(),
            seller: publication.owner
        });

        Notifications.update({
            _id: notificationId
        }, {
            $set: {
                type: 'deal',
                deal: dealId
            }
        });

        Meteor.call('confirmDeal', notificationId);
    },

    confirmDeal: function(notificationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var notification, deal;


        notification = Notifications.findOne({
            _id: notificationId
        });

        if (notification.to !== Meteor.userId()) {
            throw new Meteor.Error("Notification not owned");
        }

        if (Publications.findOne({
                _id: notification.publication
            }).status !== 0) {
            throw new Meteor.Error("Deal already confirmed");
        }


        deal = Deals.findOne({
            _id: notification.deal
        });

        //Change publication status to "Waiting to be sold"
        Publications.update({
            _id: notification.publication
        }, {
            $set: {
                status: 1
            }
        });

        //Remove all the notifications associated with the publication
        Notifications.remove({
            publication: notification.publication
        });

        //Notify previous possible buyers about the seller confirmation
        Deals.find({
            _id: {
                $nin: [notification.deal]
            },
            publication: notification.publication

        }).forEach(function(element, index) {

            Notifications.insert({
                _id: new Mongo.ObjectID(),
                type: 'deal',
                publication: notification.publication,
                from: deal.seller,
                to: element.buyer,
                textKey: 'notification_rejected',
                needsConfirmation: false
            });

        });

        //Remove all the deals related to the publication except the one that is confirmed
        Deals.remove({
            _id: {
                $nin: [notification.deal]
            },
            publication: notification.publication
        });

        //Notify previous bargainers about the seller confirmation
        Bargains.find({
            _id: {
                $nin: [notification.bargain]
            },
            publication: notification.publication

        }).forEach(function(element, index) {

            Notifications.insert({
                _id: new Mongo.ObjectID(),
                type: 'bargain',
                publication: notification.publication,
                from: deal.seller,
                to: element.buyer,
                textKey: 'notification_stopBargaining',
                needsConfirmation: false
            });

        });

        //Remove all the bargains related to the publication except the one that is confirmed
        Bargains.remove({
            _id: {
                $nin: [notification.bargain]
            },
            publication: notification.publication
        });



        //Notify the buyer about the seller confirmation
        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'deal',
            publication: notification.publication,
            from: notification.to,
            to: notification.from,
            textKey: 'notification_confirmed',
            needsConfirmation: false
        });
    },

    rejectDeal: function(notificationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var notification = Notifications.findOne({
            _id: notificationId
        });

        if (notification.to !== Meteor.userId()) {
            throw new Meteor.Error("Notification not owned");
        }


        //Remove the deal
        Deals.remove({
            _id: notification.deal
        });

        //Remove all the notifications associated to the deal
        Notifications.remove({
            type: 'deal',
            deal: notification.deal
        });

        //Notify the buyer about the seller rejection
        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'deal',
            publication: notification.publication,
            from: notification.to,
            to: notification.from,
            textKey: 'notification_rejected',
            needsConfirmation: false
        });
    },

    cancelDeal: function(publicationId) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var deal = Deals.findOne({
            publication: publicationId
        });

        if (deal.seller !== Meteor.userId() && deal.buyer !== Meteor.userId()) {
            throw new Meteor.Error("User not included in the deal");
        }


        //Change publication status to "On sale"
        Publications.update({
            _id: publicationId
        }, {
            $set: {
                status: 0
            }
        });

        //Remove the deal
        Deals.remove({
            publication: publicationId
        });

        //Remove all the bargains associated to the publication
        Bargains.remove({
            publication: publicationId
        });

        //Remove all the notifications associated to the deal
        Notifications.remove({
            publication: publicationId
        });

        //Notify the buyer about the seller cancellation
        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'deal',
            publication: publicationId,
            from: Meteor.userId(),
            to: deal.buyer !== Meteor.userId() ? deal.buyer : deal.seller,
            textKey: 'notification_cancelled',
            needsConfirmation: false
        });
    },

    closeNotification: function(id) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("User not logged");
        }

        var notification = Notifications.findOne({
            _id: id
        });

        if (notification.to !== Meteor.userId()) {
            throw new Meteor.Error("Notification not owned");
        }

        if (notification.needsConfirmation) {
            throw new Meteor.Error("The notification cannot be closed");
        }


        //Remove the notification
        Notifications.remove({
            _id: notification._id
        });
    }
});
