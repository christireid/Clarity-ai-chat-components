'use client';
import * as React from 'react';
export function useEventListener(eventName, handler, element, options) {
    // Create a ref that stores handler
    const savedHandler = React.useRef(handler);
    React.useLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);
    // Store options in ref to avoid recreating listener when object reference changes
    const optionsRef = React.useRef(options);
    React.useLayoutEffect(() => {
        optionsRef.current = options;
    }, [options]);
    React.useEffect(() => {
        // Define the listening target
        if (typeof window === 'undefined')
            return;
        const targetElement = element?.current ?? window;
        if (!(targetElement && targetElement.addEventListener))
            return;
        // Create event listener that calls handler function stored in ref
        const listener = (event) => savedHandler.current(event);
        const currentOptions = optionsRef.current;
        targetElement.addEventListener(eventName, listener, currentOptions);
        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, listener, currentOptions);
        };
    }, [eventName, element]); // Options accessed via ref
}
//# sourceMappingURL=use-event-listener.js.map