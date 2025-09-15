/**
 * Validation utility functions
 */

import { VALIDATION } from '../constants/app-config';
import { ERROR_MESSAGES } from '../constants/storage-keys';
import { CreateNoteInput, UpdateNoteInput } from '../types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Validate note input
 */
export function validateNote(input: CreateNoteInput | UpdateNoteInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if ('title' in input && input.title !== undefined) {
    if (!input.title || !input.title.trim()) {
      errors.push(ERROR_MESSAGES.TITLE_REQUIRED);
    } else if (input.title.length > VALIDATION.NOTE.TITLE_MAX_LENGTH) {
      errors.push(ERROR_MESSAGES.TITLE_TOO_LONG);
    } else if (input.title.length < VALIDATION.NOTE.TITLE_MIN_LENGTH) {
      errors.push(`Title must be at least ${VALIDATION.NOTE.TITLE_MIN_LENGTH} character long`);
    }
  }

  // Content validation
  if ('content' in input && input.content !== undefined) {
    if (input.content.length > VALIDATION.NOTE.CONTENT_MAX_LENGTH) {
      errors.push(ERROR_MESSAGES.NOTE_TOO_LONG);
    }
    
    // Warning for very long content
    if (input.content.length > VALIDATION.NOTE.CONTENT_MAX_LENGTH * 0.8) {
      warnings.push('Note content is getting quite long');
    }
  }

  // Category validation
  if ('category' in input && input.category !== undefined && input.category) {
    if (input.category.length > VALIDATION.CATEGORY.MAX_LENGTH) {
      errors.push(`Category name cannot exceed ${VALIDATION.CATEGORY.MAX_LENGTH} characters`);
    } else if (input.category.length < VALIDATION.CATEGORY.MIN_LENGTH) {
      errors.push(`Category name must be at least ${VALIDATION.CATEGORY.MIN_LENGTH} character long`);
    } else if (!VALIDATION.CATEGORY.ALLOWED_CHARS.test(input.category)) {
      errors.push('Category name contains invalid characters');
    }
  }

  // Tags validation
  if ('tags' in input && input.tags !== undefined) {
    if (input.tags.length > VALIDATION.TAG.MAX_PER_NOTE) {
      errors.push(ERROR_MESSAGES.MAX_TAGS_REACHED);
    }

    input.tags.forEach((tag, index) => {
      if (!tag || !tag.trim()) {
        errors.push(`Tag ${index + 1} cannot be empty`);
      } else if (tag.length > VALIDATION.TAG.MAX_LENGTH) {
        errors.push(`Tag "${tag}" exceeds maximum length of ${VALIDATION.TAG.MAX_LENGTH} characters`);
      } else if (tag.length < VALIDATION.TAG.MIN_LENGTH) {
        errors.push(`Tag "${tag}" must be at least ${VALIDATION.TAG.MIN_LENGTH} character long`);
      } else if (!VALIDATION.TAG.ALLOWED_CHARS.test(tag)) {
        errors.push(`Tag "${tag}" contains invalid characters`);
      }
    });

    // Check for duplicate tags
    const uniqueTags = new Set(input.tags.map(tag => tag.toLowerCase()));
    if (uniqueTags.size !== input.tags.length) {
      warnings.push('Some tags are duplicates');
    }
  }

  // Color validation
  if ('color' in input && input.color !== undefined && input.color) {
    if (!isValidColor(input.color)) {
      errors.push(ERROR_MESSAGES.INVALID_COLOR);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate search term
 */
export function validateSearchTerm(searchTerm: string): ValidationResult {
  const errors: string[] = [];

  if (searchTerm.length < VALIDATION.SEARCH.MIN_LENGTH) {
    errors.push(`Search term must be at least ${VALIDATION.SEARCH.MIN_LENGTH} characters long`);
  }

  if (searchTerm.length > VALIDATION.SEARCH.MAX_LENGTH) {
    errors.push(`Search term cannot exceed ${VALIDATION.SEARCH.MAX_LENGTH} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }

  // Check for common patterns
  if (!/[a-z]/.test(password)) {
    warnings.push('Password should contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    warnings.push('Password should contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    warnings.push('Password should contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    warnings.push('Password should contain at least one special character');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url || !url.trim()) {
    errors.push('URL is required');
    return { isValid: false, errors };
  }

  try {
    new URL(url);
  } catch {
    errors.push('Invalid URL format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate hex color
 */
export function isValidColor(color: string): boolean {
  // Check for hex color format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Validate date
 */
export function validateDate(date: any): ValidationResult {
  const errors: string[] = [];

  if (!date) {
    errors.push('Date is required');
  } else if (!(date instanceof Date)) {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push(ERROR_MESSAGES.INVALID_DATE);
      }
    } else {
      errors.push(ERROR_MESSAGES.INVALID_DATE);
    }
  } else if (isNaN(date.getTime())) {
    errors.push(ERROR_MESSAGES.INVALID_DATE);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSizeMB: number = 10): ValidationResult {
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (size > maxSizeBytes) {
    errors.push(`File size cannot exceed ${maxSizeMB}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate JSON string
 */
export function validateJson(jsonString: string): ValidationResult {
  const errors: string[] = [];

  if (!jsonString || !jsonString.trim()) {
    errors.push('JSON string is required');
    return { isValid: false, errors };
  }

  try {
    JSON.parse(jsonString);
  } catch (error) {
    errors.push('Invalid JSON format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize string by removing potentially harmful characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

/**
 * Validate and sanitize note input
 */
export function validateAndSanitizeNote(input: CreateNoteInput | UpdateNoteInput): {
  sanitized: CreateNoteInput | UpdateNoteInput;
  validation: ValidationResult;
} {
  // Create sanitized copy
  const sanitized = { ...input };

  if ('title' in sanitized && sanitized.title !== undefined) {
    sanitized.title = sanitizeString(sanitized.title);
  }

  if ('content' in sanitized && sanitized.content !== undefined) {
    sanitized.content = sanitizeString(sanitized.content);
  }

  if ('category' in sanitized && sanitized.category !== undefined && sanitized.category) {
    sanitized.category = sanitizeString(sanitized.category);
  }

  if ('tags' in sanitized && sanitized.tags !== undefined) {
    sanitized.tags = sanitized.tags.map(tag => sanitizeString(tag));
  }

  // Validate the sanitized input
  const validation = validateNote(sanitized);

  return { sanitized, validation };
}