'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var containmentPropType = React.PropTypes.any;

if (typeof window !== 'undefined') {
  containmentPropType = React.PropTypes.instanceOf(window.Element);
}

module.exports = React.createClass({
  displayName: 'VisibilitySensor',

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    partialVisibility: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    ]),
    delayedCall: React.PropTypes.bool,
    offset: React.PropTypes.shape({
      direction: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
      value: React.PropTypes.number
    }),
    scrollCheck: React.PropTypes.bool,
    scrollDelay: React.PropTypes.number,
    resizeCheck: React.PropTypes.bool,
    resizeDelay: React.PropTypes.number,
    intervalCheck: React.PropTypes.bool,
    intervalDelay: React.PropTypes.number,
    containment: containmentPropType,
    children: React.PropTypes.element,
    minTopValue: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      active: true,
      partialVisibility: false,
      minTopValue: 0,
      scrollCheck: false,
      scrollDelay: 250,
      resizeCheck: false,
      resizeDelay: 250,
      intervalCheck: true,
      intervalDelay: 1500,
      delayedCall: false,
      offset: {},
      containment: null,
      children: React.createElement('span')
    };
  },

  getInitialState: function () {
    return {
      isVisible: null,
      visibilityRect: {}
    };
  },

  componentDidMount: function () {
    if (this.props.active) {
      this.startWatching();
    }
  },

  componentWillUnmount: function () {
    this.stopWatching();
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.active) {
      this.setState(this.getInitialState());
      this.startWatching();
    } else {
      this.stopWatching();
    }
  },

  debounce: function (func, wait) {
    var timeout;

    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      this.lastTimeout = timeout;
    }.bind(this)
  },

  getContainer: function () {
    return this.props.containment || window;
  },

  addEventListenerWithDebounce: function (target, event, delay) {
    if (!this.debounceCheck) {
      this.debounceCheck = {};
    }

    var timeout;

    var debounce = function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        context.check.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, delay || 0);
    }.bind(this);

    var info = {
      target: target,
      fn: debounce,
      timeout: timeout,
    };

    target.addEventListener(event, info.fn);
    this.debounceCheck[event] = info;
  },

  startWatching: function () {
    if (this.debounceCheck || this.interval) { return; }

    if (this.props.intervalCheck) {
      this.interval = setInterval(this.check, this.props.intervalDelay);
    }

    if (this.props.scrollCheck) {
      this.addEventListenerWithDebounce(
        this.getContainer(), 'scroll', this.props.scrollDelay
      );
    }

    if (this.props.resizeCheck) {
      this.addEventListenerWithDebounce(
        window, 'resize', this.props.resizeDelay
      );
    }

    // if dont need delayed call, check on load ( before the first interval fires )
    !this.props.delayedCall && this.check();
  },

  stopWatching: function () {
    if (this.debounceCheck) {
      // clean up event listeners and their debounce callers
      for (var debounceEvent in this.debounceCheck) {
        if (this.debounceCheck.hasOwnProperty()) {
          var debounceInfo = this.debounceCheck[debounceEvent];

          clearTimeout(debounceInfo.timeout);
          debounceInfo.target.removeEventListener(
            debounceEvent, debounceInfo.fn
          );

          this.debounceCheck[debounceEvent] = null;
        }
      }
      clearTimeout(this.lastTimeout);
    }
    this.debounceCheck = null;

    if (this.interval) { this.interval = clearInterval(this.interval); }
  },

  /**
   * Check if the element is within the visible viewport
   */
  check: function () {
    var el = ReactDOM.findDOMNode(this);
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

    var state = this.state;
    // notify the parent when the value changes
    if (this.state.isVisible !== isVisible) {
      state = {
        isVisible: isVisible,
        visibilityRect: visibilityRect
      };
      this.setState(state);
      this.props.onChange(isVisible, visibilityRect);
    }

    return state;
  },

  render: function () {
    return React.Children.only(this.props.children);
  }
});
