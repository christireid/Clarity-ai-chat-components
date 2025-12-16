/* eslint-disable */

/* eslint-disable no-console */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

/**
 * @typedef {import('../lib/search-config').KnowledgeBase} KnowledgeBase
 * @typedef {import('../lib/search-config').KnowledgeBaseChunk} KnowledgeBaseChunk
 */

const ROOT_DIR = path.resolve(__dirname, '../../../');
const DOCS_CONTENT_DIR = path.join(ROOT_DIR, 'apps/docs/content');
const OUT_FILE = path.join(ROOT_DIR, 'apps/marketing-site/lib/aura-knowledge.json');

// Files to manually include from root
const ROOT_FILES = [
  'MARKETING_STRATEGY_AND_PLAN.md',
  'README.md',
  'COMPREHENSIVE_ENHANCEMENT_PLAN.md'
];

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Helper to chunk content by headers
function chunkContent(content, sourcePath, baseTitle) {
  const chunks = [];
  
  // Remove frontmatter if present (between --- and ---)
  const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
  
  // Split by headers (H1, H2, H3)
  // Logic: Split, but capture the delimiter to keep the title with the content if possible
  // Using a simplified approach: iterate lines
  
  const lines = cleanContent.split('\n');
  let currentChunk = {
    title: baseTitle,
    content: [],
    level: 0
  };
  
  lines.forEach(line => {
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      // If we have accumulated content in the current chunk, push it
      if (currentChunk.content.length > 0) {
        chunks.push({
          title: currentChunk.title,
          content: currentChunk.content.join('\n').trim(),
          sourcePath
        });
      }
      
      // Start new chunk
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      currentChunk = {
        title: `${baseTitle} > ${title}`,
        content: [line], // Include the header in the content too
        level
      };
    } else {
      currentChunk.content.push(line);
    }
  });
  
  // Push last chunk
  if (currentChunk.content.length > 0) {
    chunks.push({
      title: currentChunk.title,
      content: currentChunk.content.join('\n').trim(),
      sourcePath
    });
  }

  // Filter out empty or too short chunks (e.g. just a header)
  return chunks.filter(c => c.content.length > 50);
}

function processFiles() {
  const allChunks = [];

  // 1. Scan docs content
  console.log('Scanning docs content...');
  const docFiles = scanDirectory(DOCS_CONTENT_DIR);
  
  docFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(ROOT_DIR, filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Frontmatter title or filename
    let title = fileName;
    const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^title:\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
    }

    const fileChunks = chunkContent(content, relativePath, title);
    allChunks.push(...fileChunks);
  });

  // 2. Scan root files
  console.log('Scanning root files...');
  ROOT_FILES.forEach(fileName => {
    const filePath = path.join(ROOT_DIR, fileName);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileChunks = chunkContent(content, fileName, fileName);
      allChunks.push(...fileChunks);
    }
  });

  // 3. Save to JSON
  /** @type {KnowledgeBase} */
  const output = {
    lastUpdated: new Date().toISOString(),
    documentCount: docFiles.length + ROOT_FILES.length,
    chunkCount: allChunks.length,
    chunks: allChunks
  };

  // Ensure dir exists
  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Knowledge base saved to ${OUT_FILE}`);
  console.log(`Stats: ${output.documentCount} documents -> ${output.chunkCount} chunks.`);
}

processFiles();
