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
      <VisibilitySensor delay={10} onChange={onChange} />
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

    function getElement(style) {
      return (
        <VisibilitySensor delay={10} onChange={onChange}>
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
      <VisibilitySensor delay={1} onChange={onChange} />
    );

    ReactDOM.render(element, node);
  });

  it('should respect containmentPadding when provided', function (done) {
    var callCount = 0;

    var onChange = function (isVisible) {
      switch (callCount) {
        case 0:
          callCount++;
          assert.equal(isVisible, true, 'Component starts out visible');
          ReactDOM.render(getElement({ left: -101 }), node);
          break;
        case 1:
          callCount++;
          assert.equal(isVisible, true, 'Component visible within padded containment');
          ReactDOM.render(getElement({ left: -501 }), node);
          break;
        case 2:
          assert.equal(isVisible, false, 'Component outside padded containment');
          done();
          break;
      }
    };

    function getElement (style) {
      style = style || {};
      style.position = 'absolute';
      style.width = 100;

      return (
        <VisibilitySensor delay={10} onChange={onChange} containmentPadding={500}>
          <div style={style} />
        </VisibilitySensor>
      );
    }

    ReactDOM.render(getElement(), node);
  })

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
      <VisibilitySensor active={false} delay={1} onChange={onChange} />
    );

    ReactDOM.render(element, node);
  });
});
