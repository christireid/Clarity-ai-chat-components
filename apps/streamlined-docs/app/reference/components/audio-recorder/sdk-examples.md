# AudioRecorder SDK Examples

Integration examples for using the AudioRecorder API with various programming languages and frameworks.

## Table of Contents

- [JavaScript/TypeScript](#javascripttypescript)
- [Python](#python)
- [Node.js](#nodejs)
- [Ruby](#ruby)
- [PHP](#php)
- [Go](#go)
- [Java](#java)
- [C#/.NET](#cnet)

## JavaScript/TypeScript

### Browser Fetch API

```typescript
// Upload audio recording
async function uploadAudio(audioBlob: Blob): Promise<AudioUploadResponse> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('duration', '45.3')
  formData.append('format', 'webm')

  const response = await fetch('https://api.clarity-ai.com/v1/audio/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error.message)
  }

  return response.json()
}

// Example usage with AudioRecorder
<AudioRecorder
  maxDuration={60}
  onStop={async (blob, url) => {
    try {
      const result = await uploadAudio(blob)
      console.log('Uploaded:', result.data.url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }}
/>
```

### Axios

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.clarity-ai.com/v1',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

// Upload audio
async function uploadAudio(audioBlob: Blob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const { data } = await api.post('/audio/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percent = (progressEvent.loaded / progressEvent.total!) * 100
      console.log(`Upload progress: ${percent}%`)
    },
  })

  return data
}

// Transcribe audio
async function transcribeAudio(audioBlob: Blob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('language', 'en')
  formData.append('model', 'enhanced')
  formData.append('timestamps', 'true')

  const { data } = await api.post('/audio/transcribe', formData)
  return data
}

// Convert audio format
async function convertAudio(audioBlob: Blob, outputFormat: string) {
  const formData = new FormData()
  formData.append('audio', audioBlob)
  formData.append('outputFormat', outputFormat)
  formData.append('bitrate', '128000')

  const { data } = await api.post('/audio/convert', formData)
  return data
}
```

### Real-time Chunked Upload

```typescript
class ChunkedAudioUploader {
  private sessionId: string | null = null
  private chunkIndex = 0

  async startSession(): Promise<string> {
    const { data } = await api.post('/audio/session/start')
    this.sessionId = data.sessionId
    return this.sessionId
  }

  async uploadChunk(chunk: Blob): Promise<void> {
    if (!this.sessionId) {
      await this.startSession()
    }

    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('sessionId', this.sessionId!)
    formData.append('index', this.chunkIndex.toString())
    formData.append('timestamp', Date.now().toString())

    await api.post('/audio/upload-chunk', formData)
    this.chunkIndex++
  }

  async finalize(): Promise<AudioUploadResponse> {
    const { data } = await api.post('/audio/finalize-recording', {
      sessionId: this.sessionId,
      totalChunks: this.chunkIndex,
    })

    return data
  }
}

// Usage
const uploader = new ChunkedAudioUploader()

<AudioRecorder
  onDataAvailable={async (chunk) => {
    await uploader.uploadChunk(chunk)
  }}
  onStop={async () => {
    const result = await uploader.finalize()
    console.log('Recording complete:', result.data.url)
  }}
/>
```

## Python

### requests

```python
import requests
from typing import BinaryIO, Dict, Any

API_BASE_URL = "https://api.clarity-ai.com/v1"
API_TOKEN = "your_token_here"

def upload_audio(audio_file: BinaryIO, filename: str = "recording.webm") -> Dict[str, Any]:
    """Upload audio recording to API."""
    url = f"{API_BASE_URL}/audio/upload"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }
    files = {
        "audio": (filename, audio_file, "audio/webm")
    }
    data = {
        "format": "webm"
    }

    response = requests.post(url, headers=headers, files=files, data=data)
    response.raise_for_status()

    return response.json()

def transcribe_audio(
    audio_file: BinaryIO,
    language: str = "en",
    model: str = "enhanced",
    timestamps: bool = True
) -> Dict[str, Any]:
    """Transcribe audio to text."""
    url = f"{API_BASE_URL}/audio/transcribe"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }
    files = {
        "audio": ("recording.webm", audio_file, "audio/webm")
    }
    data = {
        "language": language,
        "model": model,
        "timestamps": str(timestamps).lower(),
        "punctuation": "true"
    }

    response = requests.post(url, headers=headers, files=files, data=data)
    response.raise_for_status()

    return response.json()

def convert_audio(
    audio_file: BinaryIO,
    output_format: str = "mp3",
    bitrate: int = 128000
) -> Dict[str, Any]:
    """Convert audio to different format."""
    url = f"{API_BASE_URL}/audio/convert"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }
    files = {
        "audio": audio_file
    }
    data = {
        "outputFormat": output_format,
        "bitrate": str(bitrate)
    }

    response = requests.post(url, headers=headers, files=files, data=data)
    response.raise_for_status()

    return response.json()

# Example usage
if __name__ == "__main__":
    # Upload audio
    with open("recording.webm", "rb") as f:
        result = upload_audio(f)
        print(f"Uploaded: {result['data']['url']}")

    # Transcribe audio
    with open("recording.webm", "rb") as f:
        result = transcribe_audio(f)
        print(f"Transcript: {result['data']['transcript']}")
        print(f"Confidence: {result['data']['confidence']}")
```

### aiohttp (async)

```python
import aiohttp
import asyncio
from typing import BinaryIO, Dict, Any

API_BASE_URL = "https://api.clarity-ai.com/v1"
API_TOKEN = "your_token_here"

async def upload_audio_async(audio_data: bytes, filename: str = "recording.webm") -> Dict[str, Any]:
    """Async upload audio recording."""
    url = f"{API_BASE_URL}/audio/upload"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }

    data = aiohttp.FormData()
    data.add_field('audio', audio_data, filename=filename, content_type='audio/webm')
    data.add_field('format', 'webm')

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=data) as response:
            response.raise_for_status()
            return await response.json()

async def transcribe_audio_async(audio_data: bytes) -> Dict[str, Any]:
    """Async transcribe audio."""
    url = f"{API_BASE_URL}/audio/transcribe"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }

    data = aiohttp.FormData()
    data.add_field('audio', audio_data, filename='recording.webm', content_type='audio/webm')
    data.add_field('language', 'en')
    data.add_field('model', 'enhanced')

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=data) as response:
            response.raise_for_status()
            return await response.json()

# Usage
async def main():
    with open("recording.webm", "rb") as f:
        audio_data = f.read()

    # Concurrent uploads
    upload_task = upload_audio_async(audio_data)
    transcribe_task = transcribe_audio_async(audio_data)

    upload_result, transcribe_result = await asyncio.gather(upload_task, transcribe_task)

    print(f"Uploaded: {upload_result['data']['url']}")
    print(f"Transcript: {transcribe_result['data']['transcript']}")

asyncio.run(main())
```

## Node.js

### node-fetch

```javascript
const FormData = require('form-data')
const fetch = require('node-fetch')
const fs = require('fs')

const API_BASE_URL = 'https://api.clarity-ai.com/v1'
const API_TOKEN = process.env.CLARITY_API_TOKEN

async function uploadAudio(filePath) {
  const form = new FormData()
  form.append('audio', fs.createReadStream(filePath))
  form.append('format', 'webm')

  const response = await fetch(`${API_BASE_URL}/audio/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      ...form.getHeaders(),
    },
    body: form,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error.message)
  }

  return response.json()
}

async function transcribeAudio(filePath) {
  const form = new FormData()
  form.append('audio', fs.createReadStream(filePath))
  form.append('language', 'en')
  form.append('model', 'enhanced')
  form.append('timestamps', 'true')

  const response = await fetch(`${API_BASE_URL}/audio/transcribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      ...form.getHeaders(),
    },
    body: form,
  })

  return response.json()
}

// Usage
;(async () => {
  try {
    const uploadResult = await uploadAudio('./recording.webm')
    console.log('Uploaded:', uploadResult.data.url)

    const transcriptResult = await transcribeAudio('./recording.webm')
    console.log('Transcript:', transcriptResult.data.transcript)
  } catch (error) {
    console.error('Error:', error.message)
  }
})()
```

### axios

```javascript
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const api = axios.create({
  baseURL: 'https://api.clarity-ai.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.CLARITY_API_TOKEN}`,
  },
})

async function uploadAudio(filePath) {
  const form = new FormData()
  form.append('audio', fs.createReadStream(filePath))

  const { data } = await api.post('/audio/upload', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  })

  return data
}

async function transcribeAudio(filePath, options = {}) {
  const form = new FormData()
  form.append('audio', fs.createReadStream(filePath))
  form.append('language', options.language || 'en')
  form.append('model', options.model || 'enhanced')

  const { data } = await api.post('/audio/transcribe', form, {
    headers: form.getHeaders(),
  })

  return data
}

module.exports = { uploadAudio, transcribeAudio }
```

## Ruby

### net/http

```ruby
require 'net/http'
require 'uri'
require 'json'

class ClarityAudioAPI
  API_BASE_URL = 'https://api.clarity-ai.com/v1'

  def initialize(api_token)
    @api_token = api_token
  end

  def upload_audio(file_path)
    uri = URI("#{API_BASE_URL}/audio/upload")
    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{@api_token}"

    form_data = [
      ['audio', File.open(file_path), { filename: File.basename(file_path) }],
      ['format', 'webm']
    ]
    request.set_form(form_data, 'multipart/form-data')

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  end

  def transcribe_audio(file_path, language: 'en', model: 'enhanced')
    uri = URI("#{API_BASE_URL}/audio/transcribe")
    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{@api_token}"

    form_data = [
      ['audio', File.open(file_path)],
      ['language', language],
      ['model', model],
      ['timestamps', 'true']
    ]
    request.set_form(form_data, 'multipart/form-data')

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  end
end

# Usage
api = ClarityAudioAPI.new(ENV['CLARITY_API_TOKEN'])

result = api.upload_audio('recording.webm')
puts "Uploaded: #{result['data']['url']}"

transcript = api.transcribe_audio('recording.webm')
puts "Transcript: #{transcript['data']['transcript']}"
```

### HTTParty

```ruby
require 'httparty'

class ClarityAudioAPI
  include HTTParty
  base_uri 'https://api.clarity-ai.com/v1'

  def initialize(api_token)
    @api_token = api_token
  end

  def upload_audio(file_path)
    self.class.post('/audio/upload',
      headers: {
        'Authorization' => "Bearer #{@api_token}"
      },
      body: {
        audio: File.new(file_path),
        format: 'webm'
      }
    )
  end

  def transcribe_audio(file_path, options = {})
    self.class.post('/audio/transcribe',
      headers: {
        'Authorization' => "Bearer #{@api_token}"
      },
      body: {
        audio: File.new(file_path),
        language: options[:language] || 'en',
        model: options[:model] || 'enhanced',
        timestamps: options[:timestamps] || true
      }
    )
  end
end
```

## PHP

### cURL

```php
<?php

class ClarityAudioAPI {
    private $apiToken;
    private $baseUrl = 'https://api.clarity-ai.com/v1';

    public function __construct($apiToken) {
        $this->apiToken = $apiToken;
    }

    public function uploadAudio($filePath) {
        $url = $this->baseUrl . '/audio/upload';

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiToken
            ],
            CURLOPT_POSTFIELDS => [
                'audio' => new CURLFile($filePath, 'audio/webm', basename($filePath)),
                'format' => 'webm'
            ]
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($httpCode !== 200) {
            throw new Exception("Upload failed: " . $response);
        }

        return json_decode($response, true);
    }

    public function transcribeAudio($filePath, $options = []) {
        $url = $this->baseUrl . '/audio/transcribe';

        $postFields = [
            'audio' => new CURLFile($filePath),
            'language' => $options['language'] ?? 'en',
            'model' => $options['model'] ?? 'enhanced',
            'timestamps' => $options['timestamps'] ?? true
        ];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiToken
            ],
            CURLOPT_POSTFIELDS => $postFields
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        return json_decode($response, true);
    }

    public function convertAudio($filePath, $outputFormat, $bitrate = 128000) {
        $url = $this->baseUrl . '/audio/convert';

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiToken
            ],
            CURLOPT_POSTFIELDS => [
                'audio' => new CURLFile($filePath),
                'outputFormat' => $outputFormat,
                'bitrate' => $bitrate
            ]
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        return json_decode($response, true);
    }
}

// Usage
$api = new ClarityAudioAPI($_ENV['CLARITY_API_TOKEN']);

$uploadResult = $api->uploadAudio('recording.webm');
echo "Uploaded: " . $uploadResult['data']['url'] . "\n";

$transcriptResult = $api->transcribeAudio('recording.webm');
echo "Transcript: " . $transcriptResult['data']['transcript'] . "\n";
?>
```

## Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
)

const (
    APIBaseURL = "https://api.clarity-ai.com/v1"
)

type ClarityAudioAPI struct {
    apiToken string
    client   *http.Client
}

type AudioUploadResponse struct {
    Success bool `json:"success"`
    Data    struct {
        ID        string  `json:"id"`
        URL       string  `json:"url"`
        Duration  float64 `json:"duration"`
        Size      int     `json:"size"`
        Format    string  `json:"format"`
        CreatedAt string  `json:"createdAt"`
    } `json:"data"`
}

type TranscriptResponse struct {
    Success bool `json:"success"`
    Data    struct {
        Transcript string  `json:"transcript"`
        Confidence float64 `json:"confidence"`
        Language   string  `json:"language"`
        Duration   float64 `json:"duration"`
    } `json:"data"`
}

func NewClarityAudioAPI(apiToken string) *ClarityAudioAPI {
    return &ClarityAudioAPI{
        apiToken: apiToken,
        client:   &http.Client{},
    }
}

func (api *ClarityAudioAPI) UploadAudio(filePath string) (*AudioUploadResponse, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)

    part, err := writer.CreateFormFile("audio", filepath.Base(filePath))
    if err != nil {
        return nil, err
    }
    io.Copy(part, file)

    writer.WriteField("format", "webm")
    writer.Close()

    req, err := http.NewRequest("POST", APIBaseURL+"/audio/upload", body)
    if err != nil {
        return nil, err
    }

    req.Header.Set("Authorization", "Bearer "+api.apiToken)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    resp, err := api.client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result AudioUploadResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }

    return &result, nil
}

func (api *ClarityAudioAPI) TranscribeAudio(filePath string) (*TranscriptResponse, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)

    part, err := writer.CreateFormFile("audio", filepath.Base(filePath))
    if err != nil {
        return nil, err
    }
    io.Copy(part, file)

    writer.WriteField("language", "en")
    writer.WriteField("model", "enhanced")
    writer.Close()

    req, err := http.NewRequest("POST", APIBaseURL+"/audio/transcribe", body)
    if err != nil {
        return nil, err
    }

    req.Header.Set("Authorization", "Bearer "+api.apiToken)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    resp, err := api.client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result TranscriptResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }

    return &result, nil
}

func main() {
    api := NewClarityAudioAPI(os.Getenv("CLARITY_API_TOKEN"))

    // Upload audio
    uploadResult, err := api.UploadAudio("recording.webm")
    if err != nil {
        fmt.Println("Upload error:", err)
        return
    }
    fmt.Println("Uploaded:", uploadResult.Data.URL)

    // Transcribe audio
    transcriptResult, err := api.TranscribeAudio("recording.webm")
    if err != nil {
        fmt.Println("Transcribe error:", err)
        return
    }
    fmt.Println("Transcript:", transcriptResult.Data.Transcript)
}
```

## Java

```java
import java.io.File;
import java.io.IOException;
import okhttp3.*;
import com.google.gson.Gson;

public class ClarityAudioAPI {
    private static final String API_BASE_URL = "https://api.clarity-ai.com/v1";
    private final String apiToken;
    private final OkHttpClient client;
    private final Gson gson;

    public ClarityAudioAPI(String apiToken) {
        this.apiToken = apiToken;
        this.client = new OkHttpClient();
        this.gson = new Gson();
    }

    public AudioUploadResponse uploadAudio(String filePath) throws IOException {
        File file = new File(filePath);

        RequestBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("audio", file.getName(),
                RequestBody.create(file, MediaType.parse("audio/webm")))
            .addFormDataPart("format", "webm")
            .build();

        Request request = new Request.Builder()
            .url(API_BASE_URL + "/audio/upload")
            .addHeader("Authorization", "Bearer " + apiToken)
            .post(requestBody)
            .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            return gson.fromJson(responseBody, AudioUploadResponse.class);
        }
    }

    public TranscriptResponse transcribeAudio(String filePath) throws IOException {
        File file = new File(filePath);

        RequestBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("audio", file.getName(),
                RequestBody.create(file, MediaType.parse("audio/webm")))
            .addFormDataPart("language", "en")
            .addFormDataPart("model", "enhanced")
            .addFormDataPart("timestamps", "true")
            .build();

        Request request = new Request.Builder()
            .url(API_BASE_URL + "/audio/transcribe")
            .addHeader("Authorization", "Bearer " + apiToken)
            .post(requestBody)
            .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            return gson.fromJson(responseBody, TranscriptResponse.class);
        }
    }

    // Response classes
    public static class AudioUploadResponse {
        public boolean success;
        public AudioData data;
    }

    public static class AudioData {
        public String id;
        public String url;
        public double duration;
        public int size;
        public String format;
        public String createdAt;
    }

    public static class TranscriptResponse {
        public boolean success;
        public TranscriptData data;
    }

    public static class TranscriptData {
        public String transcript;
        public double confidence;
        public String language;
        public double duration;
    }

    // Usage
    public static void main(String[] args) {
        String apiToken = System.getenv("CLARITY_API_TOKEN");
        ClarityAudioAPI api = new ClarityAudioAPI(apiToken);

        try {
            AudioUploadResponse uploadResult = api.uploadAudio("recording.webm");
            System.out.println("Uploaded: " + uploadResult.data.url);

            TranscriptResponse transcriptResult = api.transcribeAudio("recording.webm");
            System.out.println("Transcript: " + transcriptResult.data.transcript);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## C#/.NET

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ClarityAudioAPI
{
    private const string ApiBaseUrl = "https://api.clarity-ai.com/v1";
    private readonly string _apiToken;
    private readonly HttpClient _httpClient;

    public ClarityAudioAPI(string apiToken)
    {
        _apiToken = apiToken;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiToken);
    }

    public async Task<AudioUploadResponse> UploadAudioAsync(string filePath)
    {
        using var form = new MultipartFormDataContent();
        using var fileStream = File.OpenRead(filePath);
        using var fileContent = new StreamContent(fileStream);

        fileContent.Headers.ContentType = new MediaTypeHeaderValue("audio/webm");
        form.Add(fileContent, "audio", Path.GetFileName(filePath));
        form.Add(new StringContent("webm"), "format");

        var response = await _httpClient.PostAsync($"{ApiBaseUrl}/audio/upload", form);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<AudioUploadResponse>(json);
    }

    public async Task<TranscriptResponse> TranscribeAudioAsync(
        string filePath,
        string language = "en",
        string model = "enhanced"
    )
    {
        using var form = new MultipartFormDataContent();
        using var fileStream = File.OpenRead(filePath);
        using var fileContent = new StreamContent(fileStream);

        fileContent.Headers.ContentType = new MediaTypeHeaderValue("audio/webm");
        form.Add(fileContent, "audio", Path.GetFileName(filePath));
        form.Add(new StringContent(language), "language");
        form.Add(new StringContent(model), "model");
        form.Add(new StringContent("true"), "timestamps");

        var response = await _httpClient.PostAsync($"{ApiBaseUrl}/audio/transcribe", form);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<TranscriptResponse>(json);
    }

    // Response classes
    public class AudioUploadResponse
    {
        public bool Success { get; set; }
        public AudioData Data { get; set; }
    }

    public class AudioData
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public double Duration { get; set; }
        public int Size { get; set; }
        public string Format { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TranscriptResponse
    {
        public bool Success { get; set; }
        public TranscriptData Data { get; set; }
    }

    public class TranscriptData
    {
        public string Transcript { get; set; }
        public double Confidence { get; set; }
        public string Language { get; set; }
        public double Duration { get; set; }
    }
}

// Usage
class Program
{
    static async Task Main(string[] args)
    {
        var apiToken = Environment.GetEnvironmentVariable("CLARITY_API_TOKEN");
        var api = new ClarityAudioAPI(apiToken);

        try
        {
            var uploadResult = await api.UploadAudioAsync("recording.webm");
            Console.WriteLine($"Uploaded: {uploadResult.Data.Url}");

            var transcriptResult = await api.TranscribeAudioAsync("recording.webm");
            Console.WriteLine($"Transcript: {transcriptResult.Data.Transcript}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
```

## Related Resources

- [API Reference](/reference/components/audio-recorder)
- [OpenAPI Specification](/reference/components/audio-recorder/openapi.yaml)
- [Troubleshooting Guide](/reference/components/audio-recorder/troubleshooting)
