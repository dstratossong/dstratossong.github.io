function navScrollHook() {
  var distFromTop = $(window).scrollTop();

  var nav = $('.nav');
  var anchor = $('#nav');

  if (distFromTop >= anchor.offset().top) {
    nav.addClass('nav-fixed-top');
  } else {
    nav.removeClass('nav-fixed-top');
  }

}