describe('stopBargaining', function() {

    var notificationId;

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
            price: 500,
            category: '553d27cae530eeeaa4e038cc',
            age: '553d316be530eeeaa4e038da',
            photo: 'KmYnmtRMfan9cLJYw'
        });

        Meteor.userId = function() {
            return "buyer";
        }
        
        Meteor.call('bargainPublication', Publications.findOne()._id, 400);

        Meteor.userId = function() {
            return "seller";
        }
        
        Meteor.call('keepBargaining', Notifications.findOne()._id, 450);
        
        Meteor.userId = function() {
            return "buyer";
        }

        notificationId = Notifications.findOne()._id;
    });





    it('should work', function() {

        spyOn(Bargains, 'remove');
        spyOn(Notifications, 'remove');
        spyOn(Notifications, 'insert');

        Meteor.call('stopBargaining', notificationId, 450);

        expect(Bargains.remove).toHaveBeenCalled();
        expect(Notifications.remove).toHaveBeenCalled();
        expect(Notifications.insert).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'stopBargaining', notificationId);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'stopBargaining', notificationId);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'stopBargaining');

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'stopBargaining', "thisIsNotAnObject");

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });
});
