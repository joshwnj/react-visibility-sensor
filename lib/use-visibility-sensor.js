import { useEffect, useState, useRef, useCallback } from "react";

function normalizeRect(rect) {
  if (rect.width === undefined) {
    rect.width = rect.right - rect.left;
  }

  if (rect.height === undefined) {
    rect.height = rect.bottom - rect.top;
  }

  return rect;
}

function roundRectDown(rect) {
  return {
    top: Math.floor(rect.top),
    left: Math.floor(rect.left),
    bottom: Math.floor(rect.bottom),
    right: Math.floor(rect.right)
  };
}

function getContainmentRect(containment, offset) {
  let containmentRect;
  if (containment) {
    const containmentDOMRect = containment.getBoundingClientRect();
    containmentRect = {
      top: containmentDOMRect.top,
      left: containmentDOMRect.left,
      bottom: containmentDOMRect.bottom,
      right: containmentDOMRect.right
    };
  } else {
    containmentRect = {
      top: 0,
      left: 0,
      bottom: window.innerHeight || document.documentElement.clientHeight,
      right: window.innerWidth || document.documentElement.clientWidth
    };
  }
  // Check if visibility is wanted via offset?
  const hasValidOffset = typeof offset === "object";
  if (hasValidOffset) {
    containmentRect.top += offset.top || 0;
    containmentRect.left += offset.left || 0;
    containmentRect.bottom -= offset.bottom || 0;
    containmentRect.right -= offset.right || 0;
  }

  return containmentRect;
}

function getVisibilityRect(rect, containmentRect) {
  return {
    top: rect.top >= containmentRect.top,
    left: rect.left >= containmentRect.left,
    bottom: rect.bottom <= containmentRect.bottom,
    right: rect.right <= containmentRect.right
  };
}

function checkIsVisible(
  rect,
  containmentRect,
  visibilityRect,
  partialVisibility,
  minTopValue
) {
  // https://github.com/joshwnj/react-visibility-sensor/pull/114
  const hasSize = rect.height > 0 && rect.width > 0;
  const isVisible =
    hasSize &&
    visibilityRect.top &&
    visibilityRect.left &&
    visibilityRect.bottom &&
    visibilityRect.right;

  // check for partial visibility
  if (hasSize && partialVisibility) {
    let partialVisible =
      rect.top <= containmentRect.bottom &&
      rect.bottom >= containmentRect.top &&
      rect.left <= containmentRect.right &&
      rect.right >= containmentRect.left;

    // account for partial visibility on a single edge
    if (typeof partialVisibility === "string") {
      partialVisible = visibilityRect[partialVisibility];
    }

    // if we have minimum top visibility set by props, lets check, if it meets the passed value
    // so if for instance element is at least 200px in viewport, then show it.
    return minTopValue
      ? partialVisible && rect.top <= containmentRect.bottom - minTopValue
      : partialVisible;
  }
  return isVisible;
}

export default function useVisibilitySensor({
  active = true,
  onChange,
  partialVisibility = false,
  minTopValue = 0,
  scrollCheck = false,
  scrollDelay = 250,
  scrollThrottle = -1,
  resizeCheck = false,
  resizeDelay = 250,
  resizeThrottle = -1,
  intervalCheck = true,
  intervalDelay = 100,
  delayedCall = false,
  offset = {},
  containment = null
}) {
  const nodeRef = useRef();
  const debounceCheckRef = useRef();
  const intervalRef = useRef();
  const [isVisible, setIsVisible] = useState(null);
  const [visibilityRect, setVisibilityRect] = useState({});

  const getContainer = useCallback(() => containment || window, [containment]);

  // Check if the element is within the visible viewport
  const visibilityCheck = useCallback(() => {
    const el = nodeRef && nodeRef.current;
    // if the component has rendered to null, dont update visibility
    if (!el) {
      return;
    }

    const rect = normalizeRect(roundRectDown(el.getBoundingClientRect()));
    const containmentRect = getContainmentRect(containment, offset);
    const nextVisibilityRect = getVisibilityRect(rect, containmentRect);
    const nextIsVisible = checkIsVisible(
      rect,
      containmentRect,
      nextVisibilityRect,
      partialVisibility,
      minTopValue
    );

    // notify the parent when the value changes
    if (isVisible !== nextIsVisible) {
      setIsVisible(nextIsVisible);
      setVisibilityRect(nextVisibilityRect);
      if (onChange) onChange(nextIsVisible);
    }
  }, [
    isVisible,
    offset,
    containment,
    partialVisibility,
    minTopValue,
    onChange,
    setIsVisible,
    setVisibilityRect
  ]);

  const addEventListener = useCallback(
    (target, event, delay, throttle) => {
      if (!debounceCheckRef.current) {
        debounceCheckRef.current = {};
      }
      const debounceCheck = debounceCheckRef.current;
      let timeout;
      let func;

      const later = () => {
        timeout = null;
        visibilityCheck();
      };

      if (throttle > -1) {
        func = () => {
          if (!timeout) {
            timeout = setTimeout(later, throttle || 0);
          }
        };
      } else {
        func = () => {
          clearTimeout(timeout);
          timeout = setTimeout(later, delay || 0);
        };
      }

      const info = {
        target: target,
        fn: func,
        getLastTimeout: () => {
          return timeout;
        }
      };

      target.addEventListener(event, info.fn);
      debounceCheck[event] = info;

      return () => {
        clearTimeout(timeout);
      };
    },
    [visibilityCheck]
  );

  useEffect(() => {
    function watch() {
      if (debounceCheckRef.current || intervalRef.current) {
        return;
      }

      if (intervalCheck) {
        intervalRef.current = setInterval(visibilityCheck, intervalDelay);
      }

      if (scrollCheck) {
        addEventListener(getContainer(), "scroll", scrollDelay, scrollThrottle);
      }

      if (resizeCheck) {
        addEventListener(window, "resize", resizeDelay, resizeThrottle);
      }

      // if dont need delayed call, check on load ( before the first interval fires )
      !delayedCall && visibilityCheck();
    }

    if (active) {
      watch();
    }

    // stop any listeners and intervals on props change and re-registers
    return () => {
      if (debounceCheckRef.current) {
        const debounceCheck = debounceCheckRef.current;
        // clean up event listeners and their debounce callers
        for (let debounceEvent in debounceCheck) {
          if (debounceCheck.hasOwnProperty(debounceEvent)) {
            const debounceInfo = debounceCheck[debounceEvent];

            clearTimeout(debounceInfo.getLastTimeout());
            debounceInfo.target.removeEventListener(
              debounceEvent,
              debounceInfo.fn
            );

            debounceCheck[debounceEvent] = null;
          }
        }
      }
      debounceCheckRef.current = null;

      if (intervalRef.current) {
        intervalRef.current = clearInterval(intervalRef.current);
      }
    };
  }, [
    active,
    scrollCheck,
    scrollDelay,
    scrollThrottle,
    resizeCheck,
    resizeDelay,
    resizeThrottle,
    intervalCheck,
    intervalDelay,
    visibilityCheck
  ]);

  return { nodeRef, isVisible, visibilityRect };
}
