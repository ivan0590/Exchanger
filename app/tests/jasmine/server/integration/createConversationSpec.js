describe('createConversation', function() {

    Publications.remove({});
    Meteor.users.remove({});

    var userOne = Meteor.users.insert({
        emails: [{
            address: '1@1.com',
            verified: false
        }]
    });

    var userTwo = Meteor.users.insert({
        emails: [{
            address: '2@2.com',
            verified: false
        }]
    });

    beforeEach(function() {
        Meteor.userId = function() {
            return userOne;
        }

    });







    it('should work', function() {

        spyOn(Conversations, 'insert');

        Meteor.call('createConversation', [userOne, userTwo]);

        expect(Conversations.insert).toHaveBeenCalled();
    });

    it('should throw "Match error: Expected string, got undefined"', function() {

        Meteor.userId = function() {
            return undefined;
        }

        var methodCall = Meteor.call.bind(null, 'createConversation', [userOne, userTwo]);

        expect(methodCall).toThrowError('Match error: Expected string, got undefined');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        Meteor.userId = function() {
            return "";
        }

        var methodCall = Meteor.call.bind(null, 'createConversation', [userOne, userTwo]);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'createConversation', []);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'createConversation', [userOne]);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'createConversation', [userOne, userOne]);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Failed Match.Where validation"', function() {

        var methodCall = Meteor.call.bind(null, 'createConversation', ['invalidUserId', 'invalidUserId']);

        expect(methodCall).toThrowError('Match error: Failed Match.Where validation');
    });

    it('should throw "Match error: Expected Array"', function() {

        var methodCall = Meteor.call.bind(null, 'createConversation');

        expect(methodCall).toThrowError('Match error: Expected Array');
    });

    it('should throw "Match error: Expected Array"', function() {

        var methodCall = Meteor.call.bind(null, 'createConversation', "thisIsNotAnObject");

        expect(methodCall).toThrowError('Match error: Expected Array');
    });
});
