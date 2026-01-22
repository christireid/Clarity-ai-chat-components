# useParticlesEngine Hook - Race Condition Analysis

## Singleton Pattern Verification

The hook uses a module-level singleton pattern via `useRef` to prevent multiple initializations. This handles concurrent mounts correctly:

1. **First mount**: Starts initialization, sets `stateRef.current = 'initializing'`
2. **Concurrent mount**: Sees `stateRef.current === 'initializing'`, waits for existing promise
3. **Both unmount**: `mountedRef.current = false` prevents state updates
4. **Promise resolves**: Only updates state if `mountedRef.current === true`

## Edge Cases Handled

✅ **Multiple components mounting simultaneously**: Singleton pattern ensures only one initialization
✅ **Component unmounts during initialization**: `mountedRef` prevents state updates
✅ **Component remounts after error**: Can retry initialization (state resets to 'idle')
✅ **Component unmounts before promise resolves**: Cleanup prevents memory leaks

## Potential Issues

⚠️ **Module-level state persists across HMR**: This is intentional for singleton pattern, but means errors persist across hot reloads. This is acceptable since:
- Errors are logged in development
- Component gracefully degrades (renders nothing)
- User can refresh to retry

## Conclusion

The singleton pattern with `useRef` correctly handles race conditions. The addition of `mountedRef` ensures no state updates on unmounted components.
