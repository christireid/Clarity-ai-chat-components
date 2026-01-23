# Tool Approval System Design

**Date**: 2026-01-22
**Related**: HIGH-014, TODO-014
**Status**: Implementation Ready

## Overview

Design a capability-based tool approval system to prevent unauthorized or dangerous tool execution while maintaining developer flexibility.

## Goals

1. **Security**: Prevent execution of dangerous tools without explicit user approval
2. **Flexibility**: Support multiple approval modes (auto, manual, allowlist)
3. **Auditability**: Log all tool executions for security review
4. **Developer Experience**: Simple API, clear documentation

## Design

### 1. Tool Classification System

Tools are classified by risk level and required capabilities:

```typescript
type ToolRiskLevel = 'safe' | 'low' | 'medium' | 'high'

type ToolCapability =
  | 'read:filesystem'      // Read files
  | 'write:filesystem'     // Write/modify files
  | 'network:outbound'     // Make external HTTP requests
  | 'network:inbound'      // Accept network connections
  | 'code:execute'         // Execute arbitrary code
  | 'system:command'       // Run system commands
  | 'data:sensitive'       // Access sensitive data
  | 'user:impersonate'     // Act on behalf of users

interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: unknown) => Promise<unknown>

  // NEW: Security fields
  riskLevel?: ToolRiskLevel        // Default: 'safe'
  capabilities?: ToolCapability[]  // Default: []
  requiresApproval?: boolean       // Default: based on riskLevel
}
```

### 2. Approval Modes

```typescript
type ApprovalMode = 'auto' | 'manual' | 'allowlist' | 'blocklist'

interface ToolsConfig {
  // Existing fields...

  // NEW: Approval configuration
  approvalMode?: ApprovalMode      // Default: 'manual' for risky tools
  allowedTools?: string[]          // Tool names always approved
  blockedTools?: string[]          // Tool names always blocked
  autoApproveRiskLevels?: ToolRiskLevel[]  // Auto-approve these risk levels
  approvalHandler?: (call: ToolCall) => Promise<boolean>  // Custom approval UI
}
```

### 3. Approval Workflow

```
Tool Called
    ↓
Check if blocked
    ↓ (not blocked)
Check if allowed
    ↓ (not in allowlist)
Check risk level
    ↓
Safe/Low + autoApprove → Execute
Medium/High → Request approval
    ↓
User approves/denies
    ↓
Execute or reject
```

### 4. Audit Logging

```typescript
interface ToolAuditLog {
  timestamp: number
  toolName: string
  callId: string
  riskLevel: ToolRiskLevel
  capabilities: ToolCapability[]
  parameters: Record<string, unknown>  // Sanitized
  approved: boolean
  approvedBy?: 'user' | 'auto' | 'allowlist'
  executionStatus: 'success' | 'failure' | 'timeout' | 'denied'
  executionTimeMs?: number
  error?: string
}
```

## Implementation Plan

### Phase 1: Types & Configuration (30 min)
- [ ] Add fields to ToolDefinition interface
- [ ] Add fields to ToolsConfig interface
- [ ] Create ToolAuditLog interface
- [ ] Define risk level defaults

### Phase 2: Approval Logic (1 hour)
- [ ] Implement shouldRequireApproval() function
- [ ] Update requestToolCall() to check approval requirements
- [ ] Implement approvalHandler callback support
- [ ] Add blocklist/allowlist checks

### Phase 3: Audit Logging (30 min)
- [ ] Create audit log storage
- [ ] Log tool requests with approval status
- [ ] Log execution results
- [ ] Sanitize sensitive parameters in logs

### Phase 4: Built-in Tool Classification (30 min)
- [ ] Classify existing built-in tools
- [ ] get_current_time: safe
- [ ] calculate: safe
- [ ] generate_uuid: safe
- [ ] (future) fetch_url: medium, requires network:outbound
- [ ] (future) execute_code: high, requires code:execute

### Phase 5: Testing (1 hour)
- [ ] Test approval modes (auto, manual, allowlist, blocklist)
- [ ] Test risk level enforcement
- [ ] Test audit logging
- [ ] Test approval handler callback

### Phase 6: Documentation (30 min)
- [ ] Update README with approval system usage
- [ ] Add examples for custom approval UI
- [ ] Document capability types
- [ ] Security best practices guide

## Example Usage

### Basic Usage with Manual Approval

```typescript
const toolsConfig: ToolsConfig = {
  approvalMode: 'manual',
  autoApproveRiskLevels: ['safe', 'low'],
  approvalHandler: async (call) => {
    // Show custom approval UI
    return await showApprovalDialog(call)
  }
}
```

### Allowlist Mode (Enterprise)

```typescript
const toolsConfig: ToolsConfig = {
  approvalMode: 'allowlist',
  allowedTools: ['get_current_time', 'calculate', 'search_database'],
  blockedTools: ['execute_code', 'system_command']
}
```

### Custom Tool with Capabilities

```typescript
const fetchUrlTool: ToolDefinition = {
  name: 'fetch_url',
  description: 'Fetch content from a URL',
  riskLevel: 'medium',
  capabilities: ['network:outbound'],
  requiresApproval: true,
  execute: async (params) => {
    // Implementation
  }
}
```

## Security Considerations

1. **Default Deny**: Tools are denied by default unless approved
2. **Sensitive Data**: Parameter sanitization in audit logs
3. **Capability Escalation**: No way to bypass approval requirements
4. **Audit Trail**: Immutable log of all tool executions
5. **User Control**: Clear UI showing what tools are being executed

## Migration

Existing code will continue to work with `autoApprove: true` (current default). New projects should use explicit approval configuration.

## Success Criteria

- [ ] All HIGH-014 requirements addressed
- [ ] +2 points toward 98/100 target score
- [ ] No breaking changes to existing tool definitions
- [ ] Clear security documentation
- [ ] Comprehensive test coverage (>95%)
