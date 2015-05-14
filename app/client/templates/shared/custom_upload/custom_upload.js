Template.CustomUpload.events({
    'change #fileInput': function (event) {

        //Si hay un archivo cargado
        if(event.target.files[0]){
        	
		    var file = new FS.File(event.target.files[0]);
	        var collection;


	        file.owner = Meteor.userId();
			
			
			switch(Blaze.getData().collection){
				case 1:
					collection = ImagesPublications;
					break;
			}


	        var uploadedFile = collection.insert(file, function (err, fileObj) {
	            
	            if (err) {
	                throw err;
	            }
	        });

	        Template.registerHelper("uploadedFileId", function (){
	        	return uploadedFile._id;
	        });

        } else {

            Template.registerHelper("uploadedFileId", function (){
                return null;
            });
        }
    }
});

Template.CustomUpload.onRendered(function () {
	$.getScript("http://markusslima.github.io/bootstrap-filestyle/js/bootstrap-filestyle.min.js");
});