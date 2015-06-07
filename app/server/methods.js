/*****************************************************************************/
/* Match patterns */
/*****************************************************************************/
var checks = {

    nonEmptyString: Match.Where(function(string) {
        check(string, String);
        return string.length > 0;
    }),

    userExists: Match.Where(function(id) {
        return Meteor.users.findOne(id);
    }),

    equalsUserId: Match.Where(function(id) {
        return id === Meteor.userId();
    }),

    notEqualsUserId: Match.Where(function(id) {
        return id !== Meteor.userId();
    }),

    statusOnSale: Match.Where(function(status) {
        return status === 0;
    })
};




/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({

    updateProfile: function(profile, id) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(profile, Object);
        check(profile.$set, UsersSchema);
        check(id, checks.equalsUserId);



        Meteor.users.update(id, profile);
    },

    createPublication: function(publication) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(publication, Object);

        publication['status'] = 0;
        check(publication, PublicationsSchema);



        publication = _.extend(publication, {
            _id: new Mongo.ObjectID(),
            createdAt: new Date(),
            owner: Meteor.userId()
        });

        Publications.insert(publication);
    },

    updatePublication: function(publication, id) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(publication, Object);
        check(publication.$set, PublicationsSchema);
        check(id, Mongo.ObjectID);

        var currentPublication = Publications.findOne({
            _id: id
        });
        check(currentPublication, Object);
        check(currentPublication.owner, checks.equalsUserId);



        Publications.update(id, publication);
    },

    removePublication: function(id) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(id, Mongo.ObjectID);

        var publication = Publications.findOne({
            _id: id
        });
        check(publication, Object);
        check(publication.owner, checks.equalsUserId);



        var dealsUsers =
            _.pluck(
                Deals.find({
                    publication: id
                }, {
                    fields: {
                        buyer: 1
                    }
                }).fetch(), 'buyer');

        //Remove all the notifications related to the publication
        Notifications.remove({
            publication: id
        });

        //Notify possible buyers about the publication removal
        Deals.find({
            publication: id

        }).forEach(function(element, index) {

            Notifications.insert({
                _id: new Mongo.ObjectID(),
                type: 'deal',
                publication: publication.name,
                from: publication.owner,
                to: element.buyer,
                textKey: 'notification.publicationRemoved',
                needsConfirmation: false
            });

        });

        //Remove all the deals related to the publication
        Deals.remove({
            publication: id
        });

        //Notify bargainers about the publication removal
        Bargains.find({

            //This is for not sending two notifications to the same user in case he also has a deal
            buyer: {
                $nin: dealsUsers
            },

            publication: id

        }).forEach(function(element, index) {

            Notifications.insert({
                _id: new Mongo.ObjectID(),
                type: 'bargain',
                publication: publication.name,
                from: publication.owner,
                to: element.buyer,
                textKey: 'notification.publicationRemoved',
                needsConfirmation: false
            });

        });

        //Remove all the bargains related to the publication
        Bargains.remove({
            publication: id
        });

        //Remove the publication
        Publications.remove({
            _id: id
        });
    },

    acceptPublication: function(id) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(id, Mongo.ObjectID);

        var publication = Publications.findOne({
            _id: id
        });
        check(publication, Object);
        check(publication.status, checks.statusOnSale);
        check(publication.owner, checks.notEqualsUserId);



        var dealId = new Mongo.ObjectID();

        Deals.insert({
            _id: dealId,
            publication: id,
            buyer: Meteor.userId(),
            seller: publication.owner
        });

        Notifications.insert({
            _id: new Mongo.ObjectID(),
            type: 'deal',
            deal: dealId,
            publication: id,
            from: Meteor.userId(),
            to: publication.owner,
            textKey: 'notification.accepted',
            needsConfirmation: true
        });
    },

    confirmDeal: function(notificationId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(notificationId, Mongo.ObjectID);

        var notification = Notifications.findOne({
            _id: notificationId
        });
        check(notification, Object);
        check(notification.to, checks.equalsUserId);
        
        var publication = Publications.findOne({
            _id: notification.publication
        });
        check(publication, Object);
        check(publication.status, checks.statusOnSale);

      

        var deal = Deals.findOne({
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
                textKey: 'notification.rejected',
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
                textKey: 'notification.stopBargaining',
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
            textKey: 'notification.confirmed',
            needsConfirmation: false
        });
    },

    rejectDeal: function(notificationId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(notificationId, Mongo.ObjectID);

        var notification = Notifications.findOne({
            _id: notificationId
        });
        check(notification, Object);
        check(notification.to, checks.equalsUserId);



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
            textKey: 'notification.rejected',
            needsConfirmation: false
        });
    },

    cancelDeal: function(publicationId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(publicationId, Mongo.ObjectID);

        var deal = Deals.findOne({
            publication: publicationId
        });
        check(deal, Object);
        check(deal, Match.Where(function(arg) {
            return arg.seller === Meteor.userId() || arg.buyer === Meteor.userId();
        }));



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
            textKey: 'notification.cancelled',
            needsConfirmation: false
        });
    },

    bargainPublication: function(publicationId, price) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(publicationId, Mongo.ObjectID);
        check(price, Number);

        var publication = Publications.findOne({
            _id: publicationId
        });
        check(publication, Object);
        check(publication.owner, checks.notEqualsUserId);
        check(price, Match.Where(function(arg) {
            return arg > 0 && arg < publication.price;
        }));



        var bargainId = new Mongo.ObjectID();

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
            textKey: 'notification.bargained',
            needsConfirmation: true,
            price: price
        });
    },

    keepBargaining: function(notificationId, price) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(notificationId, Mongo.ObjectID);
        check(price, Number);

        var notification = Notifications.findOne({
            _id: notificationId
        });
        check(notification, Object);
        check(notification.to, checks.equalsUserId);

        var bargain = Bargains.findOne({
            _id: notification.bargain
        });
        check(bargain, Object);
        check(bargain, Match.Where(function(arg) {
            return arg.seller === Meteor.userId() || arg.buyer === Meteor.userId();
        }));
        check(price, Match.Where(function(arg) {
            return arg > bargain.buyerPrice && arg < bargain.sellerPrice;            
        }));



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
            textKey: 'notification.bargained',
            needsConfirmation: true,
            price: price
        });

    },

    stopBargaining: function(notificationId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(notificationId, Mongo.ObjectID);

        var notification = Notifications.findOne({
            _id: notificationId
        });
        check(notification, Object);
        check(notification.to, checks.equalsUserId);



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
            textKey: 'notification.stopBargaining',
            needsConfirmation: false
        });
    },

    confirmBargain: function(notificationId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(notificationId, Mongo.ObjectID);

        var notification = Notifications.findOne({
            _id: notificationId
        });
        check(notification, Object);
        check(notification.to, checks.equalsUserId);

        var publication = Publications.findOne({
            _id: notification.publication
        });
        check(publication, Object);
        check(publication.status, checks.statusOnSale);



        //Remove all bargains related to the publication except the one that is confirmed
        Bargains.remove({
            _id: {
                $nin: [notification.bargain]
            },
            publication: notification.publication
        });

        var dealId = new Mongo.ObjectID();

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

    setPublicationSold: function(id) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(id, Mongo.ObjectID);

        var publication = Publications.findOne({
            _id: id
        });
        check(publication, Object);
        check(publication.owner, checks.equalsUserId);
        check(publication.status, Match.Where(function(arg) {
            return arg === 1;
        }));



        //Change publication status to "Sold"
        Publications.update({
            _id: id
        }, {
            $set: {
                status: 2
            }
        });

        var deal = Deals.findOne({
            publication: id
        });

        //Notify the buyer about the change
        Notifications.insert({
            _id: new Mongo.ObjectID(),
            publication: id,
            from: publication.owner,
            to: deal.buyer,
            textKey: 'notification.sold',
            needsConfirmation: false
        });
    },

    closeNotification: function(id) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(id, Mongo.ObjectID);

        var notification = Notifications.findOne({
            _id: id
        });
        check(notification, Object);
        check(notification.to, checks.equalsUserId);
        check(notification.needsConfirmation, Match.Where(function(arg) {
            return !arg;
        }));



        //Remove the notification
        Notifications.remove({
            _id: notification._id
        });
    },

    createConversation: function(users) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(users, Array);

        users = _.uniq(users);
        check(users, Match.Where(function() {
            return users.length > 1
        }));
        _.each(users, function(element, index) {
            check(element, checks.userExists);
        });



        var participants = _.map(users, function(element, index) {
            return {
                user: element,
                active: false
            };
        });

        return Conversations.insert({
            _id: new Mongo.ObjectID(),
            participants: participants,
            messages: []
        });
    },

    changeConversation: function(conversationId, active, userId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(conversationId, Mongo.ObjectID);
        check(active, Boolean);
        check(userId, Match.Optional(checks.nonEmptyString));

        var conversation = Conversations.findOne({
            _id: conversationId
        });
        check(conversation, Object);
        check(_.pluck(conversation.participants, 'user'), Match.Where(function(arg) {
            return _.contains(arg, Meteor.userId()) || (userId && _.contains(arg, userId));
        }));
        


        //Activate the conversation only for the participant recieved as argument        
        if (userId) {
            Conversations.update({
                _id: conversationId,
                'participants.user': userId
            }, {
                $set: {
                    'participants.$.active': active
                }
            });

            //Activate the conversation for all participants
        } else {

            _.each(_.pluck(conversation.participants, 'user'), function(element) {
                Conversations.update({
                    _id: conversationId,
                    'participants.user': element
                }, {
                    $set: {
                        'participants.$.active': active
                    }
                });
            });


        }
    },

    chatWithUser: function(userId) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(userId, checks.nonEmptyString);
        check(userId, checks.userExists);        
        check(userId, checks.notEqualsUserId);



        var conversation = Conversations.findOne({
            'participants.user': {
                $all: [Meteor.userId(), userId]
            }
        });

        var conversationId = conversation ? conversation._id : Meteor.call('createConversation', [Meteor.userId(), userId]);

        //Activate the conversation only for this user
        Meteor.call('changeConversation', conversationId, true, Meteor.userId());
    },

    sendMessage: function(conversationId, message) {

        check(Meteor.userId(), checks.nonEmptyString);
        check(conversationId, Mongo.ObjectID);
        check(message, checks.nonEmptyString);

        var conversation = Conversations.findOne({
            _id: conversationId
        });
        check(conversation, Object);
        check(_.pluck(conversation.participants, 'user'), Match.Where(function(arg) {
            return _.contains(arg, Meteor.userId());
        }));



        //Add the new message to the conversation
        Conversations.update({
            _id: conversationId
        }, {
            $push: {
                messages: {
                    date: new Date(),
                    user: Meteor.userId(),
                    message: message
                }
            }
        });

        //If there are more than 100 messages in the conversation the oldest is removed
        if (conversation.messages.length > 99) {

            Conversations.update({
                _id: conversationId
            }, {
                $pop: {
                    messages: -1
                }
            });
        }

        Meteor.call('changeConversation', conversation._id, true);
    }
});