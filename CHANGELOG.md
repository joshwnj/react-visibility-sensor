Changelog
====

## 5.0.0

- Update to ES6 style React and replaced Browserify with Webpack ([#123](https://github.com/joshwnj/react-visibility-sensor/pull/123))
- Update code to the latest version of react, remove useless params/function ([#115](https://github.com/joshwnj/react-visibility-sensor/pull/115))

## 4.1.0

- Update lifecycle method for React 16.3 ([#119](https://github.com/joshwnj/react-visibility-sensor/pull/119))

## 4.0.0

- Upgrade outdated deps and node version ([#127](https://github.com/joshwnj/react-visibility-sensor/pull/127))

## 3.14.0

- re-register node in componentDidUpdate if children diffs ([#103](https://github.com/joshwnj/react-visibility-sensor/pull/103))

## 3.13.0

- Check if the component has size and is not hidden ([#114](https://github.com/joshwnj/react-visibility-sensor/pull/114))

## 3.12.0

- round down viewport values ([#116](https://github.com/joshwnj/react-visibility-sensor/pull/116))

## 3.11.0

- add react 16 as a peer dep ([#94](https://github.com/joshwnj/react-visibility-sensor/pull/94))

## 3.10.1

- prevent unnecessary rerendering ([#85](https://github.com/joshwnj/react-visibility-sensor/pull/85))

## 3.10.0

- allow passing a children function that takes state and chooses what to render from it ([#76](https://github.com/joshwnj/react-visibility-sensor/pull/76#pullrequestreview-33850456))

## 3.9.0

- Migrated deprecated React.PropTypes and React.createClass ([#73](https://github.com/joshwnj/react-visibility-sensor/pull/73))

## 3.8.0

- Improving offset and adding resize listener ([#69](https://github.com/joshwnj/react-visibility-sensor/pull/69))

## 3.7.0

- added `offset` prop ([#64](https://github.com/joshwnj/react-visibility-sensor/pull/64))

## 3.6.2

- fixed a problem where `.debounceCheck` is not cleared properly ([#62](https://github.com/joshwnj/react-visibility-sensor/pull/62))

## 3.6.1

- fixed typo from `delay` to `scrollDelay` ([#59](https://github.com/joshwnj/react-visibility-sensor/pull/59))

## 3.6.0

- added support for "scrollCheck" as well as the default "intervalCheck" ([#54](https://github.com/joshwnj/react-visibility-sensor/pull/54))

## 3.5.0

- simpler logic for `partialVisible` ([#41](https://github.com/joshwnj/react-visibility-sensor/pull/41))

## 3.4.0

- `partialVisibility` prop can now either be a `boolean` (any edge can be visible) or a string of `top|right|bottom|left` to indicate which edge determines visibility ([#42](https://github.com/joshwnj/react-visibility-sensor/pull/42/files))

## 3.3.0

- Mark partially visible when center is visible ([#40](https://github.com/joshwnj/react-visibility-sensor/pull/40))

## 3.2.1

- Fixed error case where component can be null ([#38](https://github.com/joshwnj/react-visibility-sensor/pull/38))

## 3.2.0

- Added `minTopValue` and `delayedCall` props ([#30](https://github.com/joshwnj/react-visibility-sensor/pull/30))

## 3.1.1

- Removed dist file from git (as suggested in #18)
- Added `npm run build`, which is also run on prepublish
- updated the build script so browserify produces a standalone umd script
- added `example-umd` to show how to use it with plain `<script>` tags

## 3.0.1

- return the new state from `.check` method

## 3.0.0

- upgraded to react 0.14
- removed the `package.browserify` field, which is no longer needed and was causing some conflicts ([#11](https://github.com/joshwnj/react-visibility-sensor/issues/11))

## 2.1.0

- new optional prop `partialVisibility` changes the behaviour of the sensor, so that it considers an element to be visible if it is at least partially visible ([#15](https://github.com/joshwnj/react-visibility-sensor/pull/15))

## 2.0.0

- sensor DOM node is passed in as children rather than the component always rendering its own `<div>` ([#13](https://github.com/joshwnj/react-visibility-sensor/pull/13))
- this also means the component also no longer accepts `className` or `style` props.

### Migrating from `v1.x`:

If you're not setting a `className` or `style`, no change is required.

Otherwise add your own element as a child and move the `className` or `style` there.  Eg:

- before: `<VisibilitySensor className='something' />`
- after: `<VisibilitySensor><div className='something' /></VisibilitySensor>`
