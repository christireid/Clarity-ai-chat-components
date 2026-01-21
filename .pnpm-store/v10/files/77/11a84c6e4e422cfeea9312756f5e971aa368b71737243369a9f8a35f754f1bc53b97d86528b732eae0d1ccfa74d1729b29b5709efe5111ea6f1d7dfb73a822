export declare enum ChunkStrategy {
    character = "character",
    paragraph = "paragraph"
}
export interface Chunk {
    text: string | string[] | null;
    start: number;
    end: number;
    isBoundary?: boolean;
}
export interface SplitOptions {
    chunkSize?: number;
    chunkOverlap?: number;
    splitter?: (input: string) => string[];
    chunkStrategy?: keyof typeof ChunkStrategy;
}
/**
 * Split text into parts of text (or null if the part is ignored) and their start and end indices.
 *
 * While this function takes an array of strings, the `start` and `end` indices are from the
 * perspective of the entire input array as a joined long single string.
 *
 * **Note**: `start` and `end` are based on string indexing (`input[i]` or `input.split('')`) and
 * not on array-like iteration of the string (e.g. `[...input]` or `Array.from(input)`)
 *
 * @param {string[]} inputs - The inputs to split.
 * @param {Function} splitter - The function to split the text.
 * @param {number} baseOffset - The base offset to add to the start and end positions.
 * @returns {Chunk[]}
 */
export declare function splitToParts(inputs: string[], splitter: (input: string) => string[], baseOffset?: number): Chunk[];
/**
 * Split text into chunks.
 *
 * ## Chunk Structure
 * Note that when splitting into tokens if an array is passed to input, the array item boundary is
 * *always* a token boundary.
 *
 * In the returned structure, `start` is the start of the first token in the chunk and `end` is
 * the end of the last token. In between there may be unmatched / discarded parts between tokens
 * (e.g. if you split on whitespace, there may be spaces between tokens). The `text` field of
 * the returned chunk will include all the text or array of texts from the start to the end,
 * inclusive of the unmatched parts.
 *
 * ## Chunk Strategy
 * The `chunkStrategy` option allows you to specify how the chunks are grouped.
 * - `character`: There is no grouping preference here. Fit as many whole tokens as possible into a chunk.
 * - `paragraph`: Group tokens by paragraphs. If a paragraph exceeds the chunk size, it will be split across multiple chunks.
 *
 * @param {string|string[]} input - The input (string or array of strings) to split.
 * @param {Object} options
 * @param {number} options.chunkSize - The max number of tokens (from splitter) of each chunk.
 * @param {number} options.chunkOverlap - The overlapping number of tokens (from splitter) to include from previous chunk.
 * @param {Function} options.splitter - The function to split the text.
 * @param {string} options.chunkStrategy - The strategy used to group tokens into chunks.
 * @returns {Array<{text: string | null, start: number, end: number}>}
 */
export declare function split(input: string | string[], { chunkSize, chunkOverlap, splitter, chunkStrategy }?: SplitOptions): Chunk[];
