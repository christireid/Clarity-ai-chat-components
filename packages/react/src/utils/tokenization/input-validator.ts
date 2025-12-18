/**
 * Input Validation for Token Optimization
 * 
 * Provides comprehensive validation for all token optimization operations
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized?: any;
}

export interface InputConstraints {
  maxLength?: number;
  minLength?: number;
  allowEmpty?: boolean;
  requiredType?: 'string' | 'number' | 'array' | 'object';
  encoding?: 'utf8' | 'ascii' | 'base64';
}

export class InputValidator {
  private static readonly MAX_TEXT_LENGTH = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_TOKEN_COUNT = 1000000; // 1M tokens
  private static readonly VALID_MODEL_PATTERN = /^[a-zA-Z0-9\-_.]+$/;

  /**
   * Validate text input for token counting operations
   */
  static validateTextInput(
    input: any,
    constraints: InputConstraints = {}
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const {
      maxLength = this.MAX_TEXT_LENGTH,
      minLength = 0,
      allowEmpty = true,
      requiredType = 'string'
    } = constraints;

    // Type validation
    if (input === null || input === undefined) {
      if (allowEmpty) {
        return { valid: true, errors: [], warnings: ['Input is null/undefined, treating as empty string'] };
      } else {
        return { valid: false, errors: ['Input cannot be null or undefined'], warnings: [] };
      }
    }

    // Convert to string if possible
    let text: string;
    try {
      if (typeof input !== 'string') {
        if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
          text = new TextDecoder().decode(input);
          warnings.push('Input was binary data, converted to string');
        } else if (typeof input === 'object') {
          if (Array.isArray(input) && input.length === 0) {
            text = '';
            warnings.push('Input was empty array, converted to empty string');
          } else {
            text = JSON.stringify(input);
            warnings.push('Input was object, converted to JSON string');
          }
        } else {
          text = String(input);
          warnings.push(`Input was ${typeof input}, converted to string`);
        }
      } else {
        text = input;
      }
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to convert input to string: ${error.message}`],
        warnings: []
      };
    }

    // Length validation
    if (text.length < minLength) {
      errors.push(`Text length (${text.length}) is below minimum (${minLength})`);
    }

    if (text.length > maxLength) {
      errors.push(`Text length (${text.length}) exceeds maximum (${maxLength})`);
    }

    // Encoding validation
    try {
      new TextEncoder().encode(text);
    } catch (error) {
      errors.push(`Text contains invalid encoding: ${error.message}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      sanitized: text
    };
  }

  /**
   * Validate model names
   */
  static validateModel(model: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof model !== 'string') {
      errors.push('Model must be a string');
      return { valid: false, errors, warnings };
    }

    if (!model.trim()) {
      errors.push('Model name cannot be empty');
      return { valid: false, errors, warnings };
    }

    if (!this.VALID_MODEL_PATTERN.test(model)) {
      warnings.push(`Model name "${model}" contains unusual characters`);
    }

    if (model.length > 100) {
      errors.push('Model name too long (max 100 characters)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      sanitized: model.trim().toLowerCase()
    };
  }

  /**
   * Validate compression ratio
   */
  static validateCompressionRatio(ratio: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof ratio !== 'number') {
      errors.push('Compression ratio must be a number');
      return { valid: false, errors, warnings };
    }

    if (ratio < 0 || ratio > 1) {
      errors.push('Compression ratio must be between 0 and 1');
    }

    if (ratio > 0.9) {
      warnings.push('High compression ratio may significantly impact quality');
    }

    if (ratio < 0.1) {
      warnings.push('Very low compression ratio may not achieve significant savings');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      sanitized: Math.max(0, Math.min(1, ratio))
    };
  }

  /**
   * Validate quality threshold
   */
  static validateQualityThreshold(threshold: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof threshold !== 'number') {
      errors.push('Quality threshold must be a number');
      return { valid: false, errors, warnings };
    }

    if (threshold < 0 || threshold > 1) {
      errors.push('Quality threshold must be between 0 and 1');
    }

    if (threshold < 0.5) {
      warnings.push('Low quality threshold may produce poor results');
    }

    if (threshold > 0.95) {
      warnings.push('Very high quality threshold may prevent effective optimization');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      sanitized: Math.max(0, Math.min(1, threshold))
    };
  }

  /**
   * Validate budget constraints
   */
  static validateBudget(budget: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof budget !== 'number') {
      errors.push('Budget must be a number');
      return { valid: false, errors, warnings };
    }

    if (budget <= 0) {
      errors.push('Budget must be positive');
    }

    if (budget > this.MAX_TOKEN_COUNT) {
      errors.push(`Budget exceeds maximum allowed (${this.MAX_TOKEN_COUNT})`);
    }

    if (budget > 100000) {
      warnings.push('Large budget may impact performance');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      sanitized: Math.floor(Math.max(0, Math.min(this.MAX_TOKEN_COUNT, budget)))
    };
  }

  /**
   * Comprehensive validation for optimization config
   */
  static validateOptimizationConfig(config: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitized: any = {};

    if (!config || typeof config !== 'object') {
      errors.push('Config must be an object');
      return { valid: false, errors, warnings };
    }

    // Validate compression ratio
    if (config.compressionRatio !== undefined) {
      const ratioValidation = this.validateCompressionRatio(config.compressionRatio);
      if (!ratioValidation.valid) {
        errors.push(...ratioValidation.errors);
      } else {
        sanitized.compressionRatio = ratioValidation.sanitized;
        warnings.push(...ratioValidation.warnings);
      }
    }

    // Validate quality threshold
    if (config.qualityThreshold !== undefined) {
      const qualityValidation = this.validateQualityThreshold(config.qualityThreshold);
      if (!qualityValidation.valid) {
        errors.push(...qualityValidation.errors);
      } else {
        sanitized.qualityThreshold = qualityValidation.sanitized;
        warnings.push(...qualityValidation.warnings);
      }
    }

    // Validate budget
    if (config.budget !== undefined) {
      const budgetValidation = this.validateBudget(config.budget);
      if (!budgetValidation.valid) {
        errors.push(...budgetValidation.errors);
      } else {
        sanitized.budget = budgetValidation.sanitized;
        warnings.push(...budgetValidation.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      sanitized
    };
  }
}