// Simple test of RAG chunking
const text = `
This is a test document for RAG chunking.
It contains multiple sentences to test the chunking algorithm.
Each chunk should be around 500 tokens with 50 token overlap.
This helps ensure relevant context is maintained across chunks.
The search algorithm will find the most relevant chunks for queries.
`;

// Simple word-based chunking (approximation)
function chunkText(text, chunkSize = 20, overlap = 5) {
  const words = text.trim().split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const end = Math.min(i + chunkSize, words.length);
    const chunk = words.slice(i, end).join(' ');
    chunks.push({
      id: `chunk-${chunks.length}`,
      text: chunk,
      wordCount: end - i,
      startWord: i,
      endWord: end
    });
    
    if (end >= words.length) break;
  }
  
  return chunks;
}

const chunks = chunkText(text);
console.log('Total chunks:', chunks.length);
chunks.forEach((chunk, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log('  Words:', chunk.wordCount);
  console.log('  Range:', chunk.startWord, '-', chunk.endWord);
  console.log('  Preview:', chunk.text.substring(0, 60) + '...');
});
