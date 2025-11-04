import * as React from 'react';
export function useEventListener(eventName, handler, element, options) {
    // Create a ref that stores handler
    const savedHandler = React.useRef(handler);
    React.useLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);
    React.useEffect(() => {
        // Define the listening target
        const targetElement = element?.current ?? window;
        if (!(targetElement && targetElement.addEventListener))
            return;
        // Create event listener that calls handler function stored in ref
        const listener = (event) => savedHandler.current(event);
        targetElement.addEventListener(eventName, listener, options);
        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, listener, options);
        };
    }, [eventName, element, options]);
}
//# sourceMappingURL=use-event-listener.js.map