"use strict";

import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import VisibilitySensor, { useVisibilitySensor } from "../visibility-sensor";

function RegularExample({ containment, minTopValue, partialVisibility }) {
  const [msg, setMsg] = useState("");
  const onChange = useCallback(isVisible => {
    setMsg("Element is now " + (isVisible ? "visible" : "hidden"));
  }, []);

  return (
    <div>
      <p className="msg">{msg}</p>
      <div className="before" />
      <VisibilitySensor
        scrollCheck={true}
        scrollThrottle={100}
        intervalDelay={8000}
        onChange={onChange}
      >
        {() => <div className="sensor" />}
      </VisibilitySensor>
      <div className="after" />
    </div>
  );
}

function HookExample({ containment, minTopValue, partialVisibility }) {
  const [msg, setMsg] = useState("");
  const onChange = useCallback(isVisible => {
    setMsg("Element is now " + (isVisible ? "visible" : "hidden"));
  }, []);

  const { nodeRef } = useVisibilitySensor({
    scrollCheck: true,
    scrollThrottle: 100,
    intervalDelay: 8000,
    containment,
    minTopValue: 10,
    partialVisibility: true,
    onChange
  });

  return (
    <div>
      <p className="msg">{msg}</p>
      <div className="before" />
      <div ref={nodeRef} className="sensor" />
      <div className="after" />
    </div>
  );
}

ReactDOM.render(
  React.createElement(RegularExample),
  document.getElementById("example")
);

var container = document.getElementById("example-container");
var elem = container.querySelector(".inner");

container.scrollTop = 320;
container.scrollLeft = 320;

ReactDOM.render(
  React.createElement(HookExample, {
    containment: container
  }),
  elem
);
