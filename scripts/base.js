
var navHeight = 50;
var scrollPadding = 20;
var totalOffset = navHeight + scrollPadding;

function navScrollHook() {

  var windowOffset = $(window).scrollTop();
  var windowHeight = $(window).height();
  var documentHeight = $(document).height();

  var nav = $('.nav');
  var anchor = $('#nav');

  if (windowOffset >= anchor.offset().top) {
    nav.addClass('nav-fixed-top');
  } else {
    nav.removeClass('nav-fixed-top');
  }

  var $toBeActive = null;

  $("section").each(function () {
    var $section = $(this);
    var sectionId = $section.attr("id");
    var sectionHeight = $section.height();
    var sectionOffset = $section.offset().top;

    if ($toBeActive == null) {

      if (sectionOffset - totalOffset <= windowOffset && 
          sectionOffset + sectionHeight - totalOffset >= windowOffset) {
        $toBeActive = $section;
      }
    }
    $("#" + sectionId + "-menu").removeClass("active");
  });

  if (windowOffset + windowHeight == documentHeight) {
    $toBeActive = $("section").last();
  }

  if ($toBeActive != null) {
    $("#" + $toBeActive.attr("id") + "-menu").addClass("active");
  }

}
