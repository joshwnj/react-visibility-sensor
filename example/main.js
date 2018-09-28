'use strict';

var React = require('react');
var ReactDOM = require('react-dom')
var createReactClass = require('create-react-class')
var VisibilitySensor = require('../');

var Example = createReactClass({
  getInitialState: function () {
    return { msg: '' };
  },

  onChange: function (isVisible) {
    this.setState({
      msg: 'Element is now ' + (isVisible ? 'visible' : 'hidden')
    });
  },

  render: function () {
    return (
      <div>
        <p className='msg'>{this.state.msg}</p>
        <div className='before'></div>
        <VisibilitySensor
          scrollCheck
          scrollThrottle={100}
          intervalDelay={8000}
          containment={this.props.containment}
          onChange={this.onChange}
          minTopValue={this.props.minTopValue}
          partialVisibility={this.props.partialVisibility}
          offset={this.props.offset}>
          <div className='sensor' />
        </VisibilitySensor>
        <div className='after'></div>
      </div>
    );
  }
});

ReactDOM.render(React.createElement(Example), document.getElementById('example'));

var container = document.getElementById('example-container');
var elem = container.querySelector('.inner');
container.scrollTop = 320;
container.scrollLeft = 320;
ReactDOM.render(React.createElement(Example, {
  containment: container,
  minTopValue: 10,
  partialVisibility: true
}), elem);
