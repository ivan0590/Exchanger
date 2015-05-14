/*****************************************************************************/
/* Client and Server Methods */
/*****************************************************************************/
Meteor.methods({

    addPublication: function(publication){
      
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Publications.insert({
            _id: new Mongo.ObjectID(),
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
