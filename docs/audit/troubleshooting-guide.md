# AI Components Troubleshooting Guide

**Last Updated**: 2025-01-20  
**Audit Phase**: Phase 10 - Troubleshooting Guide

## Common Issues and Solutions

### Streaming Issues

#### Streaming Not Working

**Symptoms**: Messages don't appear incrementally, only show after completion

**Possible Causes**:
1. API endpoint not returning SSE format
2. Stream format mismatch
3. Network issues

**Solutions**:
- Verify API returns `text/event-stream`
- Check `format` option matches API format
- Verify network connectivity
- Check browser console for errors

#### Streaming Stops Mid-Response

**Symptoms**: Response cuts off partway through

**Possible Causes**:
1. Network interruption
2. Server timeout
3. Rate limiting

**Solutions**:
- Check network connection
- Increase timeout settings
- Check rate limit status
- Retry the request

### Token Limit Issues

#### Token Limit Exceeded

**Symptoms**: Error message about token limits

**Possible Causes**:
1. Conversation too long
2. Single message too large
3. System prompt too large

**Solutions**:
- Use token limit guard with truncate policy
- Start new conversation
- Reduce message length
- Optimize system prompt

#### Token Count Inaccurate

**Symptoms**: Count differs from API response

**Possible Causes**:
1. Estimation for non-OpenAI models
2. Cache issues
3. Model mismatch

**Solutions**:
- Use OpenAI models for exact counts
- Clear token counter cache
- Verify model selection

### Error Handling Issues

#### Generic Error Messages

**Symptoms**: Unhelpful error messages

**Possible Causes**:
1. Error not properly classified
2. Provider error not parsed

**Solutions**:
- Check error classification
- Verify ProviderError usage
- Add custom error handling

#### Errors Not Clearing

**Symptoms**: Error persists after retry

**Possible Causes**:
1. Error state not reset
2. Component not re-rendering

**Solutions**:
- Clear error on new request
- Check component state management
- Verify error cleanup

### State Management Issues

#### Messages Lost on Refresh

**Symptoms**: Conversation disappears on page reload

**Possible Causes**:
1. Not using persistence
2. Storage not configured

**Solutions**:
- Enable `persistMessages` option
- Configure localStorage or IndexedDB
- Check storage permissions

#### State Not Syncing Across Tabs

**Symptoms**: Changes in one tab not reflected in another

**Possible Causes**:
1. Storage events not handled
2. localStorage not syncing

**Solutions**:
- Use `useLocalStorage` hook
- Check storage event listeners
- Verify cross-tab sync enabled

### Performance Issues

#### Slow Rendering During Streaming

**Symptoms**: UI freezes or stutters during streaming

**Possible Causes**:
1. Too many re-renders
2. Large message list
3. No virtualization

**Solutions**:
- Use `React.startTransition`
- Enable virtualization
- Optimize message rendering

#### Memory Leaks

**Symptoms**: Browser becomes slow over time

**Possible Causes**:
1. Event listeners not cleaned up
2. Streams not aborted
3. State not cleared

**Solutions**:
- Clean up on unmount
- Abort streams properly
- Clear state when done

## Debugging Tips

### Enable Debug Logging

```typescript
// Add to component
if (process.env.NODE_ENV === 'development') {
  console.log('Chat state:', { messages, isLoading, error })
}
```

### Check Network Tab

- Verify request format
- Check response headers
- Monitor streaming chunks

### Use React DevTools

- Inspect component state
- Check hook values
- Monitor re-renders

## Getting Help

1. Check documentation
2. Review examples
3. Check GitHub issues
4. Ask in community

## Notes

- Most issues have solutions
- Debugging tools are helpful
- Community support available
