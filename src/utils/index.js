export function scrollTo(element, to, duration) {
  if (duration < 0) return
  const difference = to - element.scrollTop
  const perTick = duration === 0 ? difference : difference / duration * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function debounce(fn, delay) {
  let last
  return function () {
    let ctx = this
    let args = arguments
    clearTimeout(last)
    last = setTimeout(function () {
      fn.apply(ctx, args)
    }, delay)
  }
}
export function dragscroll(LIST) {
  var addEventListener = 'addEventListener';
  var elems = document.getElementsByClassName('dragscroll');

  function isContain(all, cur) {
    for (var i = 0; i < cur.length; i++) {
      if (all.indexOf(cur[i]) >= 0) {
        return true
      }
    }
    return false
  }
  for (var i = 0; i < elems.length;) {
    (function (elem, lastClientX, lastClientY, pushed) {
      elem[addEventListener]('mousedown', function (e) {
        let a = isContain(LIST, e.target.className.split(' '))
        if (!a) {
          pushed = 0;
          return
        }
        pushed = 1;
        lastClientX = e.clientX;
        lastClientY = e.clientY;

        e.preventDefault();
        e.stopPropagation();
      }, 0);

      document[addEventListener]('mousemove', function (e) {
        if (pushed) {
          // console.log(e.target.className)
          elem.scrollLeft -=
            (-lastClientX + (lastClientX = e.clientX));
          elem.scrollTop -=
            (-lastClientY + (lastClientY = e.clientY));
        }
      }, 0);

      document[addEventListener]('mouseup', function () {
        pushed = 0;
      }, 0);

    })(elems[i++]);
  }
}
