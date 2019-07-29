"use strict";

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import useVisibilitySensor from "./lib/use-visibility-sensor";

export { useVisibilitySensor };

export default function VisibilitySensor({
  children,
  active,
  onChange,
  partialVisibility,
  minTopValue,
  scrollCheck,
  scrollDelay,
  scrollThrottle,
  resizeCheck,
  resizeDelay,
  resizeThrottle,
  intervalCheck,
  intervalDelay,
  delayedCall,
  offset,
  containment
}) {
  const { nodeRef, isVisible, visibilityRect } = useVisibilitySensor({
    active,
    onChange,
    partialVisibility,
    minTopValue,
    scrollCheck,
    scrollDelay,
    scrollThrottle,
    resizeCheck,
    resizeDelay,
    resizeThrottle,
    intervalCheck,
    intervalDelay,
    delayedCall,
    offset,
    containment
  });
  const isFunction = children instanceof Function;

  if (isFunction) {
    // if the consumer doesn't use our getRef function, we'll wrap
    // it in a node and apply the ref ourselves.
    return <div ref={nodeRef}>{children({ isVisible, visibilityRect })}</div>;
  }

  if (!React.Children.count(children)) {
    return <div ref={nodeRef} />;
  }

  console.warn(`[notice] passing children directly into the VisibilitySensor has been deprecated, and will be removed in the next major version.
Please upgrade to the Child Function syntax instead: https://github.com/joshwnj/react-visibility-sensor#child-function-syntax`);

  return <div ref={nodeRef}>{children}</div>;
}

VisibilitySensor.defaultProps = {
  children: <span />
};

VisibilitySensor.propTypes = {
  onChange: PropTypes.func,
  active: PropTypes.bool,
  partialVisibility: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["top", "right", "bottom", "left"])
  ]),
  delayedCall: PropTypes.bool,
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number
  }),
  scrollCheck: PropTypes.bool,
  scrollDelay: PropTypes.number,
  scrollThrottle: PropTypes.number,
  resizeCheck: PropTypes.bool,
  resizeDelay: PropTypes.number,
  resizeThrottle: PropTypes.number,
  intervalCheck: PropTypes.bool,
  intervalDelay: PropTypes.number,
  containment:
    typeof window !== "undefined"
      ? PropTypes.instanceOf(window.Element)
      : PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  minTopValue: PropTypes.number
};
