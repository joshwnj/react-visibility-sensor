/** @jsx React.DOM */
'use strict';

var React = require('react');
var VisibilitySensor = React.createFactory(require('../'));

var Example = React.createClass({
  getInitialState: function () {
    return { msg: '' };
  },

  render: function () {
    var self = this;

    var onChange = function (isVisible) {
      self.setState({
        msg: 'Element is now ' + (isVisible ? 'visible' : 'hidden')
      });
    };

    return (
      <div>
        <p className='msg'>{this.state.msg}</p>
        <div className='before'></div>
        <div className='sensor'>
          <VisibilitySensor containment={this.props.containment} onChange={onChange} />
        </div>
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
