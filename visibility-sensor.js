'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var containmentPropType = React.PropTypes.any;

if (typeof window !== 'undefined') {
  containmentPropType = React.PropTypes.instanceOf(Element);
}

module.exports = React.createClass({
  displayName: 'VisibilitySensor',

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    partialVisibility: React.PropTypes.bool,
    delay: React.PropTypes.number,
    delayedCall: React.PropTypes.bool,
    containment: containmentPropType,
    children: React.PropTypes.element,
    minTopValue: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      active: true,
      partialVisibility: false,
      minTopValue: false,
      delay: 1000,
      delayedCall: false,
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

  startWatching: function () {
    if (this.interval) { return; }
    this.interval = setInterval(this.check, this.props.delay);
    // if dont need delayed call, check on load ( before the first interval fires )
    !this.props.delayedCall && this.check();
  },

  stopWatching: function () {
    this.interval = clearInterval(this.interval);
  },

  /**
   * Check if the element is within the visible viewport
   */
  check: function () {
    var el = ReactDOM.findDOMNode(this);
    var rect = el.getBoundingClientRect();
    var containmentRect;

    if (this.props.containment) {
      containmentRect = this.props.containment.getBoundingClientRect();
    } else {
      containmentRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      };
    }

    var visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    };

    var fullVisible = (
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right
    );

    var partialVertical =
      (rect.top >= containmentRect.top && rect.top <= containmentRect.bottom)
      || (rect.bottom >= containmentRect.top && rect.bottom <= containmentRect.bottom)
      || (rect.top <= containmentRect.top && rect.bottom >= containmentRect.bottom);

    var partialHorizontal =
      (rect.left >= containmentRect.left && rect.left <= containmentRect.right)
      || (rect.right >= containmentRect.left && rect.right <= containmentRect.right);

    var partialVisible = partialVertical && partialHorizontal;

    var isVisible = false;

    // if element is fully visible, why care about partial visibility??
    if (fullVisible !== true && this.props.partialVisibility) {
      // so, if partial visibility is observed
      // if we have minimum top visibility set by props, lets check, if it meets the passed value
      // so if for instance element is at least 200px in viewport, then show it.
      if (this.props.partialVisibility && this.props.minTopValue && partialVisible) {
        isVisible = rect.top <= (containmentRect.bottom - this.props.minTopValue);
      } else {
        // minTopValue was not passed, just give partial Result.
        isVisible = partialVisible;
      }
    } else {
      // Partial visibility is not required, just return fullVisibility value
      isVisible = fullVisible;
    }

    // notify the parent when the value changes
    if (this.state.isVisible !== isVisible) {
      this.setState({
        isVisible: isVisible,
        visibilityRect: visibilityRect
      });
      this.props.onChange(isVisible, visibilityRect);
    }

    return this.state;
  },

  render: function () {
    return React.Children.only(this.props.children);
  }
});
