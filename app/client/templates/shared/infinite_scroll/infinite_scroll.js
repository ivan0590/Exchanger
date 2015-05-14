var container,
	increment = 20,
    locked = false,
    offset = -(increment),
    newItems;

incrementLimit = function() {
    Session.set('limit', Session.get('limit') + increment);
}


/*****************************************************************************/
/* InfiniteScroll: Helpers */
/*****************************************************************************/
Template.InfiniteScroll.helpers({
    collection: function() {
    	return Collection.find();
    },
    itemTemplate: function(){
    	return Template.instance().data.itemTemplate;
    }
});


/*****************************************************************************/
/* InfiniteScroll: Lifecycle Hooks */
/*****************************************************************************/
Template.InfiniteScroll.onCreated(function() {

    $(document).scrollTop($(document).height());

    CollectionName = Template.currentData().collection;

    Session.set('limit', increment);

    Deps.autorun(function() {
        Meteor.subscribe(CollectionName, Session.get('limit'));
    });

    Collection = Mongo.Collection.get(CollectionName);
});



Template.InfiniteScroll.onRendered(function() {

    container = $('#container');

    arrange = function() {
        container.isotope({
            layoutMode: 'masonry',
            itemSelector: '.ms-item',
            transitionDuration: '0.1s'
            // ,getSortData: {
            //     createdAt: '[data-item-createdAt]',
            //     // name: '#name'
            // },
            // sortBy: [
            //     'createdAt',
            //     // 'name'
            // ],
            // sortAscending: {
            //     createdAt: false,
            //     // name: true
            // }
        });
    };

    Meteor.setTimeout(function() {
        container.imagesLoaded(function() {

			arrange();
			container.isotope( 'on', 'arrangeComplete', function( filteredItems ) {					
				container.isotope('layout');
			});

        });
    }, 1000);

    $(window).scroll(function() {

        if ($(window).scrollTop() + $(window).height() >= ($(document).height() * 0.8) && 
        	!locked && 
        	offset === -(increment)) {

            locked = true;

            incrementLimit();

            Meteor.setTimeout(function() {
	        	
	            container.imagesLoaded(function() {

	                offset = -(increment) - (container.children().length - Session.get('limit'));

	                offset = offset < -(increment) || offset > -1 ? - (increment) : offset;

	                newItems = container.children().slice(offset);

	        		//console.log('CURSOR: ' + Session.get('limit'));
	                //console.log("-- CHILDREN: " + container.children().length);
	                //console.log("-- SESSION: " + Session.get('limit'));
	                //console.log("-- REST: " + (container.children().length - Session.get('limit')));
	                //console.log("-- OFFSET: " + offset);

	                container.isotope('remove', newItems);
                	container.isotope('appended', newItems);
		                
	                locked = false;

	            });

            }, 400);


        }

    });

});

Template.InfiniteScroll.onDestroyed(function() {
    $(window).unbind('scroll');
});

