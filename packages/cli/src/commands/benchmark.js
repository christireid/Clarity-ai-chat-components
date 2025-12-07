/**
 * Benchmark command - Performance testing for AI chat
 */
import { performance } from 'perf_hooks';
import fs from 'fs-extra';
import path from 'path';
import { createBanner, createDivider } from '../ui/banner.js';
import { successMessage, infoMessage } from '../ui/messages.js';
import { createTable } from '../ui/table.js';
import { createSpinner } from '../ui/progress.js';
import { handleError } from '../utils/errors.js';
/**
 * Calculate statistics from timings
 */
function calculateStats(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    return {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean,
        median: sorted[Math.floor(sorted.length / 2)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
    };
}
/**
 * Format duration
 */
function formatDuration(ms) {
    if (ms < 1)
        return `${(ms * 1000).toFixed(2)}µs`;
    if (ms < 1000)
        return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
/**
 * Run a benchmark
 */
async function runBenchmark(name, fn, iterations = 100, warmup = 10) {
    // Warmup
    for (let i = 0; i < warmup; i++) {
        await fn();
    }
    // Actual benchmark
    const timings = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await fn();
        const end = performance.now();
        timings.push(end - start);
    }
    const stats = calculateStats(timings);
    return {
        name,
        iterations,
        ...stats,
    };
}
/**
 * Message processing benchmark
 */
async function benchmarkMessageProcessing() {
    const messages = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: 'This is a test message with some content',
        timestamp: Date.now(),
    }));
    return runBenchmark('Message Array Processing (100 messages)', () => {
        messages
            .filter(m => m.role === 'user')
            .map(m => ({ ...m, processed: true }))
            .slice(0, 50);
    });
}
/**
 * JSON serialization benchmark
 */
async function benchmarkJSONSerialization() {
    const data = {
        messages: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            role: 'user',
            content: 'Test message',
        })),
    };
    return runBenchmark('JSON Serialization (1000 messages)', () => {
        JSON.stringify(data);
        JSON.parse(JSON.stringify(data));
    });
}
/**
 * State cloning benchmark
 */
async function benchmarkStateCloning() {
    const state = {
        messages: Array.from({ length: 50 }, (_, i) => ({
            id: i,
            content: 'Message',
        })),
        config: {
            provider: 'openai',
            model: 'gpt-4',
            temperature: 0.7,
        },
    };
    return runBenchmark('State Deep Clone', () => {
        JSON.parse(JSON.stringify(state));
    });
}
/**
 * String operations benchmark
 */
async function benchmarkStringOperations() {
    const text = 'This is a test message. '.repeat(100);
    return runBenchmark('String Operations', () => {
        text.split(' ');
        text.toLowerCase();
        text.toUpperCase();
        text.replace(/test/g, 'sample');
    });
}
/**
 * Display results
 */
async function displayResults(suite) {
    console.log(createDivider(undefined, 60));
    console.log();
    const tableData = suite.results.map((result, index) => ({
        '#': index + 1,
        'Benchmark': result.name,
        'Iterations': result.iterations,
        'Mean': formatDuration(result.mean),
        'Median': formatDuration(result.median),
        'Min': formatDuration(result.min),
        'Max': formatDuration(result.max),
        'P95': formatDuration(result.p95),
        'P99': formatDuration(result.p99),
    }));
    const columns = [
        { header: '#', key: '#' },
        { header: 'Benchmark', key: 'Benchmark' },
        { header: 'Iterations', key: 'Iterations' },
        { header: 'Mean', key: 'Mean' },
        { header: 'Median', key: 'Median' },
        { header: 'Min', key: 'Min' },
        { header: 'Max', key: 'Max' },
        { header: 'P95', key: 'P95' },
        { header: 'P99', key: 'P99' },
    ];
    console.log(createTable(tableData, columns, {
        border: true,
    }));
    console.log();
}
/**
 * Save results
 */
async function saveResults(suite) {
    const spinner = createSpinner('Saving results...');
    try {
        spinner.start();
        const resultsDir = path.join(process.cwd(), 'clarity-reports');
        await fs.ensureDir(resultsDir);
        const jsonPath = path.join(resultsDir, 'benchmark.json');
        await fs.writeJSON(jsonPath, suite, { spaces: 2 });
        // Generate markdown report
        const mdPath = path.join(resultsDir, 'benchmark.md');
        const markdown = generateMarkdownReport(suite);
        await fs.writeFile(mdPath, markdown);
        spinner.succeed();
        successMessage(`Results saved to clarity-reports/`);
        infoMessage(`Files: ${jsonPath}\n       ${mdPath}`);
        console.log();
    }
    catch (error) {
        spinner.fail();
        handleError(error);
    }
}
/**
 * Generate markdown report
 */
function generateMarkdownReport(suite) {
    return `# Benchmark Report

Generated: ${suite.timestamp}

## Results

${suite.results.map((result, i) => `
### ${i + 1}. ${result.name}

| Metric | Value |
|--------|-------|
| Iterations | ${result.iterations} |
| Mean | ${formatDuration(result.mean)} |
| Median | ${formatDuration(result.median)} |
| Min | ${formatDuration(result.min)} |
| Max | ${formatDuration(result.max)} |
| P95 | ${formatDuration(result.p95)} |
| P99 | ${formatDuration(result.p99)} |
`).join('\n')}

---

Generated by Clarity Chat CLI
`;
}
/**
 * Compare with previous results
 */
async function compareWithPrevious(current) {
    try {
        const previousPath = path.join(process.cwd(), 'clarity-reports', 'benchmark-previous.json');
        if (!await fs.pathExists(previousPath)) {
            return;
        }
        const previous = await fs.readJSON(previousPath);
        await createDivider();
        console.log();
        infoMessage('📊 Comparison with Previous Run');
        console.log();
        const comparisonData = current.results
            .map(currentResult => {
            const previousResult = previous.results.find(r => r.name === currentResult.name);
            if (previousResult) {
                const diff = currentResult.mean - previousResult.mean;
                const percentChange = ((diff / previousResult.mean) * 100).toFixed(2);
                const improved = diff < 0;
                return {
                    'Benchmark': currentResult.name,
                    'Change': `${improved ? '↓' : '↑'} ${Math.abs(parseFloat(percentChange))}% ${improved ? 'faster' : 'slower'}`,
                    'Difference': formatDuration(Math.abs(diff)),
                };
            }
            return null;
        })
            .filter(Boolean);
        if (comparisonData.length > 0) {
            const comparisonColumns = [
                { header: 'Benchmark', key: 'Benchmark' },
                { header: 'Previous', key: 'Previous' },
                { header: 'Current', key: 'Current' },
                { header: 'Change', key: 'Change' },
            ];
            console.log(createTable(comparisonData, comparisonColumns, {
                border: true,
            }));
            console.log();
        }
    }
    catch (error) {
        // Ignore comparison errors
    }
}
/**
 * Save as previous for next comparison
 */
async function saveAsPrevious(suite) {
    try {
        const previousPath = path.join(process.cwd(), 'clarity-reports', 'benchmark-previous.json');
        await fs.writeJSON(previousPath, suite, { spaces: 2 });
    }
    catch (error) {
        // Ignore save errors
    }
}
/**
 * Main benchmark command
 */
export async function benchmarkCommand(options) {
    console.log(createBanner('⚡ Performance Benchmarks', {
        gradient: 'pastel',
    }));
    console.log();
    const iterations = options.iterations || 100;
    try {
        const suite = {
            timestamp: new Date().toISOString(),
            results: [],
        };
        // Run benchmarks
        const spinner = createSpinner('Running benchmarks...');
        spinner.start();
        spinner.text = 'Benchmarking message processing...';
        suite.results.push(await benchmarkMessageProcessing());
        spinner.text = 'Benchmarking JSON serialization...';
        suite.results.push(await benchmarkJSONSerialization());
        spinner.text = 'Benchmarking state cloning...';
        suite.results.push(await benchmarkStateCloning());
        spinner.text = 'Benchmarking string operations...';
        suite.results.push(await benchmarkStringOperations());
        spinner.succeed('Benchmarks complete');
        console.log();
        // Display results
        await displayResults(suite);
        // Compare with previous
        if (options.compare) {
            await compareWithPrevious(suite);
        }
        // Save results
        if (options.save) {
            await saveResults(suite);
            await saveAsPrevious(suite);
        }
        successMessage('Benchmark complete!');
        console.log();
    }
    catch (error) {
        handleError(error);
    }
}
//# sourceMappingURL=benchmark.js.map