/*
тохе дать градиенты потюнить
снизу надпись (пока не надо)
фон затемнять
ie 7,8?
*/


function homepageInitialize() {

  var oldAngle,
    curAngle = 0,
    lineHeight = 0,
    scrollHeight = 0,
    touchScrollTop = 0,
    crumplesTotalHeightOnStopAngle = 0,
    $window = $(window),
    $wrappers = $(".crumpled-line-wrapper"),
    $gradients = $(".crumpled-gradient"),
    $lines = $(".crumpled-line"),
    $stub = $(".homepage-height-stub"),
    $box = $(".homepage-crumpled-box"),
    is3d = Modernizr.csstransforms3d,
    isTouch = Modernizr.touch,
    scrollTimer,
    scrollTimerCurPos,
    scrollTimerTargetPos;

  var PERSPECTIVE = 1300,
    STOPANGLE = 70;

  if (is3d) {
    $wrappers.css({
      '-webkit-perspective': PERSPECTIVE + 'px',
      '-moz-perspective': PERSPECTIVE + 'px',
      '-ms-perspective': PERSPECTIVE + 'px',
      '-o-perspective': PERSPECTIVE + 'px',
      'perspective': PERSPECTIVE + 'px'
    });
  } else {
    $wrappers.css('position', 'relative');
  }

  $window.resize(onResize);
  if (!isTouch) $window.scroll(onScroll);
  if (isTouch) $window.RMDrag({
    'move'  : onScroll,//_.throttle(onScroll, 30),
    'end' : onScrollEnd,
    'silent': false,
    'type'  : 'touch',
    'preventDefault' : true
  });
  onResize();

  $('.scroll-hover-wrapper')
    .on('mouseenter', function() {
      $('.scroll-wrapper').addClass('scroll-hover');
    })
    .on('mouseleave', function() {
      $('.scroll-wrapper').removeClass('scroll-hover');
    })
    .on('click', function() {
      fullScroll();
    })
    .on('touchstart', function(e) {
      e.stopPropagation();
    });

  //functions

  function applyTransform(obj, str) {
    obj.css({
      '-webkit-transform': str,
      '-moz-transform': str,
      '-ms-transform': str,
      '-o-transform': str,
      'transform': str
    });
  }

  function calcPerspectiveDimensions(angle) {
    var t = 0,
      b = lineHeight,
      rad = angle * Math.PI / 180,
      cosAngle = Math.cos(rad),
      sinAngle = Math.sin(rad);
    t -= lineHeight / 2;
    b -= lineHeight / 2;
    t = cosAngle * t * PERSPECTIVE / (PERSPECTIVE + sinAngle * t);
    b = cosAngle * b * PERSPECTIVE / (PERSPECTIVE + sinAngle * b);
    t += lineHeight / 2;
    b += lineHeight / 2;
    return [t, b];
  }

  function applyRotation() {

    if (Math.abs(oldAngle - curAngle) < 0.001) return;

    var perspectiveDimensions = calcPerspectiveDimensions(curAngle);

    var marginTop = lineHeight - perspectiveDimensions[1];
    var marginBottom = perspectiveDimensions[0];
    var startOffset = -marginTop - 1;
    var ind = 0;
    var dir = -1;

    $wrappers.each(function() {
      applyTransform($(this), 'translateY(' + startOffset + 'px)', 'top', startOffset + 'px');
      startOffset += lineHeight - (ind == 1 ? marginBottom : marginTop) * 2 - 2;
      ind = 1 - ind;
    })

    $lines.each(function() {
      applyTransform($(this), 'rotateX(' + (curAngle * dir) + 'deg)');
      dir *= -1;
    });

    $gradients.css('opacity', curAngle / 90);

    oldAngle = curAngle;
  }

  function onResize() {
    lineHeight = Math.ceil($window.height() / $lines.length) + (is3d ? 2 : 0);
    scrollHeight = $window.height() * 2;
    if (!isTouch) $stub.height(scrollHeight);
    $wrappers.css({'height': lineHeight + 'px'})
    $lines.css({'line-height': (lineHeight * 0.85) + 'px', 'font-size': (lineHeight * 0.8) + 'px'})

    if (is3d) {
      var perspectiveDimensions = calcPerspectiveDimensions(STOPANGLE);
      crumplesTotalHeightOnStopAngle = (perspectiveDimensions[1] - perspectiveDimensions[0] - 2) * $lines.length + 1;
    } else {
      crumplesTotalHeightOnStopAngle = lineHeight * $lines.length;
    }

    oldAngle = undefined;
    onScroll();

    var mt = ($window.height() - 672) / 2;
    mt = Math.min(Math.max(mt, 0), 108);
    $('.homepage-content-center-block-txt').css('margin-top', mt + 'px');
  }

  function onScroll(e) {
    var scrollTop = $window.scrollTop();

    if (isTouch) {
      var dY = 0;
      if (e) dY = e.deltaY;
      scrollTop = Math.max(Math.min(touchScrollTop - dY, scrollHeight / 2), 0);
    }

    var percent = 2 * scrollTop / scrollHeight;
    if (is3d) {
      curAngle = 2 * STOPANGLE * percent;
      if (curAngle >= STOPANGLE) {
        curAngle = STOPANGLE;
        var topOffset = -crumplesTotalHeightOnStopAngle * (percent - 0.5) * 2;
        applyTransform($box, 'translateY(' + topOffset + 'px)');
      } else {
        applyTransform($box, 'translateY(0px)');
      }
      applyRotation();
    } else {
      var topOffset = -crumplesTotalHeightOnStopAngle * percent;
      $box.css('top', topOffset + 'px');
    }
  }

  function onScrollEnd(e) {
    var dY = 0;
    if (e) dY = e.deltaY;
    touchScrollTop -= dY;
    touchScrollTop = Math.max(Math.min(touchScrollTop, scrollHeight / 2), 0);
  }


  function fullScrollStep() {
    console.log(scrollTimerCurPos);
    if (isTouch) {
      scrollTimerCurPos -= 30;
      if (scrollTimerCurPos <= scrollTimerTargetPos) {
        scrollTimerCurPos = scrollTimerTargetPos;
        clearInterval(scrollTimer);
      }
      onScroll({deltaY: scrollTimerCurPos });
      onScrollEnd({deltaY: scrollTimerCurPos});
    } else {
      scrollTimerCurPos += 30;
      if (scrollTimerCurPos >= scrollTimerTargetPos) {
        scrollTimerCurPos = scrollTimerTargetPos;
        clearInterval(scrollTimer);
      }
      $window.scrollTop(scrollTimerCurPos);
    }
  }

  function fullScroll() {
    if (isTouch) {
      scrollTimerCurPos = -touchScrollTop;
      scrollTimerTargetPos = touchScrollTop - scrollHeight / 2;
    } else {
      scrollTimerCurPos = $window.scrollTop();
      scrollTimerTargetPos = scrollHeight / 2;
    }
    scrollTimer = setInterval(fullScrollStep, 30);
  }




}