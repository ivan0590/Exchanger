Template.PublicationsList.onRendered(function() {

    var container = $('#container');

    //Load Isotope with Masonry
    container.imagesLoaded(function() {

        container.isotope({
            layoutMode: 'masonry',
            itemSelector: '.ms-item',
            transitionDuration: '0s'
        }).isotope('layout').isotope();

    });

    //Using a MutationObserver to readapt the layout when a new item is added
    var observer = new MutationObserver(function(mutations) {
        
        container.imagesLoaded(function() {
            container.isotope('reloadItems').isotope('layout').isotope();
        });

    });

    //Adding the MutationObserver to the items container
    observer.observe(container.get(0), {
        attributes: false, 
        childList: true, 
        characterData: false
    });
    
});

Template.PublicationsList.onDestroyed(function() {

});

