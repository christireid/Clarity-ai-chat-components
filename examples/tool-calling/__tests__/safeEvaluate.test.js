/**
 * Unit tests for the safe mathematical expression evaluator
 *
 * This is security-critical code that replaced eval().
 * These tests ensure all edge cases are handled correctly.
 */
import { describe, it, expect } from 'vitest';
import { safeEvaluate } from '../lib/tools';
describe('safeEvaluate', () => {
    describe('Basic Operations', () => {
        it('should handle addition', () => {
            expect(safeEvaluate('2 + 3')).toBe(5);
            expect(safeEvaluate('10 + 20 + 30')).toBe(60);
        });
        it('should handle subtraction', () => {
            expect(safeEvaluate('5 - 3')).toBe(2);
            expect(safeEvaluate('10 - 3 - 2')).toBe(5);
        });
        it('should handle multiplication', () => {
            expect(safeEvaluate('4 * 5')).toBe(20);
            expect(safeEvaluate('2 * 3 * 4')).toBe(24);
        });
        it('should handle division', () => {
            expect(safeEvaluate('20 / 4')).toBe(5);
            expect(safeEvaluate('100 / 5 / 2')).toBe(10);
        });
        it('should handle modulo', () => {
            expect(safeEvaluate('10 % 3')).toBe(1);
            expect(safeEvaluate('17 % 5')).toBe(2);
        });
    });
    describe('Operator Precedence', () => {
        it('should respect multiplication over addition', () => {
            expect(safeEvaluate('2 + 3 * 4')).toBe(14);
            expect(safeEvaluate('3 * 4 + 2')).toBe(14);
        });
        it('should respect division over subtraction', () => {
            expect(safeEvaluate('10 - 6 / 2')).toBe(7);
            expect(safeEvaluate('6 / 2 - 1')).toBe(2);
        });
        it('should handle complex expressions with correct precedence', () => {
            expect(safeEvaluate('2 + 3 * 4 - 5')).toBe(9);
            expect(safeEvaluate('10 / 2 + 3 * 4')).toBe(17);
        });
    });
    describe('Parentheses', () => {
        it('should override precedence with parentheses', () => {
            expect(safeEvaluate('(2 + 3) * 4')).toBe(20);
            expect(safeEvaluate('2 * (3 + 4)')).toBe(14);
        });
        it('should handle nested parentheses', () => {
            expect(safeEvaluate('((2 + 3) * 4)')).toBe(20);
            expect(safeEvaluate('(2 * (3 + (4 - 1)))')).toBe(12);
        });
        it('should handle multiple parenthetical groups', () => {
            expect(safeEvaluate('(2 + 3) * (4 + 5)')).toBe(45);
            expect(safeEvaluate('(10 - 5) / (2 + 3)')).toBe(1);
        });
    });
    describe('Decimal Numbers', () => {
        it('should handle decimal operands', () => {
            expect(safeEvaluate('1.5 + 2.5')).toBe(4);
            expect(safeEvaluate('3.14 * 2')).toBeCloseTo(6.28, 10);
        });
        it('should handle decimal results', () => {
            expect(safeEvaluate('5 / 2')).toBe(2.5);
            expect(safeEvaluate('1 / 3')).toBeCloseTo(0.333333, 5);
        });
        it('should handle leading decimals', () => {
            expect(safeEvaluate('0.5 + 0.5')).toBe(1);
            expect(safeEvaluate('0.1 * 10')).toBeCloseTo(1, 10);
        });
    });
    describe('Negative Numbers', () => {
        it('should handle unary minus', () => {
            expect(safeEvaluate('-5')).toBe(-5);
            expect(safeEvaluate('-5 + 3')).toBe(-2);
        });
        it('should handle negative in parentheses', () => {
            expect(safeEvaluate('(-5)')).toBe(-5);
            expect(safeEvaluate('(-5) * 2')).toBe(-10);
        });
        it('should handle double negative', () => {
            expect(safeEvaluate('--5')).toBe(5);
        });
    });
    describe('Whitespace Handling', () => {
        it('should handle no spaces', () => {
            expect(safeEvaluate('2+3')).toBe(5);
            expect(safeEvaluate('2*3+4')).toBe(10);
        });
        it('should handle extra spaces', () => {
            expect(safeEvaluate('  2  +  3  ')).toBe(5);
            expect(safeEvaluate('2   *   3')).toBe(6);
        });
    });
    describe('Edge Cases', () => {
        it('should handle single number', () => {
            expect(safeEvaluate('42')).toBe(42);
            expect(safeEvaluate('3.14')).toBe(3.14);
        });
        it('should handle zero', () => {
            expect(safeEvaluate('0')).toBe(0);
            expect(safeEvaluate('0 + 5')).toBe(5);
            expect(safeEvaluate('5 * 0')).toBe(0);
        });
        it('should handle large numbers', () => {
            expect(safeEvaluate('1000000 + 1000000')).toBe(2000000);
            expect(safeEvaluate('999999 * 2')).toBe(1999998);
        });
    });
    describe('Error Handling', () => {
        it('should throw on division by zero', () => {
            expect(() => safeEvaluate('5 / 0')).toThrow('Division by zero');
        });
        it('should throw on invalid characters', () => {
            expect(() => safeEvaluate('2 + x')).toThrow('Invalid character');
            expect(() => safeEvaluate('eval("alert")')).toThrow('Invalid character');
        });
        it('should throw on missing closing parenthesis', () => {
            expect(() => safeEvaluate('(2 + 3')).toThrow('Missing closing parenthesis');
        });
        it('should throw on extra tokens', () => {
            // "(2 + 3) 4" becomes "(2+3)4" which leaves "4" as an extra token after parsing the group
            expect(() => safeEvaluate('(2 + 3) 4')).toThrow('Unexpected tokens');
        });
        it('should throw on invalid number', () => {
            expect(() => safeEvaluate('2 + + 3')).toThrow();
        });
        it('should throw on empty expression', () => {
            expect(() => safeEvaluate('')).toThrow();
        });
    });
    describe('Security', () => {
        it('should reject code injection attempts', () => {
            expect(() => safeEvaluate('process.exit()')).toThrow('Invalid character');
            expect(() => safeEvaluate('require("fs")')).toThrow('Invalid character');
            expect(() => safeEvaluate('console.log(1)')).toThrow('Invalid character');
        });
        it('should reject function calls', () => {
            expect(() => safeEvaluate('Math.random()')).toThrow('Invalid character');
            expect(() => safeEvaluate('alert(1)')).toThrow('Invalid character');
        });
        it('should reject property access', () => {
            expect(() => safeEvaluate('window.location')).toThrow('Invalid character');
            expect(() => safeEvaluate('this.constructor')).toThrow('Invalid character');
        });
        it('should reject template literals', () => {
            expect(() => safeEvaluate('`${1+1}`')).toThrow('Invalid character');
        });
        it('should reject semicolons', () => {
            expect(() => safeEvaluate('1; process.exit()')).toThrow('Invalid character');
        });
    });
    describe('Real-World Expressions', () => {
        it('should calculate percentages', () => {
            // 15% of 287.50
            expect(safeEvaluate('287.50 * 15 / 100')).toBeCloseTo(43.125, 10);
            expect(safeEvaluate('287.50 * 0.15')).toBeCloseTo(43.125, 10);
        });
        it('should calculate tip amounts', () => {
            // 20% tip on $85.50
            expect(safeEvaluate('85.50 * 0.20')).toBeCloseTo(17.1, 10);
        });
        it('should calculate simple interest', () => {
            // Simple interest: P * R * T / 100
            // $1000 at 5% for 3 years
            expect(safeEvaluate('1000 * 5 * 3 / 100')).toBe(150);
        });
        it('should handle currency-like calculations', () => {
            expect(safeEvaluate('19.99 + 29.99 + 9.99')).toBeCloseTo(59.97, 10);
        });
    });
});
//# sourceMappingURL=safeEvaluate.test.js.map