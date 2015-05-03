/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */

TAPi18n.publish("categories", function () {
	return Categories.i18nFind();
});


TAPi18n.publish("ages", function () {
	return Ages.i18nFind();
});








// Meteor.publish('publications', function(){
//     return Publications.find({owner: this.userId});
// });