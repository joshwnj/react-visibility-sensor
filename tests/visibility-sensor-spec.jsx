/** @jsx React.DOM */

require('es5-shim');

var React = require('react');
var ReactDOM = require('react-dom');
var assert = require('assert');

describe('VisibilitySensor', function () {
  var node;

  beforeEach(function () {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(node);
    document.body.removeChild(node);
  });

  var VisibilitySensor = require('../visibility-sensor.js');

  it('should notify of changes to visibility when parent moves', function (done) {
    var firstTime = true;
    var onChange = function (isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');
        node.setAttribute('style', 'position:absolute; width:100px; left:-101px');
      }
      // after moving the sensor it should be not visible anymore
      else {
        assert.equal(isVisible, false, 'Component has moved out of the visible viewport');
        done();
      }
    };

    var element = (
      <VisibilitySensor onChange={onChange} intervalDelay={10} />
    );

    ReactDOM.render(element, node);
  });

  it('should notify of changes to visibility when user scrolls', function (done) {
    var firstTime = true;
    var onChange = function (isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');

        window.scrollTo(0,1000);
      }
      // after moving the sensor it should be not visible anymore
      else {
        assert.equal(isVisible, false, 'Component has moved out of the visible viewport');
        done();
      }
    };

    var element = (
      <div style={{height: '5000px'}}>
        <VisibilitySensor scrollCheck scrollDelay={10} onChange={onChange} intervalCheck={false} />
      </div>
    );

    ReactDOM.render(element, node);
  });

  it('should notify of changes to visibility when child moves', function (done) {
    var firstTime = true;
    var style = {};
    var onChange = function (isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');
        style = {
          position: 'absolute',
          width: 100,
          left: -101
        };
        ReactDOM.render(getElement(style), node);
      }
      // after moving the sensor it should be not visible anymore
      else {
        assert.equal(isVisible, false, 'Component has moved out of the visible viewport');
        done();
      }
    };

    // set interval must be one in order for this to work
    function getElement(style) {
      return (
        <VisibilitySensor onChange={onChange} intervalDelay={10}>
          <div style={style} />
        </VisibilitySensor>
      );
    }

    ReactDOM.render(getElement(), node);
  });


  it('should notify of changes to visibility', function (done) {
    var onChange = function (isVisible) {
      assert.equal(isVisible, true, 'Component starts out visible');
      done();
    };
    var element = (
      <VisibilitySensor onChange={onChange} />
    );

    ReactDOM.render(element, node);
  });

  it('should not notify when deactivated', function (done) {
    var wasCallbackCalled = false;
    var onChange = function (isVisible) {
      wasCallbackCalled = true;
    };

    setTimeout(function () {
      assert(!wasCallbackCalled, 'onChange callback should not be called');
      done();
    }, 20);

    var element = (
      <VisibilitySensor active={false} onChange={onChange} intervalDelay={10} />
    );

    ReactDOM.render(element, node);
  });

  it('should clear interval and debounceCheck when deactivated', function () {
    var onChange = function () {};

    var element1 = (
      <VisibilitySensor active={true} onChange={onChange} scrollCheck />
    );

    var element2 = (
      <VisibilitySensor active={false} onChange={onChange} scrollCheck />
    );

    var component1 = ReactDOM.render(element1, node);
    assert(component1.interval, 'interval should be set');
    assert(component1.debounceCheck, 'debounceCheck should be set');

    var component2 = ReactDOM.render(element2, node);
    assert(!component2.interval, 'interval should not be set');
    assert(!component2.debounceCheck, 'debounceCheck should not be set');

  });
});
