// Tell whether the rect is visible, given an offset
//
// return: boolean
module.exports = function (offset, rect, containmentRect) {
  var offsetDir = offset.direction;
  var offsetVal = offset.value;

  // Rules for checking different kind of offsets. In example if the element is
  // 90px below viewport and offsetTop is 100, it is considered visible.
  switch (offsetDir) {
  case 'top':
    return ((containmentRect.top + offsetVal) < rect.top) &&
      (containmentRect.bottom > rect.bottom) &&
      (containmentRect.left < rect.left) &&
      (containmentRect.right > rect.right);

  case 'left':
    return ((containmentRect.left + offsetVal) < rect.left) &&
      (containmentRect.bottom > rect.bottom) &&
      (containmentRect.top < rect.top) &&
      (containmentRect.right > rect.right);

  case 'bottom':
    return ((containmentRect.bottom - offsetVal) > rect.bottom) &&
      (containmentRect.left < rect.left) &&
      (containmentRect.right > rect.right) &&
      (containmentRect.top < rect.top);

  case 'right':
    return ((containmentRect.right - offsetVal) > rect.right) &&
      (containmentRect.left < rect.left) &&
      (containmentRect.top < rect.top) &&
      (containmentRect.bottom > rect.bottom);
  }
}
