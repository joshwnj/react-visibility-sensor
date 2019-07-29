import React from "react";
import ReactDOM from "react-dom";
import { act } from 'react-dom/test-utils';
import assert from "assert";
import VisibilitySensor, { useVisibilitySensor } from "../visibility-sensor";

describe("VisibilitySensor", function() {
  var node;

  beforeEach(function() {
    node = document.createElement("div");
    document.body.appendChild(node);
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(node);
    document.body.removeChild(node);
  });

  it("should notify of changes to visibility when parent moves", function(
    done
  ) {
    var firstTime = true;
    var onChange = function(isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, "Component starts out visible");
        act(() => {
          node.setAttribute(
            "style",
            "position:absolute; width:100px; left:-101px"
          );
        });
      } else {
        // after moving the sensor it should be not visible anymore
        assert.equal(
          isVisible,
          false,
          "Component has moved out of the visible viewport"
        );
        done();
      }
    };

    var element;
    act(() => {
      element = (
        <VisibilitySensor
            intervalDelay={10}
            onChange={onChange}
          >{() => (
            <div style={{ height: "10px", width: "10px" }} />
          )}</VisibilitySensor>
      );
    });

    ReactDOM.render(element, node);
  });

  it("should notify of changes to visibility when user scrolls", function(
    done
  ) {
    var firstTime = true;
    var onChange = function(isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, "Component starts out visible");
        act(() => {
          window.scrollTo(0, 1000);
        });
      } else {
        // after moving the sensor it should be not visible anymore
        assert.equal(
          isVisible,
          false,
          "Component has moved out of the visible viewport"
        );
        done();
      }
    };

    var element;
    act(() => {
      element = (
        <div style={{ height: "5000px" }}>
          <VisibilitySensor
            scrollCheck
            scrollDelay={10}
            onChange={onChange}
            intervalCheck={false}
          >{() => (
            <div style={{ height: "10px", width: "10px" }} />
          )}</VisibilitySensor>
        </div>
      );
    });

    ReactDOM.render(element, node);
  });

  it("should notify of changes to visibility when child moves", function(done) {
    var firstTime = true;
    var initialStyle = {
      height: "10px",
      width: "10px"
    };
    var onChange = function(isVisible) {
      // by default we expect the sensor to be visible
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, "Component starts out visible");
        const style = {
          position: "absolute",
          width: 100,
          left: -101
        };
        ReactDOM.render(getElement(style), node);
      } else {
        // after moving the sensor it should be not visible anymore
        assert.equal(
          isVisible,
          false,
          "Component has moved out of the visible viewport"
        );
        done();
      }
    };

    // set interval must be one in order for this to work
    function getElement(style) {
      return (
        <VisibilitySensor onChange={onChange} intervalDelay={10}>
          { () => <div style={style} /> }
        </VisibilitySensor>
      );
    }

    ReactDOM.render(getElement(initialStyle), node);
  });

  it("should notify of changes to visibility", function(done) {
    var onChange = function(isVisible) {
      assert.equal(isVisible, true, "Component starts out visible");
      done();
    };

    var element = (
      <VisibilitySensor onChange={onChange}>
        { () => <div style={{ height: "10px", width: "10px" }} /> }
      </VisibilitySensor>
    );

    ReactDOM.render(element, node);
  });

  it("should not notify when deactivated", function(done) {
    var wasCallbackCalled = false;
    var onChange = function(isVisible) {
      wasCallbackCalled = true;
    };

    setTimeout(function() {
      assert(!wasCallbackCalled, "onChange callback should not be called");
      done();
    }, 20);

    var element = (
      <VisibilitySensor active={false} onChange={onChange} intervalDelay={10} />
    );

    ReactDOM.render(element, node);
  });

  it("should clear interval and debounceCheck when deactivated", function() {
    var onChange = function() {};

    var element1;
    var element2;

    act(() => {
      element1 = (
        <VisibilitySensor
          active={true}
          onChange={onChange}
          scrollCheck
          resizeCheck
        />
      );
    });
    act(() => {
      element2 = (
        <VisibilitySensor
          active={false}
          onChange={onChange}
          scrollCheck
          resizeCheck
        />
      );
    });

    var component1 = ReactDOM.render(element1, node);
    assert(component1.interval, "interval should be set");
    assert(component1.debounceCheck, "debounceCheck should be set");
    assert(
      component1.debounceCheck.scroll,
      "debounceCheck.scroll should be set"
    );
    assert(
      component1.debounceCheck.resize,
      "debounceCheck.scroll should be set"
    );
    var component2;
    act(() => {
      component2 = ReactDOM.render(element2, node);
    });
    assert(!component2.interval, "interval should not be set");
    assert(!component2.debounceCheck, "debounceCheck should not be set");
  });

  it("should work when using offset prop and moving to outside of offset area", function(
    done
  ) {
    var firstTime = true;
    node.setAttribute("style", "position:absolute; top:51px");
    var onChange = function(isVisible) {
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, "Component starts out visible");
        act(() => {
          node.setAttribute("style", "position:absolute; top:49px");
        });
      } else {
        assert.equal(
          isVisible,
          false,
          "Component has moved out of offset area"
        );
        done();
      }
    };

    var element;

    act(() => {
      element = (
        <VisibilitySensor
          onChange={onChange}
          offset={{ top: 50 }}
          intervalDelay={10}
        >
          {() => <div style={{ height: "10px", width: "10px" }} />}
        </VisibilitySensor>
      );
    });

    ReactDOM.render(element, node);
  });

  it("should work when using offset prop and moving to inside of offset area", function(
    done
  ) {
    var firstTime = true;
    node.setAttribute("style", "position:absolute; top:49px");
    var onChange = function(isVisible) {
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, false, "Component starts out invisible");
        act(() => {
          node.setAttribute("style", "position:absolute; top:51px");
        });
      } else {
        assert.equal(
          isVisible,
          true,
          "Component has moved inside of offset area"
        );
        done();
      }
    };

    var element;
    act(() => {
      element = (
        <VisibilitySensor
          onChange={onChange}
          offset={{ top: 50 }}
          intervalDelay={10}
        >
          {() => <div style={{ height: "10px", width: "10px" }} />}
        </VisibilitySensor>
      );
    });

    ReactDOM.render(element, node);
  });

  it("should work when using negative offset prop and moving to outside of viewport", function(
    done
  ) {
    var firstTime = true;
    node.setAttribute("style", "position:absolute; top:-49px");
    var onChange = function(isVisible) {
      if (firstTime) {
        firstTime = false;
        assert.equal(isVisible, true, "Component starts out visible");
        act(() => {
          node.setAttribute("style", "position:absolute; top:-51px");
        });
      } else {
        assert.equal(
          isVisible,
          false,
          "Component has moved outside of viewport and visible area"
        );
        done();
      }
    };

    var element;
    act(() => {
      element = (
        <VisibilitySensor
          onChange={onChange}
          offset={{ top: -50 }}
          intervalDelay={10}
        >
          { () => <div style={{ height: "10px", width: "10px" }} /> }
        </VisibilitySensor>
      );
    });

    ReactDOM.render(element, node);
  });

  it("should call child function with state", function(done) {
    var wasChildrenCalled = false;
    var children = function(props) {
      wasChildrenCalled = true;
      assert(
        "isVisible" in props,
        "children should be called with isVisible prop"
      );
      assert(
        "visibilityRect" in props,
        "children should be called with visibilityRect prop"
      );
      return <div />;
    };

    setTimeout(function() {
      assert(wasChildrenCalled, "children should be called");
      done();
    }, 200);

    var element = <VisibilitySensor>{children}</VisibilitySensor>;

    ReactDOM.render(element, node);
  });

  it("should not return visible if it has no size", function(done) {
    var firstTime = true;
    var onChange = function(isVisible) {
      if (firstTime) {
        assert.equal(isVisible, false, "Component is not visible");
        done();
      }
    };
    var element;
    act(() => {
      element = (
        <VisibilitySensor onChange={onChange}>
          { () => <div style={{ height: "0px", width: "0px" }} /> }
        </VisibilitySensor>
      );
    });

    ReactDOM.render(element, node);
  });

  it("should not return visible if the sensor is hidden", function(done) {
    var firstTime = true;
    var onChange = function(isVisible) {
      // throw new Error(`LALALALALALALLA [${isVisible ? 'Bai' : 'Ez'}]`)
      if (firstTime) {
        assert.equal(isVisible, false, "Component is not visible");
        done();
      }
    };
    var element;
    act(() => {
      element = (
        <div style={{ display: "none" }}>
          <VisibilitySensor onChange={onChange}>
            {({ isVisible }) => {
              // throw new Error(`MEMEMEMEMEMEMEMEMEMEM [${isVisible ? 'Bai' : 'Ez'}]`);
            return <div style={{ height: "10px", width: "10px" }} /> }}
          </VisibilitySensor>
        </div>
      );
    });

    act(() => {
      ReactDOM.render(element, node);
    });
  });
});


describe("VisibilitySensor with Container", function() {
  var node;
  var container;

  function WithStyleVisibilitySensor({ style, ...restProps }) {
    const { nodeRef } = useVisibilitySensor(restProps);

    return <div ref={nodeRef} style={style} />
  }

  beforeEach(function() {
    node = document.createElement("div");
    document.body.appendChild(node);

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(node);
    document.body.removeChild(node);
    document.body.removeChild(container);
  });


  it("should detect an absolutely positioned element inside the visible part of a container", function(done) {
    var firstTime = true;
    var onChange = function(isVisible) {
      if (firstTime) {
        assert.equal(isVisible, true, "Component is visible");
        done();
      }
    };

    container.style.width = 300
    container.style.height = 300
    container.style.position = 'relative'
    container.style.overflow = 'hidden'

    var element;
    act(() => {
      element = (
        <WithStyleVisibilitySensor
          onChange={onChange}
          style={{
            position: "absolute",
            left: "1px",
            top: "1px",
            height: "10px",
            width: "10px",
          }}
        />
      );
    });

    ReactDOM.render(element, node);
  });

  it("should not detect an absolutely positioned element outside the visible part of a container", function(done) {
    var firstTime = true;
    var onChange = function(isVisible) {
      if (firstTime) {
        assert.equal(isVisible, false, "Component is not visible");
        done();
      }
    };

    container.style.width = 300
    container.style.height = 300
    container.style.position = 'relative'
    container.style.overflow = 'hidden'

    var element;
    act(() => {
      element = (
        <WithStyleVisibilitySensor
          onChange={onChange}
          style={{
            position: "absolute",
            left: "400px",
            top: "400px",
            height: "10px",
            width: "10px",
          }}
        />
      );
    });

    ReactDOM.render(element, node);
  });
});
