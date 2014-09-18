/** @jsx React.DOM */

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');

describe('VisibilitySensor', function () {
  var elem;

  beforeEach(function () {
    elem = document.createElement('div');
    document.body.appendChild(elem);
  });

  afterEach(function () {
    React.unmountComponentAtNode(elem);
    elem.remove();
  });

  var VisibilitySensor = require('../visibility-sensor.jsx');

  it('should notify of changes to visibility', function (done) {
    var component;
    var firstTime = true;
    var onChange = function (isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');
        elem.setAttribute('style', 'position:absolute; width:100px; left:-101px');
      }
      // after moving the sensor it should be not visible anymore
      else {
        assert.equal(isVisible, false, 'Component has moved out of the visible viewport');
        done();
      }
    };

    component = (
      <VisibilitySensor delay={10} onChange={onChange} />
    );

    React.renderComponent(component, elem);
  });

  it('should notify of changes to visibility', function (done) {
    var component;
    var onChange = function (isVisible) {
      assert.equal(isVisible, true, 'Component starts out visible');
      done();
    };
    component = (
      <VisibilitySensor delay={1} onChange={onChange} />
    );

    React.renderComponent(component, elem);
  });

  it('should not notify when deactivated', function (done) {
    var component;
    var wasCallbackCalled = false;
    var onChange = function (isVisible) {
      wasCallbackCalled = true;
    };

    setTimeout(function () {
      assert(!wasCallbackCalled, 'onChange callback should not be called');
      done();
    }, 20);

    component = (
      <VisibilitySensor active={false} delay={1} onChange={onChange} />
    );

    React.renderComponent(component, elem);
  });
});
