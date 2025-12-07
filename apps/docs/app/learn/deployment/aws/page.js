import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Deploy to AWS - Clarity Chat',
    description: 'Deploy Clarity Chat on AWS with Lambda, API Gateway, and CloudFront.',
};
export default function AWSDeploymentPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Deployment" }), _jsx("h1", { children: "Deploy to AWS" }), _jsx("p", { className: "docs-lead", children: "Deploy Clarity Chat on AWS using Lambda, API Gateway, S3, and CloudFront for a scalable, production-ready setup." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Architecture Overview" }), _jsx("pre", { children: _jsx("code", { children: `┌──────────────┐
│   Route 53   │  DNS
└──────┬───────┘
       │
┌──────▼───────┐
│  CloudFront  │  CDN (static assets)
└──────┬───────┘
       │
┌──────▼────────────────────────┐
│                               │
│  S3 Bucket      API Gateway   │
│  (Next.js       (API routes)  │
│   static)                     │
│                │              │
└────────────────┼──────────────┘
                 │
          ┌──────▼──────┐
          │   Lambda    │  Serverless functions
          │  Functions  │
          └──────┬──────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼────┐          ┌───────▼──────┐
│DynamoDB │          │  Other AWS   │
│         │          │  Services    │
└─────────┘          └──────────────┘` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Option 1: SST (Recommended)" }), _jsx("p", { children: "Use SST for the easiest AWS deployment experience:" }), _jsx("h3", { children: "1. Install SST" }), _jsx("pre", { children: _jsx("code", { children: `npx create-sst@latest
cd my-sst-app
npm install @clarity-chat/react` }) }), _jsx("h3", { children: "2. Configure SST" }), _jsx("pre", { children: _jsx("code", { children: `// sst.config.ts
import { SSTConfig } from 'sst'
import { NextjsSite } from 'sst/constructs'

export default {
  config(_input) {
    return {
      name: 'clarity-chat',
      region: 'us-east-1'
    }
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        environment: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY!
        },
        customDomain: {
          domainName: 'chat.yourdomain.com',
          hostedZone: 'yourdomain.com'
        }
      })
      
      stack.addOutputs({
        SiteUrl: site.url
      })
    })
  }
} satisfies SSTConfig` }) }), _jsx("h3", { children: "3. Deploy" }), _jsx("pre", { children: _jsx("code", { children: `npx sst deploy --stage production` }) }), _jsxs(Callout, { type: "info", title: "SST Benefits", children: ["\u2022 Automatic Lambda configuration", _jsx("br", {}), "\u2022 Response streaming support", _jsx("br", {}), "\u2022 Local development with AWS services", _jsx("br", {}), "\u2022 Live Lambda debugging"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Option 2: AWS Amplify" }), _jsx("p", { children: "Managed hosting for Next.js applications:" }), _jsx("h3", { children: "1. Install Amplify CLI" }), _jsx("pre", { children: _jsx("code", { children: `npm install -g @aws-amplify/cli
amplify configure` }) }), _jsx("h3", { children: "2. Initialize Amplify" }), _jsx("pre", { children: _jsx("code", { children: `amplify init
# Choose:
# - Do you want to use an existing environment? No
# - Enter a name for the environment: production
# - Choose your default editor: VS Code
# - Choose the type of app: javascript
# - Framework: react
# - Build command: npm run build
# - Start command: npm run start` }) }), _jsx("h3", { children: "3. Add Hosting" }), _jsx("pre", { children: _jsx("code", { children: `amplify add hosting
# Choose:
# - Select the plugin: Hosting with Amplify Console
# - type: Manual deployment

amplify publish` }) }), _jsx("h3", { children: "4. Configure Response Streaming" }), _jsx("pre", { children: _jsx("code", { children: `// amplify/backend/function/chatapi/src/index.js
export const handler = awslambda.streamifyResponse(
  async (event, responseStream, context) => {
    const httpResponseMetadata = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    }
    
    responseStream = awslambda.HttpResponseStream.from(
      responseStream,
      httpResponseMetadata
    )
    
    // Stream your response
    for await (const chunk of streamFromOpenAI()) {
      responseStream.write(chunk)
    }
    
    responseStream.end()
  }
)` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Option 3: Manual Lambda + API Gateway" }), _jsx("h3", { children: "1. Create Lambda Function" }), _jsx("pre", { children: _jsx("code", { children: `// lambda/chat/index.mjs
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const handler = awslambda.streamifyResponse(
  async (event, responseStream) => {
    const { messages } = JSON.parse(event.body)
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true
    })
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        responseStream.write(content)
      }
    }
    
    responseStream.end()
  }
)` }) }), _jsx("h3", { children: "2. Deploy with AWS CLI" }), _jsx("pre", { children: _jsx("code", { children: `# Package function
zip -r function.zip index.mjs node_modules

# Create function
aws lambda create-function \\
  --function-name clarity-chat-api \\
  --runtime nodejs20.x \\
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-role \\
  --handler index.handler \\
  --zip-file fileb://function.zip \\
  --timeout 60 \\
  --memory-size 1024 \\
  --environment Variables={OPENAI_API_KEY=sk-...}

# Enable response streaming
aws lambda update-function-configuration \\
  --function-name clarity-chat-api \\
  --invoke-mode RESPONSE_STREAM` }) }), _jsx("h3", { children: "3. Create API Gateway" }), _jsx("pre", { children: _jsx("code", { children: `# Create REST API
aws apigatewayv2 create-api \\
  --name clarity-chat \\
  --protocol-type HTTP \\
  --target arn:aws:lambda:us-east-1:ACCOUNT_ID:function:clarity-chat-api

# Add Lambda integration
aws apigatewayv2 create-integration \\
  --api-id API_ID \\
  --integration-type AWS_PROXY \\
  --integration-uri arn:aws:lambda:us-east-1:ACCOUNT_ID:function:clarity-chat-api \\
  --payload-format-version 2.0 \\
  --invoke-mode RESPONSE_STREAM

# Create route
aws apigatewayv2 create-route \\
  --api-id API_ID \\
  --route-key 'POST /chat' \\
  --target integrations/INTEGRATION_ID` }) }), _jsx("h3", { children: "4. Deploy Frontend to S3 + CloudFront" }), _jsx("pre", { children: _jsx("code", { children: `# Build Next.js app
npm run build
npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Create CloudFront distribution
aws cloudfront create-distribution \\
  --origin-domain-name your-bucket-name.s3.amazonaws.com \\
  --default-root-object index.html

# Invalidate cache after updates
aws cloudfront create-invalidation \\
  --distribution-id DISTRIBUTION_ID \\
  --paths "/*"` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Infrastructure as Code (Terraform)" }), _jsx("pre", { children: _jsx("code", { children: `# main.tf
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Lambda Function
resource "aws_lambda_function" "chat_api" {
  filename      = "function.zip"
  function_name = "clarity-chat-api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 60
  memory_size   = 1024
  
  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key
    }
  }
  
  invoke_mode = "RESPONSE_STREAM"
}

# API Gateway
resource "aws_apigatewayv2_api" "chat_api" {
  name          = "clarity-chat"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["https://yourdomain.com"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type"]
  }
}

resource "aws_apigatewayv2_integration" "chat_integration" {
  api_id           = aws_apigatewayv2_api.chat_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.chat_api.invoke_arn
  invoke_mode      = "RESPONSE_STREAM"
}

# S3 Bucket for frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "clarity-chat-frontend"
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  index_document {
    suffix = "index.html"
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-clarity-chat"
  }
  
  enabled             = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-clarity-chat"
    viewer_protocol_policy = "redirect-to-https"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Environment Variables" }), _jsx("p", { children: "Store secrets in AWS Secrets Manager or Parameter Store:" }), _jsx("pre", { children: _jsx("code", { children: `# Store secret
aws secretsmanager create-secret \\
  --name /clarity-chat/openai-api-key \\
  --secret-string sk-...

# Access in Lambda
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: 'us-east-1' })
const response = await client.send(
  new GetSecretValueCommand({ SecretId: '/clarity-chat/openai-api-key' })
)
const apiKey = response.SecretString` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Monitoring & Logging" }), _jsx("h3", { children: "CloudWatch Logs" }), _jsx("pre", { children: _jsx("code", { children: `// Lambda function logging
console.log('Request received:', JSON.stringify(event))
console.error('Error:', error.message)

// Query logs with CloudWatch Insights
fields @timestamp, @message
| filter @message like /Error/
| sort @timestamp desc
| limit 20` }) }), _jsx("h3", { children: "CloudWatch Metrics" }), _jsx("pre", { children: _jsx("code", { children: `// Custom metrics
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' })

await cloudwatch.send(new PutMetricDataCommand({
  Namespace: 'ClarityChat',
  MetricData: [{
    MetricName: 'TokensUsed',
    Value: tokensUsed,
    Unit: 'Count',
    Timestamp: new Date()
  }]
}))` }) }), _jsx("h3", { children: "X-Ray Tracing" }), _jsx("pre", { children: _jsx("code", { children: `// Enable X-Ray in Lambda
import AWSXRay from 'aws-xray-sdk-core'
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

// Trace segments
const segment = AWSXRay.getSegment()
const subsegment = segment.addNewSubsegment('OpenAI API Call')

try {
  const response = await openai.chat.completions.create(...)
  subsegment.close()
} catch (error) {
  subsegment.addError(error)
  subsegment.close()
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Cost Optimization" }), _jsx("h3", { children: "Lambda Pricing" }), _jsxs("ul", { children: [_jsx("li", { children: "1M requests/month free" }), _jsx("li", { children: "$0.20 per 1M requests after" }), _jsx("li", { children: "$0.00001667 per GB-second" })] }), _jsx("h3", { children: "Optimize Costs" }), _jsxs("ul", { children: [_jsx("li", { children: "Use ARM architecture (Graviton2) for 20% savings" }), _jsx("li", { children: "Right-size memory allocation (1024MB usually optimal)" }), _jsx("li", { children: "Enable Lambda SnapStart for faster cold starts" }), _jsx("li", { children: "Use Provisioned Concurrency for consistent latency ($$)" }), _jsx("li", { children: "Set appropriate timeout (don't over-allocate)" })] }), _jsx("h3", { children: "CloudFront Caching" }), _jsx("pre", { children: _jsx("code", { children: `# Cache static assets aggressively
Cache-Control: public, max-age=31536000, immutable

# Cache API responses with short TTL
Cache-Control: public, max-age=60, stale-while-revalidate=120` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Security Best Practices" }), _jsx("h3", { children: "IAM Roles" }), _jsx("pre", { children: _jsx("code", { children: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:/clarity-chat/*"
    }
  ]
}` }) }), _jsx("h3", { children: "API Gateway Throttling" }), _jsx("pre", { children: _jsx("code", { children: `# Set throttling limits
aws apigatewayv2 update-stage \\
  --api-id API_ID \\
  --stage-name production \\
  --throttle-settings RateLimit=100,BurstLimit=200` }) }), _jsx("h3", { children: "WAF Protection" }), _jsx("pre", { children: _jsx("code", { children: `# Create WAF Web ACL
aws wafv2 create-web-acl \\
  --name clarity-chat-waf \\
  --scope REGIONAL \\
  --default-action Allow={} \\
  --rules file://waf-rules.json

# Associate with API Gateway
aws wafv2 associate-web-acl \\
  --web-acl-arn WAF_ARN \\
  --resource-arn API_GATEWAY_ARN` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/learn/deployment/vercel", className: "docs-card", children: [_jsx("h3", { children: "Deploy to Vercel" }), _jsx("p", { children: "Easiest deployment option" })] }), _jsxs("a", { href: "/learn/deployment/docker", className: "docs-card", children: [_jsx("h3", { children: "Docker Deployment" }), _jsx("p", { children: "Self-hosted containers" })] }), _jsxs("a", { href: "/cookbook/production-monitoring", className: "docs-card", children: [_jsx("h3", { children: "Production Monitoring" }), _jsx("p", { children: "Observability setup" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map