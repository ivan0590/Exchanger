describe('acceptPublication', function() {

    var publicationId;

    beforeEach(function() {

        Meteor.userId = function() {
            return "buyer";
        }

        Publications.remove({});
        Meteor.call('createPublication', {
            name: 'dummyPublication',
            description: 'dummyPublication',
            price: 2.5,
            category: '553d27cae530eeeaa4e038cc',
            age: '553d316be530eeeaa4e038da',
            photo: 'KmYnmtRMfan9cLJYw'
        });

        Meteor.userId = function() {
            return "seller";
        }

        publicationId = Publications.findOne()._id;
    });





    it('should work', function() {

        spyOn(Deals, 'insert');
        spyOn(Notifications, 'insert');

        Meteor.call('acceptPublication', publicationId);

        expect(Deals.insert).toHaveBeenCalled();
        expect(Notifications.insert).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'acceptPublication', publicationId);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'acceptPublication', publicationId);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'acceptPublication');

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'acceptPublication', "thisIsNotAnObject");

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });
});
