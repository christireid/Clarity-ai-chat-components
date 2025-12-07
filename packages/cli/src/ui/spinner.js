/**
 * Beautiful spinner using Charm-style animations
 * Inspired by https://github.com/charmbracelet/bubbletea
 */
import chalk from 'chalk';
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const DOTS_FRAMES = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
const ARROW_FRAMES = ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'];
const PULSE_FRAMES = ['●', '◐', '○', '◑'];
export class Spinner {
    frames;
    frameIndex = 0;
    interval = null;
    text = '';
    color = chalk.cyan;
    constructor(type = 'default') {
        switch (type) {
            case 'dots':
                this.frames = DOTS_FRAMES;
                break;
            case 'arrow':
                this.frames = ARROW_FRAMES;
                break;
            case 'pulse':
                this.frames = PULSE_FRAMES;
                break;
            default:
                this.frames = SPINNER_FRAMES;
        }
    }
    start(text = '') {
        this.text = text;
        this.frameIndex = 0;
        // Hide cursor
        process.stdout.write('\x1B[?25l');
        this.interval = setInterval(() => {
            this.render();
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        }, 80);
    }
    update(text) {
        this.text = text;
    }
    succeed(text) {
        this.stop();
        const message = text || this.text;
        console.log(chalk.green('✓') + ' ' + message);
    }
    fail(text) {
        this.stop();
        const message = text || this.text;
        console.log(chalk.red('✗') + ' ' + message);
    }
    warn(text) {
        this.stop();
        const message = text || this.text;
        console.log(chalk.yellow('⚠') + ' ' + message);
    }
    info(text) {
        this.stop();
        const message = text || this.text;
        console.log(chalk.blue('ℹ') + ' ' + message);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        // Clear line and show cursor
        process.stdout.write('\r\x1B[K');
        process.stdout.write('\x1B[?25h');
    }
    render() {
        const frame = this.color(this.frames[this.frameIndex]);
        process.stdout.write(`\r${frame} ${this.text}`);
    }
}
/**
 * Multi-spinner for parallel operations
 */
export class MultiSpinner {
    spinners = new Map();
    interval = null;
    frameIndex = 0;
    add(id, text) {
        this.spinners.set(id, { text, status: 'pending' });
        if (!this.interval) {
            this.start();
        }
    }
    update(id, text) {
        const spinner = this.spinners.get(id);
        if (spinner) {
            spinner.text = text;
        }
    }
    succeed(id, text) {
        const spinner = this.spinners.get(id);
        if (spinner) {
            spinner.status = 'success';
            if (text)
                spinner.text = text;
        }
        this.checkComplete();
    }
    fail(id, text) {
        const spinner = this.spinners.get(id);
        if (spinner) {
            spinner.status = 'error';
            if (text)
                spinner.text = text;
        }
        this.checkComplete();
    }
    start() {
        process.stdout.write('\x1B[?25l'); // Hide cursor
        this.interval = setInterval(() => {
            this.render();
            this.frameIndex = (this.frameIndex + 1) % SPINNER_FRAMES.length;
        }, 80);
    }
    render() {
        // Move cursor up to start of spinners
        if (this.spinners.size > 1) {
            process.stdout.write(`\x1B[${this.spinners.size}A`);
        }
        // Render each spinner
        this.spinners.forEach((spinner) => {
            process.stdout.write('\r\x1B[K'); // Clear line
            if (spinner.status === 'pending') {
                const frame = chalk.cyan(SPINNER_FRAMES[this.frameIndex]);
                process.stdout.write(`${frame} ${spinner.text}`);
            }
            else if (spinner.status === 'success') {
                process.stdout.write(chalk.green('✓') + ' ' + spinner.text);
            }
            else {
                process.stdout.write(chalk.red('✗') + ' ' + spinner.text);
            }
            process.stdout.write('\n');
        });
    }
    checkComplete() {
        const allComplete = Array.from(this.spinners.values()).every(s => s.status !== 'pending');
        if (allComplete && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            process.stdout.write('\x1B[?25h'); // Show cursor
        }
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write('\x1B[?25h'); // Show cursor
    }
}
/**
 * Progress bar with Charm-style visualization
 */
export class ProgressBar {
    total;
    current = 0;
    text = '';
    width = 40;
    constructor(total, text = '') {
        this.total = total;
        this.text = text;
    }
    update(current, text) {
        this.current = current;
        if (text)
            this.text = text;
        this.render();
    }
    increment(text) {
        this.current++;
        if (text)
            this.text = text;
        this.render();
    }
    complete(text) {
        this.current = this.total;
        if (text)
            this.text = text;
        this.render();
        console.log(); // New line after completion
    }
    render() {
        const percent = Math.min(100, Math.floor((this.current / this.total) * 100));
        const filled = Math.floor((this.width * this.current) / this.total);
        const empty = this.width - filled;
        const bar = chalk.cyan('█').repeat(filled) +
            chalk.gray('░').repeat(empty);
        const percentage = chalk.bold(`${percent}%`);
        const progress = chalk.gray(`[${this.current}/${this.total}]`);
        process.stdout.write(`\r${bar} ${percentage} ${progress} ${this.text}`);
    }
}
//# sourceMappingURL=spinner.js.map