/** @jsx React.DOM */
'use strict';

var React = require('react');
var VisibilitySensor = React.createFactory(require('../'));

var Example = React.createClass({
  getInitialState: function () {
    return { msg: '' };
  },

  onChange: function (isVisible) {
    this.setState({
      msg: 'Element is now ' + (isVisible ? 'visible' : 'hidden')
    });
  },

  render: function () {
    var self = this;

    return (
      <div>
        <p className='msg'>{this.state.msg}</p>
        <div className='before'></div>
        <VisibilitySensor containment={this.props.containment} onChange={this.onChange}>
          <div className='sensor' />
        </VisibilitySensor>
        <div className='after'></div>
      </div>
    );
  }
});

React.render(React.createElement(Example), document.getElementById('example'));

var container = document.getElementById('example-container');
var elem = container.querySelector('.inner');
container.scrollTop = 320;
container.scrollLeft = 320;
React.render(React.createElement(Example, { containment: container }), elem);
