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
      <VisibilitySensor onChange={onChange} intervalDelay={10} >
        <div style={{ height: '10px', width: '10px'}} />
      </VisibilitySensor>
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
        <VisibilitySensor scrollCheck scrollDelay={10} onChange={onChange} intervalCheck={false} >
          <div style={{ height: '10px', width: '10px'}} />
        </VisibilitySensor>
      </div>
    );

    ReactDOM.render(element, node);
  });

  it('should notify of changes to visibility when child moves', function (done) {
    var firstTime = true;
    var initialStyle = {
      height: '10px',
      width: '10px',
    };
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

    ReactDOM.render(getElement(initialStyle), node);
  });


  it('should notify of changes to visibility', function (done) {
    var onChange = function (isVisible) {
      assert.equal(isVisible, true, 'Component starts out visible');
      done();
    };

    var element = (
      <VisibilitySensor onChange={onChange} >
        <div style={{ height: '10px', width: '10px'}} />
      </VisibilitySensor>
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
      <VisibilitySensor active={true} onChange={onChange} scrollCheck resizeCheck />
    );

    var element2 = (
      <VisibilitySensor active={false} onChange={onChange} scrollCheck resizeCheck />
    );

    var component1 = ReactDOM.render(element1, node);
    assert(component1.interval, 'interval should be set');
    assert(component1.debounceCheck, 'debounceCheck should be set');
    assert(component1.debounceCheck.scroll, 'debounceCheck.scroll should be set');
    assert(component1.debounceCheck.resize, 'debounceCheck.scroll should be set');

    var component2 = ReactDOM.render(element2, node);
    assert(!component2.interval, 'interval should not be set');
    assert(!component2.debounceCheck, 'debounceCheck should not be set');
  });

  it('should work when using offset prop and moving to outside of offset area', function (done) {
    var firstTime = true;
    node.setAttribute('style', 'position:absolute; top:51px');
    var onChange = function (isVisible) {
      if(firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');
        node.setAttribute('style', 'position:absolute; top:49px');
      } else {
        assert.equal(isVisible, false, 'Component has moved out of offset area');
        done();
      }
    }

    var element = (
      <VisibilitySensor onChange={onChange} offset={{top:50}} intervalDelay={10} >
        <div style={{ height: '10px', width: '10px'}} />
      </VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it('should be backwards-compatible with old offset config', function (done) {
    var firstTime = true;
    node.setAttribute('style', 'position:absolute; top:51px');
    var onChange = function (isVisible) {
      if(firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');
        node.setAttribute('style', 'position:absolute; top:49px');
      } else {
        assert.equal(isVisible, false, 'Component has moved out of offset area');
        done();
      }
    }

    var element = (
      <VisibilitySensor onChange={onChange} offset={{direction: 'top', value: 50}} intervalDelay={10} >
        <div style={{ height: '10px', width: '10px'}} />
      </VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it('should work when using offset prop and moving to inside of offset area', function (done) {
    var firstTime = true;
    node.setAttribute('style', 'position:absolute; top:49px');
    var onChange = function (isVisible) {
      if(firstTime) {
        firstTime = false;
        assert.equal(isVisible, false, 'Component starts out invisible');
        node.setAttribute('style', 'position:absolute; top:51px');
      } else {
        assert.equal(isVisible, true, 'Component has moved inside of offset area');
        done();
      }
    }

    var element = (
      <VisibilitySensor onChange={onChange} offset={{top:50}} intervalDelay={10} >
        <div style={{ height: '10px', width: '10px'}} />
      </VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it('should work when using negative offset prop and moving to outside of viewport', function (done) {
    var firstTime = true;
    node.setAttribute('style', 'position:absolute; top:-49px');
    var onChange = function (isVisible) {
      if(firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, 'Component starts out visible');
        node.setAttribute('style', 'position:absolute; top:-51px');
      } else {
        assert.equal(isVisible, false, 'Component has moved outside of viewport and visible area');
        done();
      }
    }

    var element = (
      <VisibilitySensor onChange={onChange} offset={{top:-50}} intervalDelay={10} >
        <div style={{ height: '10px', width: '10px'}} />
      </VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it('should call child function with state', function (done) {
    var wasChildrenCalled = false;
    var children = function (props) {
      wasChildrenCalled = true;
      assert('isVisible' in props, 'children should be called with isVisible prop');
      assert('visibilityRect' in props, 'children should be called with visibilityRect prop');
      return <div />;
    };

    setTimeout(function () {
      assert(wasChildrenCalled, 'children should be called');
      done();
    }, 200);

    var element = (
      <VisibilitySensor>{children}</VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it('should not return visible if it has no size', function (done) {
    var firstTime = true;
    var onChange = function (isVisible) {
      if (firstTime) {
        assert.equal(isVisible, false, 'Component is not visible');
        done();
      }
    };

    var element = (
      <VisibilitySensor onChange={onChange} >
        <div style={{ height: '0px', width: '0px' }} />
      </VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it('should not return visible if the sensor is hidden', function (done) {
    var firstTime = true;
    var onChange = function (isVisible) {
      if (firstTime) {
        assert.equal(isVisible, false, 'Component is not visible');
        done();
      }
    };

    var element = (
      <div style={{ display: 'none'}} >
        <VisibilitySensor onChange={onChange} >
          <div style={{ height: '10px', width: '10px'}} />
        </VisibilitySensor>
      </div>
    );

    ReactDOM.render(element, node);
  });
});
