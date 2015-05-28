var subs = new SubsManager({
    expireIn: 5
});

Router.configure({
    layoutTemplate: 'MasterLayout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'NotFound'
});

Router.route('/', {
    name: 'home',
    controller: 'HomeController',
    action: 'action',
    where: 'client',
    waitOn: function() {
        return subs.subscribe("publications");
    }
});


Router.route('create_publication', {
    name: 'create_publication',
    controller: 'PublicationController',
    action: 'create',
    where: 'client',
    waitOn: function() {
        return [
            TAPi18n.subscribe("categories"),
            TAPi18n.subscribe("ages"),
            subs.subscribe("publications")
        ];
    }
});

Router.route('publication/:_id/edit', {
    name: 'edit_publication',
    controller: 'PublicationController',
    action: 'edit',
    where: 'client',
    waitOn: function() {
        return [
            Meteor.subscribe("publication", new Mongo.ObjectID(this.params._id)),
            TAPi18n.subscribe("categories"),
            TAPi18n.subscribe("ages"),
            Meteor.subscribe("images_publications")
        ];
    }
});

Router.route('publication/:_id', {
    name: 'show_publication',
    controller: 'PublicationController',
    action: 'show',
    where: 'client',
    waitOn: function() {
        return [
            Meteor.subscribe("publication", new Mongo.ObjectID(this.params._id)),
            Meteor.subscribe("deal", new Mongo.ObjectID(this.params._id))
        ];
    }
});
