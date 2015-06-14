describe('updatePublication', function() {

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

        spyOn(Publications, 'update');

        Meteor.call('updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 2.5,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(Publications.update).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected object, got undefined"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication');

        expect(methodCall).toThrowError('Match error: Expected object, got undefined');
    });

    it('should throw "Match error: Expected object, got string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', "thisIsNotAnObject", publicationId);

        expect(methodCall).toThrowError('Match error: Expected object, got string');
    });

    it('should throw "Match error: Expected object, got string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, "thisIsNotAndObjectId");

        expect(methodCall).toThrowError('Match error: Expected particular constructor');
    });

    it('should throw "Match error: Name must be a string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: new Object(),
                description: 'dummyPublication',
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Name must be a string');
    });


    it('should throw "Match error: Description must be a string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: new Object(),
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Description must be a string');
    });

    it('should throw "Match error: Price must be a number"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: '2',
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Price must be a number');
    });

    it('should throw "Match error: Category must be a string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 0,
                category: new Object(),
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Category must be a string');
    });

    it('should throw "Match error: Age must be a string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 0,
                category: '553d316be530eeeaa4e038da',
                age: new Object(),
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Age must be a string');
    });


    it('should throw "Match error: Photo must be a string"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: 0,
                category: '553d316be530eeeaa4e038da',
                age: '553d316be530eeeaa4e038da',
                photo: new Object()
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Photo must be a string');
    });

    it('should throw "Match error: Name cannot exceed 200 characters"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: Array(202).join("-"),
                description: 'dummyPublication',
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Name cannot exceed 200 characters');
    });

    it('should throw "Match error: Description cannot exceed 500 characters"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: Array(502).join("-"),
                price: 2,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Description cannot exceed 500 characters');
    });

    it('should throw "Match error: Price must be at least 0"', function() {

        var methodCall = Meteor.call.bind(null, 'updatePublication', {
            $set: {
                name: 'dummyPublication',
                description: 'dummyPublication',
                price: -1,
                category: '553d27cae530eeeaa4e038cc',
                age: '553d316be530eeeaa4e038da',
                photo: 'KmYnmtRMfan9cLJYw'
            }
        }, publicationId);

        expect(methodCall).toThrowError('Match error: Price must be at least 0');
    });
});
