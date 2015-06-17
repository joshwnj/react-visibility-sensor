Changelog
====

## 2.0.0

- sensor DOM node is passed in as children rather than the component always rendering its own `<div>` ([#13](https://github.com/joshwnj/react-visibility-sensor/pull/13))
- this also means the component also no longer accepts `className` or `style` props.

### Migrating from `v1.x`:

If you're not setting a `className` or `style`, no change is required.

Otherwise add your own element as a child and move the `className` or `style` there.  Eg:

- before: `<VisibilitySensor className='something' />`
- after: `<VisibilitySensor><div className='something' /></VisibilitySensor>`
