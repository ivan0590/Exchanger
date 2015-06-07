/*****************************************************************************/
/* CustomUpload: Event Handlers */
/*****************************************************************************/
Template.CustomUpload.events({
    'change #fileInput': function (event) {


        //If a file was loaded
        if(event.target.files[0]){
        	
		    var file = new FS.File(event.target.files[0]);
	        var collection;


	        file.owner = Meteor.userId();

            //Eval is evil, but in this case is ok since I'm not using user inputs here
            collection = eval(Template.currentData().collection);
            
	        var uploadedFile = collection.insert(file, function (err, fileObj) {
	            
	            if (err) {
	                throw err;
	            }
	        });

            if(Template.currentData().schema){
                $('#schemaField').val(uploadedFile._id);                
            }

        }
    }
});

/*****************************************************************************/
/* CustomUpload: Lifecycle Hooks */
/*****************************************************************************/
Template.CustomUpload.onRendered(function () {    
    $.getScript("http://markusslima.github.io/bootstrap-filestyle/js/bootstrap-filestyle.min.js");
});

