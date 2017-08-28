	// // JavaScript Document


function myFunction()
{
	//alert("Resize");
	
	var targetHeight = document.getElementById("left_image_ref").offsetHeight;
	//alert("width style.height " +document.getElementById("left_image_ref").style.height);
	var divs = document.querySelectorAll(".pr_opts");
	alert(divs.length);
	if(divs.length > 0)
		for(var i = 0; i < divs.length; i++)
		{
			divs[i].style.height = targetHeight + "px";
		}
	
}
// $(document).ready(function(e) {
    
// 	/**Slide animation for dashboard items. **/
// 	$(document).on('mouseenter', '.l_item', function(e) {
// 		$(this).children('.l_item_text').animate({'margin-top':0}, 125);	
// 	});
// 	$(document).on('mouseleave', '.l_item', function(e) {
// 		$(this).children('.l_item_text').animate({'margin-top':'235px'}, 125);//check variable height screen size	
// 	});
	
// 	/** Expansion and collapse of display boxes **/
// 	$(document).on('click', '.l_item', function(e){		
// 		//maybe keep the current one open if its in same row
// 		var checkOpen = $(this).parent().nextAll('.l_display').hasClass('l_display_open');
// 		if (checkOpen == false){
// 			$('.l_display_open').animate({'height':'0'}).removeClass('l_display_open');
// 			$(this).parent().nextAll('.l_display').animate({'height':'300px'}).addClass('l_display_open');//check variable height
// 		}
		
// 	});
// 	$(document).on('click', '.l_close_display', function(e){
// 		$(this).parents('.l_display').animate({'height':'0'}).removeClass('l_display_open');//check variable height
// 	});
	
// 	//slide without swipe
	$(document).on('click', '.gal_right', function(e){		
			$(this).parent().animate({scrollLeft:750},175);
		
	});
	$(document).on('click', '.gal_left', function(e){
			$(this).parent().animate({scrollLeft: -750},175);
		
	});
	
// });
// 	function $id(id) {
// 		return document.getElementById(id);
// 	}
	
// 	// getElementById
// 	function $class(cls){
// 		return document.getElementsByClassName(cls);
// 	}

// *End of Helper Functions *

// //**BELOW THIS AREA IS THE DRAG AND DROP CONTROLLER**//
	
// 	function DragAndDrop(){
// 		console.log('draganddrop loaded');
// 		if (window.File && window.FileList && window.FileReader) {
// 			startDND();
// 		}
		
// 		function startDND() {
	
// 			var filedrag = $class("dragbox");
// 			// file select
		
// 			// is XHR2 available?
// 			var xhr = new XMLHttpRequest();
// 			if (xhr.upload) {
			
// 				// everything checks out, start the listers.
// 				for(i=0; i<filedrag.length; i++) {
        			
// 					filedrag[i].addEventListener("dragover", FileDragHover, false);
// 					filedrag[i].addEventListener("dragleave", FileDragHover, false);
// 					filedrag[i].addEventListener("drop", FileSelectHandler, false);
// 				}
				
// 			}	
	
// 		}
		
// 		// file drag hover
// 		function FileDragHover(e) {
// 			e.stopPropagation();
// 			e.preventDefault();
// 			e.target.className = (e.type == "dragover" ? "hover" : "");
			
// 		}
// 	function FileSelectHandler(e) {
	
// 		//on drop get target id
// 		var dropTarget = e.target.id;
// 		alert(dropTarget);
// 		FileDragHover(e);
		
		
// 		var files = e.target.files || e.dataTransfer.files;
	
// 		// process all File objects
// 		for (var i = 0, f; f = files[i]; i++) {
// 			ProcessFile(f,dropTarget);
// 		}
	
// 	}
// 	function ProcessFile(file,dropTarget) {
// 		//do some prechecks before the upload
// 		supportedFormats = ['image/jpg','image/jpeg','image/png'];
// 		console.log("<p>File information: <strong>" + file.name +
// 		"</strong> type: <strong>" + file.type +
// 		"</strong> size: <strong>" + file.size +
// 		"</strong> bytes</p>")
// 		if(file.size > 300000){
// 			alert('File size is above 300kb, needs to be smaller');
// 		} else if (supportedFormats.indexOf(file.type)){
// 			//grab key
// 			var key = $('#itemsList').val();
// 			//sort out the target upload //TODO Check Storage references for image
// 			if(dropTarget == "primary-target"){
// 				var storageRef = firebase.storage().ref().child('products').child(key);
// 				var urlRef = firebase.database().ref().child('products').child(key);
// 				var galleryTarget = 'branding';
// 			} else{
// 				var galleryTarget = dropTarget.split('-')[1];
// 				var storageRef = firebase.storage().ref().child('products').child(key).child('images');
// 				var urlRef = firebase.database().ref().child('products').child(key).child('images');
// 			}
// 			//upload now			
// 			var uploadTask = storageRef.put(file);
// 			uploadTask.on('state_changed', function(snapshot){
// 			}, function(error) {
// 			  alert('There was an error during upload, check console log');
// 			  console.log(error);
// 			}, function() {
// 			  //get the url
// 			  var downloadURL = uploadTask.snapshot.downloadURL;
// 			  console.log(downloadURL);
// 			  var newUpdate = {galleryTarget:downloadURL};
// 			  urlRef.update(newUpdate);
// 			});
			
// 		} else{
// 			alert('Incorrect format, please use *jpg, *jpeg, *png');
// 		}
		
// 	}
// }