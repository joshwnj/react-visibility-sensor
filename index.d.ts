declare module "react-visibility-sensor" {
  import * as React from "react";

  interface Shape {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  }

  
  interface Props {
    /** callback for whenever the element changes from being within the window viewport or not. */
    onChange?: (isVisible: boolean) => void;
    /**
     * boolean flag for enabling / disabling the sensor.  When `active !== true` the sensor will not fire the `onChange` callback.
     * @default true
     */
    active?: boolean;
    /**
     * consider element visible if only part of it is visible. Also possible values are - 'top', 'right', 'bottom', 'left' - in case it's needed to detect when one of these become visible explicitly.
     * @default false
     */
    partialVisibility?: boolean | 'top' | 'right' | 'bottom' | 'left';
    /**
     * with offset you can define amount of px from one side when the visibility should already change. So in example setting `offset={{top:10}}` means that the visibility changes hidden when there is less than 10px to top of the viewport. Offset works along with `partialVisibility`
     * @default {}
     */
    offset?: Shape;
    /**
     * consider element visible if only part of it is visible and a minimum amount of pixels could be set, so if at least 100px are in viewport, we mark element as visible.
     * @default 0
     */
    minTopValue?: number;
    /**
     * when this is true, it gives you the possibility to check if the element is in view even if it wasn't because of a user scroll
     * @default true
     */
    intervalCheck?: boolean;
    /**
     * integer, number of milliseconds between checking the element's position in relation the the window viewport. Making this number too low will have a negative impact on performance.
     * @default 100
     */
    intervalDelay?: number;
    /**
     * by making this true, the scroll listener is enabled.
     * @default false
     */
    scrollCheck?: boolean;
    /**
     * is the debounce rate at which the check is triggered. Ex: 250ms after the user stopped scrolling.
     * @default 250
     */
    scrollDelay?: number;
    /**
     * by specifying a value > -1, you are enabling throttle instead of the delay to trigger checks on scroll event. Throttle supercedes delay.
     * @default -1
     */
    scrollThrottle?: number;
    /**
     * by making this true, the resize listener is enabled. Resize listener only listens to the window.
     * @default false
     */
    resizeCheck?: boolean;
    /**
     * is the debounce rate at which the check is triggered. Ex: 250ms after the user stopped resizing.
     * @default 250
     */
    resizeDelay?: number;
    /**
     * by specifying a value > -1, you are enabling throttle instead of the delay to trigger checks on resize event. Throttle supercedes delay.
     * @default -1
     */
    resizeThrottle?: number;
    /** element to use as a viewport when checking visibility. Default behaviour is to use the browser window as viewport. */
    containment?: Element;
    /**
     * if is set to true, wont execute on page load ( prevents react apps triggering elements as visible before styles are loaded )
     * @default false
     */
    delayedCall?: boolean;
    /** can be a React element or a function.  If you provide a function, it will be called with 1 argument `{isVisible: ?boolean, visibilityRect: Object}` */
    children?:
      | React.ReactNode
      | ((
          args: { isVisible: boolean; visibilityRect?: Shape }
        ) => React.ReactNode);
  }

  const ReactVisibilitySensor: React.StatelessComponent<Props>;

  export default ReactVisibilitySensor;
}
