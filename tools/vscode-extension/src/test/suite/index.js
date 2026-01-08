/**
 * Test Suite Entry Point
 *
 * Discovers and runs all test files using Mocha
 */
import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';
export async function run() {
    const mocha = new Mocha({
        ui: 'bdd',
        color: true,
        timeout: 10000,
    });
    const testsRoot = path.resolve(__dirname, '.');
    const files = await glob('**/*.test.js', { cwd: testsRoot });
    // Add files to the test suite
    files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));
    return new Promise((resolve, reject) => {
        try {
            mocha.run((failures) => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                }
                else {
                    resolve();
                }
            });
        }
        catch (err) {
            console.error(err);
            reject(err);
        }
    });
}
//# sourceMappingURL=index.js.map