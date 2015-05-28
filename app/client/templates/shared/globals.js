/*****************************************************************************/
/* Global helpers */
/*****************************************************************************/
Template.registerHelper("getUser", function(id) {
    return Meteor.users.findOne({
        _id: id
    });
});

Template.registerHelper("getPublication", function(id) {
    return Publications.findOne({
        _id: id
    });
});

Template.registerHelper("getCategory", function(id) {
    return Categories.findOne(new Mongo.ObjectID(id));
});

Template.registerHelper("getAge", function(id) {
    return Ages.findOne(new Mongo.ObjectID(id));
});

Template.registerHelper("getPhoto", function(id) {
    return new FS.File(ImagesPublications.findOne({
        _id: id
    }));
});

Template.registerHelper("optionsCategories", function(id) {
    return Categories.find().map(function(element) {
        return {
            label: element.name,
            value: element._id._str
        };
    });
});

Template.registerHelper("optionsAges", function(id) {
    return Ages.find().map(function(element) {
        return {
            label: element.name,
            value: element._id._str
        };
    });
});

Template.registerHelper("allowedCategories", function(id) {
    return Categories.find().map(function(element) {
        return element._id._str;
    });
});

Template.registerHelper("allowedAges", function(id) {
    return Ages.find().map(function(element) {
        return element._id._str;
    });
});


/*****************************************************************************/
/* Common functions used along my code */
/*****************************************************************************/
common = (function() {

    return {

        showBargainWindow: function(serverMethod, bargainId, min, max) {

            bootbox.prompt({
                title: TAPi18n.__('modal_bargainPublication', {
                    min: min,
                    max: max
                }),
                inputType: 'number',
                buttons: {
                    confirm: {
                        label: TAPi18n.__('button_confirm')
                    },
                    cancel: {
                        label: TAPi18n.__('button_close')
                    }
                },
                value: max,
                callback: function(result) {

                    if (!result) {
                        return true;
                    }

                    result = parseFloat(result);

                    check(result, Match.Where(function(element) {
                        return element > min && element < max;
                    }));
                    
                    Meteor.call(serverMethod, bargainId, result);
                }
            });

            $('.bootbox-input-number').attr('min', min);
            $('.bootbox-input-number').attr('max', max);
            $('.bootbox-input-number').attr('step', 0.01);
        }
    }

})();
