Template.customUpload.events({
    'change #fileInput': function (event) {

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
        }
    }
});

Template.customUpload.rendered = function () {
	$.getScript("http://markusslima.github.io/bootstrap-filestyle/js/bootstrap-filestyle.min.js");
};