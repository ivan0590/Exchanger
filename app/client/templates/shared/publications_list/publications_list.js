/*****************************************************************************/
/* PublicationsList: Lifecycle Hooks */
/*****************************************************************************/
Template.PublicationsList.onRendered(function() {

    function organizeIsotope(argument) {

        container.imagesLoaded(function() {
            container.isotope('reloadItems').isotope('layout').isotope();

            if (!container.children().not('#noResultsMessage').length) {
                $('#noResultsMessage').removeClass('hidden').hide().fadeIn(600);
            } else {
                $('#noResultsMessage').hide();
            }
        });
    }

    var container = $('#container');

    //Load Isotope with Masonry
    container.imagesLoaded(function() {

        container.isotope({
            layoutMode: 'masonry',
            itemSelector: '.ms-item',
            transitionDuration: '0s'
        }).isotope('layout').isotope();
    });

    container[0]._uihooks = {
        insertElement: function(node, next) {

            $(node).insertBefore(next);

            organizeIsotope();
        },
        removeElement: function(node, next) {

            $(node).remove();

            organizeIsotope();
        }
    };
});
