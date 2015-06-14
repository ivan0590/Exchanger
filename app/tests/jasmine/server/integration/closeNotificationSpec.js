describe('closeNotification', function() {

    var notificationId, notificationId;

    beforeEach(function() {

        Meteor.userId = function() {
            return "seller";
        }

        Publications.remove({});
        Notifications.remove({});
        Bargains.remove({});
        Deals.remove({});

        Meteor.call('createPublication', {
            name: 'dummyPublication',
            description: 'dummyPublication',
            price: 2.5,
            category: '553d27cae530eeeaa4e038cc',
            age: '553d316be530eeeaa4e038da',
            photo: 'KmYnmtRMfan9cLJYw'
        });

        Meteor.userId = function() {
            return "buyer";
        }

        Meteor.call('acceptPublication', Publications.findOne()._id);
        
        Meteor.userId = function() {
            return "seller";
        }

        Meteor.call('confirmDeal', Notifications.findOne()._id);

        Meteor.userId = function() {
            return "buyer";
        }

        notificationId = Notifications.findOne()._id;
    });



    



    it('should work', function() {

        spyOn(Notifications, 'remove');

        Meteor.call('closeNotification',  notificationId);

        expect(Notifications.remove).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'closeNotification',  notificationId);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'closeNotification',  notificationId);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'closeNotification');

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'closeNotification', "thisIsNotAnObject");

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });
});
