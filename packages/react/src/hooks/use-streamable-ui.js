'use client';
import * as React from 'react';
const identityTransform = (value) => value;
const isAsyncIterable = (value) => Boolean(value) && typeof value[Symbol.asyncIterator] === 'function';
const isPromiseLike = (value) => Boolean(value) && typeof value.then === 'function';
const isReadableStream = (value) => Boolean(value) && typeof value.getReader === 'function';
const toAsyncIterableFromReadable = (stream) => ({
    [Symbol.asyncIterator]() {
        const reader = stream.getReader();
        return {
            async next() {
                const { value, done } = await reader.read();
                if (done) {
                    reader.releaseLock?.();
                    return { value: undefined, done: true };
                }
                return { value, done: false };
            },
            async return() {
                try {
                    await reader.cancel();
                }
                catch {
                    // ignore cancellation errors
                }
                reader.releaseLock?.();
                return { value: undefined, done: true };
            },
        };
    },
});
export function useStreamableUI(source, options = {}) {
    const { mode = 'append', transform = identityTransform, completeWhen, onUpdate, onComplete, onError, } = options;
    const transformRef = React.useRef(transform);
    const completeWhenRef = React.useRef(completeWhen);
    const onUpdateRef = React.useRef(onUpdate);
    const onCompleteRef = React.useRef(onComplete);
    const onErrorRef = React.useRef(onError);
    React.useEffect(() => {
        transformRef.current = transform;
    }, [transform]);
    React.useEffect(() => {
        completeWhenRef.current = completeWhen;
    }, [completeWhen]);
    React.useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);
    React.useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);
    React.useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);
    const [values, setValues] = React.useState([]);
    const [latest, setLatest] = React.useState(null);
    const [status, setStatus] = React.useState('idle');
    const [error, setError] = React.useState(null);
    const latestRef = React.useRef(null);
    const reset = React.useCallback(() => {
        setValues([]);
        setLatest(null);
        setStatus('idle');
        setError(null);
        latestRef.current = null;
    }, []);
    React.useEffect(() => {
        if (!source) {
            reset();
            return;
        }
        let cancelled = false;
        const setComplete = (finalValue) => {
            if (cancelled)
                return;
            setStatus('complete');
            onCompleteRef.current?.(finalValue ?? latestRef.current);
        };
        const handleError = (err) => {
            if (cancelled)
                return;
            const errorInstance = err instanceof Error ? err : new Error(String(err));
            setError(errorInstance);
            setStatus('error');
            onErrorRef.current?.(errorInstance);
        };
        const pushValue = (raw) => {
            if (cancelled)
                return;
            const shouldComplete = completeWhenRef.current?.(raw) ?? false;
            if (raw == null) {
                if (shouldComplete) {
                    setComplete(latestRef.current);
                }
                return;
            }
            const transformed = transformRef.current(raw);
            if (transformed == null) {
                if (shouldComplete) {
                    setComplete(latestRef.current);
                }
                return;
            }
            latestRef.current = transformed;
            setLatest(transformed);
            setValues((prev) => (mode === 'append' ? [...prev, transformed] : [transformed]));
            onUpdateRef.current?.(transformed);
            if (shouldComplete) {
                setComplete(transformed);
            }
        };
        const beginStreaming = () => {
            setStatus('streaming');
            setError(null);
            setValues([]);
            setLatest(null);
            latestRef.current = null;
        };
        beginStreaming();
        const cleanupFns = [];
        const registerCleanup = (fn) => {
            if (typeof fn === 'function') {
                cleanupFns.push(fn);
            }
        };
        const normalizedSource = isReadableStream(source)
            ? toAsyncIterableFromReadable(source)
            : source;
        if (isAsyncIterable(normalizedSource)) {
            const iterator = normalizedSource[Symbol.asyncIterator]();
            (async () => {
                try {
                    while (!cancelled) {
                        const { value, done } = await iterator.next();
                        if (cancelled) {
                            return;
                        }
                        if (done) {
                            setComplete(latestRef.current);
                            return;
                        }
                        pushValue(value);
                    }
                }
                catch (err) {
                    handleError(err);
                }
                finally {
                    if (typeof iterator.return === 'function') {
                        try {
                            await iterator.return();
                        }
                        catch {
                            // ignore iterator.return errors
                        }
                    }
                }
            })();
            return () => {
                cancelled = true;
            };
        }
        if (isPromiseLike(normalizedSource)) {
            ;
            (async () => {
                try {
                    const value = await normalizedSource;
                    pushValue(value);
                    setComplete(latestRef.current);
                }
                catch (err) {
                    handleError(err);
                }
            })();
            return () => {
                cancelled = true;
            };
        }
        const streamable = normalizedSource;
        if (streamable) {
            if ('value' in streamable && streamable.value != null) {
                pushValue(streamable.value);
                if (streamable.done) {
                    setComplete(streamable.value);
                }
            }
            const unsubscribe = streamable.subscribe((value) => {
                pushValue(value);
            });
            registerCleanup(unsubscribe);
            if (typeof streamable.onDone === 'function') {
                const unsubscribeDone = streamable.onDone(() => {
                    setComplete(latestRef.current);
                });
                registerCleanup(unsubscribeDone);
            }
            else if (streamable.done) {
                setComplete(latestRef.current);
            }
            return () => {
                cancelled = true;
                cleanupFns.forEach((fn) => {
                    try {
                        fn();
                    }
                    catch {
                        // noop
                    }
                });
            };
        }
        return () => {
            cancelled = true;
            cleanupFns.forEach((fn) => {
                try {
                    fn();
                }
                catch {
                    // noop
                }
            });
        };
    }, [source, mode, reset]);
    return {
        values,
        latest,
        status,
        isStreaming: status === 'streaming',
        error,
        reset,
    };
}
//# sourceMappingURL=use-streamable-ui.js.map