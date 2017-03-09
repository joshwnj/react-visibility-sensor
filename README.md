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

- Plain: <https://unpkg.com/react-visibility-sensor@3.4.0/dist/visibility-sensor.js>
- Minified <https://unpkg.com/react-visibility-sensor@3.4.0/dist/visibility-sensor.min.js>

Take a look at the [umd example](./example-umd/) to see this in action

Example
----

[View the example](https://joshwnj.github.io/react-visibility-sensor/)

To run the example locally:

- `npm run build-example`
- open `example/index.html` in a browser

General usage goes something like:

```js
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
- `partialVisibility`: (default `false`) consider element visible if only part of it is visible. Also possible values are - 'top', 'right', 'bottom', 'left' - in case it's needed to detect when one of these become visible explicitly.
- `offset`: (default `{}`) with offset you can define amount of px from one side when the visibility should already change. So in example setting `offset={{direction: 'top', value:10}}` means that the visibility changes hidden when there is less than 10px to top of the viewport. Setting offset automatically disables the `partialVisibility`
- `minTopValue`: (default `0`) consider element visible if only part of it is visible and a minimum amount of pixels could be set, so if at least 100px are in viewport, we mark element as visible.
- `intervalCheck`: (default `true`) the default usage of Visibility Sensor is to trigger a check on user scrolling, by checking this as true, it gives you the possibility to check if the element is in view even if it wasn't because of a user scroll
- `intervalDelay`: (default `1500`) integer, number of milliseconds between checking the element's position in relation the the window viewport. Making this number too low will have a negative impact on performance.
- `scrollCheck`: (default: `false`) by making this true, the scroll listener is enabled.
- `scrollDelay`: (default: `250`) is the debounce rate at which the check is triggered. Ex: 250ms after the user stopped scrolling.
- `containment`: (optional) element to use as a viewport when checking visibility. Default behaviour is to use the browser window as viewport.
- `containmentPadding`: (default `0`) integer, padding to expand the containment / viewport. When offloading rich content for performance, this padding will allow you to expand the rendered region outside the visible region in order to maintain smooth scrolling. This padding does not require `containment` to be set, it will also default to the window as the viewport.
- `delayedCall`: (default `false`) if is set to true, wont execute on page load ( prevents react apps triggering elements as visible before styles are loaded )

It's possible to use both `intervalCheck` and `scrollCheck` together. This means you can detect most visibility changes quickly with `scrollCheck`, and an `intervalCheck` with a higher `intervalDelay` will act as a fallback for other visibility events, such as resize of a container.

Thanks
----

Special thanks to contributors:

- [@B-Stefan](https://github.com/B-Stefan)
- [@kof](https://github.com/kof)
- [@gaearon](https://github.com/gaearon)
- [@kompot](https://github.com/kompot)
- [@EugeneHlushko](https://github.com/EugeneHlushko)
- [@eek](http://github.com/eek)

License
----

MIT
