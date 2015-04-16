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
        <div className='sensor'>
            <VisibilitySensor onChange={onChange} />
        </div>
      </div>
    );
  }
});

React.render(React.createElement(Example), document.getElementById('example'));
