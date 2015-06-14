describe('removePublication', function() {

    var publicationId;

    beforeEach(function() {

        Meteor.userId = function() {
            return "seller";
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

        publicationId = Publications.findOne()._id;

    });



    



    it('should work', function() {

        spyOn(Notifications, 'remove');
        spyOn(Deals, 'remove');
        spyOn(Bargains, 'remove');
        spyOn(Publications, 'remove');

        Meteor.call('removePublication', publicationId);

        expect(Notifications.remove).toHaveBeenCalled();
        expect(Deals.remove).toHaveBeenCalled();
        expect(Bargains.remove).toHaveBeenCalled();
        expect(Publications.remove).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'removePublication', publicationId);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'removePublication', publicationId);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'removePublication');

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'removePublication', "thisIsNotAnObject");

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });
});
