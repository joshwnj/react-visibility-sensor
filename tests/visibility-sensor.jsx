/** @jsx React.DOM */

require('node-jsx').install();

var jsdom = require("jsdom");
var assert = require("assert");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var tape = require('tape');

var VisibilitySensor = require('../visibility-sensor.jsx');

function setupDom () {
  global.window = jsdom.jsdom().createWindow();
  global.document = window.document;
}

tape('VisibilitySensor: notify of changes', function (t) {
  t.plan(1);
  setupDom();

  var component;
  var onChange = function (isVisible) {
    t.equal(isVisible, true, 'Component starts out visible');
    component.unmountComponent();
  };
  component = TestUtils.renderIntoDocument(
    <VisibilitySensor delay={1} onChange={onChange} />
  );
});
