var numOfSections = 5;
//var adjustment = 120;
//var section = $(document).height() / numOfSections;
//var trackSection = 0;
var fadeTime = 500;
//var seen=[numOfSections];

var lightBulbVisible = false;
var currentSection,
	currentDisplayingPicture = 0,
	offset = 0.5;

//$(document).ready(function(){
//	start();
//});

$(window).scroll(function () {
	var distanceFromTop = $(window).scrollTop(),
		windowHeight = $(window).height();
	currentSection = distanceFromTop / windowHeight;
	console.log('Currently in: ' + currentSection + ' (int): ' + parseInt(currentSection));

	// prevent light bulb from loading first.
	if (!lightBulbVisible) {
		$(".light-bulb")[0].style.visibility = "visible";
		lightBulbVisible = true;
	}

	if (Math.abs(currentSection - currentDisplayingPicture) > offset) {
		changeSection(Math.round(currentSection));
	}

   //if($(window).scrollTop() > ($(window).height())*(trackSection)-adjustment) {
	// console.log("changed!");
	// changeSection();
	// trackSection+=1;
   //}
   //else{
	//   if (($(window).height())*(trackSection)-$(window).scrollTop()>$(window).height()*1.5){
	//		console.log("up!");
	//		trackSection-=2;
	//		if (trackSection<1){
	//			trackSection=1;
	//		}
	//		changeSection();
	//	}
	//}
});

function changeSection(newPicture) {
	if (currentDisplayingPicture == newPicture) return;
	console.log('changed to ' + newPicture);

	//if (currentDisplayingPicture) { // is not zero
	//	document.getElementsByClassName()
	//}

	document.getElementById("light_bulb_image").className = "light_bulb_image"+(newPicture);
	$("#light_bulb_image_container").hide().fadeIn(fadeTime);
	currentDisplayingPicture = newPicture;
}

//function start(){
//	for (i = 0; i < seen.length; i++) {
//		seen[i]=false;
//	}
//	trackSection=1;
//}
