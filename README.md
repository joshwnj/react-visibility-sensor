React Visibility Sensor
====

[![Build Status](https://secure.travis-ci.org/joshwnj/react-visibility-sensor.png)](http://travis-ci.org/joshwnj/react-visibility-sensor)

Sensor component for React that notifies you when it goes in or out of the window viewport.

Install
----

`npm install react-visibility-sensor`


Example
----

To view the example:

- `npm run build-example`
- open `example/index.html` in a browser

General usage goes something like:

```
function render () {
  var VisibilitySensor = require('react-visibility-sensor');

  var onChange = function (isVisible) {
    console.log('Element is now %s', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilitySensor onChange={onChange} />
  );
}
```


Props
----

- `onChange`: callback for whenever the element changes from being within the window viewport or not. Function is called with 1 argument `(isVisible: boolean)`
- `active`: (default `true`) boolean flag for enabling / disabling the sensor.  When `active !== true` the sensor will not fire the `onChange` callback.
- `delay`: (default `1000`) integer, number of milliseconds between checking the element's position in relation the the window viewport. Making this number too low will have a negative impact on performance.

License
----

MIT
