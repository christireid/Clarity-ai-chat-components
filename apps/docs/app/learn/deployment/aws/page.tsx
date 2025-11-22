import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Deploy to AWS - Clarity Chat',
  description: 'Deploy Clarity Chat on AWS with Lambda, API Gateway, and CloudFront.',
}

export default function AWSDeploymentPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Deployment</span>
        <h1>Deploy to AWS</h1>
        <p className="docs-lead">
          Deploy Clarity Chat on AWS using Lambda, API Gateway, S3, and CloudFront for a scalable, production-ready setup.
        </p>
      </div>

      <section className="docs-section">
        <h2>Architecture Overview</h2>
        <pre><code>{`┌──────────────┐
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
└─────────┘          └──────────────┘`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Option 1: SST (Recommended)</h2>
        <p>Use SST for the easiest AWS deployment experience:</p>

        <h3>1. Install SST</h3>
        <pre><code>{`npx create-sst@latest
cd my-sst-app
npm install @clarity-chat/react`}</code></pre>

        <h3>2. Configure SST</h3>
        <pre><code>{`// sst.config.ts
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
} satisfies SSTConfig`}</code></pre>

        <h3>3. Deploy</h3>
        <pre><code>{`npx sst deploy --stage production`}</code></pre>

        <Callout type="info" title="SST Benefits">
          • Automatic Lambda configuration<br/>
          • Response streaming support<br/>
          • Local development with AWS services<br/>
          • Live Lambda debugging
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Option 2: AWS Amplify</h2>
        <p>Managed hosting for Next.js applications:</p>

        <h3>1. Install Amplify CLI</h3>
        <pre><code>{`npm install -g @aws-amplify/cli
amplify configure`}</code></pre>

        <h3>2. Initialize Amplify</h3>
        <pre><code>{`amplify init
# Choose:
# - Do you want to use an existing environment? No
# - Enter a name for the environment: production
# - Choose your default editor: VS Code
# - Choose the type of app: javascript
# - Framework: react
# - Build command: npm run build
# - Start command: npm run start`}</code></pre>

        <h3>3. Add Hosting</h3>
        <pre><code>{`amplify add hosting
# Choose:
# - Select the plugin: Hosting with Amplify Console
# - type: Manual deployment

amplify publish`}</code></pre>

        <h3>4. Configure Response Streaming</h3>
        <pre><code>{`// amplify/backend/function/chatapi/src/index.js
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
)`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Option 3: Manual Lambda + API Gateway</h2>

        <h3>1. Create Lambda Function</h3>
        <pre><code>{`// lambda/chat/index.mjs
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
)`}</code></pre>

        <h3>2. Deploy with AWS CLI</h3>
        <pre><code>{`# Package function
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
  --invoke-mode RESPONSE_STREAM`}</code></pre>

        <h3>3. Create API Gateway</h3>
        <pre><code>{`# Create REST API
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
  --target integrations/INTEGRATION_ID`}</code></pre>

        <h3>4. Deploy Frontend to S3 + CloudFront</h3>
        <pre><code>{`# Build Next.js app
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
  --paths "/*"`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Infrastructure as Code (Terraform)</h2>
        <pre><code>{`# main.tf
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
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <p>Store secrets in AWS Secrets Manager or Parameter Store:</p>
        <pre><code>{`# Store secret
aws secretsmanager create-secret \\
  --name /clarity-chat/openai-api-key \\
  --secret-string sk-...

# Access in Lambda
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: 'us-east-1' })
const response = await client.send(
  new GetSecretValueCommand({ SecretId: '/clarity-chat/openai-api-key' })
)
const apiKey = response.SecretString`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Monitoring & Logging</h2>

        <h3>CloudWatch Logs</h3>
        <pre><code>{`// Lambda function logging
console.log('Request received:', JSON.stringify(event))
console.error('Error:', error.message)

// Query logs with CloudWatch Insights
fields @timestamp, @message
| filter @message like /Error/
| sort @timestamp desc
| limit 20`}</code></pre>

        <h3>CloudWatch Metrics</h3>
        <pre><code>{`// Custom metrics
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
}))`}</code></pre>

        <h3>X-Ray Tracing</h3>
        <pre><code>{`// Enable X-Ray in Lambda
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
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Cost Optimization</h2>

        <h3>Lambda Pricing</h3>
        <ul>
          <li>1M requests/month free</li>
          <li>$0.20 per 1M requests after</li>
          <li>$0.00001667 per GB-second</li>
        </ul>

        <h3>Optimize Costs</h3>
        <ul>
          <li>Use ARM architecture (Graviton2) for 20% savings</li>
          <li>Right-size memory allocation (1024MB usually optimal)</li>
          <li>Enable Lambda SnapStart for faster cold starts</li>
          <li>Use Provisioned Concurrency for consistent latency ($$)</li>
          <li>Set appropriate timeout (don't over-allocate)</li>
        </ul>

        <h3>CloudFront Caching</h3>
        <pre><code>{`# Cache static assets aggressively
Cache-Control: public, max-age=31536000, immutable

# Cache API responses with short TTL
Cache-Control: public, max-age=60, stale-while-revalidate=120`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Security Best Practices</h2>

        <h3>IAM Roles</h3>
        <pre><code>{`{
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
}`}</code></pre>

        <h3>API Gateway Throttling</h3>
        <pre><code>{`# Set throttling limits
aws apigatewayv2 update-stage \\
  --api-id API_ID \\
  --stage-name production \\
  --throttle-settings RateLimit=100,BurstLimit=200`}</code></pre>

        <h3>WAF Protection</h3>
        <pre><code>{`# Create WAF Web ACL
aws wafv2 create-web-acl \\
  --name clarity-chat-waf \\
  --scope REGIONAL \\
  --default-action Allow={} \\
  --rules file://waf-rules.json

# Associate with API Gateway
aws wafv2 associate-web-acl \\
  --web-acl-arn WAF_ARN \\
  --resource-arn API_GATEWAY_ARN`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/learn/deployment/vercel" className="docs-card">
            <h3>Deploy to Vercel</h3>
            <p>Easiest deployment option</p>
          </a>
          <a href="/learn/deployment/docker" className="docs-card">
            <h3>Docker Deployment</h3>
            <p>Self-hosted containers</p>
          </a>
          <a href="/cookbook/production-monitoring" className="docs-card">
            <h3>Production Monitoring</h3>
            <p>Observability setup</p>
          </a>
        </div>
      </section>
    </div>
  )
}
