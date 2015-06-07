/*****************************************************************************/
/* Common UI functions used along my code */
/*****************************************************************************/

common = (function() {

    return {

        escapeRegExp: function(string) {
            return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },

        showBargainWindow: function(serverMethod, bargainId, min, max) {

            bootbox.prompt({
                title: TAPi18n.__('modal.bargainPublication', {
                    min: min,
                    max: max
                }),
                inputType: 'number',
                buttons: {
                    confirm: {
                        label: TAPi18n.__('button.confirm')
                    },
                    cancel: {
                        label: TAPi18n.__('button.close')
                    }
                },
                value: max,
                callback: function(result) {

                    if (!result) {
                        return true;
                    }

                    result = parseFloat(result);

                    check(result, Match.Where(function(element) {
                        return element > min && element < max;
                    }));

                    Meteor.call(serverMethod, bargainId, result);
                }
            });

            $('.bootbox-input-number').attr('min', min);
            $('.bootbox-input-number').attr('max', max);
            $('.bootbox-input-number').attr('step', 0.01);
        }
    }

})();
