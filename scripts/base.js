function navScrollHook() {
  var distFromTop = $(window).scrollTop();
  var viewPortSize = $(window).height();

  var nav = $('.nav');

  if (distFromTop >= nav.offset().top - viewPortSize) {
    nav.addClass('nav-fixed-top');
  } else {
    nav.removeClass('nav-fixed-top');
  }

}
