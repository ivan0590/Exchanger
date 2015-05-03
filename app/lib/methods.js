/*****************************************************************************/
/* Client and Server Methods */
/*****************************************************************************/
Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   *  if (this.isSimulation) {
   *    // do some client stuff while waiting for
   *    // result from server.
   *    return;
   *  }
   *
   *  // server method logic
   * }
   */

    addPublication: function(publication){
      
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if(!Categories.find({_id: publication.category})) {
            throw new Meteor.Error('category with id "' + publication.category + '" not found');
        }

        if(!Ages.find({_id: publication.age})) {
            throw new Meteor.Error('age with id "' + publication.age + '"" not found');
        }

        $(publication).each(function (index, element){
            if(!element){
                throw new Meteor.Error(index + ' is empty');
            }
        });

        if(!Ages.find({_id: publication.age})) {
            throw new Meteor.Error('age with id "' + publication.age + '"" not found');
        }        

        Publications.insert({
            name: publication.name,
            description: publication.description,
            price: publication.price,
            category: publication.category,
            age: publication.age,
            photo: publication.photo,
            createdAt: new Date(),
            owner: Meteor.userId()
        });

    }
});
