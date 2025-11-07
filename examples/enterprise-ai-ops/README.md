# Enterprise AI Operations Dashboard

**Comprehensive observability, safety monitoring, and evaluation platform for AI systems**

## 🌟 Overview

This demo showcases enterprise-grade AI operations capabilities, providing complete visibility into:

- **Real-Time Observability** - Monitor requests, latency, errors, and performance
- **Safety Monitoring** - PII detection, content filtering, prompt injection protection
- **Evaluation Framework** - Automated quality scoring and compliance checking
- **Prompt Testing** - Test harness for validating prompts and behaviors
- **Token Optimization** - Cost tracking and savings visualization
- **Performance Analytics** - Deep insights into system performance

## ✨ Key Features

### Observability Dashboard
- **Real-Time Metrics** - Live monitoring of all system metrics
- **Request Analytics** - Volume, patterns, and trends
- **Latency Tracking** - P50, P95, P99 percentiles
- **Error Monitoring** - Error rates and failure analysis
- **User Activity** - Active users and usage patterns

### Safety Console
- **PII Detection** - Automatic detection and redaction
- **Content Filtering** - Multi-category content screening
- **Prompt Injection Protection** - Defense against adversarial prompts
- **Violation Tracking** - Review and resolution workflow
- **Compliance Reporting** - Audit trails and reports

### Evaluation Dashboard
- **Quality Scoring** - Multi-dimensional quality metrics
- **A/B Testing** - Compare model versions
- **Benchmarking** - Track improvements over time
- **Custom Metrics** - Define your own evaluation criteria
- **Automated Reports** - Scheduled evaluation reports

### Prompt Test Harness
- **Test Case Management** - Organize and version test cases
- **Automated Testing** - Run tests on schedule or trigger
- **Behavior Validation** - Verify expected behaviors
- **Regression Detection** - Catch breaking changes
- **Performance Testing** - Measure prompt performance

### Token Optimization
- **Cost Tracking** - Real-time cost monitoring
- **Savings Analysis** - Breakdown by optimization technique
- **Usage Forecasting** - Predict future costs
- **Budget Alerts** - Set spending limits
- **ROI Calculator** - Measure optimization impact

### Performance Dashboard
- **Latency Analysis** - Response time breakdowns
- **Throughput Metrics** - Requests per second
- **Error Analysis** - Error type and frequency
- **Resource Utilization** - CPU, memory, GPU usage
- **Capacity Planning** - Predict scaling needs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd examples/enterprise-ai-ops
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3003](http://localhost:3003)

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Recharts** for data visualization

### Clarity Chat Components Used

```typescript
import {
  // AI Ops Components
  EvaluationDashboard,
  SafetyReviewConsole,
  PromptTestHarness,
  
  // Token Optimization
  TokenOptimizationDashboard,
  useTokenOptimization,
  
  // Performance
  PerformanceDashboard,
  
  // Safety
  SafetyStatusCard,
  ResponseQualityMeter,
  
  // Theme
  ThemeProvider,
  themes,
} from '@clarity-chat/react'
```

## 📊 Dashboard Sections

### Overview Tab
- System health metrics
- Real-time monitoring charts
- Active alerts and notifications
- Quick action buttons

### Safety Tab
- Safety violation console
- PII detection status
- Content filtering logs
- Compliance reports

### Evaluation Tab
- Quality score trends
- Evaluation results
- Benchmark comparisons
- Custom metric dashboards

### Testing Tab
- Test case library
- Test execution history
- Behavior validation results
- Regression test reports

### Token Ops Tab
- Cost breakdown
- Optimization savings
- Usage trends
- Budget management

### Performance Tab
- Latency distribution
- Throughput metrics
- Error analysis
- Resource utilization

## 🎯 Use Cases

### 1. Safety Monitoring
```
Scenario: Detect and prevent PII exposure

System:
- Real-time PII scanning
- Automatic redaction
- Violation alerts
- Compliance reporting
```

### 2. Quality Assurance
```
Scenario: Evaluate model responses

System:
- Automated quality scoring
- Multi-dimensional metrics
- Benchmark comparisons
- Trend analysis
```

### 3. Cost Optimization
```
Scenario: Reduce AI API costs

System:
- Token usage tracking
- Optimization analysis
- Savings visualization
- Budget alerts
```

### 4. Performance Tuning
```
Scenario: Improve response times

System:
- Latency monitoring
- Bottleneck identification
- Optimization recommendations
- Capacity planning
```

## 🔧 Customization

### Adding Custom Metrics

```typescript
const customMetrics = {
  userSatisfaction: 4.5,
  responseAccuracy: 92.3,
  taskCompletionRate: 87.5,
}
```

### Custom Safety Rules

```typescript
const safetyRules = {
  piiDetection: {
    enabled: true,
    autoRedact: true,
    alertThreshold: 1,
  },
  contentFiltering: {
    categories: ['violence', 'hate', 'self-harm'],
    strictness: 'high',
  },
}
```

### Custom Evaluation Criteria

```typescript
const evaluationCriteria = {
  accuracy: { weight: 0.4, threshold: 0.9 },
  relevance: { weight: 0.3, threshold: 0.85 },
  coherence: { weight: 0.2, threshold: 0.8 },
  helpfulness: { weight: 0.1, threshold: 0.75 },
}
```

## 📈 Metrics Explained

### Success Rate
Percentage of successful requests out of total requests.

### Latency Percentiles
- **P50**: Median response time
- **P95**: 95% of requests faster than this
- **P99**: 99% of requests faster than this

### Quality Score
Weighted average of accuracy, relevance, coherence, and helpfulness.

### Token Savings
Total tokens saved through optimization techniques.

## 🚧 Backend Integration

This demo includes mock data. For production use:

1. **Set Up Observability**
   - Integrate with your AI backend
   - Configure metrics collection
   - Set up real-time streaming

2. **Configure Safety**
   - Enable PII detection
   - Set up content filters
   - Configure alert thresholds

3. **Set Up Evaluation**
   - Define evaluation criteria
   - Configure automated testing
   - Set up benchmark tracking

4. **Token Tracking**
   - Integrate token counting
   - Set up cost tracking
   - Configure optimization

## 📚 Documentation

- [Clarity Chat Docs](../../docs/README.md)
- [AI Ops Guide](../../docs/guides/ai-ops.md)
- [Safety Guide](../../docs/guides/safety.md)
- [Evaluation Guide](../../docs/guides/evaluation.md)
- [Token Optimization Guide](../../docs/guides/token-optimization.md)

## 🤝 Contributing

This is a demo application. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See [LICENSE](../../LICENSE)

---

**Built with ❤️ using Clarity Chat by Code & Clarity**

This demo showcases enterprise-grade AI operations capabilities that are production-ready.
