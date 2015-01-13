


$(document).ready(function(){
    start();

});

$(window).scroll(function () {
    $(".light-bulb")[0].style.visibility = "visible";
    if($(window).scrollTop() + $(window).height() > $(document).height()/2) {
        console.log("hi");
    }
});

function start(){
    $("#lightbulb").fadeIn(3000);
}



// Function taken from http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    //return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    return ((docViewTop < elemTop) && (docViewBottom > elemBottom));
}


