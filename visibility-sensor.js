'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isVisibleWithOffset from './lib/is-visible-with-offset';

var containmentPropType = PropTypes.any;

if (typeof window !== 'undefined') {
  containmentPropType = PropTypes.instanceOf(window.Element);
}

export default class VisibilitySensor extends React.Component {

  static defaultProps = {
    active: true,
      partialVisibility: false,
      minTopValue: 0,
      scrollCheck: false,
      scrollDelay: 250,
      scrollThrottle: -1,
      resizeCheck: false,
      resizeDelay: 250,
      resizeThrottle: -1,
      intervalCheck: true,
      intervalDelay: 100,
      delayedCall: false,
      offset: {},
      containment: null,
      children: <span />
  };

  static propTypes = {
    onChange: PropTypes.func,
    active: PropTypes.bool,
    partialVisibility: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    ]),
    delayedCall: PropTypes.bool,
    offset: PropTypes.oneOfType([
      PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        bottom: PropTypes.number,
        right: PropTypes.number
      }),
      // deprecated offset property
      PropTypes.shape({
        direction: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
        value: PropTypes.number
      })
    ]),
    scrollCheck: PropTypes.bool,
    scrollDelay: PropTypes.number,
    scrollThrottle: PropTypes.number,
    resizeCheck: PropTypes.bool,
    resizeDelay: PropTypes.number,
    resizeThrottle: PropTypes.number,
    intervalCheck: PropTypes.bool,
    intervalDelay: PropTypes.number,
    containment: containmentPropType,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
    minTopValue: PropTypes.number,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      isVisible: null,
      visibilityRect: {}
    };
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    if (this.props.active) {
      this.startWatching();
    }
  }
  
  componentWillUnmount() {
    this.stopWatching();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) {
      this.setState(this.getInitialState());
      this.startWatching();
    } else if (!nextProps.active) {
      this.stopWatching();
    }
  }

  getContainer() {
    return this.props.containment || window;
  }

  addEventListener(target, event, delay, throttle) {
    if (!this.debounceCheck) {
      this.debounceCheck = {};
    }

    var timeout;
    var func;

    var later = function () {
      timeout = null;
      this.check();
    }.bind(this);

    if (throttle > -1) {
      func = function () {
        if (!timeout) {
          timeout = setTimeout(later, throttle || 0);
        }
      };
    } else {
      func = function () {
        clearTimeout(timeout);
        timeout = setTimeout(later, delay || 0);
      };
    }

    var info = {
      target: target,
      fn: func,
      getLastTimeout: function () {
        return timeout;
      },
    };

    target.addEventListener(event, info.fn);
    this.debounceCheck[event] = info;
  }

  startWatching() {
    if (this.debounceCheck || this.interval) { return; }

    if (this.props.intervalCheck) {
      this.interval = setInterval(this.check, this.props.intervalDelay);
    }

    if (this.props.scrollCheck) {
      this.addEventListener(
        this.getContainer(),
        'scroll',
        this.props.scrollDelay,
        this.props.scrollThrottle
      );
    }

    if (this.props.resizeCheck) {
      this.addEventListener(
        window,
        'resize',
        this.props.resizeDelay,
        this.props.resizeThrottle
      );
    }

    // if dont need delayed call, check on load ( before the first interval fires )
    !this.props.delayedCall && this.check();
  }

  stopWatching() {
    if (this.debounceCheck) {
      // clean up event listeners and their debounce callers
      for (var debounceEvent in this.debounceCheck) {
        if (this.debounceCheck.hasOwnProperty(debounceEvent)) {
          var debounceInfo = this.debounceCheck[debounceEvent];

          clearTimeout(debounceInfo.getLastTimeout());
          debounceInfo.target.removeEventListener(
            debounceEvent, debounceInfo.fn
          );

          this.debounceCheck[debounceEvent] = null;
        }
      }
    }
    this.debounceCheck = null;

    if (this.interval) { this.interval = clearInterval(this.interval); }
  }

  check() {
    var el = this.node;
    var rect;
    var containmentRect;
    // if the component has rendered to null, dont update visibility
    if (!el) {
      return this.state;
    }

    rect = el.getBoundingClientRect();

    if (this.props.containment) {
      var containmentDOMRect = this.props.containment.getBoundingClientRect();
      containmentRect = {
        top: containmentDOMRect.top,
        left: containmentDOMRect.left,
        bottom: containmentDOMRect.bottom,
        right: containmentDOMRect.right,
      }
    } else {
      containmentRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      };
    }

    // Check if visibility is wanted via offset?
    var offset = this.props.offset || {};
    var hasValidOffset = typeof offset === 'object';
    if (hasValidOffset) {
      containmentRect.top += offset.top || 0;
      containmentRect.left += offset.left || 0;
      containmentRect.bottom -= offset.bottom || 0;
      containmentRect.right -= offset.right || 0;
    }

    var visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    };

    var isVisible = (
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right
    );

    // check for partial visibility
    if (this.props.partialVisibility) {
      var partialVisible =
          rect.top <= containmentRect.bottom && rect.bottom >= containmentRect.top &&
          rect.left <= containmentRect.right && rect.right >= containmentRect.left;

      // account for partial visibility on a single edge
      if (typeof this.props.partialVisibility === 'string') {
        partialVisible = visibilityRect[this.props.partialVisibility]
      }

      // if we have minimum top visibility set by props, lets check, if it meets the passed value
      // so if for instance element is at least 200px in viewport, then show it.
      isVisible = this.props.minTopValue
        ? partialVisible && rect.top <= (containmentRect.bottom - this.props.minTopValue)
        : partialVisible
    }

    // Deprecated options for calculating offset.
    if (typeof offset.direction === 'string' &&
        typeof offset.value === 'number') {
      console.warn('[notice] offset.direction and offset.value have been deprecated. They still work for now, but will be removed in next major version. Please upgrade to the new syntax: { %s: %d }', offset.direction, offset.value)

      isVisible = isVisibleWithOffset(offset, rect, containmentRect);
    }

    var state = this.state;
    // notify the parent when the value changes
    if (this.state.isVisible !== isVisible) {
      state = {
        isVisible: isVisible,
        visibilityRect: visibilityRect
      };
      this.setState(state);
      if (this.props.onChange) this.props.onChange(isVisible, visibilityRect);
    }

    return state;
  }

  render() {
    if (this.props.children instanceof Function) {
      return this.props.children({
        isVisible: this.state.isVisible,
        visibilityRect: this.state.visibilityRect,
      });
    }
    return React.Children.only(this.props.children);
  }
}
