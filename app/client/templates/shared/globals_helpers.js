/*****************************************************************************/
/* Global helpers */
/*****************************************************************************/

var globalHelpers = {
    getUser: function(id) {
        return Meteor.users.findOne({
            _id: id
        });
    },
    getPublication: function(id) {
        return Publications.findOne({
            _id: id
        });
    },
    getCategory: function(id) {
        return Categories.findOne(new Mongo.ObjectID(id));
    },
    getAge: function(id) {
        return Ages.findOne(new Mongo.ObjectID(id));
    },
    getPublicationPhoto: function(id) {
        return new FS.File(ImagesPublications.findOne({
            _id: id
        }));
    },
    getProfilePhoto: function(id) {
        return new FS.File(ImagesProfiles.findOne({
            _id: id
        }));
    },
    optionsCategories: function(id) {
        return Categories.find().map(function(element) {
            return {
                label: element.name,
                value: element._id._str
            };
        });
    },
    optionsAges: function(id) {
        return Ages.find().map(function(element) {
            return {
                label: element.name,
                value: element._id._str
            };
        });
    },
    allowedCategories: function(id) {
        return Categories.find().map(function(element) {
            return element._id._str;
        });
    },
    allowedAges: function(id) {
        return Ages.find().map(function(element) {
            return element._id._str;
        });
    },
    prettifyDate: function(date, format) {
        ReactiveDate.depend();
        return moment(date).format(format);
    }
};

_.each(globalHelpers, function(element, index) {
    Template.registerHelper(index, element);
});