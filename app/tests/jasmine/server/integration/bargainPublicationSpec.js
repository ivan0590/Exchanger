describe('bargainPublication', function() {

    var publicationId;

    beforeEach(function() {

        Meteor.userId = function() {
            return "seller";
        }

        Publications.remove({});
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

        publicationId = Publications.findOne()._id;
    });





    it('should work', function() {

        spyOn(Bargains, 'insert');
        spyOn(Notifications, 'insert');

        Meteor.call('bargainPublication', publicationId, 400);

        expect(Bargains.insert).toHaveBeenCalled();
        expect(Notifications.insert).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication');

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Expected particular constructor"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication', "thisIsNotAnObject");

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Expected number, got string"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId, "thisIsNotAnumber");

        expect(methodCall).toThrowError('Match error: Expected number, got string');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId, -1);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId, 0);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId, 500);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });
    

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'bargainPublication', publicationId, 501);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });
});
