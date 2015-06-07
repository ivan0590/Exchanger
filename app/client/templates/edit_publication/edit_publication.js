/*****************************************************************************/
/* EditPublication: Lifecycle Hooks */
/*****************************************************************************/
Template.EditPublication.onRendered(function () {
    $('option[value=""]').prop('disabled', true);
});