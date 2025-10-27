const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = '.' + url.pathname;

  // Handle root
  if (filePath === './') {
    filePath = './index.html';
  }

  // Handle API endpoint for markdown files
  if (url.pathname.startsWith('/api/markdown')) {
    const demo = url.searchParams.get('demo');
    const file = url.searchParams.get('file');

    if (!demo || !file) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing demo or file parameter' }));
      return;
    }

    // Map demo names to paths
    const pathMap = {
      'model-comparison-demo': '../model-comparison-demo/',
      'rag-workbench-demo': '../rag-workbench-demo/',
      'analytics-console-demo': '../analytics-console-demo/',
      'examples': '../',
      'main': '../../'
    };

    const basePath = pathMap[demo];
    if (!basePath) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid demo specified' }));
      return;
    }

    const mdFilePath = path.join(__dirname, basePath, file);

    // Security check - ensure file is within allowed directories
    const resolvedPath = path.resolve(mdFilePath);
    const allowedBase = path.resolve(__dirname, '..');
    if (!resolvedPath.startsWith(allowedBase)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access denied' }));
      return;
    }

    fs.readFile(mdFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }

      res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
    return;
  }

  // Serve static files
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
