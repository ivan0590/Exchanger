var intervalId;

/*****************************************************************************/
/* Chat: Subscriptions */
/*****************************************************************************/
Meteor.subscribe('conversations');

/*****************************************************************************/
/* Chat: Event Handlers */
/*****************************************************************************/
Template.Chat.events({
    'submit .sendMessage': function(event) {

        event.preventDefault();

        var message = $(event.currentTarget).find('[name=message]').val(),
            chatBox = $(event.currentTarget).parent().siblings('.chatBox');

        if (message) {
            Meteor.call('sendMessage', this._id, message);

            $(event.currentTarget).find('[name=message]').val('');

            chatBox.animate({
                scrollTop: chatBox.prop("scrollHeight")
            }, 50);
        }
    },
    'click #closeChat': function() {

        $('#chats').find('[aria-expanded=false]').closest('.chatElement:hidden').show(300);
        Meteor.call('changeConversation', this._id, false, Meteor.userId());

    },
    'click #toggleChats': function() {

        $('#chats').toggle('drop', {
            direction: 'right'
        }, 400, function() {

            var toggleChats = $('#toggleChats');

            if ($('#chats').is(':visible')) {
                $(toggleChats.children().get(0)).removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
            } else {
                $(toggleChats.children().get(0)).removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
            }
        });

    },

    'focus, click .chatElement': function(event) {

        if (intervalId) {
            Meteor.clearInterval(intervalId);
            intervalId = undefined;
        }
    }
});

/*****************************************************************************/
/* Chat: Helpers */
/*****************************************************************************/
Template.Chat.helpers({
    'conversations': function() {
        return Conversations.find();
    },
    'conversationsCount': function() {
        return Conversations.find().count();
    },
    'people': function() {
        return _.without(_.pluck(this.participants, 'user'), Meteor.userId());
    }
});

/*****************************************************************************/
/* Chat: Lifecycle Hooks */
/*****************************************************************************/
Template.Chat.onCreated(function() {

});

Template.Chat.onRendered(function() {

    //Hide the other elements on chat collapse('show')
    $(document).on('shown.bs.collapse', '.chatElement', function(event) {

        $(event.currentTarget).find('.chatBox').animate({
            scrollTop: $(event.currentTarget).find('.chatBox').prop("scrollHeight")
        }, 50);

        $('.chatElement').not($(event.currentTarget)).hide('blind', 300);

    });

    //Show the other elements on chat collapse('hide')
    $(document).on('hidden.bs.collapse', '.chatElement', function(event) {
        $('.chatElement').not($(event.currentTarget)).show('blind', 300);
    });

    //Visual efects for incoming messages
    function insertElementHook(node, next) {

        $(node).insertBefore(next);

        var message = $(node),
            chatBox = message.parent('.chatBox'),
            chat = message.closest('.chatElement');

        $('#chats').show();

        if (chat.is(':hidden')) {
            chat.show('blind', 300);
        }

        //Effect
        if (!intervalId && message.data('user') !== Meteor.userId() && !chat.is(':focus')) {

            intervalId = Meteor.setInterval(function() {
                chat.effect('shake', {}, 750);
            }, 750);
        }

    }


    Meteor.setTimeout(function() {

        //Effects on new chat
        $('#chats')[0]._uihooks = {
            insertElement: function(node, next) {

                var chat = $(node),
                    chatBox = chat.find('.chatBox');

                $('#chats').show();

                chat.insertAfter(next);

                //Effect
                if (!intervalId && chatBox.children().last().data('user') !== Meteor.userId() && !chat.is(':focus')) {

                    intervalId = Meteor.setInterval(function() {
                        chat.effect('shake', {

                        }, 750);
                    }, 750);
                }

                //Effects on new messages
                chatBox[0]._uihooks = {
                    insertElement: insertElementHook
                };
            }
        };

        //Effects on existing messages
        $.each($('.chatBox'), function(index, element) {

            element._uihooks = {
                insertElement: insertElementHook
            };

        });

    }, 1000);
});

Template.Chat.onDestroyed(function() {

});
