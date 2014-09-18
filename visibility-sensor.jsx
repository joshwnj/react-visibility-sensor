/** @jsx React.DOM */
'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'VisibilitySensor',

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    delay: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      active: true,
      delay: 1000
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
      this.lastValue = null;
      this.startWatching();
    } else {
      this.stopWatching();
    }
  },

  startWatching: function () {
    if (this.interval) { return; }
    this.interval = setInterval(this.check, this.props.delay);
  },

  stopWatching: function () {
    this.interval = clearInterval(this.interval);
  },

  /**
   * Check if the element is within the visible viewport
   */
  check: function () {
    var el = this.getDOMNode();
    var rect = el.getBoundingClientRect();
    var isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    // notify the parent when the value changes
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible;
      this.props.onChange(isVisible);
    }
  },

  render: function () {
    return (
      <div>{this.props.children}</div>
    );
  }
});
