React Visibility Sensor
====

[![Build Status](https://secure.travis-ci.org/joshwnj/react-visibility-sensor.png)](http://travis-ci.org/joshwnj/react-visibility-sensor)

Sensor component for React that notifies you when it goes in or out of the window viewport.

Install
----

`npm install react-visibility-sensor`

### Including the script directly

Useful if you want to use with bower, or in a plain old `<script>` tag.

In this case, make sure that `React` and `ReactDOM` are already loaded and globally accessible.

- Plain: <https://npmcdn.com/react-visibility-sensor@3.1.1/dist/visibility-sensor.js>
- Minified <https://npmcdn.com/react-visibility-sensor@3.1.1/dist/visibility-sensor.min.js>

Take a look at the [umd example](./example-umd/) to see this in action

Example
----

[View the example](https://joshwnj.github.io/react-visibility-sensor/)

To run the example locally:

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
- `partialVisibility`: (default `false`) consider element visible if only part of it is visible.
- `minTopValue`: (default `false`) consider element visible if only part of it is visible and a minimum amount of pixels could be set, so if at least 100px are in viewport, we mark element as visible.
- `delay`: (default `1000`) integer, number of milliseconds between checking the element's position in relation the the window viewport. Making this number too low will have a negative impact on performance.
- `containment`: (optional) element to use as a viewport when checking visibility. Default behaviour is to use the browser window as viewport.
- `delayedCall`: (default `false`) if is set to true, wont execute on page load ( prevents react apps triggering elements as visible before styles are loaded )

Thanks
----

Special thanks to contributors:

- [@B-Stefan](https://github.com/B-Stefan)
- [@kof](https://github.com/kof)
- [@gaearon](https://github.com/gaearon)
- [@kompot](https://github.com/kompot)

License
----

MIT
