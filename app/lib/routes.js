var subs = new SubsManager({
    expireIn: 5
});

Router.configure({
    layoutTemplate: 'MasterLayout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'NotFound'
});

/*****************************************************************************/
/* Filters */
/*****************************************************************************/

//Check if the user is loggedin
Router.onBeforeAction(function() {

    if (!Meteor.user()) {
        Router.go('home');
    }
    this.next();

}, {
    only: ['edit_profile', 'edit_publication', 'create_publication']
});

//Check if the userId recieved as parameter exists
Router.onBeforeAction(function() {

    var user = Meteor.users.findOne({
        _id: this.params._id
    });

    if (!user) {
        Router.go('home');
    } else {
        this.next();
    }

}, {
    only: ['show_profile', 'edit_profile']
});

//Check if the publicationId recieved as parameter exists
Router.onBeforeAction(function() {

    if (this.params._id.length !== 24 ||
        !this.params._id.match(/^[0-9a-f]*$/) ||
        !Publications.findOne({
            _id: new Mongo.ObjectID(this.params._id)
        })) {

        Router.go('home');

    } else {

        this.next();
    }

}, {
    only: ['show_publication', 'edit_publication']
});


/*****************************************************************************/
/* Home route */
/*****************************************************************************/
Router.route('/', {
    name: 'home',
    controller: 'HomeController',
    action: 'action',
    where: 'client',
    waitOn: function() {
        return [
            subs.subscribe("publications"),
            subs.subscribe("images_publications"),
            subs.subscribe("images_profiles")
        ];
    }
});

/*****************************************************************************/
/* User profile routes */
/*****************************************************************************/
Router.route('profile/:_id', {
    name: 'show_profile',
    controller: 'ProfileController',
    action: 'show',
    where: 'client',
    waitOn: function() {
        return subs.subscribe("user", this.params._id);
    }
});

Router.route('profile/:_id/edit', {
    name: 'edit_profile',
    controller: 'ProfileController',
    action: 'edit',
    where: 'client',
    waitOn: function() {
        return subs.subscribe("user", this.params._id);
    }
});

/*****************************************************************************/
/* Publications  routes */
/*****************************************************************************/
Router.route('publication/create', {
    name: 'create_publication',
    controller: 'PublicationController',
    action: 'create',
    where: 'client',
    waitOn: function() {
        return subs.subscribe("publications");
    }
});

Router.route('publication/:_id', {
    name: 'show_publication',
    controller: 'PublicationController',
    action: 'show',
    waitOn: function() {

        if (this.params._id.length === 24 &&
            this.params._id.match(/^[0-9a-f]*$/) &&
            Publications.findOne({
                _id: new Mongo.ObjectID(this.params._id)
            })) {

            return [
                subs.subscribe("publication", new Mongo.ObjectID(this.params._id)),
                subs.subscribe("deal", new Mongo.ObjectID(this.params._id))
            ];
        }

    }
});

Router.route('publication/:_id/edit', {
    name: 'edit_publication',
    controller: 'PublicationController',
    action: 'edit',
    where: 'client',
    waitOn: function() {


        if (this.params._id.length === 24 &&
            this.params._id.match(/^[0-9a-f]*$/) &&
            Publications.findOne({
                _id: new Mongo.ObjectID(this.params._id)
            })) {

            return subs.subscribe("publication", new Mongo.ObjectID(this.params._id));
        }
    }
});
