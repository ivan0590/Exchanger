Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});


Router.route('create_publication', {
  name: 'create_publication',
  controller: 'PublicationController',
  action: 'create',
  where: 'client'
});

Router.route('publication/:_id/edit', {
  name: 'edit_publication',
  controller: 'PublicationController',
  action: 'edit',
  where: 'client'
});

Router.route('publication/:_id', {
  name: 'show_publication',
  controller: 'PublicationController',
  action: 'show',
  where: 'client'
});