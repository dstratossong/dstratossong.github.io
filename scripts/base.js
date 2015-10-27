function navScrollHook() {
  var distFromTop = $(window).scrollTop();
  var viewPortSize = $(window).height();
  $('.nav').each(function (i) {
    if (distFromTop >= $(this).offset().top - viewPortSize + triggerPad) {
      $(this).removeClass('fade-in');
      $(this).css('visibility', 'visible').hide().fadeIn();
    }
  });

  var nav = $('.nav');

  if (distFromTop >= nav.offset().top - viewPortSize) console.log(true);

}
