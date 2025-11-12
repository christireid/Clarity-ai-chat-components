/**
 * Transform runner
 * Executes jscodeshift transformations
 */
import { run as jscodeshift } from 'jscodeshift/src/Runner.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export async function runTransform(transformName, targetPath, options = {}) {
    const transformPath = path.join(__dirname, 'transforms', `${transformName}.js`);
    const result = await jscodeshift(transformPath, [targetPath], {
        dry: options.dry || false,
        print: options.print || false,
        verbose: options.verbose ? 2 : 0,
        parser: options.parser || 'tsx',
        extensions: 'tsx,ts,jsx,js',
        ignorePattern: '**/node_modules/**',
    });
    return result;
}
//# sourceMappingURL=runner.js.map