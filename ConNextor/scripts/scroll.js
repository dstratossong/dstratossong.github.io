var lightBulbVisible = false,
	currentSection,
	currentDisplayingPicture = 0,
	offset = 0.5,
	fadeTime = 300;

/**
 * With every scroll, checks the current position and the section updates.
 */
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

	// note that we round the current section anyways
	// any offset < 0.5 would cause periods of inactivity
	// any offset > 0.5 would cause this function to be called too many times
	if (Math.abs(currentSection - currentDisplayingPicture) > offset) {
		changeSection(Math.round(currentSection));
	}
});

/**
 * Updates all visual elements associated with the given section.
 * This includes the time-line side pane, the picture in the bulb
 * as well as the background change and dotted line
 *
 * @param newSection
 */
function changeSection(newSection) {
	if (currentDisplayingPicture == newSection) return;
	console.log('changed to ' + newSection);

	//if (currentDisplayingPicture) { // is not zero
	//	document.getElementsByClassName()
	//}

	document.getElementById("light_bulb_image").className = "light_bulb_image"+(newSection);
	$("#light_bulb_image_container").hide().fadeIn(fadeTime);
	$("#section"+newSection+"text").fadeIn(fadeTime);
	currentDisplayingPicture = newSection;
}

function highlightCurrentTimeLineElement(newSection) {

}