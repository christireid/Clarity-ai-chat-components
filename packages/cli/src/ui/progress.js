/**
 * Beautiful progress indicators
 * Enhanced progress bars and spinners
 */
import chalk from 'chalk';
import ora from 'ora';
/**
 * Enhanced progress bar
 */
export class ProgressBar {
    total;
    current = 0;
    text = '';
    width;
    completeChar;
    incompleteChar;
    showPercentage;
    showCount;
    color;
    constructor(options) {
        this.total = options.total;
        this.width = options.width || 40;
        this.completeChar = options.completeChar || '█';
        this.incompleteChar = options.incompleteChar || '░';
        this.showPercentage = options.showPercentage ?? true;
        this.showCount = options.showCount ?? true;
        this.color = options.color || chalk.cyan;
    }
    update(current, text) {
        this.current = Math.min(current, this.total);
        if (text !== undefined)
            this.text = text;
        this.render();
    }
    increment(text) {
        this.current = Math.min(this.current + 1, this.total);
        if (text !== undefined)
            this.text = text;
        this.render();
    }
    setText(text) {
        this.text = text;
        this.render();
    }
    complete(text) {
        this.current = this.total;
        if (text !== undefined)
            this.text = text;
        this.render();
        console.log(); // New line after completion
    }
    render() {
        const percent = Math.min(100, Math.floor((this.current / this.total) * 100));
        const filled = Math.floor((this.width * this.current) / this.total);
        const empty = this.width - filled;
        const bar = this.color(this.completeChar.repeat(filled)) + chalk.dim(this.incompleteChar.repeat(empty));
        const parts = [bar];
        if (this.showPercentage) {
            parts.push(chalk.bold(`${percent}%`));
        }
        if (this.showCount) {
            parts.push(chalk.dim(`[${this.current}/${this.total}]`));
        }
        if (this.text) {
            parts.push(this.text);
        }
        process.stdout.write(`\r${parts.join(' ')}`);
    }
}
/**
 * Create a spinner with enhanced styling
 */
export function createSpinner(text) {
    return ora({
        text,
        spinner: 'dots',
        color: 'cyan',
    });
}
/**
 * Create a multi-step progress indicator
 */
export class StepProgress {
    steps;
    currentStep = 0;
    spinner = null;
    constructor(steps) {
        this.steps = steps.map(name => ({ name, status: 'pending' }));
    }
    start(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length)
            return;
        this.currentStep = stepIndex;
        this.steps[stepIndex].status = 'active';
        if (this.spinner) {
            this.spinner.stop();
        }
        this.spinner = createSpinner(this.steps[stepIndex].name);
        this.spinner.start();
    }
    succeed(stepIndex, text) {
        if (stepIndex < 0 || stepIndex >= this.steps.length)
            return;
        this.steps[stepIndex].status = 'complete';
        if (this.spinner) {
            this.spinner.succeed(text || this.steps[stepIndex].name);
            this.spinner = null;
        }
    }
    fail(stepIndex, text) {
        if (stepIndex < 0 || stepIndex >= this.steps.length)
            return;
        this.steps[stepIndex].status = 'error';
        if (this.spinner) {
            this.spinner.fail(text || this.steps[stepIndex].name);
            this.spinner = null;
        }
    }
    renderSummary() {
        console.log();
        console.log(chalk.bold('Summary:'));
        this.steps.forEach((step, index) => {
            const icon = step.status === 'complete'
                ? chalk.green('✓')
                : step.status === 'error'
                    ? chalk.red('✗')
                    : step.status === 'active'
                        ? chalk.cyan('→')
                        : chalk.dim('○');
            const status = step.status === 'complete'
                ? chalk.green('Complete')
                : step.status === 'error'
                    ? chalk.red('Failed')
                    : step.status === 'active'
                        ? chalk.cyan('Active')
                        : chalk.dim('Pending');
            console.log(`  ${icon} ${step.name} ${chalk.dim('—')} ${status}`);
        });
    }
}
/**
 * Create a percentage progress indicator
 */
export function percentageProgress(current, total, label) {
    const percent = Math.floor((current / total) * 100);
    const barWidth = 20;
    const filled = Math.floor((barWidth * current) / total);
    const empty = barWidth - filled;
    const bar = chalk.cyan('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
    const percentText = chalk.bold(`${percent}%`);
    const countText = chalk.dim(`(${current}/${total})`);
    return label
        ? `${bar} ${percentText} ${countText} ${label}`
        : `${bar} ${percentText} ${countText}`;
}
//# sourceMappingURL=progress.js.map