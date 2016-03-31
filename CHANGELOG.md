Changelog
====

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
