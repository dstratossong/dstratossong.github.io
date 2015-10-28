function navScrollHook() {
  var distFromTop = $(window).scrollTop();
  var viewPortSize = $(window).height();

  var nav = $('.nav');
  var anchor = $('#nav');

  if (distFromTop >= anchor.offset().top - viewPortSize) {
    nav.addClass('nav-fixed-top');
  } else {
    nav.removeClass('nav-fixed-top');
  }

}
